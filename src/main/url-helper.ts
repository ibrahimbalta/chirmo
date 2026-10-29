/**
 * URL and Search query resolver for Chirmo browser.
 * Translates user input into either a direct URL or a search query (defaulting to Google Search).
 */

const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/.*)?$/;
const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?(?:\/.*)?$/;
const LOCALHOST_REGEX = /^localhost(?::\d+)?(?:\/.*)?$/;

export function resolveUrlOrSearch(input: string, searchEngine = 'google'): string {
  const trimmed = input.trim();

  if (!trimmed) {
    return 'about:blank';
  }

  // Explicit protocols
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('file://') ||
    trimmed.startsWith('about:') ||
    trimmed.startsWith('chrome://') ||
    trimmed.startsWith('chirmo://')
  ) {
    return trimmed;
  }

  // Check if it's localhost or an IP address
  if (LOCALHOST_REGEX.test(trimmed)) {
    return `http://${trimmed}`;
  }

  if (IP_REGEX.test(trimmed)) {
    return `http://${trimmed}`;
  }

  // Check if it looks like a domain name without spaces
  if (!trimmed.includes(' ') && DOMAIN_REGEX.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Otherwise, default to Google Search
  return buildSearchUrl(trimmed, searchEngine);
}

export function buildSearchUrl(query: string, searchEngine = 'google'): string {
  const encoded = encodeURIComponent(query.trim());
  switch (searchEngine.toLowerCase()) {
    case 'bing':
      return `https://www.bing.com/search?q=${encoded}`;
    case 'duckduckgo':
      return `https://duckduckgo.com/?q=${encoded}`;
    case 'google':
    default:
      return `https://www.google.com/search?q=${encoded}`;
  }
}

export function isSecureUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
