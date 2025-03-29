import React from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';

const TestSuiteContainer = styled.div`
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const TestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const TestTitle = styled.h2`
  font-size: 1.75rem;
  margin: 0;
`;

const TestControls = styled.div`
  display: flex;
  gap: 1rem;
  
  ${media.xs} {
    flex-direction: column;
  }
`;

const RunButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const TestList = styled.div`
  margin-bottom: 2rem;
`;

const TestCategory = styled.div`
  margin-bottom: 1.5rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryStatus = styled.div<{ status: 'passed' | 'failed' | 'pending' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => props.status === 'passed' && `
    background-color: rgba(46, 204, 113, 0.2);
    color: #2ecc71;
  `}
  
  ${props => props.status === 'failed' && `
    background-color: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
  `}
  
  ${props => props.status === 'pending' && `
    background-color: rgba(243, 156, 18, 0.2);
    color: #f39c12;
  `}
`;

const TestItems = styled.div`
  padding-left: 1.5rem;
`;

const TestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TestName = styled.div``;

const TestStatus = styled.div<{ status: 'passed' | 'failed' | 'pending' }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  
  ${props => props.status === 'passed' && `
    background-color: #2ecc71;
  `}
  
  ${props => props.status === 'failed' && `
    background-color: #e74c3c;
  `}
  
  ${props => props.status === 'pending' && `
    background-color: #f39c12;
  `}
`;

const TestResults = styled.div`
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ResultsTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const ResultsSummary = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  
  ${media.xs} {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResultCount = styled.span<{ type: 'total' | 'passed' | 'failed' }>`
  font-weight: bold;
  
  ${props => props.type === 'passed' && `
    color: #2ecc71;
  `}
  
  ${props => props.type === 'failed' && `
    color: #e74c3c;
  `}
`;

const ResultLabel = styled.span`
  color: var(--text-light);
`;

const ErrorLog = styled.div`
  background-color: #fdf2f2;
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #e74c3c;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  color: #333;
`;

interface TestSuiteProps {
  onComplete?: (results: { passed: number; failed: number; total: number }) => void;
}

const TestSuite: React.FC<TestSuiteProps> = ({ onComplete }) => {
  const [running, setRunning] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    'core': true,
    'multilingual': true,
    'responsive': true,
    'admin': true,
    'demo': true,
    'monetization': true
  });
  
  const [results, setResults] = React.useState({
    passed: 0,
    failed: 0,
    total: 42
  });
  
  const [testStatus, setTestStatus] = React.useState<Record<string, 'passed' | 'failed' | 'pending'>>({
    // Core functionality tests
    'table-plan-drag-drop': 'pending',
    'table-plan-save': 'pending',
    'guest-management-add': 'pending',
    'guest-management-rsvp': 'pending',
    'budget-tracker-add': 'pending',
    'budget-tracker-chart': 'pending',
    'music-requests-add': 'pending',
    'music-requests-vote': 'pending',
    'gallery-upload': 'pending',
    'gallery-privacy': 'pending',
    
    // Multilingual tests
    'language-switch-de': 'pending',
    'language-switch-en': 'pending',
    'translations-complete-de': 'pending',
    'translations-complete-en': 'pending',
    'date-format-localization': 'pending',
    'currency-format-localization': 'pending',
    
    // Responsive design tests
    'mobile-navigation': 'pending',
    'mobile-table-plan': 'pending',
    'mobile-forms': 'pending',
    'tablet-layout': 'pending',
    'desktop-layout': 'pending',
    'responsive-tables': 'pending',
    
    // Admin dashboard tests
    'admin-login': 'pending',
    'admin-theme-change': 'pending',
    'admin-content-edit': 'pending',
    'admin-feature-toggle': 'pending',
    'admin-user-management': 'pending',
    'admin-no-code-customization': 'pending',
    
    // Demo area tests
    'demo-table-plan': 'pending',
    'demo-guest-list': 'pending',
    'demo-budget': 'pending',
    'demo-music': 'pending',
    'demo-gallery': 'pending',
    'demo-navigation': 'pending',
    
    // Monetization tests
    'pricing-display': 'pending',
    'checkout-flow': 'pending',
    'payment-processing': 'pending',
    'order-confirmation': 'pending',
    'free-tier-limits': 'pending',
    'premium-features-access': 'pending'
  });
  
  const getCategoryStatus = (category: string): 'passed' | 'failed' | 'pending' => {
    const tests = Object.entries(testStatus).filter(([key]) => key.startsWith(category));
    
    if (tests.some(([, status]) => status === 'failed')) {
      return 'failed';
    }
    
    if (tests.some(([, status]) => status === 'pending')) {
      return 'pending';
    }
    
    return 'passed';
  };
  
  const toggleCategory = (category: string) => {
    setExpanded(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const runTests = () => {
    setRunning(true);
    
    // Simulate test running with random results
    const newStatus: Record<string, 'passed' | 'failed' | 'pending'> = {};
    let passedCount = 0;
    let failedCount = 0;
    
    // Simulate test execution with delays
    const runTest = (testKey: string, index: number) => {
      setTimeout(() => {
        const result = Math.random() > 0.2 ? 'passed' : 'failed';
        
        if (result === 'passed') {
          passedCount++;
        } else {
          failedCount++;
        }
        
        newStatus[testKey] = result;
        
        setTestStatus(prev => ({
          ...prev,
          [testKey]: result
        }));
        
        if (index === Object.keys(testStatus).length - 1) {
          setRunning(false);
          setResults({
            passed: passedCount,
            failed: failedCount,
            total: Object.keys(testStatus).length
          });
          
          if (onComplete) {
            onComplete({
              passed: passedCount,
              failed: failedCount,
              total: Object.keys(testStatus).length
            });
          }
        }
      }, index * 100); // Stagger test execution
    };
    
    // Run each test with a delay
    Object.keys(testStatus).forEach((testKey, index) => {
      runTest(testKey, index);
    });
  };
  
  return (
    <TestSuiteContainer>
      <TestHeader>
        <TestTitle>
          <TranslatedText i18nKey="testing.title" />
        </TestTitle>
        <TestControls>
          <RunButton onClick={runTests} disabled={running}>
            {running ? (
              <>
                <span>⟳</span>
                <TranslatedText i18nKey="testing.running" />
              </>
            ) : (
              <>
                <span>▶</span>
                <TranslatedText i18nKey="testing.runAll" />
              </>
            )}
          </RunButton>
        </TestControls>
      </TestHeader>
      
      <TestList>
        {/* Core functionality tests */}
        <TestCategory>
          <CategoryHeader onClick={() => toggleCategory('core')}>
            <CategoryTitle>
              <span>{expanded.core ? '▼' : '▶'}</span>
              <TranslatedText i18nKey="testing.coreFunctionality" />
            </CategoryTitle>
            <CategoryStatus status={getCategoryStatus('table-plan')}>
              {getCategoryStatus('table-plan') === 'passed' && <TranslatedText i18nKey="testing.passed" />}
              {getCategoryStatus('table-plan') === 'failed' && <TranslatedText i18nKey="testing.failed" />}
              {getCategoryStatus('table-plan') === 'pending' && <TranslatedText i18nKey="testing.pending" />}
            </CategoryStatus>
          </CategoryHeader>
          
          {expanded.core && (
            <TestItems>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.tablePlanDragDrop" />
                </TestName>
                <TestStatus status={testStatus['table-plan-drag-drop']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.tablePlanSave" />
                </TestName>
                <TestStatus status={testStatus['table-plan-save']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.guestManagementAdd" />
                </TestName>
                <TestStatus status={testStatus['guest-management-add']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.guestManagementRsvp" />
                </TestName>
                <TestStatus status={testStatus['guest-management-rsvp']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.budgetTrackerAdd" />
                </TestName>
                <TestStatus status={testStatus['budget-tracker-add']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.budgetTrackerChart" />
                </TestName>
                <TestStatus status={testStatus['budget-tracker-chart']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.musicRequestsAdd" />
                </TestName>
                <TestStatus status={testStatus['music-requests-add']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.musicRequestsVote" />
                </TestName>
                <TestStatus status={testStatus['music-requests-vote']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.galleryUpload" />
                </TestName>
                <TestStatus status={testStatus['gallery-upload']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.galleryPrivacy" />
                </TestName>
                <TestStatus status={testStatus['gallery-privacy']} />
              </TestItem>
            </TestItems>
          )}
        </TestCategory>
        
        {/* Multilingual tests */}
        <TestCategory>
          <CategoryHeader onClick={() => toggleCategory('multilingual')}>
            <CategoryTitle>
              <span>{expanded.multilingual ? '▼' : '▶'}</span>
              <TranslatedText i18nKey="testing.multilingual" />
            </CategoryTitle>
            <CategoryStatus status={getCategoryStatus('language')}>
              {getCategoryStatus('language') === 'passed' && <TranslatedText i18nKey="testing.passed" />}
              {getCategoryStatus('language') === 'failed' && <TranslatedText i18nKey="testing.failed" />}
              {getCategoryStatus('language') === 'pending' && <TranslatedText i18nKey="testing.pending" />}
            </CategoryStatus>
          </CategoryHeader>
          
          {expanded.multilingual && (
            <TestItems>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.languageSwitchDe" />
                </TestName>
                <TestStatus status={testStatus['language-switch-de']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.languageSwitchEn" />
                </TestName>
                <TestStatus status={testStatus['language-switch-en']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.translationsCompleteDe" />
                </TestName>
                <TestStatus status={testStatus['translations-complete-de']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.translationsCompleteEn" />
                </TestName>
                <TestStatus status={testStatus['translations-complete-en']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.dateFormatLocalization" />
                </TestName>
                <TestStatus status={testStatus['date-format-localization']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.currencyFormatLocalization" />
                </TestName>
                <TestStatus status={testStatus['currency-format-localization']} />
              </TestItem>
            </TestItems>
          )}
        </TestCategory>
        
        {/* Responsive design tests */}
        <TestCategory>
          <CategoryHeader onClick={() => toggleCategory('responsive')}>
            <CategoryTitle>
              <span>{expanded.responsive ? '▼' : '▶'}</span>
              <TranslatedText i18nKey="testing.responsiveDesign" />
            </CategoryTitle>
            <CategoryStatus status={getCategoryStatus('mobile')}>
              {getCategoryStatus('mobile') === 'passed' && <TranslatedText i18nKey="testing.passed" />}
              {getCategoryStatus('mobile') === 'failed' && <TranslatedText i18nKey="testing.failed" />}
              {getCategoryStatus('mobile') === 'pending' && <TranslatedText i18nKey="testing.pending" />}
            </CategoryStatus>
          </CategoryHeader>
          
          {expanded.responsive && (
            <TestItems>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.mobileNavigation" />
                </TestName>
                <TestStatus status={testStatus['mobile-navigation']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.mobileTablePlan" />
                </TestName>
                <TestStatus status={testStatus['mobile-table-plan']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.mobileForms" />
                </TestName>
                <TestStatus status={testStatus['mobile-forms']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.tabletLayout" />
                </TestName>
                <TestStatus status={testStatus['tablet-layout']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.desktopLayout" />
                </TestName>
                <TestStatus status={testStatus['desktop-layout']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.responsiveTables" />
                </TestName>
                <TestStatus status={testStatus['responsive-tables']} />
              </TestItem>
            </TestItems>
          )}
        </TestCategory>
        
        {/* Admin dashboard tests */}
        <TestCategory>
          <CategoryHeader onClick={() => toggleCategory('admin')}>
            <CategoryTitle>
              <span>{expanded.admin ? '▼' : '▶'}</span>
              <TranslatedText i18nKey="testing.adminDashboard" />
            </CategoryTitle>
            <CategoryStatus status={getCategoryStatus('admin')}>
              {getCategoryStatus('admin') === 'passed' && <TranslatedText i18nKey="testing.passed" />}
              {getCategoryStatus('admin') === 'failed' && <TranslatedText i18nKey="testing.failed" />}
              {getCategoryStatus('admin') === 'pending' && <TranslatedText i18nKey="testing.pending" />}
            </CategoryStatus>
          </CategoryHeader>
          
          {expanded.admin && (
            <TestItems>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.adminLogin" />
                </TestName>
                <TestStatus status={testStatus['admin-login']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.adminThemeChange" />
                </TestName>
                <TestStatus status={testStatus['admin-theme-change']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.adminContentEdit" />
                </TestName>
                <TestStatus status={testStatus['admin-content-edit']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.adminFeatureToggle" />
                </TestName>
                <TestStatus status={testStatus['admin-feature-toggle']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.adminUserManagement" />
                </TestName>
                <TestStatus status={testStatus['admin-user-management']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.adminNoCodeCustomization" />
                </TestName>
                <TestStatus status={testStatus['admin-no-code-customization']} />
              </TestItem>
            </TestItems>
          )}
        </TestCategory>
        
        {/* Demo area tests */}
        <TestCategory>
          <CategoryHeader onClick={() => toggleCategory('demo')}>
            <CategoryTitle>
              <span>{expanded.demo ? '▼' : '▶'}</span>
              <TranslatedText i18nKey="testing.demoArea" />
            </CategoryTitle>
            <CategoryStatus status={getCategoryStatus('demo')}>
              {getCategoryStatus('demo') === 'passed' && <TranslatedText i18nKey="testing.passed" />}
              {getCategoryStatus('demo') === 'failed' && <TranslatedText i18nKey="testing.failed" />}
              {getCategoryStatus('demo') === 'pending' && <TranslatedText i18nKey="testing.pending" />}
            </CategoryStatus>
          </CategoryHeader>
          
          {expanded.demo && (
            <TestItems>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.demoTablePlan" />
                </TestName>
                <TestStatus status={testStatus['demo-table-plan']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.demoGuestList" />
                </TestName>
                <TestStatus status={testStatus['demo-guest-list']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.demoBudget" />
                </TestName>
                <TestStatus status={testStatus['demo-budget']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.demoMusic" />
                </TestName>
                <TestStatus status={testStatus['demo-music']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.demoGallery" />
                </TestName>
                <TestStatus status={testStatus['demo-gallery']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.demoNavigation" />
                </TestName>
                <TestStatus status={testStatus['demo-navigation']} />
              </TestItem>
            </TestItems>
          )}
        </TestCategory>
        
        {/* Monetization tests */}
        <TestCategory>
          <CategoryHeader onClick={() => toggleCategory('monetization')}>
            <CategoryTitle>
              <span>{expanded.monetization ? '▼' : '▶'}</span>
              <TranslatedText i18nKey="testing.monetization" />
            </CategoryTitle>
            <CategoryStatus status={getCategoryStatus('pricing')}>
              {getCategoryStatus('pricing') === 'passed' && <TranslatedText i18nKey="testing.passed" />}
              {getCategoryStatus('pricing') === 'failed' && <TranslatedText i18nKey="testing.failed" />}
              {getCategoryStatus('pricing') === 'pending' && <TranslatedText i18nKey="testing.pending" />}
            </CategoryStatus>
          </CategoryHeader>
          
          {expanded.monetization && (
            <TestItems>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.pricingDisplay" />
                </TestName>
                <TestStatus status={testStatus['pricing-display']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.checkoutFlow" />
                </TestName>
                <TestStatus status={testStatus['checkout-flow']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.paymentProcessing" />
                </TestName>
                <TestStatus status={testStatus['payment-processing']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.orderConfirmation" />
                </TestName>
                <TestStatus status={testStatus['order-confirmation']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.freeTierLimits" />
                </TestName>
                <TestStatus status={testStatus['free-tier-limits']} />
              </TestItem>
              <TestItem>
                <TestName>
                  <TranslatedText i18nKey="testing.premiumFeaturesAccess" />
                </TestName>
                <TestStatus status={testStatus['premium-features-access']} />
              </TestItem>
            </TestItems>
          )}
        </TestCategory>
      </TestList>
      
      {(results.passed > 0 || results.failed > 0) && (
        <TestResults>
          <ResultsTitle>
            <TranslatedText i18nKey="testing.results" />
          </ResultsTitle>
          
          <ResultsSummary>
            <ResultItem>
              <ResultCount type="total">{results.total}</ResultCount>
              <ResultLabel>
                <TranslatedText i18nKey="testing.totalTests" />
              </ResultLabel>
            </ResultItem>
            
            <ResultItem>
              <ResultCount type="passed">{results.passed}</ResultCount>
              <ResultLabel>
                <TranslatedText i18nKey="testing.passedTests" />
              </ResultLabel>
            </ResultItem>
            
            <ResultItem>
              <ResultCount type="failed">{results.failed}</ResultCount>
              <ResultLabel>
                <TranslatedText i18nKey="testing.failedTests" />
              </ResultLabel>
            </ResultItem>
          </ResultsSummary>
          
          {results.failed > 0 && (
            <div>
              <div>
                <TranslatedText i18nKey="testing.failureDetails" />
              </div>
              
              <ErrorLog>
                {Object.entries(testStatus)
                  .filter(([, status]) => status === 'failed')
                  .map(([key]) => `ERROR: Test '${key}' failed\n`)
                  .join('')}
              </ErrorLog>
            </div>
          )}
        </TestResults>
      )}
    </TestSuiteContainer>
  );
};

export default TestSuite;
