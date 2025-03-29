import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface TranslatedButtonProps {
  i18nKey: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  size: 'small' | 'medium' | 'large';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  
  /* Size styles */
  padding: ${props => {
    switch (props.size) {
      case 'small': return '0.25rem 0.75rem';
      case 'large': return '0.75rem 1.5rem';
      default: return '0.5rem 1rem';
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  
  /* Variant styles */
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return '#f9ca24';
      case 'secondary': return '#4834d4';
      case 'outline': return 'transparent';
      case 'danger': return '#eb4d4b';
      default: return '#f9ca24';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary': return '#333';
      case 'secondary': return '#fff';
      case 'outline': return '#333';
      case 'danger': return '#fff';
      default: return '#333';
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'outline': return '1px solid #ddd';
      default: return 'none';
    }
  }};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const TranslatedButton: React.FC<TranslatedButtonProps> = ({
  i18nKey,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  icon
}) => {
  const { t } = useTranslation();
  
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
    >
      {icon && icon}
      {t(i18nKey)}
    </StyledButton>
  );
};

export default TranslatedButton;
