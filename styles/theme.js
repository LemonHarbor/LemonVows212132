// styles/theme.js
const theme = {
  colors: {
    primary: '#3498db',
    primaryDark: '#2980b9',
    secondary: '#e74c3c',
    secondaryDark: '#c0392b',
    background: '#f5f7fa',
    text: '#333333',
    lightText: '#666666',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Playfair Display', serif",
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    wide: '1200px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
};

export { theme };
