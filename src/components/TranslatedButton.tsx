import React from 'react';
import styled from 'styled-components';
import { media } from '../styles/ResponsiveComponents';
import TranslatedText from './TranslatedText';

interface TranslatedButtonProps {
  i18nKey: string;
  defaultText: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline' | 'text';
  size: 'small' | 'medium' | 'large';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
  cursor: pointer;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: var(--primary-color);
          color: var(--text-on-primary);
          border: none;
          
          &:hover {
            background-color: var(--primary-dark);
          }
          
          &:disabled {
            background-color: var(--disabled-color);
            color: var(--text-light);
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: var(--secondary-color);
          color: var(--text-on-secondary);
          border: none;
          
          &:hover {
            background-color: var(--secondary-dark);
          }
          
          &:disabled {
            background-color: var(--disabled-color);
            color: var(--text-light);
            cursor: not-allowed;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          
          &:hover {
            background-color: var(--primary-light);
          }
          
          &:disabled {
            border-color: var(--disabled-color);
            color: var(--text-light);
            cursor: not-allowed;
          }
        `;
      case 'text':
        return `
          background-color: transparent;
          color: var(--primary-color);
          border: none;
          
          &:hover {
            background-color: var(--primary-light);
          }
          
          &:disabled {
            color: var(--text-light);
            cursor: not-allowed;
          }
        `;
      default:
        return '';
    }
  }}
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'medium':
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
      case 'large':
        return `
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return '';
    }
  }}
  
  ${media.xs} {
    width: 100%;
  }
`;

const TranslatedButton: React.FC<TranslatedButtonProps> = ({
  i18nKey,
  defaultText,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  className
}) => {
  return (
    <StyledButton
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
      type={type}
      className={className}
    >
      <TranslatedText i18nKey={i18nKey} defaultText={defaultText} />
    </StyledButton>
  );
};

export default TranslatedButton;
