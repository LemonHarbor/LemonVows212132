import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  i18nKey: string;
  defaultText: string;
  values?: Record<string, string | number>;
  className?: string;
}

const StyledText = styled.span`
  display: inline;
`;

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  i18nKey, 
  defaultText, 
  values = {}, 
  className 
}) => {
  const { t } = useTranslation();
  
  return (
    <StyledText className={className}>
      {t(i18nKey, { defaultValue: defaultText, ...values })}
    </StyledText>
  );
};

export default TranslatedText;
