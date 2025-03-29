import React from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';

const PricingContainer = styled.div`
  padding: 3rem 0;
`;

const PricingHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  ${media.sm} {
    margin-bottom: 2rem;
  }
`;

const PricingTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  ${media.sm} {
    font-size: 2rem;
  }
  
  ${media.xs} {
    font-size: 1.75rem;
  }
`;

const PricingSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-light);
  max-width: 700px;
  margin: 0 auto;
  
  ${media.sm} {
    font-size: 1.125rem;
  }
  
  ${media.xs} {
    font-size: 1rem;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media.sm} {
    grid-template-columns: 1fr;
    max-width: 400px;
    gap: 1.5rem;
  }
`;

const PricingCard = styled.div<{ featured?: boolean }>`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  ${props => props.featured && `
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    border: 2px solid var(--primary-color);
    
    ${media.md} {
      transform: scale(1);
    }
  `}
  
  &:hover {
    transform: translateY(-5px);
  }
  
  ${media.sm} {
    padding: 1.5rem;
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  right: -3rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 0.5rem 3rem;
  font-weight: bold;
  transform: rotate(45deg);
  font-size: 0.875rem;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  
  ${media.sm} {
    font-size: 1.25rem;
  }
`;

const PlanPrice = styled.div`
  margin-bottom: 1.5rem;
`;

const Price = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  
  ${media.sm} {
    font-size: 2rem;
  }
`;

const PriceUnit = styled.span`
  font-size: 1rem;
  color: var(--text-light);
`;

const PlanDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 2rem;
  
  ${media.sm} {
    margin-bottom: 1.5rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
  flex-grow: 1;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureIcon = styled.span`
  color: var(--success-color);
  margin-right: 0.75rem;
`;

const FeatureText = styled.span``;

const PricingFooter = styled.div`
  margin-top: auto;
`;

const ComparisonLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  text-decoration: underline;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const PricingSection: React.FC = () => {
  return (
    <PricingContainer>
      <PricingHeader>
        <PricingTitle>
          <TranslatedText i18nKey="landing.pricingTitle" />
        </PricingTitle>
        <PricingSubtitle>
          <TranslatedText i18nKey="landing.pricingSubtitle" />
        </PricingSubtitle>
      </PricingHeader>
      
      <PricingGrid>
        {/* Free Plan */}
        <PricingCard>
          <PlanName>
            <TranslatedText i18nKey="pricing.freePlan" />
          </PlanName>
          <PlanPrice>
            <Price>0€</Price>
            <PriceUnit> / <TranslatedText i18nKey="pricing.forever" /></PriceUnit>
          </PlanPrice>
          <PlanDescription>
            <TranslatedText i18nKey="pricing.freeDescription" />
          </PlanDescription>
          
          <FeaturesList>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.freeFeature1" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.freeFeature2" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.freeFeature3" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.freeFeature4" />
              </FeatureText>
            </FeatureItem>
          </FeaturesList>
          
          <PricingFooter>
            <TranslatedButton 
              i18nKey="pricing.startFree" 
              variant="outline"
              size="large"
            />
          </PricingFooter>
        </PricingCard>
        
        {/* Premium Plan */}
        <PricingCard featured>
          <FeaturedBadge>
            <TranslatedText i18nKey="pricing.popular" />
          </FeaturedBadge>
          <PlanName>
            <TranslatedText i18nKey="pricing.premiumPlan" />
          </PlanName>
          <PlanPrice>
            <Price>89€</Price>
            <PriceUnit> / <TranslatedText i18nKey="pricing.oneTime" /></PriceUnit>
          </PlanPrice>
          <PlanDescription>
            <TranslatedText i18nKey="pricing.premiumDescription" />
          </PlanDescription>
          
          <FeaturesList>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.premiumFeature1" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.premiumFeature2" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.premiumFeature3" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.premiumFeature4" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.premiumFeature5" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.premiumFeature6" />
              </FeatureText>
            </FeatureItem>
          </FeaturesList>
          
          <PricingFooter>
            <TranslatedButton 
              i18nKey="pricing.getPremium" 
              variant="primary"
              size="large"
            />
          </PricingFooter>
        </PricingCard>
        
        {/* Ultimate Plan */}
        <PricingCard>
          <PlanName>
            <TranslatedText i18nKey="pricing.ultimatePlan" />
          </PlanName>
          <PlanPrice>
            <Price>129€</Price>
            <PriceUnit> / <TranslatedText i18nKey="pricing.oneTime" /></PriceUnit>
          </PlanPrice>
          <PlanDescription>
            <TranslatedText i18nKey="pricing.ultimateDescription" />
          </PlanDescription>
          
          <FeaturesList>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.ultimateFeature1" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.ultimateFeature2" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.ultimateFeature3" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.ultimateFeature4" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.ultimateFeature5" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.ultimateFeature6" />
              </FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              <FeatureText>
                <TranslatedText i18nKey="pricing.ultimateFeature7" />
              </FeatureText>
            </FeatureItem>
          </FeaturesList>
          
          <PricingFooter>
            <TranslatedButton 
              i18nKey="pricing.getUltimate" 
              variant="secondary"
              size="large"
            />
          </PricingFooter>
        </PricingCard>
      </PricingGrid>
      
      <ComparisonLink href="#comparison">
        <TranslatedText i18nKey="pricing.viewComparison" />
      </ComparisonLink>
    </PricingContainer>
  );
};

export default PricingSection;
