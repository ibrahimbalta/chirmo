import { session, WebContents } from 'electron';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'about:', 'data:']);

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
  'local-fonts',
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
    try {
      const parsed = new URL(url);
      if (ALLOWED_PROTOCOLS.has(parsed.protocol)) {
        if (onNewTabRequested) {
          onNewTabRequested(url);
        }
      } else {
        console.warn(`[Security] Blocked untrusted protocol in new window request: ${url}`);
      }
    } catch {
      console.warn(`[Security] Invalid URL requested in window open: ${url}`);
    }
    return { action: 'deny' };
  });

  // Intercept will-navigate to prevent protocol smuggling
  contents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsed = new URL(navigationUrl);
      if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
        console.warn(`[Security] Blocked navigation to forbidden protocol: ${navigationUrl}`);
        event.preventDefault();
      }
    } catch {
      event.preventDefault();
    }
  });

  // Block auxiliary click middle-click new window tricks
  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
}
