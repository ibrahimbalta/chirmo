import { describe, it, expect } from 'vitest';
import { generateErrorPage } from '../src/main/error-page';

describe('Custom Error Page Generator', () => {
  it('should generate a data URI with encoded HTML', () => {
    const errorUri = generateErrorPage('https://nonexistent-site-12345.com', -105, 'ERR_NAME_NOT_RESOLVED');
    expect(errorUri.startsWith('data:text/html;charset=utf-8,')).toBe(true);
  });

  it('should decode and display the failed URL and Turkish friendly error description', () => {
    const errorUri = generateErrorPage('https://example.com/deadlink', -102, 'ERR_CONNECTION_REFUSED');
    const decoded = decodeURIComponent(errorUri);

    expect(decoded).toContain('Bu Sayfaya Ulaşılamıyor');
    expect(decoded).toContain('Hedef sunucu bağlantıyı reddetti');
    expect(decoded).toContain('https://example.com/deadlink');
    expect(decoded).toContain('Yeniden Dene');
    expect(decoded).toContain("Google'da Ara");
  });
});
