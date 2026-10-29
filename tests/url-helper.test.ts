import { describe, it, expect } from 'vitest';
import { resolveUrlOrSearch, buildSearchUrl, isSecureUrl } from '../src/main/url-helper';

describe('URL Helper and Google Search Resolver', () => {
  it('should keep explicit HTTPS URLs intact', () => {
    expect(resolveUrlOrSearch('https://github.com')).toBe('https://github.com');
    expect(resolveUrlOrSearch('https://news.ycombinator.com/item?id=123')).toBe('https://news.ycombinator.com/item?id=123');
  });

  it('should keep explicit HTTP URLs intact', () => {
    expect(resolveUrlOrSearch('http://example.com')).toBe('http://example.com');
  });

  it('should prepend https to standard domains without protocol', () => {
    expect(resolveUrlOrSearch('google.com')).toBe('https://google.com');
    expect(resolveUrlOrSearch('wikipedia.org/wiki/Electron')).toBe('https://wikipedia.org/wiki/Electron');
  });

  it('should resolve localhost and port properly', () => {
    expect(resolveUrlOrSearch('localhost:3000')).toBe('http://localhost:3000');
    expect(resolveUrlOrSearch('localhost')).toBe('http://localhost');
  });

  it('should turn search queries with spaces into Google Search URLs', () => {
    expect(resolveUrlOrSearch('chirmo yapay zeka')).toBe(
      'https://www.google.com/search?q=chirmo%20yapay%20zeka'
    );
    expect(resolveUrlOrSearch('electron webcontentsview tutorial')).toBe(
      'https://www.google.com/search?q=electron%20webcontentsview%20tutorial'
    );
  });

  it('should turn non-domain single words into Google Search', () => {
    expect(resolveUrlOrSearch('typescript')).toBe(
      'https://www.google.com/search?q=typescript'
    );
  });

  it('should support other search engines if specified', () => {
    expect(buildSearchUrl('react test', 'duckduckgo')).toBe(
      'https://duckduckgo.com/?q=react%20test'
    );
    expect(buildSearchUrl('bing test', 'bing')).toBe(
      'https://www.bing.com/search?q=bing%20test'
    );
  });

  it('should correctly evaluate HTTPS security', () => {
    expect(isSecureUrl('https://chirmo.app')).toBe(true);
    expect(isSecureUrl('http://insecure.com')).toBe(false);
    expect(isSecureUrl('about:blank')).toBe(false);
  });
});
