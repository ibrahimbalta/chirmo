import { WebContentsView, BrowserWindow } from 'electron';
import { ScrapedPageData } from './types';
import { resolveUrlOrSearch } from '../url-helper';

export class ToolExecutor {
  /**
   * Safely loads a web page in a background isolated WebContentsView,
   * extracts readable content, and returns structured data.
   */
  public static async scrapeWebPage(
    url: string,
    timeoutMs = 15000
  ): Promise<ScrapedPageData> {
    const resolvedUrl = resolveUrlOrSearch(url);

    return new Promise((resolve, reject) => {
      const view = new WebContentsView({
        webPreferences: {
          sandbox: true,
          contextIsolation: true,
          nodeIntegration: false,
          images: false, // Don't load images for faster background scraping
        },
      });

      let timeoutTimer: NodeJS.Timeout | null = null;
      let isDone = false;

      const cleanup = () => {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        try {
          // view is garbage collected after losing reference
          view.webContents.stop();
        } catch {
          // ignore
        }
      };

      timeoutTimer = setTimeout(() => {
        if (!isDone) {
          isDone = true;
          cleanup();
          reject(new Error(`Web sayfası yüklenirken zaman aşımı oluştu (${timeoutMs / 1000}s): ${resolvedUrl}`));
        }
      }, timeoutMs);

      view.webContents.on('did-finish-load', async () => {
        if (isDone) return;
        isDone = true;
        cleanup();

        try {
          // Safely execute JavaScript in isolated DOM context
          const extractionScript = `
            (() => {
              const title = document.title || '';
              const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
              
              // Extract headings
              const headingNodes = Array.from(document.querySelectorAll('h1, h2, h3'));
              const headings = headingNodes.map(h => h.textContent ? h.textContent.trim() : '').filter(Boolean).slice(0, 10);
              
              // Extract main text (strip script, style, nav, footer, noscript)
              const clone = document.body.cloneNode(true);
              const elementsToRemove = clone.querySelectorAll('script, style, nav, footer, noscript, iframe, svg');
              elementsToRemove.forEach(el => el.remove());
              
              const rawText = clone.innerText || clone.textContent || '';
              const cleanedText = rawText.replace(/\\s+/g, ' ').trim();
              
              const words = cleanedText ? cleanedText.split(/\\s+/).length : 0;
              const linksCount = document.querySelectorAll('a[href]').length;
              
              return {
                title,
                description: metaDesc,
                headings,
                mainText: cleanedText.slice(0, 4000), // First 4000 characters
                wordCount: words,
                linksCount
              };
            })();
          `;

          const result = await view.webContents.executeJavaScript(extractionScript);

          resolve({
            url: resolvedUrl,
            title: result.title || 'Başlıksız Sayfa',
            description: result.description || '',
            headings: result.headings || [],
            mainText: result.mainText || '',
            wordCount: result.wordCount || 0,
            linksCount: result.linksCount || 0,
          });
        } catch (err: any) {
          reject(new Error(`Sayfa içeriği ayrıştırılamadı: ${err.message}`));
        }
      });

      view.webContents.on('did-fail-load', (_, errorCode, errorDesc, validatedUrl) => {
        if (isDone) return;
        isDone = true;
        cleanup();
        reject(new Error(`Sayfa yüklenemedi [${errorCode}]: ${errorDesc} (${validatedUrl})`));
      });

      view.webContents.loadURL(resolvedUrl).catch((err) => {
        if (!isDone) {
          isDone = true;
          cleanup();
          reject(err);
        }
      });
    });
  }
}
