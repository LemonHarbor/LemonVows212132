import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';
import { supabase } from '@services/supabase';

const AutoScalingContainer = styled.div`
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

const PricingPlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const PricingPlan = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--box-shadow-hover);
  }
`;

const PricingPlanFeatured = styled(PricingPlan)`
  border: 2px solid var(--primary-color);
  position: relative;
  
  &::before {
    content: 'Empfohlen';
    position: absolute;
    top: -12px;
    right: 20px;
    background-color: var(--primary-color);
    color: var(--text-on-primary);
    padding: 0.25rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: bold;
  }
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const PlanPeriod = styled.span`
  font-size: 1rem;
  font-weight: normal;
  color: var(--text-light);
`;

const PlanDescription = styled.p`
  margin-bottom: 1.5rem;
  color: var(--text-light);
`;

const PlanFeatures = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
  padding: 0;
`;

const PlanFeature = styled.li`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-light);
  }
`;

const FeatureIcon = styled.span`
  color: var(--success-color);
  margin-right: 0.5rem;
`;

const PlanButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  border: none;
  border-radius: var(--border-radius);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const PlanButtonOutline = styled(PlanButton)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  
  &:hover {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
  }
`;

const SalesStatsContainer = styled.div`
  margin-top: 3rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  color: var(--text-light);
  font-size: 0.875rem;
`;

const ChartContainer = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const ChartCanvas = styled.div`
  height: 300px;
  position: relative;
`;

const SettingsContainer = styled.div`
  margin-top: 3rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: var(--font-weight-medium);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  background-color: var(--background-color);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.span`
  margin-right: 1rem;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary-color);
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
  
  &:focus + span {
    box-shadow: 0 0 1px var(--primary-color);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-dark);
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  ${media.xs} {
    flex-direction: column;
  }
`;

const AutoScalingSystem: React.FC = () => {
  const [pricingPlans, setPricingPlans] = useState([
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfekt für kleine Hochzeiten mit wenigen Gästen.',
      features: [
        'RSVP-System für bis zu 20 Gäste',
        'Einfache Gästeliste',
        'Grundlegende Hochzeitswebsite',
        'Email-Support'
      ],
      maxGuests: 20,
      isPopular: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 89,
      description: 'Ideal für mittelgroße Hochzeiten mit allen wichtigen Funktionen.',
      features: [
        'Alle Free-Funktionen',
        'Bis zu 75 Gäste',
        'Interaktiver Tischplan',
        'Budgetplaner',
        'Musikwünsche',
        'Prioritäts-Support'
      ],
      maxGuests: 75,
      isPopular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 129,
      description: 'Die komplette Lösung für große Hochzeiten ohne Einschränkungen.',
      features: [
        'Alle Basic-Funktionen',
        'Unbegrenzte Gäste',
        'Foto-Galerie',
        'Geschenkeliste',
        'Lieferantenverwaltung',
        'Premium-Support',
        'Benutzerdefinierte Domain'
      ],
      maxGuests: 999,
      isPopular: false
    }
  ]);
  
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    conversionRate: 0
  });
  
  const [autoScalingSettings, setAutoScalingSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    autoCreateInstance: true,
    notifyOnPurchase: true,
    paymentProcessor: 'stripe',
    trialPeriod: 14,
    autoRenew: true,
    discountFirstYear: 10
  });
  
  // Simulated monthly sales data for chart
  const [monthlySalesData, setMonthlySalesData] = useState([
    { month: 'Jan', sales: 5 },
    { month: 'Feb', sales: 8 },
    { month: 'Mar', sales: 12 },
    { month: 'Apr', sales: 15 },
    { month: 'Mai', sales: 20 },
    { month: 'Jun', sales: 22 }
  ]);
  
  useEffect(() => {
    // In a real app, we would fetch this data from Supabase
    const fetchSalesData = async () => {
      try {
        // Simulating data fetch
        // const { data, error } = await supabase.from('sales_stats').select('*').single();
        // if (error) throw error;
        // setSalesStats(data);
        
        // For demo purposes, we'll use simulated data
        setSalesStats({
          totalSales: 67,
          monthlyRevenue: 2430,
          activeSubscriptions: 42,
          conversionRate: 3.8
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    
    fetchSalesData();
  }, []);
  
  const handlePlanUpdate = (planId, field, value) => {
    setPricingPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };
  
  const handleSettingChange = (setting, value) => {
    setAutoScalingSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };
  
  const handleToggleChange = (setting) => {
    setAutoScalingSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting]
    }));
  };
  
  const handleSaveSettings = async () => {
    // In a real app, we would save these settings to Supabase
    try {
      // await supabase.from('pricing_plans').upsert(pricingPlans);
      // await supabase.from('auto_scaling_settings').upsert([autoScalingSettings]);
      console.log('Settings saved successfully');
      
      // Simulate successful save
      alert('Einstellungen erfolgreich gespeichert!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  
  // Function to simulate a new sale for demonstration purposes
  const simulateNewSale = () => {
    // Update sales stats
    setSalesStats(prev => ({
      totalSales: prev.totalSales + 1,
      monthlyRevenue: prev.monthlyRevenue + pricingPlans[1].price,
      activeSubscriptions: prev.activeSubscriptions + 1,
      conversionRate: ((prev.totalSales + 1) / (prev.totalSales + 1 + 26)) * 100
    }));
    
    // Update monthly sales data
    setMonthlySalesData(prev => {
      const newData = [...prev];
      newData[newData.length - 1].sales += 1;
      return newData;
    });
    
    // Show success message
    alert('Neue Verkaufssimulation: Basic-Plan wurde verkauft!');
  };
  
  return (
    <AutoScalingContainer>
      <SectionTitle>
        <TranslatedText i18nKey="autoScaling.title" defaultText="Automatische Skalierung & Verkauf" />
      </SectionTitle>
      
      <PricingPlansContainer>
        {pricingPlans.map(plan => {
          const PlanComponent = plan.isPopular ? PricingPlanFeatured : PricingPlan;
          
          return (
            <PlanComponent key={plan.id}>
              <PlanName>{plan.name}</PlanName>
              <PlanPrice>
                {plan.price > 0 ? `${plan.price}€` : 'Kostenlos'}
                {plan.price > 0 && <PlanPeriod> / einmalig</PlanPeriod>}
              </PlanPrice>
              <PlanDescription>{plan.description}</PlanDescription>
              <PlanFeatures>
                {plan.features.map((feature, index) => (
                  <PlanFeature key={index}>
                    <FeatureIcon>✓</FeatureIcon>
                    {feature}
                  </PlanFeature>
                ))}
              </PlanFeatures>
              {plan.price > 0 ? (
                <PlanButton>
                  <TranslatedText i18nKey="autoScaling.buyNow" defaultText="Jetzt kaufen" />
                </PlanButton>
              ) : (
                <PlanButtonOutline>
                  <TranslatedText i18nKey="autoScaling.startFree" defaultText="Kostenlos starten" />
                </PlanButtonOutline>
              )}
            </PlanComponent>
          );
        })}
      </PricingPlansContainer>
      
      <SalesStatsContainer>
        <SectionTitle>
          <TranslatedText i18nKey="autoScaling.salesStats" defaultText="Verkaufsstatistiken" />
        </SectionTitle>
        
        <StatsGrid>
          <StatCard>
            <StatValue>{salesStats.totalSales}</StatValue>
            <StatLabel>
              <TranslatedText i18nKey="autoScaling.totalSales" defaultText="Gesamtverkäufe" />
            </StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{salesStats.monthlyRevenue}€</StatValue>
            <StatLabel>
              <TranslatedText i18nKey="autoScaling.monthlyRevenue" defaultText="Monatlicher Umsatz" />
            </StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{salesStats.activeSubscriptions}</StatValue>
            <StatLabel>
              <TranslatedText i18nKey="autoScaling.activeSubscriptions" defaultText="Aktive Abonnements" />
            </StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{salesStats.conversionRate.toFixed(1)}%</StatValue>
            <StatLabel>
              <TranslatedText i18nKey="autoScaling.conversionRate" defaultText="Konversionsrate" />
            </StatLabel>
          </StatCard>
        </StatsGrid>
        
        <ChartContainer>
          <ChartTitle>
            <TranslatedText i18nKey="autoScaling.monthlySales" defaultText="Monatliche Verkäufe" />
          </ChartTitle>
          <ChartCanvas>
            {/* In a real app, we would use a charting library like Chart.js or Recharts */}
            <div style={{ 
              display: 'flex', 
              height: '100%', 
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 10px'
            }}>
              {monthlySalesData.map((data, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '40px', 
                    height: `${data.sales * 10}px`, 
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '8px'
                  }}></div>
                  <div style={{ fontSize: '0.875rem' }}>{data.month}</div>
                </div>
              ))}
            </div>
          </ChartCanvas>
        </ChartContainer>
        
        <ButtonGroup>
          <TranslatedButton
            i18nKey="autoScaling.simulateSale"
            defaultText="Verkauf simulieren"
            variant="primary"
            onClick={simulateNewSale}
          />
        </ButtonGroup>
      </SalesStatsContainer>
      
      <SettingsContainer>
        <SectionTitle>
          <TranslatedText i18nKey="autoScaling.settings" defaultText="Einstellungen für automatische Skalierung" />
        </SectionTitle>
        
        <FormGroup>
          <ToggleSwitch>
            <ToggleLabel>
              <TranslatedText i18nKey="autoScaling.stripeEnabled" defaultText="Stripe aktivieren" />
            </ToggleLabel>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={autoScalingSettings.stripeEnabled}
                onChange={() => handleToggleChange('stripeEnabled')}
              />
              <Slider />
            </Switch>
          </ToggleSwitch>
        </FormGroup>
        
        <FormGroup>
          <ToggleSwitch>
            <ToggleLabel>
              <TranslatedText i18nKey="autoScaling.paypalEnabled" defaultText="PayPal aktivieren" />
            </ToggleLabel>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={autoScalingSettings.paypalEnabled}
                onChange={() => handleToggleChange('paypalEnabled')}
              />
              <Slider />
            </Switch>
          </ToggleSwitch>
        </FormGroup>
        
        <FormGroup>
          <ToggleSwitch>
            <ToggleLabel>
              <TranslatedText i18nKey="autoScaling.autoCreateInstance" defaultText="Automatisch neue Instanz erstellen" />
            </ToggleLabel>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={autoScalingSettings.autoCreateInstance}
                onChange={() => handleToggleChange('autoCreateInstance')}
              />
              <Slider />
            </Switch>
          </ToggleSwitch>
        </FormGroup>
        
        <FormGroup>
          <ToggleSwitch>
            <ToggleLabel>
              <TranslatedText i18nKey="autoScaling.notifyOnPurchase" defaultText="Bei Kauf benachrichtigen" />
            </ToggleLabel>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={autoScalingSettings.notifyOnPurchase}
                onChange={() => handleToggleChange('notifyOnPurchase')}
              />
              <Slider />
            </Switch>
          </ToggleSwitch>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>
            <TranslatedText i18nKey="autoScaling.paymentProcessor" defaultText="Standard-Zahlungsanbieter" />
          </FormLabel>
          <FormSelect
            value={autoScalingSettings.paymentProcessor}
            onChange={(e) => handleSettingChange('paymentProcessor', e.target.value)}
          >
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="lemonsqueezy">LemonSqueezy</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>
            <TranslatedText i18nKey="autoScaling.trialPeriod" defaultText="Testzeitraum (Tage)" />
          </FormLabel>
          <FormInput
            type="number"
            value={autoScalingSettings.trialPeriod}
            onChange={(e) => handleSettingChange('trialPeriod', parseInt(e.target.value))}
            min="0"
            max="30"
          />
        </FormGroup>
        
        <FormGroup>
          <ToggleSwitch>
            <ToggleLabel>
              <TranslatedText i18nKey="autoScaling.autoRenew" defaultText="Automatische Verlängerung" />
            </ToggleLabel>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={autoScalingSettings.autoRenew}
                onChange={() => handleToggleChange('autoRenew')}
              />
              <Slider />
            </Switch>
          </ToggleSwitch>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>
            <TranslatedText i18nKey="autoScaling.discountFirstYear" defaultText="Rabatt im ersten Jahr (%)" />
          </FormLabel>
          <FormInput
            type="number"
            value={autoScalingSettings.discountFirstYear}
            onChange={(e) => handleSettingChange('discountFirstYear', parseInt(e.target.value))}
            min="0"
            max="100"
          />
        </FormGroup>
        
        <ButtonGroup>
          <TranslatedButton
            i18nKey="autoScaling.saveSettings"
            defaultText="Einstellungen speichern"
            variant="primary"
            onClick={handleSaveSettings}
          />
        </ButtonGroup>
      </SettingsContainer>
    </AutoScalingContainer>
  );
};

export default AutoScalingSystem;
