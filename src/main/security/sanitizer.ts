/**
 * Security and Prompt Injection Sanitizer for Chirmo.
 * Treats all scraped web content as untrusted input.
 * Strips dangerous injection sequences and normalizes text before AI consumption.
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /forget\s+(all\s+)?(previous|prior)\s+rules?/gi,
  /you\s+are\s+now\s+(a\s+)?(developer|jailbroken|unrestricted|DAN)/gi,
  /system\s*:\s*system_override/gi,
  /assistant\s*:\s*override/gi,
  /\[SYSTEM_INSTRUCTION\]/gi,
  /<\/?system>/gi,
  /eval\s*\(/gi,
  /javascript\s*:/gi,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
];

export interface SanitizationResult {
  sanitizedText: string;
  injectionsDetected: number;
  threats: string[];
}

export function sanitizeWebContent(rawContent: string): SanitizationResult {
  if (!rawContent) {
    return { sanitizedText: '', injectionsDetected: 0, threats: [] };
  }

  let sanitized = rawContent;
  const threats: string[] = [];
  let injectionsCount = 0;

  for (const pattern of INJECTION_PATTERNS) {
    const matches = sanitized.match(pattern);
    if (matches && matches.length > 0) {
      injectionsCount += matches.length;
      threats.push(...matches.map((m) => m.slice(0, 50)));
      sanitized = sanitized.replace(pattern, '[BLOCKED_INJECTION_ATTEMPT]');
    }
  }

  // Normalize Unicode to prevent zero-width obfuscation and homograph attacks
  sanitized = sanitized
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // strip zero-width spaces
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  return {
    sanitizedText: sanitized,
    injectionsDetected: injectionsCount,
    threats,
  };
}

export function wrapUntrustedContext(content: string, sourceUrl: string): string {
  const { sanitizedText, injectionsDetected } = sanitizeWebContent(content);
  
  const injectionWarning = injectionsDetected > 0
    ? `\n[UYARI: Bu web sayfasında ${injectionsDetected} adet potansiyel prompt injection girişimi filtrelendi.]\n`
    : '';

  return `
--- BEGIN UNTRUSTED WEB CONTEXT (${sourceUrl}) ---
${injectionWarning}
${sanitizedText}
--- END UNTRUSTED WEB CONTEXT ---
`;
}
