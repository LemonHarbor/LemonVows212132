import { render, screen } from '@testing-library/react';
import { subscriptionApi, PRICING_PLANS } from '@/lib/monetization';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  }))
}));

describe('Monetization API', () => {
  describe('subscriptionApi', () => {
    test('getUserPlan returns FREE plan when no subscription is found', async () => {
      const plan = await subscriptionApi.getUserPlan('user123');
      expect(plan).toEqual(PRICING_PLANS.FREE);
    });

    test('canUseFeature returns false for premium features on FREE plan', async () => {
      // Mock getUserPlan to return FREE plan
      jest.spyOn(subscriptionApi, 'getUserPlan').mockResolvedValue(PRICING_PLANS.FREE);
      
      const canUse = await subscriptionApi.canUseFeature('user123', 'premium_feature');
      expect(canUse).toBe(false);
    });

    test('checkLimit returns true when under the limit', async () => {
      // Mock getUserPlan to return BASIC plan
      jest.spyOn(subscriptionApi, 'getUserPlan').mockResolvedValue(PRICING_PLANS.BASIC);
      
      const canAddGuest = await subscriptionApi.checkLimit('user123', 'guests', 30);
      expect(canAddGuest).toBe(true);
    });

    test('checkLimit returns false when over the limit', async () => {
      // Mock getUserPlan to return BASIC plan
      jest.spyOn(subscriptionApi, 'getUserPlan').mockResolvedValue(PRICING_PLANS.BASIC);
      
      const canAddGuest = await subscriptionApi.checkLimit('user123', 'guests', 60);
      expect(canAddGuest).toBe(false);
    });

    test('checkLimit returns true for unlimited features in premium plans', async () => {
      // Mock getUserPlan to return PREMIUM plan
      jest.spyOn(subscriptionApi, 'getUserPlan').mockResolvedValue(PRICING_PLANS.PREMIUM);
      
      const canAddGuest = await subscriptionApi.checkLimit('user123', 'guests', 1000);
      expect(canAddGuest).toBe(true);
    });
  });
});
