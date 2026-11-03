import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo 3-Column Learning Dashboard & Sidebar Layout', () => {
  it('has LearningCenterSidebar component with navigation items and daily goal', () => {
    const filePath = path.resolve(__dirname, '../src/renderer/src/components/home/LearningCenterSidebar.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('Öğrenme Merkezi');
    expect(content).toContain('Merhaba İbrahim!');
    expect(content).toContain('Kelime Defterim');
    expect(content).toContain('İngilizce Derslerim');
    expect(content).toContain('Dinleme Pratiği');
    expect(content).toContain('Konuşma Pratiği');
    expect(content).toContain('Yazma Pratiği');
    expect(content).toContain('Hafıza Testleri');
    expect(content).toContain('Gelişim Raporum');
    expect(content).toContain('Günlük Hedefim');
    expect(content).toContain('Chirmo Pro\'ya Geç');
  });

  it('has ChirmoAiTeacherSidebar component with greeting, daily word, and recommendations', () => {
    const filePath = path.resolve(__dirname, '../src/renderer/src/components/home/ChirmoAiTeacherSidebar.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('Chirmo AI Öğretmeni');
    expect(content).toContain('Çevrimiçi');
    expect(content).toContain('Bugünün Kelimesi');
    expect(content).toContain('Improve');
    expect(content).toContain('Geliştirmek');
    expect(content).toContain('Bugünkü Öğrenme Durumum');
    expect(content).toContain('Chirmo Önerisi');
  });

  it('integrates 3-panel dashboard in App.tsx with responsive desktop/mobile containers', () => {
    const appPath = path.resolve(__dirname, '../src/renderer/src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    expect(content).toContain('<LearningCenterSidebar');
    expect(content).toContain('<SimpleSearchHome');
    expect(content).toContain('<ChirmoAiTeacherSidebar');
  });
});
