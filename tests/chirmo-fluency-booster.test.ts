import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Fluency Booster & Kids Supercharged Features', () => {
  const boosterPath = path.resolve(
    __dirname,
    '../src/renderer/src/components/learning/ChirmoFluencyBooster.tsx'
  );
  const kidsHubPath = path.resolve(
    __dirname,
    '../src/renderer/src/components/kids/ChirmoKidsDedicatedHub.tsx'
  );

  it('exports ChirmoFluencyBooster with 5 scientific acceleration modules', () => {
    expect(fs.existsSync(boosterPath)).toBe(true);
    const content = fs.readFileSync(boosterPath, 'utf-8');

    // 1. Gölgeleme & Ağız Jimnastiği
    expect(content).toContain('Chirmo ile Aynı Anda Söyle');
    expect(content).toContain('Ağız & Dil İpucu');

    // 2. Görsel Hızlı Refleks
    expect(content).toContain('Görsel Refleks Antrenmanı');
    expect(content).toContain('How much is the coffee?');

    // 3. Yürüyüş & Kulak Doldurma Modu
    expect(content).toContain('Yürüyüş & Kulak Doldurma Modu');
    expect(content).toContain('Can I have the bill, please?');

    // 4. Türklerin En Sık Yaptığı Hatalar
    expect(content).toContain('Kurtarıcı Püf Noktaları Doktoru');
    expect(content).toContain('I am agree with you.');
    expect(content).toContain('I agree with you.');

    // 5. Hayatım & Meslek
    expect(content).toContain('Kendi Hayatına ve Hedefine Özel Kalıplar');
    expect(content).toContain('Yazılımcı & Teknoloji');
  });

  it('enriches Kids Hub with animal safari, magic colors, cartoon chat and sticker book', () => {
    expect(fs.existsSync(kidsHubPath)).toBe(true);
    const content = fs.readFileSync(kidsHubPath, 'utf-8');

    expect(content).toContain('Chirmo\'nun Konuşan Hayvanat Bahçesi');
    expect(content).toContain('Sihirli Boya & Konuş Laboratuvarı');
    expect(content).toContain('Chirmo ile Eğlenceli Sohbet');
    expect(content).toContain('Süper Çıkartma Albümüm');
  });
});
