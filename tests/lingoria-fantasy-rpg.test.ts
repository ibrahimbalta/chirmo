import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';

describe('Lingoria by Chirmo Kids - Fantastic Language Learning Universe', () => {
  const componentPath = path.resolve(__dirname, '../src/renderer/src/components/kids/ChirmoKidsDedicatedHub.tsx');
  const content = fs.readFileSync(componentPath, 'utf-8');

  it('features Lingoria by Chirmo Kids brand and fantasy RPG header', () => {
    expect(content).toContain('Lingoria');
    expect(content).toContain('by Chirmo Kids');
    expect(content).toContain('Fantastik Dil Dünyası');
    expect(content).toContain('lingoriaXp');
    expect(content).toContain('playerLevel');
  });

  it('features the 8 interactive fantasy regions of Lingoria', () => {
    expect(content).toContain('Kelime Ormanı');
    expect(content).toContain('Konuşma Köyü');
    expect(content).toContain('Gramer Kalesi');
    expect(content).toContain('Hikâye Vadisi');
    expect(content).toContain('Hayvanlar Adası');
    expect(content).toContain('Renkler Şehri');
    expect(content).toContain('Zaman Kulesi');
    expect(content).toContain('Macera Limanı');
  });

  it('includes Lingo & Zippy companion speech bubble and greeting audio', () => {
    expect(content).toContain('Lingo & Zippy Rehberiniz');
    expect(content).toContain('Merhaba Maceracı! Haydi, Lingoria\'da yeni bir görev başlatalım!');
    expect(content).toContain('Selamı Dinle');
  });

  it('implements interactive Daily Quest (Ormandaki 5 Kayıp Kelimeyi Bul!) with XP reward', () => {
    expect(content).toContain('Ormandaki 5 kayıp kelimeyi bul!');
    expect(content).toContain('+50 XP');
    expect(content).toContain('Göreve Başla');
    expect(content).toContain('isQuestModalOpen');
    expect(content).toContain('questCollectedWords');
  });

  it('contains the showcase cards: Bugünün Kelimesi, Popüler Oyunlar, and İlerlemen bar', () => {
    expect(content).toContain('Bugünün Kelimesi');
    expect(content).toContain('Popüler Oyunlar');
    expect(content).toContain('Kelime Avı');
    expect(content).toContain('Kayıp Kelimeler');
    expect(content).toContain('Büyülü Cümleler');
    expect(content).toContain('İlerlemen');
    expect(content).toContain('XP Barı:');
  });

  it('persists XP, stars, and completed quests to localStorage', () => {
    expect(content).toContain('lingoria_xp');
    expect(content).toContain('lingoria_completed_quests');
    expect(content).toContain('chirmo_kids_stars');
  });

  it('features Maceracının Büyülü Teçhizat Sandığı (Language Gear Chest) with 5 core linguistic tools', () => {
    expect(content).toContain('Maceracının Büyülü Teçhizat Sandığı');
    expect(content).toContain('Cümle Kılıcı');
    expect(content).toContain('Soru Asası');
    expect(content).toContain('İstek Kalkanı');
    expect(content).toContain('Duygu İksiri');
    expect(content).toContain('Zaman Pusulası');
    expect(content).toContain('isGearChestOpen');
    expect(content).toContain('Teçhizatlarımı Kuşandım');
  });
});
