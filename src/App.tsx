import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import { AppProvider } from './context/AppContext';
import GlobalStyles from './styles/GlobalStyles';
import './styles/improved-styles.css';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = (): void => {
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <AppProvider>
      <GlobalStyles />
      <Router>
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
            <Route path="/demo" element={<DemoPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
