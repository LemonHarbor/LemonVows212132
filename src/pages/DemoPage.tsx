import React from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import InteractiveDemo from '@components/InteractiveDemo';
import PricingSection from '@components/PricingSection';
import { useApp } from '@context/AppContext';

const DemoContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const DemoTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
  
  ${media.sm} {
    font-size: 2rem;
  }
`;

const DemoSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-light);
  max-width: 800px;
  margin: 0 auto;
  
  ${media.sm} {
    font-size: 1rem;
  }
`;

const DemoFeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const DemoFeature = styled.div`
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

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
`;

const FeatureDescription = styled.p`
  color: var(--text-color);
  margin-bottom: 1.5rem;
`;

const FeatureButton = styled.button`
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const TestimonialsContainer = styled.div`
  margin-bottom: 3rem;
`;

const TestimonialsTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-dark);
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

const DemoPage: React.FC = () => {
  const { language } = useApp();
  
  const features = [
    {
      id: 'guest-list',
      title: language === 'de' ? 'Gästeliste' : 'Guest List',
      description: language === 'de' 
        ? 'Verwalten Sie Ihre Gäste und deren Antworten.' 
        : 'Manage your guests and their responses.',
      buttonText: language === 'de' ? 'Demo starten' : 'Start Demo',
    },
    {
      id: 'table-planner',
      title: language === 'de' ? 'Tischplaner' : 'Table Planner',
      description: language === 'de' 
        ? 'Erstellen Sie Ihren Sitzplan mit Drag & Drop.' 
        : 'Create your seating plan with drag & drop.',
      buttonText: language === 'de' ? 'Demo starten' : 'Start Demo',
    },
    {
      id: 'budget-planner',
      title: language === 'de' ? 'Budgetplaner' : 'Budget Planner',
      description: language === 'de' 
        ? 'Behalten Sie Ihre Ausgaben im Überblick.' 
        : 'Keep track of your expenses.',
      buttonText: language === 'de' ? 'Demo starten' : 'Start Demo',
    },
  ];
  
  const testimonials = [
    {
      id: 1,
      text: language === 'de' 
        ? 'LemonVows hat unsere Hochzeitsplanung so viel einfacher gemacht! Besonders der Tischplaner war ein Lebensretter.' 
        : 'LemonVows made our wedding planning so much easier! Especially the table planner was a lifesaver.',
      author: 'Sarah & Thomas',
      wedding: language === 'de' ? 'Hochzeit im Juni 2024' : 'Wedding in June 2024',
      avatar: 'S',
    },
    {
      id: 2,
      text: language === 'de' 
        ? 'Die Budgetplanung hat uns geholfen, den Überblick zu behalten und keine bösen Überraschungen zu erleben.' 
        : 'The budget planning helped us keep track and avoid any nasty surprises.',
      author: 'Michael & Julia',
      wedding: language === 'de' ? 'Hochzeit im August 2023' : 'Wedding in August 2023',
      avatar: 'M',
    },
    {
      id: 3,
      text: language === 'de' 
        ? 'Das RSVP-System war fantastisch! Unsere Gäste fanden es einfach zu bedienen und wir hatten alle Informationen an einem Ort.' 
        : 'The RSVP system was fantastic! Our guests found it easy to use and we had all information in one place.',
      author: 'Lisa & Mark',
      wedding: language === 'de' ? 'Hochzeit im Mai 2024' : 'Wedding in May 2024',
      avatar: 'L',
    },
  ];
  
  const [activeDemo, setActiveDemo] = React.useState<string | null>(null);
  
  const handleStartDemo = (demoId: string) => {
    setActiveDemo(demoId);
    // Scroll to demo section
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <DemoContainer>
      <DemoHeader>
        <DemoTitle>
          <TranslatedText i18nKey="demo.title" defaultText="Testen Sie LemonVows" />
        </DemoTitle>
        <DemoSubtitle>
          <TranslatedText i18nKey="demo.subtitle" defaultText="Erleben Sie die Funktionen von LemonVows in unserer interaktiven Demo." />
        </DemoSubtitle>
      </DemoHeader>
      
      <DemoFeaturesContainer>
        {features.map(feature => (
          <DemoFeature key={feature.id}>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
            <FeatureButton onClick={() => handleStartDemo(feature.id)}>
              {feature.buttonText}
            </FeatureButton>
          </DemoFeature>
        ))}
      </DemoFeaturesContainer>
      
      {activeDemo && (
        <div id="demo-section">
          <InteractiveDemo demoId={activeDemo} />
        </div>
      )}
      
      <TestimonialsContainer>
        <TestimonialsTitle>
          <TranslatedText i18nKey="demo.testimonials" defaultText="Was unsere Kunden sagen" />
        </TestimonialsTitle>
        <TestimonialsList>
          {testimonials.map(testimonial => (
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
      
      <PricingSection />
    </DemoContainer>
  );
};

export default DemoPage;
