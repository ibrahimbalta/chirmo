import { describe, it, expect } from 'vitest';
import {
  CareerTrackService,
  CAREER_TRACKS
} from '../src/renderer/src/services/careerTrackService';

describe('Career & Professional Speaking Track Service', () => {
  it('provides the 4 core professional tracks (Tech, Interview, Visa, Business)', () => {
    const tracks = CareerTrackService.getTracks();
    expect(tracks).toHaveLength(4);

    const trackIds = tracks.map(t => t.id);
    expect(trackIds).toContain('tech');
    expect(trackIds).toContain('interview');
    expect(trackIds).toContain('visa');
    expect(trackIds).toContain('business');
  });

  it('includes industry power jargon and real-world scenarios for each track', () => {
    const techTrack = CareerTrackService.getTrackById('tech');
    expect(techTrack).toBeDefined();
    expect(techTrack?.powerJargon.length).toBeGreaterThanOrEqual(4);
    expect(techTrack?.scenarios.length).toBeGreaterThanOrEqual(2);

    const standupScenario = techTrack?.scenarios.find(s => s.id === 'tech_standup');
    expect(standupScenario).toBeDefined();
    expect(standupScenario?.prompt).toContain('standup');
    expect(standupScenario?.targetKeywords).toContain('blocker');
  });

  it('evaluates user spoken career answer, matching keywords and professional tone', () => {
    const techTrack = CareerTrackService.getTrackById('tech')!;
    const scenario = techTrack.scenarios[0];

    const userSpeech = 'Yesterday I refactored the auth microservice. Today I am implementing unit tests and I have no blocker.';
    const result = CareerTrackService.evaluateCareerSpeech(scenario, userSpeech);

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.matchedKeywords.length).toBeGreaterThan(0);
    expect(result.professionalTone).toBe('excellent');
    expect(result.feedback).toBeTruthy();
  });

  it('handles short or off-topic speech with constructive guidance', () => {
    const interviewTrack = CareerTrackService.getTrackById('interview')!;
    const scenario = interviewTrack.scenarios[0];

    const shortSpeech = 'Yes, me good.';
    const result = CareerTrackService.evaluateCareerSpeech(scenario, shortSpeech);

    expect(result.score).toBeLessThan(60);
    expect(result.professionalTone).toBe('needs_improvement');
    expect(result.feedbackTr).toBeTruthy();
  });
});
