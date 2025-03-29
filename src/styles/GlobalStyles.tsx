import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #f9ca24;
    --secondary-color: #4834d4;
    --text-color: #333333;
    --text-light: #666666;
    --background-color: #ffffff;
    --background-light: #f9f9f9;
    --border-color: #dddddd;
    --success-color: #2ecc71;
    --warning-color: #f39c12;
    --danger-color: #e74c3c;
    --border-radius: 4px;
    --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --transition: all 0.2s ease;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  [data-theme='dark'] {
    --primary-color: #f9ca24;
    --secondary-color: #6c5ce7;
    --text-color: #f0f0f0;
    --text-light: #cccccc;
    --background-color: #222222;
    --background-light: #333333;
    --border-color: #444444;
    --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-family);
    color: var(--text-color);
    background-color: var(--background-color);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  h1 {
    font-size: 2.5rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  h2 {
    font-size: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: var(--secondary-color);
    text-decoration: none;
    transition: var(--transition);
    
    &:hover {
      color: var(--primary-color);
    }
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Responsive container */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    
    @media (max-width: 1200px) {
      max-width: 992px;
    }
    
    @media (max-width: 992px) {
      max-width: 768px;
    }
    
    @media (max-width: 768px) {
      max-width: 576px;
    }
  }

  /* Responsive grid */
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(6, 1fr);
    }
    
    @media (max-width: 576px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Utility classes */
  .text-center {
    text-align: center;
  }

  .mb-1 {
    margin-bottom: 0.5rem;
  }

  .mb-2 {
    margin-bottom: 1rem;
  }

  .mb-3 {
    margin-bottom: 1.5rem;
  }

  .mb-4 {
    margin-bottom: 2rem;
  }

  .mt-1 {
    margin-top: 0.5rem;
  }

  .mt-2 {
    margin-top: 1rem;
  }

  .mt-3 {
    margin-top: 1.5rem;
  }

  .mt-4 {
    margin-top: 2rem;
  }

  .p-1 {
    padding: 0.5rem;
  }

  .p-2 {
    padding: 1rem;
  }

  .p-3 {
    padding: 1.5rem;
  }

  .p-4 {
    padding: 2rem;
  }

  /* Responsive visibility */
  .hide-on-mobile {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  .show-on-mobile {
    display: none !important;
    
    @media (max-width: 768px) {
      display: block !important;
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

export default GlobalStyles;
