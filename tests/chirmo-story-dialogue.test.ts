import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Interactive Story Dialogue & Roleplay Studio', () => {
  const storyPath = path.resolve(
    __dirname,
    '../src/renderer/src/components/learning/ChirmoStoryDialogueStudio.tsx'
  );

  it('exports ChirmoStoryDialogueStudio component with interactive adventures', () => {
    expect(fs.existsSync(storyPath)).toBe(true);
    const content = fs.readFileSync(storyPath, 'utf-8');

    expect(content).toContain('export const ChirmoStoryDialogueStudio');
    expect(content).toContain('The Mysterious Cafe in London');
    expect(content).toContain('Lost Luggage at Heathrow Airport');
    expect(content).toContain('Kids: The Friendly Little Dinosaur');
  });

  it('provides fill-in-the-blank gaps and audio speech verification', () => {
    const content = fs.readFileSync(storyPath, 'utf-8');

    expect(content).toContain('blankTemplateEn');
    expect(content).toContain('correctWord');
    expect(content).toContain('Cevabı Kontrol Et & Konuş');
    expect(content).toContain('Tebrikler! Hikaye Başarıyla Tamamlandı!');
  });
});
