import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Chirmo PWA & Mobile Compatibility', () => {
  it('has a valid manifest.webmanifest with icons and standalone display mode', () => {
    const manifestPath = path.resolve(__dirname, '../public/manifest.webmanifest');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    expect(manifest.name).toContain('Chirmo');
    expect(manifest.short_name).toBe('Chirmo');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);

    const sizes = manifest.icons.map((i: any) => i.sizes);
    expect(sizes.includes('192x192')).toBe(true);
    expect(sizes.includes('512x512')).toBe(true);
  });

  it('has a valid manifest.json alias for older Android browser compatibility', () => {
    const manifestJsonPath = path.resolve(__dirname, '../public/manifest.json');
    expect(fs.existsSync(manifestJsonPath)).toBe(true);

    const content = fs.readFileSync(manifestJsonPath, 'utf-8');
    const manifest = JSON.parse(content);
    expect(manifest.display).toBe('standalone');
  });

  it('has a valid Service Worker script sw.js with cache and network fallback', () => {
    const swPath = path.resolve(__dirname, '../public/sw.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain('addEventListener(\'install\'');
    expect(content).toContain('addEventListener(\'activate\'');
    expect(content).toContain('addEventListener(\'fetch\'');
  });

  it('includes PWA manifest and mobile viewport meta tags in index.html', () => {
    const htmlPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');

    expect(html).toContain('name="viewport"');
    expect(html).toContain('name="mobile-web-app-capable"');
    expect(html).toContain('name="apple-mobile-web-app-capable"');
    expect(html).toContain('rel="manifest"');
  });
});
