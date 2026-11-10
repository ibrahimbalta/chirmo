import { WebContentsView } from 'electron';
import { ScrapedPageData } from './types';
import { resolveUrlOrSearch } from '../url-helper';
import { isSafeExternalUrl, secureWebContents } from '../security';

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
    if (!isSafeExternalUrl(resolvedUrl) || resolvedUrl === 'about:blank') {
      throw new Error('Güvenlik politikası gereği bu URL adresine erişim engellendi.');
    }

    return new Promise((resolve, reject) => {
      const view = new WebContentsView({
        webPreferences: {
          sandbox: true,
          contextIsolation: true,
          nodeIntegration: false,
          images: false
        }
      });

      // Enforce navigation & redirect SSRF protection on background scraper view
      secureWebContents(view.webContents);

      let timeoutTimer: NodeJS.Timeout | null = null;
      let isDone = false;

      const cleanup = () => {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        try {
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
          const extractionScript = `
            (() => {
              const title = document.title || '';
              const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
              
              const headingNodes = Array.from(document.querySelectorAll('h1, h2, h3, a[title]'));
              const seen = new Set();
              const headings = [];
              for (const node of headingNodes) {
                const txt = (node.getAttribute('title') || node.textContent || '').replace(/\\s+/g, ' ').trim();
                if (txt.length >= 22 && txt.length <= 160 && !seen.has(txt.toLowerCase())) {
                  seen.add(txt.toLowerCase());
                  headings.push(txt);
                  if (headings.length >= 20) break;
                }
              }
              
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
                mainText: cleanedText.slice(0, 4000),
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
            linksCount: result.linksCount || 0
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
