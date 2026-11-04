import { describe, it, expect, beforeEach } from 'vitest';
import { SubscriptionService } from '../src/renderer/src/services/subscriptionService';

describe('SubscriptionService (200 TL / Ay Abonelik ve Ticari Model)', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        for (const key in store) delete store[key];
      }
    };
  });

  it('defines 200 TL / Ay premium plan with fair usage policy', () => {
    const premium = SubscriptionService.PLANS.premium;
    expect(premium.priceMonthlyTr).toBe(200);
    expect(premium.currency).toBe('TL');
    expect(premium.limits.dailyAiSpeakingMinutes).toBe(30);
    expect(premium.limits.simulationsAccess).toBe('all');
    expect(premium.features.length).toBeGreaterThanOrEqual(6);
  });

  it('calculates cost breakdown and verifies net profitability', () => {
    const breakdown = SubscriptionService.getCostBreakdown();
    expect(breakdown.length).toBeGreaterThan(0);

    const netProfit = breakdown.find((b) => b.item.includes('KÂR'));
    expect(netProfit).toBeDefined();
    expect(netProfit!.costPerUserTr).toBeGreaterThan(100); // 200 TL'nin %50'sinden fazlası net kâr
  });

  it('activates and cancels premium subscription smoothly', () => {
    const initial = SubscriptionService.getSubscriptionState();
    expect(initial.isPremium).toBe(false);

    const activated = SubscriptionService.activatePremium('iyzico_checkout');
    expect(activated.isPremium).toBe(true);
    expect(activated.planId).toBe('premium_monthly');
    expect(activated.renewsAt).toBeDefined();

    const cancelled = SubscriptionService.cancelSubscription();
    expect(cancelled.isPremium).toBe(true); // retains access until end of billing cycle
    expect(cancelled.cancelledAt).toBeDefined();
  });
});
