import React from 'react';
import styled from 'styled-components';
import { media } from '../styles/ResponsiveComponents';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
}

const CardContainer = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  
  ${media.sm} {
    padding: 1.5rem;
  }
  
  ${media.xs} {
    padding: 1rem;
  }
`;

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ children, className }) => {
  return (
    <CardContainer className={className}>
      {children}
    </CardContainer>
  );
};

export default ResponsiveCard;
