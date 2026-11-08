import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Hero Landing Portal (Açılış Vitrini)', () => {
  const landingPath = path.resolve(
    __dirname,
    '../src/renderer/src/components/landing/ChirmoHeroLandingPortal.tsx'
  );

  it('exists and has core hero headlines and Turkish education solution', () => {
    expect(fs.existsSync(landingPath)).toBe(true);
    const content = fs.readFileSync(landingPath, 'utf-8');

    // Hero Manşetleri ve Konsept
    expect(content).toContain('Yıllarca Ezberlediniz');
    expect(content).toContain('Artık Konuşma Vakti');
    expect(content).toContain('30 Günde Kendini İfade Etme Kampı');
    expect(content).toContain('Lingoria Macera Evreni');
    expect(content).toContain('Neden Yıllardır Konuşamıyoruz');
  });

  it('provides dual gateway options for adults (Camp & Panel) and kids (Lingoria RPG)', () => {
    const content = fs.readFileSync(landingPath, 'utf-8');

    // 2 Ana Kapı ve Butonlar
    expect(content).toContain('onEnterStudentPanel');
    expect(content).toContain('onEnterKidsWorld');
    expect(content).toContain('Öğrenci Paneline Başla');
    expect(content).toContain('Lingoria Dünyasını Aç');
  });

  it('contains interactive demo showcase with English and German speaking practice', () => {
    const content = fs.readFileSync(landingPath, 'utf-8');

    // İnteraktif Demo ve Sesli Pratik
    expect(content).toContain('Kalıp Mantığını 10 Saniyede Görün');
    expect(content).toContain('Can I have a large black coffee, please?');
    expect(content).toContain('Kann ich bitte einen großen schwarzen Kaffee haben?');
    expect(content).toContain('handleSpeak');
    expect(content).toContain('speechSynthesis');
  });

  it('integrates seamlessly into App.tsx as default starting page with quick return buttons', () => {
    const appPath = path.resolve(__dirname, '../src/renderer/src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    // App.tsx Entegrasyonu
    expect(content).toContain('ChirmoHeroLandingPortal');
    expect(content).toContain("activeTab === 'portal'");
    expect(content).toContain('onEnterStudentPanel');
    expect(content).toContain('title="Chirmo Açılış Vitrinine Dön"');
  });
});
