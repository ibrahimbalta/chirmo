import { session, WebContents } from 'electron';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'about:']);

const BLOCKED_SSRF_HOSTS = new Set([
  '169.254.169.254',
  'metadata.google.internal',
  'metadata',
  '127.0.0.1',
  '0.0.0.0',
  'localhost',
  '[::1]',
  '[::]'
]);

function isPrivateOrLoopbackIp(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    h === '::1' ||
    h === '::' ||
    h.startsWith('fe80:') ||
    h.startsWith('fc00:') ||
    h.startsWith('fd00:') ||
    h.endsWith('.local') ||
    h.endsWith('.internal')
  ) {
    return true;
  }

  // Pure integer/hex/octal IP obfuscation check
  if (/^(0x[0-9a-f]+|\d+)$/i.test(h)) {
    return true;
  }

  const ipv4Match = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // Carrier-grade NAT
  }

  return false;
}

/**
 * Validates URLs passed across IPC or navigation to prevent SSRF, protocol smuggling,
 * private network scanning (RFC1918/IPv6), and local file disclosure.
 */
export function isSafeExternalUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.length > 2048) return false;
  const trimmed = rawUrl.trim();
  if (trimmed === 'about:blank') return true;

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return false;
    }
    if (parsed.protocol === 'about:' && trimmed !== 'about:blank') {
      return false;
    }
    // Block embedded URL credentials (phishing / SSRF parser confusion)
    if (parsed.username || parsed.password) {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_SSRF_HOSTS.has(hostname) || isPrivateOrLoopbackIp(hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const BLOCKED_PERMISSIONS = new Set([
  'media',
  'geolocation',
  'notifications',
  'midi',
  'midiSysex',
  'pointerLock',
  'fullscreen',
  'openExternal',
  'clipboard-read',
  'clipboard-sanitized-write',
  'serial',
  'hid',
  'usb',
  'idle-detection',
  'screen-wake-lock',
  'window-management',
  'local-fonts'
]);

export function setupSecurityPolicies(): void {
  // 1. Permission request handler (Strict Whitelist / Blacklist)
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (BLOCKED_PERMISSIONS.has(permission)) {
      console.warn(`[Security] Blocked unauthorized permission request: ${permission}`);
      callback(false);
      return;
    }
    // Default deny for unknown permissions
    callback(false);
  });

  // 2. Permission check handler (For navigator.permissions.query)
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    if (BLOCKED_PERMISSIONS.has(permission)) {
      return false;
    }
    return false;
  });

  // 3. Disable device access (USB, Serial, HID, Bluetooth)
  session.defaultSession.on('select-usb-device', (event, details, callback) => {
    event.preventDefault();
    callback('');
  });

  session.defaultSession.on('select-serial-port', (event, details, callback) => {
    event.preventDefault();
    callback('');
  });

  session.defaultSession.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();
    callback('');
  });
}

export function secureWebContents(
  contents: WebContents,
  onNewTabRequested?: (url: string) => void
): void {
  // Prevent opening arbitrary external windows or popups; route to Chirmo tab
  contents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      if (onNewTabRequested) {
        onNewTabRequested(url);
      }
    } else {
      console.warn(`[Security] Blocked untrusted URL in new window request: ${url}`);
    }
    return { action: 'deny' };
  });

  // Intercept will-navigate and will-redirect to prevent protocol smuggling and 302 SSRF
  contents.on('will-navigate', (event, navigationUrl) => {
    if (!isSafeExternalUrl(navigationUrl)) {
      console.warn(`[Security] Blocked navigation to forbidden URL: ${navigationUrl}`);
      event.preventDefault();
    }
  });

  contents.on('will-redirect', (event, redirectUrl) => {
    if (!isSafeExternalUrl(redirectUrl)) {
      console.warn(`[Security] Blocked redirect to forbidden URL: ${redirectUrl}`);
      event.preventDefault();
    }
  });

  // Block auxiliary click middle-click new window tricks
  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
}
