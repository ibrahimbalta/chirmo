/**
 * GOOGLE LIVE SUGGEST & AUTOCOMPLETE SERVICE
 * Fetches real-time search queries directly from Google's official suggestion engine.
 * Uses JSONP to completely bypass CORS in any web browser environment.
 */

export class GoogleSuggestService {
  public static async fetchSuggestions(query: string, maxResults = 8): Promise<string[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    // Fallback: If not in browser environment (e.g. testing)
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      try {
        const res = await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(trimmed)}`
        );
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json?.[1]) ? json[1].slice(0, maxResults) : [];
      } catch {
        return [];
      }
    }

    // In Browser: JSONP gives 100% reliable, zero-CORS real-time Google search suggestions
    return new Promise<string[]>((resolve) => {
      const callbackName = `cogko_google_suggest_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      const script = document.createElement('script');

      const timer = setTimeout(() => {
        cleanup();
        resolve([]);
      }, 2500);

      const cleanup = () => {
        clearTimeout(timer);
        try {
          delete (window as any)[callbackName];
        } catch {
          (window as any)[callbackName] = undefined;
        }
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };

      (window as any)[callbackName] = (data: any) => {
        cleanup();
        if (Array.isArray(data) && Array.isArray(data[1])) {
          // Google suggest returns [query, [sug1, sug2, ...]]
          resolve(data[1].slice(0, maxResults));
        } else {
          resolve([]);
        }
      };

      script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(
        trimmed
      )}&jsonp=${callbackName}`;

      script.onerror = () => {
        cleanup();
        resolve([]);
      };

      document.body.appendChild(script);
    });
  }
}
