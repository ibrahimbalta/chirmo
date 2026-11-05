import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Turkish-to-English Answer Bridge in Interactive Dialogue', () => {
  it('adds Turkish to English interactive answer bridge in ChirmoInteractiveGraduationDialogueModal', () => {
    const modalPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/learning/ChirmoInteractiveGraduationDialogueModal.tsx'
    );
    expect(fs.existsSync(modalPath)).toBe(true);

    const content = fs.readFileSync(modalPath, 'utf-8');

    // Türkçe Cevap Asistanı Butonu ve Alanı
    expect(content).toContain('Aklındaki Cevabı Türkçe Yaz');
    expect(content).toContain('handleTranslateTurkishAnswer');
    expect(content).toContain('turkishInput');
    expect(content).toContain('translatedEnglishAnswer');

    // Telaffuz Dinleme ve Chirmo'ya Gönderme Butonları
    expect(content).toContain('Bu Cevabı Chirmo\'ya Gönder');
  });
});
