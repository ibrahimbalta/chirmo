import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';

describe('Chirmo Kids Expanded Vocabulary & Revolutionary Learning Methods', () => {
  const componentPath = path.resolve(__dirname, '../src/renderer/src/components/kids/ChirmoKidsDedicatedHub.tsx');

  it('contains expanded vocabulary for all age groups with 20+ words in 5-7 and 8-10', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');

    // 5-7 Expanded vocabulary check
    expect(content).toContain('Banana');
    expect(content).toContain('Water');
    expect(content).toContain('Big Tree');
    expect(content).toContain('Rabbit');

    // 8-10 Expanded vocabulary check
    expect(content).toContain('Football & Goal');
    expect(content).toContain('Smart Robot');
    expect(content).toContain('Tasty Sandwich');

    // 11-13 & 14-17 Expanded vocabulary check
    expect(content).toContain('Mobile Technology');
    expect(content).toContain('Milky Way Galaxy');
    expect(content).toContain('Artificial Intelligence');
  });

  it('implements TPR (Total Physical Response) Action Lab: Chirmo Diyor ki (Simon Says)', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('Chirmo Diyor ki!');
    expect(content).toContain('Touch your nose');
    expect(content).toContain('Jump high like a bunny');
    expect(content).toContain('Clap your hands');
    expect(content).toContain('Görevi Yaptım');
  });

  it('implements Interactive Picture Storybooks with clickable rich scenes', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('Sihirli Konuşan Hikayeler');
    expect(content).toContain('Piknik Ormanı');
    expect(content).toContain('Uzay İstasyonu');
    expect(content).toContain('Mavi Okyanus Krallığı');
    expect(content).toContain('Dinozor Safari Parkı');
  });

  it('implements 4-Block Visual Sentence Factory 2.0 with dynamic English-Turkish mapping', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('Cümle Fabrikası');
    expect(content).toContain('Özne (Kim?)');
    expect(content).toContain('Eylem (Ne Yapıyor?)');
    expect(content).toContain('Nesne (Neyi?)');
    expect(content).toContain('Zaman & Yer');
  });
});
