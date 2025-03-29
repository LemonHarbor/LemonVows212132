import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface FormLabelProps {
  i18nKey: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  
  .required {
    color: #e53e3e;
    margin-left: 0.25rem;
  }
`;

const FormLabel: React.FC<FormLabelProps> = ({
  i18nKey,
  required = false,
  htmlFor,
  className
}) => {
  const { t } = useTranslation();
  
  return (
    <StyledLabel htmlFor={htmlFor} className={className}>
      {t(i18nKey)}
      {required && <span className="required">*</span>}
    </StyledLabel>
  );
};

export default FormLabel;
