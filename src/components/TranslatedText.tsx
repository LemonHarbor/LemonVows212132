import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface TranslatedTextProps {
  i18nKey: string;
  ns?: string;
  values?: Record<string, any>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const StyledText = styled.span`
  display: inline;
`;

const TranslatedText: React.FC<TranslatedTextProps> = ({
  i18nKey,
  ns,
  values,
  className,
  as = 'span'
}) => {
  const { t } = useTranslation(ns);
  
  return (
    <StyledText as={as} className={className}>
      {t(i18nKey, values)}
    </StyledText>
  );
};

export default TranslatedText;
