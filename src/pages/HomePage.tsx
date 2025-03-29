import React from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';
import { useNavigate } from 'react-router-dom';

const HomeContainer = styled.div`
  width: 100%;
`;

const HeroSection = styled.section`
  background-color: var(--background-light);
  padding: 5rem 2rem;
  text-align: center;
  
  ${media.sm} {
    padding: 3rem 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  
  ${media.sm} {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  color: var(--text-light);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  ${media.sm} {
    font-size: 1.25rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  ${media.xs} {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  
  ${media.sm} {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
  
  ${media.sm} {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
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

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
`;

const FeatureDescription = styled.p`
  color: var(--text-color);
`;

const HowItWorksSection = styled.section`
  padding: 5rem 2rem;
  background-color: var(--background-light);
  
  ${media.sm} {
    padding: 3rem 1rem;
  }
`;

const StepsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  
  ${media.sm} {
    flex-direction: column;
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
`;

const StepDescription = styled.p`
  color: var(--text-color);
`;

const TestimonialsSection = styled.section`
  padding: 5rem 2rem;
  
  ${media.sm} {
    padding: 3rem 1rem;
  }
`;

const TestimonialsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  position: relative;
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1.5rem;
  color: var(--text-color);
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
  color: var(--text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
  margin-right: 1rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: bold;
  color: var(--text-dark);
`;

const AuthorWedding = styled.div`
  font-size: 0.875rem;
  color: var(--text-light);
`;

const CtaSection = styled.section`
  padding: 5rem 2rem;
  background-color: var(--primary-color);
  text-align: center;
  
  ${media.sm} {
    padding: 3rem 1rem;
  }
`;

const CtaContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-on-primary);
  
  ${media.sm} {
    font-size: 2rem;
  }
`;

const CtaDescription = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  color: var(--text-on-primary);
  opacity: 0.9;
  
  ${media.sm} {
    font-size: 1rem;
  }
`;

const CtaButton = styled.button`
  background-color: var(--text-on-primary);
  color: var(--primary-color);
  border: none;
  border-radius: var(--border-radius);
  padding: 1rem 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  ${media.sm} {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: '🎯',
      title: <TranslatedText i18nKey="home.feature1Title" defaultText="Interaktiver Tischplan" />,
      description: <TranslatedText i18nKey="home.feature1Desc" defaultText="Erstellen Sie Ihren Sitzplan mit Drag & Drop und vermeiden Sie Konflikte zwischen Gästen." />,
    },
    {
      icon: '📋',
      title: <TranslatedText i18nKey="home.feature2Title" defaultText="Gästeverwaltung & RSVP" />,
      description: <TranslatedText i18nKey="home.feature2Desc" defaultText="Verwalten Sie Ihre Gästeliste und verfolgen Sie Zu- und Absagen in Echtzeit." />,
    },
    {
      icon: '💰',
      title: <TranslatedText i18nKey="home.feature3Title" defaultText="Budgetplaner" />,
      description: <TranslatedText i18nKey="home.feature3Desc" defaultText="Behalten Sie den Überblick über Ihre Ausgaben und bleiben Sie im Budget." />,
    },
    {
      icon: '🎵',
      title: <TranslatedText i18nKey="home.feature4Title" defaultText="Musikwünsche" />,
      description: <TranslatedText i18nKey="home.feature4Desc" defaultText="Lassen Sie Ihre Gäste Musikwünsche einreichen und abstimmen." />,
    },
    {
      icon: '📸',
      title: <TranslatedText i18nKey="home.feature5Title" defaultText="Foto-Galerie" />,
      description: <TranslatedText i18nKey="home.feature5Desc" defaultText="Sammeln und teilen Sie Fotos Ihrer Hochzeit mit allen Gästen." />,
    },
    {
      icon: '📱',
      title: <TranslatedText i18nKey="home.feature6Title" defaultText="Mobile-First Design" />,
      description: <TranslatedText i18nKey="home.feature6Desc" defaultText="Nutzen Sie LemonVows auf allen Geräten - vom Smartphone bis zum Desktop." />,
    },
  ];
  
  const steps = [
    {
      number: 1,
      title: <TranslatedText i18nKey="home.step1Title" defaultText="Registrieren Sie sich" />,
      description: <TranslatedText i18nKey="home.step1Desc" defaultText="Erstellen Sie ein Konto und geben Sie Ihre Hochzeitsdaten ein." />,
    },
    {
      number: 2,
      title: <TranslatedText i18nKey="home.step2Title" defaultText="Laden Sie Ihre Gäste ein" />,
      description: <TranslatedText i18nKey="home.step2Desc" defaultText="Fügen Sie Ihre Gäste hinzu und senden Sie ihnen Einladungen mit RSVP-Links." />,
    },
    {
      number: 3,
      title: <TranslatedText i18nKey="home.step3Title" defaultText="Planen Sie Ihre Hochzeit" />,
      description: <TranslatedText i18nKey="home.step3Desc" defaultText="Nutzen Sie unsere Tools, um Ihren Tischplan zu erstellen, Ihr Budget zu verwalten und mehr." />,
    },
    {
      number: 4,
      title: <TranslatedText i18nKey="home.step4Title" defaultText="Genießen Sie Ihren großen Tag" />,
      description: <TranslatedText i18nKey="home.step4Desc" defaultText="Mit LemonVows ist alles organisiert, sodass Sie sich auf das Wichtigste konzentrieren können: Ihre Hochzeit!" />,
    },
  ];
  
  const testimonials = [
    {
      id: 1,
      text: <TranslatedText i18nKey="home.testimonial1Text" defaultText="LemonVows hat unsere Hochzeitsplanung so viel einfacher gemacht! Besonders der Tischplaner war ein Lebensretter." />,
      author: 'Sarah & Thomas',
      wedding: <TranslatedText i18nKey="home.testimonial1Wedding" defaultText="Hochzeit im Juni 2024" />,
      avatar: 'S',
    },
    {
      id: 2,
      text: <TranslatedText i18nKey="home.testimonial2Text" defaultText="Die Budgetplanung hat uns geholfen, den Überblick zu behalten und keine bösen Überraschungen zu erleben." />,
      author: 'Michael & Julia',
      wedding: <TranslatedText i18nKey="home.testimonial2Wedding" defaultText="Hochzeit im August 2023" />,
      avatar: 'M',
    },
    {
      id: 3,
      text: <TranslatedText i18nKey="home.testimonial3Text" defaultText="Das RSVP-System war fantastisch! Unsere Gäste fanden es einfach zu bedienen und wir hatten alle Informationen an einem Ort." />,
      author: 'Lisa & Mark',
      wedding: <TranslatedText i18nKey="home.testimonial3Wedding" defaultText="Hochzeit im Mai 2024" />,
      avatar: 'L',
    },
  ];
  
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            <TranslatedText i18nKey="home.heroTitle" defaultText="Hochzeitsplanung leicht gemacht" />
          </HeroTitle>
          <HeroSubtitle>
            <TranslatedText i18nKey="home.heroSubtitle" defaultText="LemonVows hilft Ihnen, Ihre Traumhochzeit zu planen - von der Gästeliste bis zum Tischplan." />
          </HeroSubtitle>
          <HeroButtons>
            <TranslatedButton
              i18nKey="home.demoButton"
              defaultText="Demo ausprobieren"
              variant="primary"
              size="large"
              onClick={() => navigate('/demo')}
            />
            <TranslatedButton
              i18nKey="home.registerButton"
              defaultText="Jetzt registrieren"
              variant="outline"
              size="large"
              onClick={() => navigate('/register')}
            />
          </HeroButtons>
        </HeroContent>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>
          <TranslatedText i18nKey="home.featuresTitle" defaultText="Alles was Sie für Ihre Hochzeitsplanung brauchen" />
        </SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
      
      <HowItWorksSection>
        <SectionTitle>
          <TranslatedText i18nKey="home.howItWorksTitle" defaultText="So funktioniert's" />
        </SectionTitle>
        <StepsContainer>
          <StepsList>
            {steps.map((step) => (
              <StepItem key={step.number}>
                <StepNumber>{step.number}</StepNumber>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </StepContent>
              </StepItem>
            ))}
          </StepsList>
        </StepsContainer>
      </HowItWorksSection>
      
      <TestimonialsSection>
        <SectionTitle>
          <TranslatedText i18nKey="home.testimonialsTitle" defaultText="Was unsere Kunden sagen" />
        </SectionTitle>
        <TestimonialsContainer>
          <TestimonialsList>
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id}>
                <TestimonialText>"{testimonial.text}"</TestimonialText>
                <TestimonialAuthor>
                  <AuthorAvatar>{testimonial.avatar}</AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>{testimonial.author}</AuthorName>
                    <AuthorWedding>{testimonial.wedding}</AuthorWedding>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialsList>
        </TestimonialsContainer>
      </TestimonialsSection>
      
      <CtaSection>
        <CtaContainer>
          <CtaTitle>
            <TranslatedText i18nKey="home.ctaTitle" defaultText="Bereit, Ihre Hochzeitsplanung zu vereinfachen?" />
          </CtaTitle>
          <CtaDescription>
            <TranslatedText i18nKey="home.ctaDescription" defaultText="Starten Sie noch heute mit LemonVows und erleben Sie stressfreie Hochzeitsplanung." />
          </CtaDescription>
          <CtaButton onClick={() => navigate('/register')}>
            <TranslatedText i18nKey="home.ctaButton" defaultText="Kostenlos starten" />
          </CtaButton>
        </CtaContainer>
      </CtaSection>
    </HomeContainer>
  );
};

export default HomePage;
