import React from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';

const MarketingContainer = styled.div`
  padding: 3rem 0;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0;
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  margin-bottom: 3rem;
  
  ${media.sm} {
    padding: 3rem 1rem;
    margin-bottom: 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  
  ${media.md} {
    font-size: 2.5rem;
  }
  
  ${media.sm} {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--text-light);
  max-width: 800px;
  margin: 0 auto 2rem;
  
  ${media.sm} {
    font-size: 1.25rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  ${media.xs} {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  text-align: center;
  margin-bottom: 3rem;
  
  ${media.sm} {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
  }
  
  ${media.sm} {
    padding: 1.5rem;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  
  ${media.sm} {
    font-size: 1.25rem;
  }
`;

const FeatureDescription = styled.p`
  color: var(--text-light);
`;

const TestimonialsSection = styled.div`
  margin-bottom: 3rem;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  
  ${media.sm} {
    padding: 1.5rem;
  }
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1.5rem;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: bold;
  color: var(--text-color);
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: bold;
`;

const AuthorWedding = styled.div`
  font-size: 0.875rem;
  color: var(--text-light);
`;

const CtaSection = styled.div`
  text-align: center;
  padding: 4rem;
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  
  ${media.sm} {
    padding: 2rem 1rem;
  }
`;

const CtaTitle = styled.h2`
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  
  ${media.sm} {
    font-size: 1.75rem;
  }
`;

const CtaText = styled.p`
  font-size: 1.25rem;
  color: var(--text-light);
  max-width: 700px;
  margin: 0 auto 2rem;
  
  ${media.sm} {
    font-size: 1rem;
  }
`;

const MarketingPage: React.FC = () => {
  return (
    <MarketingContainer>
      <HeroSection>
        <HeroTitle>
          <TranslatedText i18nKey="landing.hero" />
        </HeroTitle>
        <HeroSubtitle>
          <TranslatedText i18nKey="landing.heroSubtitle" />
        </HeroSubtitle>
        <HeroButtons>
          <TranslatedButton 
            i18nKey="landing.getStarted" 
            variant="primary"
            size="large"
          />
          <TranslatedButton 
            i18nKey="landing.learnMore" 
            variant="outline"
            size="large"
          />
        </HeroButtons>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>
          <TranslatedText i18nKey="landing.features" />
        </SectionTitle>
        
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🪑</FeatureIcon>
            <FeatureTitle>
              <TranslatedText i18nKey="tableplan.title" />
            </FeatureTitle>
            <FeatureDescription>
              <TranslatedText i18nKey="landing.tablePlanFeature" />
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureTitle>
              <TranslatedText i18nKey="guests.title" />
            </FeatureTitle>
            <FeatureDescription>
              <TranslatedText i18nKey="landing.guestsFeature" />
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>
              <TranslatedText i18nKey="budget.title" />
            </FeatureTitle>
            <FeatureDescription>
              <TranslatedText i18nKey="landing.budgetFeature" />
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎵</FeatureIcon>
            <FeatureTitle>
              <TranslatedText i18nKey="music.title" />
            </FeatureTitle>
            <FeatureDescription>
              <TranslatedText i18nKey="landing.musicFeature" />
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📷</FeatureIcon>
            <FeatureTitle>
              <TranslatedText i18nKey="gallery.title" />
            </FeatureTitle>
            <FeatureDescription>
              <TranslatedText i18nKey="landing.galleryFeature" />
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>
              <TranslatedText i18nKey="landing.mobileFeatureTitle" />
            </FeatureTitle>
            <FeatureDescription>
              <TranslatedText i18nKey="landing.mobileFeature" />
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <TestimonialsSection>
        <SectionTitle>
          <TranslatedText i18nKey="landing.testimonials" />
        </SectionTitle>
        
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              <TranslatedText i18nKey="landing.testimonial1" />
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>S</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Sarah & Thomas</AuthorName>
                <AuthorWedding>
                  <TranslatedText i18nKey="landing.weddingDate1" />
                </AuthorWedding>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <TestimonialText>
              <TranslatedText i18nKey="landing.testimonial2" />
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>M</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Michael & Julia</AuthorName>
                <AuthorWedding>
                  <TranslatedText i18nKey="landing.weddingDate2" />
                </AuthorWedding>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <TestimonialText>
              <TranslatedText i18nKey="landing.testimonial3" />
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>L</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Lisa & Mark</AuthorName>
                <AuthorWedding>
                  <TranslatedText i18nKey="landing.weddingDate3" />
                </AuthorWedding>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>
      
      <CtaSection>
        <CtaTitle>
          <TranslatedText i18nKey="landing.ctaTitle" />
        </CtaTitle>
        <CtaText>
          <TranslatedText i18nKey="landing.ctaText" />
        </CtaText>
        <TranslatedButton 
          i18nKey="landing.getStarted" 
          variant="primary"
          size="large"
        />
      </CtaSection>
    </MarketingContainer>
  );
};

export default MarketingPage;
