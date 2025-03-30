// pages/index.js
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Button = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureDescription = styled.p`
  margin-bottom: 0;
`;

const DemoSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 60px;
`;

const DemoTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const DemoDescription = styled.p`
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const HomePage = () => {
  return (
    <Container>
      <Hero>
        <Title>LemonVows</Title>
        <Subtitle>
          Die moderne Hochzeitsplanungs-App für Brautpaare. Planen Sie Ihre Traumhochzeit einfach und stressfrei mit unseren leistungsstarken Tools.
        </Subtitle>
        <Link href="/demo" passHref>
          <Button>Demo ausprobieren</Button>
        </Link>
      </Hero>
      
      <FeaturesGrid>
        <FeatureCard>
          <FeatureTitle>Gästeverwaltung</FeatureTitle>
          <FeatureDescription>
            Verwalten Sie Ihre Gästeliste, senden Sie Einladungen und verfolgen Sie RSVP-Antworten in Echtzeit.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Tischplanung</FeatureTitle>
          <FeatureDescription>
            Erstellen Sie mit unserem intuitiven Drag-and-Drop-Tool mühelos den perfekten Sitzplan für Ihre Hochzeit.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Menüauswahl</FeatureTitle>
          <FeatureDescription>
            Erfassen Sie Menüpräferenzen und Allergien Ihrer Gäste und teilen Sie diese Informationen mit Ihrem Caterer.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Statistik-Dashboard</FeatureTitle>
          <FeatureDescription>
            Behalten Sie den Überblick über Zusagen, Absagen und ausstehende Antworten mit unserem übersichtlichen Dashboard.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Mehrsprachig</FeatureTitle>
          <FeatureDescription>
            Unterstützung für Deutsch, Englisch, Französisch und Spanisch, damit alle Ihre Gäste die Plattform nutzen können.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureTitle>Mobil optimiert</FeatureTitle>
          <FeatureDescription>
            Greifen Sie von jedem Gerät aus auf Ihre Hochzeitsplanung zu - ob Smartphone, Tablet oder Computer.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
      
      <DemoSection>
        <DemoTitle>Testen Sie LemonVows</DemoTitle>
        <DemoDescription>
          Erleben Sie alle Funktionen von LemonVows in unserer interaktiven Demo. Entdecken Sie, wie einfach die Hochzeitsplanung sein kann.
        </DemoDescription>
        <Link href="/demo" passHref>
          <Button>Zur Demo</Button>
        </Link>
      </DemoSection>
    </Container>
  );
};

export default HomePage;
