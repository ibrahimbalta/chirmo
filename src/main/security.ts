import { session, WebContents, shell } from 'electron';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'about:', 'data:']);

export function setupSecurityPolicies(): void {
  // 1. Permission request handler
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    // For Phase 1, deny sensitive permissions like media, geolocation, notifications by default
    const sensitive = ['media', 'geolocation', 'notifications', 'midi', 'openExternal'];
    if (sensitive.includes(permission)) {
      console.warn(`[Security] Blocked sensitive permission request: ${permission}`);
      callback(false);
      return;
    }
    callback(true);
  });

  // 2. Deny new window creation from untrusted contents, or route to Chirmo tab
  // Handled on individual webContents via setWindowOpenHandler
}

export function secureWebContents(
  contents: WebContents, 
  onNewTabRequested?: (url: string) => void
): void {
  // Prevent opening arbitrary windows
  contents.setWindowOpenHandler(({ url }) => {
    try {
      const parsed = new URL(url);
      if (ALLOWED_PROTOCOLS.has(parsed.protocol)) {
        if (onNewTabRequested) {
          onNewTabRequested(url);
        }
      } else {
        console.warn(`[Security] Blocked untrusted protocol in new window: ${url}`);
      }
    } catch {
      console.warn(`[Security] Invalid URL requested: ${url}`);
    }
    return { action: 'deny' };
  });

  // Intercept will-navigate
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
}
