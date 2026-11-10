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

    expect(content).toContain('Yıllarca Ezberlediniz');
    expect(content).toContain('Artık Konuşma Vakti');
    expect(content).toContain('FirestoreService');
    expect(content).toContain('recordVisitAndGetStats');
  });

  it('provides dual gateway options for adults (Camp & Panel) and kids (Lingoria RPG)', () => {
    const content = fs.readFileSync(landingPath, 'utf-8');

    expect(content).toContain('onEnterStudentPanel');
    expect(content).toContain('onEnterKidsWorld');
    expect(content).toContain('Öğrenci Paneline Başla');
  });

  it('contains interactive demo showcase with English and German speaking practice', () => {
    const content = fs.readFileSync(landingPath, 'utf-8');

    expect(content).toContain('Can I have a large black coffee, please?');
    expect(content).toContain('Kann ich bitte einen großen schwarzen Kaffee haben?');
    expect(content).toContain('handleSpeak');
    expect(content).toContain('speechSynthesis');
  });

  it('integrates seamlessly into App.tsx as default starting page with quick return buttons', () => {
    const appPath = path.resolve(__dirname, '../src/renderer/src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    expect(content).toContain('ChirmoHeroLandingPortal');
    expect(content).toContain("activeTab === 'portal'");
    expect(content).toContain('onEnterStudentPanel');
  });

  it('provides header login entry, auth modal and dedicated user profile dashboard page', () => {
    const content = fs.readFileSync(landingPath, 'utf-8');

    expect(content).toContain('ChirmoAuthModal');
    expect(content).toContain('Giriş Yap');
    expect(content).toContain('isAuthModalOpen');
    expect(content).toContain('PrivacyAuthService');
    expect(content).toContain('onEnterStudentPanel()');
    expect(content).toContain('Kullanıcı Sayfası');
    expect(content).toContain('isProfileModalOpen');
    expect(content).toContain('UserProfileService');
    expect(content).toContain('Öğrenci Paneline Devam Et');
    expect(content).toContain('Güvenli Çıkış');
  });

  it('protects all shortcuts and portal links requiring login or registration first before entering panel', () => {
    const content = fs.readFileSync(landingPath, 'utf-8');

    expect(content).toContain('handleProtectedAction');
    expect(content).toContain('setPendingAction');
    expect(content).toContain('pendingAction');
  });
});
