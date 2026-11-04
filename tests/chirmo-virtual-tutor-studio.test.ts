import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Virtual Tutor Studio (30-Day Immersion Engine)', () => {
  it('has ChirmoVirtualTutorStudio component with animated persona and live tabs', () => {
    const studioPath = path.resolve(__dirname, '../src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx');
    expect(fs.existsSync(studioPath)).toBe(true);

    const content = fs.readFileSync(studioPath, 'utf-8');
    // Chirmo Karakter & Sanal Öğretmen Varlığı
    expect(content).toContain('Chirmo AI');
    expect(content).toContain('30 Günde Kendini İfade Etme Kampı');
    expect(content).toContain('chirmoState');

    // 4 İnteraktif Stüdyo Modu
    expect(content).toContain('Günün 15 Dk Görevi');
    expect(content).toContain('Chirmo ile Canlı Rol Yapma');
    expect(content).toContain('Hızlı Pratik Oyunları');
    expect(content).toContain('30 Günlük Harita');

    // Ses Tanıma ve Mikrofon
    expect(content).toContain('handleStartSpeaking');
    expect(content).toContain('handleChirmoSpeak');
    expect(content).toContain('scoreResult');
    expect(content).toContain('Kelimelerime Ekle');
  });

  it('connects SimpleSearchHome to ChirmoVirtualTutorStudio as primary home studio', () => {
    const homePath = path.resolve(__dirname, '../src/renderer/src/components/home/SimpleSearchHome.tsx');
    expect(fs.existsSync(homePath)).toBe(true);

    const content = fs.readFileSync(homePath, 'utf-8');
    expect(content).toContain('ChirmoVirtualTutorStudio');
  });

  it('updates App.tsx navigation to focus on Chirmo Stüdyo and 30-Day Speaking Camp', () => {
    const appPath = path.resolve(__dirname, '../src/renderer/src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    expect(content).toContain('Chirmo Stüdyo');
    expect(content).toContain('30 Günlük Kamp');
    expect(content).toContain('Hedeflerim');
    expect(content).toContain('30 Günde Konuşma Garantili Sanal Öğretmen');
  });
});
