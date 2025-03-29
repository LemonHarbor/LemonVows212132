import styled from 'styled-components';

// Responsive breakpoints
const breakpoints = {
  xs: '576px',
  sm: '768px',
  md: '992px',
  lg: '1200px'
};

// Media query helpers
export const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xsUp: `@media (min-width: ${breakpoints.xs})`,
  smUp: `@media (min-width: ${breakpoints.sm})`,
  mdUp: `@media (min-width: ${breakpoints.md})`,
  lgUp: `@media (min-width: ${breakpoints.lg})`
};

// Responsive container
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  ${media.lg} {
    max-width: 992px;
  }
  
  ${media.md} {
    max-width: 768px;
  }
  
  ${media.sm} {
    max-width: 576px;
    padding: 0 0.75rem;
  }
`;

// Responsive flex row
export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.75rem;
  
  ${media.sm} {
    margin: 0 -0.5rem;
  }
`;

// Responsive column with different widths at different breakpoints
interface ColProps {
  xs?: number; // 1-12 for column width at xs breakpoint
  sm?: number; // 1-12 for column width at sm breakpoint
  md?: number; // 1-12 for column width at md breakpoint
  lg?: number; // 1-12 for column width at lg breakpoint
  offset?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export const Col = styled.div<ColProps>`
  position: relative;
  width: 100%;
  padding: 0 0.75rem;
  
  ${media.sm} {
    padding: 0 0.5rem;
  }
  
  ${props => props.xs && `
    flex: 0 0 ${(props.xs / 12) * 100}%;
    max-width: ${(props.xs / 12) * 100}%;
  `}
  
  ${props => props.sm && `
    ${media.smUp} {
      flex: 0 0 ${(props.sm / 12) * 100}%;
      max-width: ${(props.sm / 12) * 100}%;
    }
  `}
  
  ${props => props.md && `
    ${media.mdUp} {
      flex: 0 0 ${(props.md / 12) * 100}%;
      max-width: ${(props.md / 12) * 100}%;
    }
  `}
  
  ${props => props.lg && `
    ${media.lgUp} {
      flex: 0 0 ${(props.lg / 12) * 100}%;
      max-width: ${(props.lg / 12) * 100}%;
    }
  `}
  
  ${props => props.offset?.xs && `
    margin-left: ${(props.offset.xs / 12) * 100}%;
  `}
  
  ${props => props.offset?.sm && `
    ${media.smUp} {
      margin-left: ${(props.offset.sm / 12) * 100}%;
    }
  `}
  
  ${props => props.offset?.md && `
    ${media.mdUp} {
      margin-left: ${(props.offset.md / 12) * 100}%;
    }
  `}
  
  ${props => props.offset?.lg && `
    ${media.lgUp} {
      margin-left: ${(props.offset.lg / 12) * 100}%;
    }
  `}
`;

// Responsive card component
export const Card = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  ${media.sm} {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

// Responsive button
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
  
  ${media.sm} {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  ${props => props.variant === 'primary' && `
    background-color: var(--primary-color);
    color: var(--text-color);
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: var(--secondary-color);
    color: white;
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
  `}
  
  ${props => props.variant === 'outline' && `
    background-color: transparent;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--background-light);
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: var(--danger-color);
    color: white;
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
  `}
`;

// Responsive form elements
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  ${media.sm} {
    margin-bottom: 1rem;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  ${media.sm} {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--background-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  ${media.sm} {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  ${media.sm} {
    padding: 0.5rem;
    font-size: 0.875rem;
    min-height: 80px;
  }
`;

// Responsive navigation
export const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  
  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const NavBrand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  
  ${media.sm} {
    margin-bottom: 1rem;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
  }
`;

export const NavLink = styled.a`
  color: var(--text-color);
  font-weight: 500;
  
  &:hover {
    color: var(--primary-color);
  }
  
  &.active {
    color: var(--primary-color);
  }
`;

// Mobile menu toggle
export const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  ${media.sm} {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

// Responsive spacing utilities
export const Spacer = styled.div<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>`
  height: ${props => {
    switch (props.size) {
      case 'sm': return '0.5rem';
      case 'md': return '1rem';
      case 'lg': return '2rem';
      case 'xl': return '3rem';
      default: return '1rem';
    }
  }};
  
  ${media.sm} {
    height: ${props => {
      switch (props.size) {
        case 'sm': return '0.25rem';
        case 'md': return '0.75rem';
        case 'lg': return '1.5rem';
        case 'xl': return '2rem';
        default: return '0.75rem';
      }
    }};
  }
`;

// Responsive text utilities
export const Text = styled.p<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>`
  margin-bottom: 1rem;
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'md': return '1rem';
      case 'lg': return '1.25rem';
      case 'xl': return '1.5rem';
      default: return '1rem';
    }
  }};
  
  ${media.sm} {
    font-size: ${props => {
      switch (props.size) {
        case 'sm': return '0.75rem';
        case 'md': return '0.875rem';
        case 'lg': return '1rem';
        case 'xl': return '1.25rem';
        default: return '0.875rem';
      }
    }};
  }
`;

// Responsive heading
export const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  
  ${media.sm} {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

// Responsive subheading
export const SubHeading = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  
  ${media.sm} {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
`;
