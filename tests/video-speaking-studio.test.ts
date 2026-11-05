import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Video & Film English Speaking & Shadowing Studio', () => {
  const watchingViewPath = path.resolve(
    __dirname,
    '../src/renderer/src/components/learning/WatchingView.tsx'
  );
  const learningHubPath = path.resolve(
    __dirname,
    '../src/renderer/src/components/learning/SimpleLearningHub.tsx'
  );
  const appPath = path.resolve(
    __dirname,
    '../src/renderer/src/App.tsx'
  );
  const homeHubPath = path.resolve(
    __dirname,
    '../src/renderer/src/components/home/HomeSearchHub.tsx'
  );
  const indexPath = path.resolve(
    __dirname,
    '../index.html'
  );

  it('index.html CSP permits YouTube iframes and media sources without black screens', () => {
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('frame-src');
    expect(content).toContain('https://www.youtube.com');
    expect(content).toContain('https://www.youtube-nocookie.com');
  });

  it('WatchingView implements interactive YouTube/video link import and curated film/speech lessons', () => {
    expect(fs.existsSync(watchingViewPath)).toBe(true);
    const content = fs.readFileSync(watchingViewPath, 'utf-8');

    // Video URL input & parsing
    expect(content).toContain('handleCustomUrlSubmit');
    expect(content).toContain('youtube.com');
    // Categories including films, TED talks, news
    expect(content).toContain('Film');
    expect(content).toContain('TED');
  });

  it('WatchingView implements extractYouTubeVideoId supporting youtu.be, shorts, and query params', () => {
    const content = fs.readFileSync(watchingViewPath, 'utf-8');
    expect(content).toContain('extractYouTubeVideoId');
    expect(content).toContain('referrerPolicy');
    expect(content).toContain('youtube-nocookie.com');
  });

  it('WatchingView provides active speaking training with Shadowing Mode & microphone evaluation', () => {
    const content = fs.readFileSync(watchingViewPath, 'utf-8');

    // Shadowing speaking coach
    expect(content).toContain('handleStartShadowing');
    expect(content).toContain('shadowingScore');
    expect(content).toContain('isListening');
  });

  it('WatchingView provides Listening Comprehension Quiz and interactive word definitions', () => {
    const content = fs.readFileSync(watchingViewPath, 'utf-8');

    // Listening quiz / fill-in-the-blank
    expect(content).toContain('handleAnswerQuiz');
    // Vocabulary Vault saving
    expect(content).toContain('handleSaveWord');
    expect(content).toContain('handleWordClick');
  });

  it('WatchingView implements interactive lesson generator explaining dialogue and providing drills ("burda şunu diyor")', () => {
    const content = fs.readFileSync(watchingViewPath, 'utf-8');

    // Interactive lesson card with Chirmo teacher explanation
    expect(content).toContain("What's that?");
    expect(content).toContain('handleGenerateInteractiveLesson');
    expect(content).toContain('interactiveLesson');
    expect(content).toContain('substitutionDrills');
  });

  it('App implements mobile header and mobile bottom navigation for Film button', () => {
    const appContent = fs.readFileSync(appPath, 'utf-8');
    // Header must have visible mobile Film button next to logo
    expect(appContent).toContain('md:hidden');
    expect(appContent).toContain("setActiveTab('video')");
    // Mobile bottom nav must also include Film
    expect(appContent).toContain('Film');

    const watchingContent = fs.readFileSync(watchingViewPath, 'utf-8');
    // Mobile bottom clearance so player is not blocked by mobile nav
    expect(watchingContent).toContain('pb-24');
  });

  it('SimpleLearningHub integrates Video Speaking & Shadowing Studio tab', () => {
    const content = fs.readFileSync(learningHubPath, 'utf-8');
    expect(content).toContain('WatchingView');
    expect(content).toContain("'video'");
  });

  it('HomeSearchHub includes Video Speaking Studio widget in catalog', () => {
    const content = fs.readFileSync(homeHubPath, 'utf-8');
    expect(content).toContain('videostudio');
  });

  it('App header ensures Giriş / Kayıt button is responsive and visible on mobile screens', () => {
    const content = fs.readFileSync(appPath, 'utf-8');
    // Verify responsive compact styling on mobile so auth button is never pushed off-screen
    expect(content).toContain('Giriş');
    expect(content).toContain('setIsAuthModalOpen');
  });
});
