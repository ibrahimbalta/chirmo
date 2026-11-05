import { describe, it, expect, beforeEach } from 'vitest';
import { SubscriptionService } from '../src/renderer/src/services/subscriptionService';

describe('SubscriptionService (200 TL / Yıl - Yıllık Tek Seferlik Ödeme Modeli)', () => {
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

  it('defines 200 TL / Yıl tek seferlik premium plan with fair usage policy', () => {
    const premium = SubscriptionService.PLANS.premium;
    expect(premium.priceYearlyTr).toBe(200);
    expect(premium.priceMonthlyTr).toBe(200);
    expect(premium.billingPeriod).toContain('Yıllık');
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

  it('activates and cancels premium subscription smoothly with 1-year coverage', () => {
    const initial = SubscriptionService.getSubscriptionState();
    expect(initial.isPremium).toBe(false);

    const activated = SubscriptionService.activatePremium('iyzico_checkout');
    expect(activated.isPremium).toBe(true);
    expect(activated.planId).toBe('premium_yearly');
    expect(activated.billingType).toBe('yearly_one_time');
    expect(activated.renewsAt).toBeDefined();

    // Verify 1 year validity
    const startYear = new Date(activated.startedAt!).getFullYear();
    const expiryYear = new Date(activated.renewsAt!).getFullYear();
    expect(expiryYear - startYear).toBe(1);

    const cancelled = SubscriptionService.cancelSubscription();
    expect(cancelled.isPremium).toBe(true); // retains access until end of billing cycle
    expect(cancelled.cancelledAt).toBeDefined();
  });
});
