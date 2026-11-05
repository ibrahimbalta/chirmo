import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';

describe('Chirmo Kids Age-Adaptive Speaking Architecture', () => {
  const componentPath = path.resolve(__dirname, '../src/renderer/src/components/kids/ChirmoKidsDedicatedHub.tsx');
  const content = fs.readFileSync(componentPath, 'utf-8');

  it('provides age-differentiated TPR action lab missions across all 4 age groups', () => {
    // 5-7
    expect(content).toContain('Touch your nose');
    // 8-10
    expect(content).toContain('Put on your backpack');
    // 11-13
    expect(content).toContain('Welcome to our science fair');
    // 14-17
    expect(content).toContain('Take a confident speaker stance');
  });

  it('provides age-differentiated storybook scenes for kids and teens', () => {
    // 5-7
    expect(content).toContain('The Magical Picnic Forest');
    // 8-10
    expect(content).toContain('The Smart Science Lab');
    // 11-13
    expect(content).toContain('International Airport & Travel');
    // 14-17
    expect(content).toContain('Silicon Valley Tech Hub');
  });

  it('provides age-differentiated pattern builders and sentence factories', () => {
    // 8-10 school & sports
    expect(content).toContain('Our school soccer team');
    // 11-13 tech & science
    expect(content).toContain('clean renewable energy systems');
    // 14-17 career & debate
    expect(content).toContain('ethical artificial intelligence');
  });

  it('provides age-differentiated chat steps for meaningful English conversation', () => {
    // 5-7
    expect(content).toContain('What is your favorite animal?');
    // 8-10
    expect(content).toContain('What is your favorite school subject?');
    // 11-13
    expect(content).toContain('What are your favorite hobbies after school?');
    // 14-17
    expect(content).toContain('What is your biggest ambition for the future?');
  });

  it('implements active age speaking showcase banner and reset handler', () => {
    expect(content).toContain('handleSelectAge');
    expect(content).toContain('Günün Sesli Konuşma Meydan Okuması');
  });
});
