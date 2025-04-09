import { useEffect, useState } from 'react';

// Breakpoint definitions
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

type Breakpoint = keyof typeof breakpoints;

// Hook to detect current breakpoint
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    // Function to update dimensions and breakpoint
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      // Determine current breakpoint
      if (width < breakpoints.sm) {
        setBreakpoint('xs');
      } else if (width < breakpoints.md) {
        setBreakpoint('sm');
      } else if (width < breakpoints.lg) {
        setBreakpoint('md');
      } else if (width < breakpoints.xl) {
        setBreakpoint('lg');
      } else if (width < breakpoints.xxl) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('xxl');
      }
    };
    
    // Set initial dimensions
    if (typeof window !== 'undefined') {
      updateDimensions();
      
      // Add event listener for window resize
      window.addEventListener('resize', updateDimensions);
      
      // Clean up event listener
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, []);
  
  return { breakpoint, dimensions };
};

// Hook to check if current breakpoint is mobile
export const useMobile = () => {
  const { breakpoint } = useBreakpoint();
  return ['xs', 'sm'].includes(breakpoint);
};

// Hook to check if current breakpoint is tablet
export const useTablet = () => {
  const { breakpoint } = useBreakpoint();
  return breakpoint === 'md';
};

// Hook to check if current breakpoint is desktop
export const useDesktop = () => {
  const { breakpoint } = useBreakpoint();
  return ['lg', 'xl', 'xxl'].includes(breakpoint);
};

// CSS media query strings for styled-components or emotion
export const mediaQueries = {
  xs: `@media (max-width: ${breakpoints.sm - 1}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  md: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px) and (max-width: ${breakpoints.xxl - 1}px)`,
  xxl: `@media (min-width: ${breakpoints.xxl}px)`,
  mobile: `@media (max-width: ${breakpoints.md - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.lg}px)`,
  touch: `@media (max-width: ${breakpoints.lg - 1}px)`,
};

// Responsive utility classes
export const responsiveStyles = `
  /* Responsive container */
  .container {
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: auto;
    margin-left: auto;
  }
  
  @media (min-width: ${breakpoints.sm}px) {
    .container {
      max-width: 540px;
    }
  }
  
  @media (min-width: ${breakpoints.md}px) {
    .container {
      max-width: 720px;
    }
  }
  
  @media (min-width: ${breakpoints.lg}px) {
    .container {
      max-width: 960px;
    }
  }
  
  @media (min-width: ${breakpoints.xl}px) {
    .container {
      max-width: 1140px;
    }
  }
  
  @media (min-width: ${breakpoints.xxl}px) {
    .container {
      max-width: 1320px;
    }
  }
  
  /* Responsive grid */
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -0.5rem;
    margin-left: -0.5rem;
  }
  
  .col {
    flex: 1 0 0%;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }
  
  /* Responsive columns */
  .col-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
  .col-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
  .col-3 { flex: 0 0 25%; max-width: 25%; }
  .col-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
  .col-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
  .col-6 { flex: 0 0 50%; max-width: 50%; }
  .col-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
  .col-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
  .col-9 { flex: 0 0 75%; max-width: 75%; }
  .col-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
  .col-11 { flex: 0 0 91.666667%; max-width: 91.666667%; }
  .col-12 { flex: 0 0 100%; max-width: 100%; }
  
  /* Responsive columns for different breakpoints */
  @media (min-width: ${breakpoints.sm}px) {
    .col-sm-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
    .col-sm-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
    .col-sm-3 { flex: 0 0 25%; max-width: 25%; }
    .col-sm-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-sm-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
    .col-sm-6 { flex: 0 0 50%; max-width: 50%; }
    .col-sm-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
    .col-sm-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
    .col-sm-9 { flex: 0 0 75%; max-width: 75%; }
    .col-sm-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
    .col-sm-11 { flex: 0 0 91.666667%; max-width: 91.666667%; }
    .col-sm-12 { flex: 0 0 100%; max-width: 100%; }
  }
  
  @media (min-width: ${breakpoints.md}px) {
    .col-md-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
    .col-md-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
    .col-md-3 { flex: 0 0 25%; max-width: 25%; }
    .col-md-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-md-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
    .col-md-6 { flex: 0 0 50%; max-width: 50%; }
    .col-md-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
    .col-md-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
    .col-md-9 { flex: 0 0 75%; max-width: 75%; }
    .col-md-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
    .col-md-11 { flex: 0 0 91.666667%; max-width: 91.666667%; }
    .col-md-12 { flex: 0 0 100%; max-width: 100%; }
  }
  
  @media (min-width: ${breakpoints.lg}px) {
    .col-lg-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
    .col-lg-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
    .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
    .col-lg-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-lg-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
    .col-lg-6 { flex: 0 0 50%; max-width: 50%; }
    .col-lg-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
    .col-lg-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
    .col-lg-9 { flex: 0 0 75%; max-width: 75%; }
    .col-lg-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
    .col-lg-11 { flex: 0 0 91.666667%; max-width: 91.666667%; }
    .col-lg-12 { flex: 0 0 100%; max-width: 100%; }
  }
  
  @media (min-width: ${breakpoints.xl}px) {
    .col-xl-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
    .col-xl-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
    .col-xl-3 { flex: 0 0 25%; max-width: 25%; }
    .col-xl-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-xl-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
    .col-xl-6 { flex: 0 0 50%; max-width: 50%; }
    .col-xl-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
    .col-xl-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
    .col-xl-9 { flex: 0 0 75%; max-width: 75%; }
    .col-xl-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
    .col-xl-11 { flex: 0 0 91.666667%; max-width: 91.666667%; }
    .col-xl-12 { flex: 0 0 100%; max-width: 100%; }
  }
  
  /* Responsive visibility */
  .d-none { display: none !important; }
  .d-block { display: block !important; }
  .d-flex { display: flex !important; }
  .d-grid { display: grid !important; }
  
  @media (min-width: ${breakpoints.sm}px) {
    .d-sm-none { display: none !important; }
    .d-sm-block { display: block !important; }
    .d-sm-flex { display: flex !important; }
    .d-sm-grid { display: grid !important; }
  }
  
  @media (min-width: ${breakpoints.md}px) {
    .d-md-none { display: none !important; }
    .d-md-block { display: block !important; }
    .d-md-flex { display: flex !important; }
    .d-md-grid { display: grid !important; }
  }
  
  @media (min-width: ${breakpoints.lg}px) {
    .d-lg-none { display: none !important; }
    .d-lg-block { display: block !important; }
    .d-lg-flex { display: flex !important; }
    .d-lg-grid { display: grid !important; }
  }
  
  @media (min-width: ${breakpoints.xl}px) {
    .d-xl-none { display: none !important; }
    .d-xl-block { display: block !important; }
    .d-xl-flex { display: flex !important; }
    .d-xl-grid { display: grid !important; }
  }
  
  /* Responsive spacing */
  .m-0 { margin: 0 !important; }
  .m-1 { margin: 0.25rem !important; }
  .m-2 { margin: 0.5rem !important; }
  .m-3 { margin: 1rem !important; }
  .m-4 { margin: 1.5rem !important; }
  .m-5 { margin: 3rem !important; }
  
  .mt-0 { margin-top: 0 !important; }
  .mt-1 { margin-top: 0.25rem !important; }
  .mt-2 { margin-top: 0.5rem !important; }
  .mt-3 { margin-top: 1rem !important; }
  .mt-4 { margin-top: 1.5rem !important; }
  .mt-5 { margin-top: 3rem !important; }
  
  .mb-0 { margin-bottom: 0 !important; }
  .mb-1 { margin-bottom: 0.25rem !important; }
  .mb-2 { margin-bottom: 0.5rem !important; }
  .mb-3 { margin-bottom: 1rem !important; }
  .mb-4 { margin-bottom: 1.5rem !important; }
  .mb-5 { margin-bottom: 3rem !important; }
  
  .ml-0 { margin-left: 0 !important; }
  .ml-1 { margin-left: 0.25rem !important; }
  .ml-2 { margin-left: 0.5rem !important; }
  .ml-3 { margin-left: 1rem !important; }
  .ml-4 { margin-left: 1.5rem !important; }
  .ml-5 { margin-left: 3rem !important; }
  
  .mr-0 { margin-right: 0 !important; }
  .mr-1 { margin-right: 0.25rem !important; }
  .mr-2 { margin-right: 0.5rem !important; }
  .mr-3 { margin-right: 1rem !important; }
  .mr-4 { margin-right: 1.5rem !important; }
  .mr-5 { margin-right: 3rem !important; }
  
  .p-0 { padding: 0 !important; }
  .p-1 { padding: 0.25rem !important; }
  .p-2 { padding: 0.5rem !important; }
  .p-3 { padding: 1rem !important; }
  .p-4 { padding: 1.5rem !important; }
  .p-5 { padding: 3rem !important; }
  
  .pt-0 { padding-top: 0 !important; }
  .pt-1 { padding-top: 0.25rem !important; }
  .pt-2 { padding-top: 0.5rem !important; }
  .pt-3 { padding-top: 1rem !important; }
  .pt-4 { padding-top: 1.5rem !important; }
  .pt-5 { padding-top: 3rem !important; }
  
  .pb-0 { padding-bottom: 0 !important; }
  .pb-1 { padding-bottom: 0.25rem !important; }
  .pb-2 { padding-bottom: 0.5rem !important; }
  .pb-3 { padding-bottom: 1rem !important; }
  .pb-4 { padding-bottom: 1.5rem !important; }
  .pb-5 { padding-bottom: 3rem !important; }
  
  .pl-0 { padding-left: 0 !important; }
  .pl-1 { padding-left: 0.25rem !important; }
  .pl-2 { padding-left: 0.5rem !important; }
  .pl-3 { padding-left: 1rem !important; }
  .pl-4 { padding-left: 1.5rem !important; }
  .pl-5 { padding-left: 3rem !important; }
  
  .pr-0 { padding-right: 0 !important; }
  .pr-1 { padding-right: 0.25rem !important; }
  .pr-2 { padding-right: 0.5rem !important; }
  .pr-3 { padding-right: 1rem !important; }
  .pr-4 { padding-right: 1.5rem !important; }
  .pr-5 { padding-right: 3rem !important; }
  
  /* Responsive text alignment */
  .text-left { text-align: left !important; }
  .text-center { text-align: center !important; }
  .text-right { text-align: right !important; }
  
  @media (min-width: ${breakpoints.sm}px) {
    .text-sm-left { text-align: left !important; }
    .text-sm-center { text-align: center !important; }
    .text-sm-right { text-align: right !important; }
  }
  
  @media (min-width: ${breakpoints.md}px) {
    .text-md-left { text-align: left !important; }
    .text-md-center { text-align: center !important; }
    .text-md-right { text-align: right !important; }
  }
  
  @media (min-width: ${breakpoints.lg}px) {
    .text-lg-left { text-align: left !important; }
    .text-lg-center { text-align: center !important; }
    .text-lg-right { text-align: right !important; }
  }
  
  @media (min-width: ${breakpoints.xl}px) {
    .text-xl-left { text-align: left !important; }
    .text-xl-center { text-align: center !important; }
    .text-xl-right { text-align: right !important; }
  }
  
  /* Responsive flexbox utilities */
  .flex-row { flex-direction: row !important; }
  .flex-column { flex-direction: column !important; }
  .flex-wrap { flex-wrap: wrap !important; }
  .flex-nowrap { flex-wrap: nowrap !important; }
  .justify-content-start { justify-content: flex-start !important; }
  .justify-content-end { justify-content: flex-end !important; }
  .justify-content-center { justify-content: center !important; }
  .justify-content-between { justify-content: space-between !important; }
  .justify-content-around { justify-content: space-around !important; }
  .align-items-start { align-items: flex-start !important; }
  .align-items-end { align-items: flex-end !important; }
  .align-items-center { align-items: center !important; }
  .align-items-baseline { align-items: baseline !important; }
  .align-items-stretch { align-items: stretch !important; }
  
  @media (min-width: ${breakpoints.sm}px) {
    .flex-sm-row { flex-direction: row !important; }
    .flex-sm-column { flex-direction: column !important; }
    .justify-content-sm-start { justify-content: flex-start !important; }
    .justify-content-sm-end { justify-content: flex-end !important; }
    .justify-content-sm-center { justify-content: center !important; }
    .justify-content-sm-between { justify-content: space-between !important; }
    .justify-content-sm-around { justify-content: space-around !important; }
    .align-items-sm-start { align-items: flex-start !important; }
    .align-items-sm-end { align-items: flex-end !important; }
    .align-items-sm-center { align-items: center !important; }
    .align-items-sm-baseline { align-items: baseline !important; }
    .align-items-sm-stretch { align-items: stretch !important; }
  }
  
  @media (min-width: ${breakpoints.md}px) {
    .flex-md-row { flex-direction: row !important; }
    .flex-md-column { flex-direction: column !important; }
    .justify-content-md-start { justify-content: flex-start !important; }
    .justify-content-md-end { justify-content: flex-end !important; }
    .justify-content-md-center { justify-content: center !important; }
    .justify-content-md-between { justify-content: space-between !important; }
    .justify-content-md-around { justify-content: space-around !important; }
    .align-items-md-start { align-items: flex-start !important; }
    .align-items-md-end { align-items: flex-end !important; }
    .align-items-md-center { align-items: center !important; }
    .align-items-md-baseline { align-items: baseline !important; }
    .align-items-md-stretch { align-items: stretch !important; }
  }
  
  /* Mobile-first approach base styles */
  html {
    font-size: 16px;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    overflow-x: hidden;
  }
  
  /* Responsive typography */
  h1 {
    font-size: 1.75rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
  }
  
  h4 {
    font-size: 1.125rem;
  }
  
  h5 {
    font-size: 1rem;
  }
  
  h6 {
    font-size: 0.875rem;
  }
  
  @media (min-width: ${breakpoints.md}px) {
    h1 {
      font-size: 2.5rem;
    }
    
    h2 {
      font-size: 2rem;
    }
    
    h3 {
      font-size: 1.75rem;
    }
    
    h4 {
      font-size: 1.5rem;
    }
    
    h5 {
      font-size: 1.25rem;
    }
    
    h6 {
      font-size: 1rem;
    }
  }
  
  /* Responsive images */
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Touch-friendly interactive elements */
  button, 
  [type="button"], 
  [type="reset"], 
  [type="submit"],
  .button {
    min-height: 44px; /* Minimum touch target size */
    min-width: 44px;
  }
  
  /* Improved form elements for mobile */
  input, 
  select, 
  textarea {
    font-size: 16px; /* Prevents iOS zoom on focus */
    max-width: 100%;
  }
  
  /* Responsive tables */
  .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

// Function to add responsive meta tag to document head
export const addResponsiveMetaTags = () => {
  if (typeof document !== 'undefined') {
    // Viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    
    // Theme color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute('content', '#ffbd00');
    
    // Mobile web app meta tags
    const appleMeta = document.createElement('meta');
    appleMeta.setAttribute('name', 'apple-mobile-web-app-capable');
    appleMeta.setAttribute('content', 'yes');
    document.head.appendChild(appleMeta);
    
    const statusBarMeta = document.createElement('meta');
    statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    statusBarMeta.setAttribute('content', 'default');
    document.head.appendChild(statusBarMeta);
  }
};

// Function to add global responsive styles
export const addResponsiveStyles = () => {
  if (typeof document !== 'undefined') {
    let styleElement = document.getElementById('responsive-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'responsive-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = responsiveStyles;
  }
};

export default {
  breakpoints,
  useBreakpoint,
  useMobile,
  useTablet,
  useDesktop,
  mediaQueries,
  responsiveStyles,
  addResponsiveMetaTags,
  addResponsiveStyles
};
