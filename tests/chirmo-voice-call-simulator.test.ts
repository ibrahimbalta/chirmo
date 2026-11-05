import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Voice Call Simulator (Adım 1: Chirmo Seni Arıyor!)', () => {
  it('creates ChirmoVoiceCallSimulatorModal with incoming call ringing, active call, and summary states', () => {
    const modalPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/learning/ChirmoVoiceCallSimulatorModal.tsx'
    );
    expect(fs.existsSync(modalPath)).toBe(true);

    const content = fs.readFileSync(modalPath, 'utf-8');
    expect(content).toContain('ChirmoVoiceCallSimulatorModal');
    expect(content).toContain('ringing');
    expect(content).toContain('in-call');
    expect(content).toContain('summary');
    expect(content).toContain('handleAnswerCall');
    expect(content).toContain('handleEndCall');
    expect(content).toContain('Chirmo AI');
  });

  it('integrates voice call trigger into ChirmoVirtualTutorStudio hero stage', () => {
    const studioPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx'
    );
    const content = fs.readFileSync(studioPath, 'utf-8');

    expect(content).toContain('ChirmoVoiceCallSimulatorModal');
    expect(content).toContain('isVoiceCallModalOpen');
    expect(content).toContain('2 Dk Sesli Arama');
  });
});
