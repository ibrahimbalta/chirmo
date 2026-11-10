import { session, WebContents } from 'electron';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'about:']);

const BLOCKED_SSRF_HOSTS = new Set([
  '169.254.169.254',
  'metadata.google.internal',
  '127.0.0.1',
  '0.0.0.0',
  'localhost',
  '[::1]'
]);

/**
 * Validates URLs passed across IPC or navigation to prevent SSRF, protocol smuggling, and local file disclosure.
 */
export function isSafeExternalUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (trimmed === 'about:blank') return true;

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_SSRF_HOSTS.has(hostname) || hostname.startsWith('169.254.')) {
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

  // Intercept will-navigate to prevent protocol smuggling and SSRF
  contents.on('will-navigate', (event, navigationUrl) => {
    if (!isSafeExternalUrl(navigationUrl)) {
      console.warn(`[Security] Blocked navigation to forbidden URL: ${navigationUrl}`);
      event.preventDefault();
    }
  });

  // Block auxiliary click middle-click new window tricks
  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
}
