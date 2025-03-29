import React, { useState } from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';

const CheckoutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  
  ${media.sm} {
    padding: 1.5rem;
  }
  
  ${media.xs} {
    padding: 1rem;
  }
`;

const CheckoutHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const CheckoutTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  
  ${media.sm} {
    font-size: 1.5rem;
  }
`;

const CheckoutSubtitle = styled.p`
  color: var(--text-light);
`;

const CheckoutSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  ${media.sm} {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  
  ${media.sm} {
    &:not(:last-child)::after {
      display: none;
    }
  }
  
  ${props => props.active && `
    font-weight: bold;
    color: var(--primary-color);
  `}
  
  ${props => props.completed && `
    color: var(--success-color);
  `}
`;

const StepNumber = styled.div<{ active: boolean; completed: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  background-color: ${props => 
    props.completed 
      ? 'var(--success-color)' 
      : props.active 
        ? 'var(--primary-color)' 
        : 'var(--background-light)'
  };
  color: ${props => 
    (props.completed || props.active) 
      ? 'white' 
      : 'var(--text-light)'
  };
`;

const StepContent = styled.div`
  padding: 2rem;
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  
  ${media.sm} {
    padding: 1.5rem;
  }
  
  ${media.xs} {
    padding: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const OrderSummary = styled.div`
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-of-type {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
`;

const SummaryItemLabel = styled.span``;

const SummaryItemValue = styled.span`
  font-weight: 500;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.125rem;
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  ${media.xs} {
    flex-direction: column;
  }
`;

const PaymentMethod = styled.div<{ selected: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  
  &:hover {
    border-color: var(--primary-color);
  }
`;

const PaymentIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  
  ${media.xs} {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: var(--success-color);
  margin-bottom: 1rem;
`;

type CheckoutStep = 'information' | 'payment' | 'confirmation';

const CheckoutProcess: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal'>('credit-card');
  
  const handleNextStep = () => {
    if (currentStep === 'information') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation');
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('information');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };
  
  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <CheckoutTitle>
          <TranslatedText i18nKey="checkout.title" />
        </CheckoutTitle>
        <CheckoutSubtitle>
          <TranslatedText i18nKey="checkout.subtitle" />
        </CheckoutSubtitle>
      </CheckoutHeader>
      
      <CheckoutSteps>
        <Step 
          active={currentStep === 'information'} 
          completed={currentStep === 'payment' || currentStep === 'confirmation'}
        >
          <StepNumber 
            active={currentStep === 'information'} 
            completed={currentStep === 'payment' || currentStep === 'confirmation'}
          >
            {(currentStep === 'payment' || currentStep === 'confirmation') ? '✓' : '1'}
          </StepNumber>
          <TranslatedText i18nKey="checkout.stepInformation" />
        </Step>
        
        <Step 
          active={currentStep === 'payment'} 
          completed={currentStep === 'confirmation'}
        >
          <StepNumber 
            active={currentStep === 'payment'} 
            completed={currentStep === 'confirmation'}
          >
            {currentStep === 'confirmation' ? '✓' : '2'}
          </StepNumber>
          <TranslatedText i18nKey="checkout.stepPayment" />
        </Step>
        
        <Step 
          active={currentStep === 'confirmation'} 
          completed={false}
        >
          <StepNumber 
            active={currentStep === 'confirmation'} 
            completed={false}
          >
            3
          </StepNumber>
          <TranslatedText i18nKey="checkout.stepConfirmation" />
        </Step>
      </CheckoutSteps>
      
      {currentStep === 'information' && (
        <>
          <StepContent>
            <FormGroup>
              <Label htmlFor="email">
                <TranslatedText i18nKey="checkout.email" />
              </Label>
              <Input type="email" id="email" />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="name">
                <TranslatedText i18nKey="checkout.name" />
              </Label>
              <Input type="text" id="name" />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="weddingDate">
                <TranslatedText i18nKey="checkout.weddingDate" />
              </Label>
              <Input type="date" id="weddingDate" />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="package">
                <TranslatedText i18nKey="checkout.package" />
              </Label>
              <Select id="package">
                <option value="premium">Premium (89€)</option>
                <option value="ultimate">Ultimate (129€)</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <CheckboxLabel>
                <Checkbox type="checkbox" />
                <TranslatedText i18nKey="checkout.termsAgree" />
              </CheckboxLabel>
            </FormGroup>
          </StepContent>
          
          <ButtonGroup>
            <div></div> {/* Empty div for spacing */}
            <TranslatedButton 
              i18nKey="checkout.continue" 
              variant="primary" 
              onClick={handleNextStep}
            />
          </ButtonGroup>
        </>
      )}
      
      {currentStep === 'payment' && (
        <>
          <OrderSummary>
            <SummaryTitle>
              <TranslatedText i18nKey="checkout.orderSummary" />
            </SummaryTitle>
            
            <SummaryItem>
              <SummaryItemLabel>
                <TranslatedText i18nKey="checkout.package" />
              </SummaryItemLabel>
              <SummaryItemValue>Premium</SummaryItemValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryItemLabel>
                <TranslatedText i18nKey="checkout.price" />
              </SummaryItemLabel>
              <SummaryItemValue>89.00€</SummaryItemValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryItemLabel>
                <TranslatedText i18nKey="checkout.tax" />
              </SummaryItemLabel>
              <SummaryItemValue>16.91€</SummaryItemValue>
            </SummaryItem>
            
            <SummaryTotal>
              <span>
                <TranslatedText i18nKey="checkout.total" />
              </span>
              <span>105.91€</span>
            </SummaryTotal>
          </OrderSummary>
          
          <StepContent>
            <Label>
              <TranslatedText i18nKey="checkout.paymentMethod" />
            </Label>
            
            <PaymentMethods>
              <PaymentMethod 
                selected={paymentMethod === 'credit-card'} 
                onClick={() => setPaymentMethod('credit-card')}
              >
                <PaymentIcon>💳</PaymentIcon>
                <TranslatedText i18nKey="checkout.creditCard" />
              </PaymentMethod>
              
              <PaymentMethod 
                selected={paymentMethod === 'paypal'} 
                onClick={() => setPaymentMethod('paypal')}
              >
                <PaymentIcon>P</PaymentIcon>
                <TranslatedText i18nKey="checkout.paypal" />
              </PaymentMethod>
            </PaymentMethods>
            
            {paymentMethod === 'credit-card' && (
              <>
                <FormGroup>
                  <Label htmlFor="cardNumber">
                    <TranslatedText i18nKey="checkout.cardNumber" />
                  </Label>
                  <Input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="cardName">
                    <TranslatedText i18nKey="checkout.cardName" />
                  </Label>
                  <Input type="text" id="cardName" />
                </FormGroup>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <FormGroup style={{ flex: 1 }}>
                    <Label htmlFor="expiryDate">
                      <TranslatedText i18nKey="checkout.expiryDate" />
                    </Label>
                    <Input type="text" id="expiryDate" placeholder="MM/YY" />
                  </FormGroup>
                  
                  <FormGroup style={{ flex: 1 }}>
                    <Label htmlFor="cvv">
                      <TranslatedText i18nKey="checkout.cvv" />
                    </Label>
                    <Input type="text" id="cvv" placeholder="123" />
                  </FormGroup>
                </div>
              </>
            )}
            
            {paymentMethod === 'paypal' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p>
                  <TranslatedText i18nKey="checkout.paypalRedirect" />
                </p>
              </div>
            )}
          </StepContent>
          
          <ButtonGroup>
            <TranslatedButton 
              i18nKey="common.back" 
              variant="outline" 
              onClick={handlePreviousStep}
            />
            <TranslatedButton 
              i18nKey="checkout.completePayment" 
              variant="primary" 
              onClick={handleNextStep}
            />
          </ButtonGroup>
        </>
      )}
      
      {currentStep === 'confirmation' && (
        <SuccessMessage>
          <SuccessIcon>✓</SuccessIcon>
          <h2>
            <TranslatedText i18nKey="checkout.thankYou" />
          </h2>
          <p>
            <TranslatedText i18nKey="checkout.orderConfirmed" />
          </p>
          <p>
            <TranslatedText i18nKey="checkout.emailSent" />
          </p>
          <div style={{ marginTop: '2rem' }}>
            <TranslatedButton 
              i18nKey="checkout.getStarted" 
              variant="primary" 
            />
          </div>
        </SuccessMessage>
      )}
    </CheckoutContainer>
  );
};

export default CheckoutProcess;
