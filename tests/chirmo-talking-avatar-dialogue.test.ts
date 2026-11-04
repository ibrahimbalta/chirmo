import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Talking Robot Avatar & Interactive Graduation Dialogue', () => {
  it('creates ChirmoTalkingRobotAvatar with 4 animated states and audio waves', () => {
    const avatarPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/avatar/ChirmoTalkingRobotAvatar.tsx'
    );
    expect(fs.existsSync(avatarPath)).toBe(true);

    const content = fs.readFileSync(avatarPath, 'utf-8');
    expect(content).toContain('ChirmoTalkingRobotAvatar');
    expect(content).toContain('idle');
    expect(content).toContain('listening');
    expect(content).toContain('thinking');
    expect(content).toContain('speaking');
    expect(content).toContain('chirmo-character.png');
  });

  it('creates ChirmoInteractiveGraduationDialogueModal with voice co-pilot hints and 30-day milestone support', () => {
    const modalPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/learning/ChirmoInteractiveGraduationDialogueModal.tsx'
    );
    expect(fs.existsSync(modalPath)).toBe(true);

    const content = fs.readFileSync(modalPath, 'utf-8');
    expect(content).toContain('ChirmoInteractiveGraduationDialogueModal');
    expect(content).toContain('Takıldım');
    expect(content).toContain('İpucu');
    expect(content).toContain('handleVoiceWhisperHint');
    expect(content).toContain('ChirmoTalkingRobotAvatar');
    expect(content).toContain('GeminiAiTeacherService');
    expect(content).toContain('SpeechRecognition');
    expect(content).toContain('Türkçe Açıklaması');
    expect(content).toContain('translationTr');
  });

  it('integrates graduation dialogue modal into ThirtyDayCampView for day 30 milestone', () => {
    const campPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/kids/ThirtyDayCampView.tsx'
    );
    const content = fs.readFileSync(campPath, 'utf-8');
    expect(content).toContain('ChirmoInteractiveGraduationDialogueModal');
    expect(content).toContain('isGraduationDialogueOpen');
  });

  it('integrates Chirmo live robot conversation into ChirmoVirtualTutorStudio', () => {
    const studioPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx'
    );
    const content = fs.readFileSync(studioPath, 'utf-8');
    expect(content).toContain('ChirmoInteractiveGraduationDialogueModal');
    expect(content).toContain('isRobotDialogueOpen');
  });
});
