import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo Bulletproof ErrorBoundary & Recovery Engine', () => {
  it('has ErrorBoundary component that catches uncaught errors and provides recovery', () => {
    const errorBoundaryPath = path.resolve(__dirname, '../src/renderer/src/components/common/ErrorBoundary.tsx');
    expect(fs.existsSync(errorBoundaryPath)).toBe(true);

    const content = fs.readFileSync(errorBoundaryPath, 'utf-8');
    expect(content).toContain('componentDidCatch');
    expect(content).toContain('getDerivedStateFromError');
    expect(content).toContain('Yeniden Başlat');
    expect(content).toContain('Sıfırla ve Aç');
  });

  it('wraps App with ErrorBoundary in main.tsx', () => {
    const mainPath = path.resolve(__dirname, '../src/renderer/src/main.tsx');
    const content = fs.readFileSync(mainPath, 'utf-8');

    expect(content).toContain('<ErrorBoundary>');
    expect(content).toContain('<App />');
    expect(content).toContain('</ErrorBoundary>');
  });
});
