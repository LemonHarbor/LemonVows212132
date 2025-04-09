import { render, screen, fireEvent } from '@testing-library/react';
import PricingPage from '@/components/sections/PricingPage';
import { PRICING_PLANS } from '@/lib/monetization';

describe('PricingPage', () => {
  const mockOnSelectPlan = jest.fn();

  beforeEach(() => {
    mockOnSelectPlan.mockClear();
  });

  test('renders all pricing plans', () => {
    render(<PricingPage currentPlanId="free" onSelectPlan={mockOnSelectPlan} />);
    
    // Check if all plan names are rendered
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Ultimate')).toBeInTheDocument();
  });

  test('shows current plan as selected', () => {
    render(<PricingPage currentPlanId="basic" onSelectPlan={mockOnSelectPlan} />);
    
    // Check if the current plan button is disabled
    const basicPlanButton = screen.getByText('Aktueller Plan');
    expect(basicPlanButton).toBeDisabled();
  });

  test('calls onSelectPlan when a plan is selected', () => {
    render(<PricingPage currentPlanId="free" onSelectPlan={mockOnSelectPlan} />);
    
    // Click on the Premium plan
    const premiumPlanButton = screen.getAllByText('Plan auswählen')[1]; // Premium is the second paid plan
    fireEvent.click(premiumPlanButton);
    
    // Check if onSelectPlan was called with the correct plan ID
    expect(mockOnSelectPlan).toHaveBeenCalledWith('premium');
  });

  test('displays correct pricing information', () => {
    render(<PricingPage currentPlanId="free" onSelectPlan={mockOnSelectPlan} />);
    
    // Check if the pricing information is displayed correctly
    expect(screen.getByText('Kostenlos')).toBeInTheDocument();
    expect(screen.getByText(`${PRICING_PLANS.BASIC.price} ${PRICING_PLANS.BASIC.currency}`)).toBeInTheDocument();
    expect(screen.getByText(`${PRICING_PLANS.PREMIUM.price} ${PRICING_PLANS.PREMIUM.currency}`)).toBeInTheDocument();
    expect(screen.getByText(`${PRICING_PLANS.ULTIMATE.price} ${PRICING_PLANS.ULTIMATE.currency}`)).toBeInTheDocument();
  });

  test('displays features for each plan', () => {
    render(<PricingPage currentPlanId="free" onSelectPlan={mockOnSelectPlan} />);
    
    // Check if features are displayed for each plan
    PRICING_PLANS.FREE.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
    
    PRICING_PLANS.BASIC.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
    
    PRICING_PLANS.PREMIUM.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
    
    PRICING_PLANS.ULTIMATE.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });
});
