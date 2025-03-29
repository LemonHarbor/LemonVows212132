import React, { useState } from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';

interface ResponsiveCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const CardContainer = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  transition: var(--transition);
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  ${media.sm} {
    padding: 1.5rem;
  }
  
  ${media.xs} {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  ${media.xs} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  margin-right: 1rem;
  
  ${media.xs} {
    margin-right: 0;
    margin-bottom: 0.75rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  
  ${media.xs} {
    font-size: 1.125rem;
  }
`;

const CardDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 1.5rem;
  
  ${media.xs} {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
`;

const CardContent = styled.div``;

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  description,
  icon,
  children,
  className
}) => {
  return (
    <CardContainer className={className}>
      <CardHeader>
        {icon && <IconContainer>{icon}</IconContainer>}
        <CardTitle>
          <TranslatedText i18nKey={title} />
        </CardTitle>
      </CardHeader>
      <CardDescription>
        <TranslatedText i18nKey={description} />
      </CardDescription>
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

export default ResponsiveCard;
