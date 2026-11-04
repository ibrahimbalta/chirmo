import { describe, it, expect, beforeEach } from 'vitest';
import path from 'path';
import fs from 'fs';

describe('Chirmo Kids Dedicated Hub Component & Curriculum Structure', () => {
  const componentPath = path.resolve(__dirname, '../src/renderer/src/components/kids/ChirmoKidsDedicatedHub.tsx');

  it('exists and exports ChirmoKidsDedicatedHub component', () => {
    expect(fs.existsSync(componentPath)).toBe(true);
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('export const ChirmoKidsDedicatedHub');
  });

  it('includes 4 distinct age groups spanning from 5 to 17 years old', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('5-7');
    expect(content).toContain('8-10');
    expect(content).toContain('11-13');
    expect(content).toContain('14-17');
    expect(content).toContain('Okul Öncesi & 1. Sınıf');
    expect(content).toContain('İlkokul Kademesi');
    expect(content).toContain('Ortaokul / LGS Temeli');
    expect(content).toContain('Gençler & Lise');
  });

  it('provides gamified interactive modes: Games, Cards, Pattern Builder, Songs, and Parent Dashboard', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('Dedektif Chirmo: Sesi Duy ve Doğru Resmi Seç!');
    expect(content).toContain('Cümle Yapbozu: Kelimeleri Sıraya Diz!');
    expect(content).toContain('Süper Telaffuz Arenası: Chirmo ile Birlikte Söyle!');
    expect(content).toContain('Lego Gibi Cümle Kurma Atölyesi (Kids Pattern Builder)');
    expect(content).toContain('ABC Phonics Song');
    expect(content).toContain('Ebeveyn Doğrulama Kapısı');
    expect(content).toContain('Uluslararası Müfredat Uyumlu');
  });
});
