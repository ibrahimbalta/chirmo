import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export interface SavedTab {
  id: string;
  url: string;
  title: string;
}

export interface SavedSession {
  tabs: SavedTab[];
  activeTabId: string | null;
  savedAt: string;
}

export class SessionRecovery {
  private filePath: string;

  constructor() {
    const userData = app.getPath('userData');
    this.filePath = path.join(userData, 'chirmo-session.json');
  }

  public save(tabs: SavedTab[], activeTabId: string | null): void {
    // Only save real HTTP/HTTPS or search URLs (don't save internal blanks or error pages)
    const validTabs = tabs.filter(
      (t) => t.url && (t.url.startsWith('http://') || t.url.startsWith('https://'))
    );

    const session: SavedSession = {
      tabs: validTabs,
      activeTabId,
      savedAt: new Date().toISOString(),
    };

    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(session, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.warn('[SessionRecovery] Failed to save session:', err);
    }
  }

  public load(): SavedSession | null {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const session: SavedSession = JSON.parse(raw);
        if (session.tabs && session.tabs.length > 0) {
          return session;
        }
      }
    } catch (err) {
      console.warn('[SessionRecovery] Failed to read session file, starting fresh:', err);
    }
    return null;
  }

  public clear(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        fs.unlinkSync(this.filePath);
      }
    } catch {
      // ignore
    }
  }
}
