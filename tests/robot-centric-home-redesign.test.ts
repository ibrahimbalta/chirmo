import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Robot-Centric Home Stage Redesign', () => {
  it('updates LearningCenterSidebar branding to focus on AI English Speaking Robot', () => {
    const sidebarPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/home/LearningCenterSidebar.tsx'
    );
    const content = fs.readFileSync(sidebarPath, 'utf-8');
    expect(content).toContain('AI İngilizce Konuşma Robotu');
  });

  it('transforms ChirmoVirtualTutorStudio into a clean robot-centric speaking stage', () => {
    const studioPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx'
    );
    const content = fs.readFileSync(studioPath, 'utf-8');

    // Merkezi Robot Sahnesi ve Konuşma Çağrısı
    expect(content).toContain('Chirmo ile Canlı Konuşmaya Başla');
    expect(content).toContain('Günün Konuşma Pratiğine Hazır mısın');
    expect(content).toContain('Kafede Sipariş Verme');
    expect(content).toContain('ChirmoTalkingRobotAvatar');

    // Geriye dönük uyumluluk ve test etiketleri
    expect(content).toContain('30 Günde Kendini İfade Etme Kampı');
    expect(content).toContain('Günün 15 Dk Görevi');
    expect(content).toContain('Chirmo ile Canlı Rol Yapma');
    expect(content).toContain('Hızlı Pratik Oyunları');
    expect(content).toContain('30 Günlük Harita');
  });

  it('keeps right tutor sidebar smoothly toggleable in App.tsx while providing wide center stage', () => {
    const appPath = path.resolve(__dirname, '../src/renderer/src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    expect(content).toContain('isTutorOpen');
    expect(content).toContain('setIsTutorOpen');
    expect(content).toContain('SimpleSearchHome');
  });
});
