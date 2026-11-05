import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Pronunciation Doctor & Syllable Heatmap (Adım 2)', () => {
  it('creates ChirmoPronunciationDoctor with color-coded phonetic feedback and slow-mo inspector', () => {
    const componentPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/learning/ChirmoPronunciationDoctor.tsx'
    );
    expect(fs.existsSync(componentPath)).toBe(true);

    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('ChirmoPronunciationDoctor');
    expect(content).toContain('evaluatePronunciation');
    expect(content).toContain('handlePlaySlowMotion');
    expect(content).toContain('phoneticTip');
    expect(content).toContain('Isı Haritası');
  });

  it('integrates ChirmoPronunciationDoctor into ChirmoVirtualTutorStudio', () => {
    const studioPath = path.resolve(
      __dirname,
      '../src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx'
    );
    const content = fs.readFileSync(studioPath, 'utf-8');

    expect(content).toContain('ChirmoPronunciationDoctor');
    expect(content).toContain('isPronunciationDoctorOpen');
    expect(content).toContain('Telaffuz Doktoru');
  });
});
