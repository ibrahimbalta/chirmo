export interface ParsedTranscriptLine {
  timeSec: number;
  timeStr: string;
  en: string;
  tr: string;
}

export interface SubtitleLine {
  id: number;
  timeSec: number;
  timeStr: string;
  en: string;
  tr: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  highlightWords: string[];
  blankTargetWord: string;
  quizOptions: string[];
}

/**
 * Common phrase dictionary for quick Turkish preview during shadowing practice.
 */
export const getQuickTurkishPreview = (enText: string): string => {
  const lower = enText.toLowerCase().trim();
  if (lower.includes('hello') || lower.includes('welcome')) return 'Merhaba ve hoş geldiniz!';
  if (lower.includes('practice') || lower.includes('shadowing')) return 'Her gün düzenli pratik yaparak konuşmanızı geliştirin.';
  if (lower.includes('english') || lower.includes('speak')) return 'Doğal ve akıcı bir şekilde konuşma çalışması.';
  if (lower.includes('secret') || lower.includes('fluent')) return 'Akıcı konuşmanın ve telaffuzun en önemli sırrı.';
  if (lower.includes('mistake') || lower.includes('grow')) return 'Hata yapmaktan korkmayın, pratik yaptıkça gelişeceksiniz.';
  if (lower.includes('thank')) return 'Çok teşekkür ederim.';
  if (lower.includes('good morning')) return 'Günaydın.';
  if (lower.includes('how are you')) return 'Nasılsınız?';
  return 'Bu sahnedeki konuşmayı dinleyin ve mikrofona tekrarlayın.';
};

/**
 * Parses raw YouTube transcript text (either "0:05 text" format or plain text).
 */
export const parseYouTubeTranscriptText = (rawText: string): ParsedTranscriptLine[] => {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const results: ParsedTranscriptLine[] = [];

  // Regex to match timestamps like 0:05, 1:24, 01:23, 10:45, [02:30]
  const timestampRegex = /^(?:\[)?(\d{1,2}):(\d{2})(?:\])?/;

  let currentTimeSec = 0;
  let currentTimeStr = '0:00';
  let currentBuffer = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(timestampRegex);

    if (match) {
      if (currentBuffer.trim()) {
        results.push({
          timeSec: currentTimeSec,
          timeStr: currentTimeStr,
          en: currentBuffer.trim(),
          tr: getQuickTurkishPreview(currentBuffer.trim())
        });
        currentBuffer = '';
      }

      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      currentTimeSec = minutes * 60 + seconds;
      currentTimeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      // Rest of the line after the timestamp
      const remainingText = line.replace(timestampRegex, '').trim();
      if (remainingText) {
        currentBuffer = remainingText;
      }
    } else {
      // Inline timestamp check like: "0:05 hello there 0:15 how are you"
      const inlineMatches = Array.from(line.matchAll(/(?:^|\s)(\d{1,2}):(\d{2})\s+/g));
      if (inlineMatches.length > 0) {
        let lastIndex = 0;
        for (let j = 0; j < inlineMatches.length; j++) {
          const m = inlineMatches[j];
          const textBefore = line.slice(lastIndex, m.index).trim();
          if (textBefore && (currentTimeSec > 0 || currentBuffer)) {
            currentBuffer += (currentBuffer ? ' ' : '') + textBefore;
            results.push({
              timeSec: currentTimeSec,
              timeStr: currentTimeStr,
              en: currentBuffer.trim(),
              tr: getQuickTurkishPreview(currentBuffer.trim())
            });
            currentBuffer = '';
          }
          const minutes = parseInt(m[1], 10);
          const seconds = parseInt(m[2], 10);
          currentTimeSec = minutes * 60 + seconds;
          currentTimeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          lastIndex = (m.index || 0) + m[0].length;
        }
        const textAfter = line.slice(lastIndex).trim();
        if (textAfter) {
          currentBuffer = textAfter;
        }
      } else {
        currentBuffer += (currentBuffer ? ' ' : '') + line;
      }
    }
  }

  if (currentBuffer.trim()) {
    results.push({
      timeSec: currentTimeSec,
      timeStr: currentTimeStr,
      en: currentBuffer.trim(),
      tr: getQuickTurkishPreview(currentBuffer.trim())
    });
  }

  // Fallback: If no timestamps were found (plain text pasted), split into sentences
  if (results.length <= 1 && (!results[0] || results[0].timeSec === 0)) {
    const rawNormalized = rawText.replace(/\r?\n/g, ' ').trim();
    const sentences = rawNormalized
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);

    if (sentences.length > 1) {
      return sentences.map((sentence, idx) => {
        const estSec = idx * 8;
        const mins = Math.floor(estSec / 60);
        const secs = estSec % 60;
        return {
          timeSec: estSec,
          timeStr: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
          en: sentence,
          tr: getQuickTurkishPreview(sentence)
        };
      });
    }
  }

  return results;
};

/**
 * Converts parsed transcript lines into SubtitleLine objects.
 */
export const convertParsedToSubtitleLines = (
  parsed: ParsedTranscriptLine[],
  startIndex: number = 1
): SubtitleLine[] => {
  return parsed.map((item, idx) => {
    const words = item.en
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const highlightWords = words.slice(0, Math.min(3, words.length)).map((w) => w.toLowerCase());
    const blankTargetWord = highlightWords[0] || words[0]?.toLowerCase() || 'speaking';

    const fallbackOptions = ['practice', 'english', 'listen', 'fluency', 'shadowing', 'conversation'];
    const otherDistractors = fallbackOptions.filter((w) => w !== blankTargetWord).slice(0, 2);
    const quizOptions = [blankTargetWord, ...otherDistractors].sort(() => 0.5 - Math.random());

    let level: 'A1' | 'A2' | 'B1' | 'B2' = 'A1';
    if (words.length > 12) level = 'B2';
    else if (words.length > 8) level = 'B1';
    else if (words.length > 4) level = 'A2';

    return {
      id: startIndex + idx,
      timeSec: item.timeSec,
      timeStr: item.timeStr,
      en: item.en,
      tr: item.tr,
      level,
      highlightWords,
      blankTargetWord,
      quizOptions
    };
  });
};
