import React from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';

interface MobileNavbarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--background-color);
  box-shadow: var(--box-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
`;

const DesktopMenu = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.5rem;
  
  ${media.sm} {
    display: none;
  }
`;

const MenuItem = styled.li`
  a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  
  ${media.sm} {
    display: block;
  }
`;

const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  ${media.sm} {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 150;
  }
`;

const MobileMenuContainer = styled.div<{ isOpen: boolean }>`
  display: none;
  
  ${media.sm} {
    display: block;
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-80%'};
    width: 80%;
    height: 100%;
    background-color: var(--background-color);
    z-index: 200;
    transition: right 0.3s ease;
    box-shadow: var(--box-shadow);
    padding: 2rem 1rem;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileMenuClose = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
`;

const MobileMenuItems = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MobileMenuItem = styled.li`
  a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.25rem;
    display: block;
    padding: 0.5rem 0;
    transition: var(--transition);
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const MobileNavbar: React.FC<MobileNavbarProps> = ({ isOpen, toggleMenu }) => {
  return (
    <>
      <NavbarContainer>
        <Logo>LemonVows</Logo>
        
        <DesktopMenu>
          <MenuItem><a href="/">Home</a></MenuItem>
          <MenuItem><a href="/features">Features</a></MenuItem>
          <MenuItem><a href="/pricing">Pricing</a></MenuItem>
          <MenuItem><a href="/demo">Demo</a></MenuItem>
          <MenuItem><a href="/contact">Contact</a></MenuItem>
        </DesktopMenu>
        
        <MobileMenuButton onClick={toggleMenu}>
          ☰
        </MobileMenuButton>
      </NavbarContainer>
      
      <MobileMenuOverlay isOpen={isOpen} onClick={toggleMenu} />
      
      <MobileMenuContainer isOpen={isOpen}>
        <MobileMenuHeader>
          <Logo>LemonVows</Logo>
          <MobileMenuClose onClick={toggleMenu}>✕</MobileMenuClose>
        </MobileMenuHeader>
        
        <MobileMenuItems>
          <MobileMenuItem><a href="/" onClick={toggleMenu}>Home</a></MobileMenuItem>
          <MobileMenuItem><a href="/features" onClick={toggleMenu}>Features</a></MobileMenuItem>
          <MobileMenuItem><a href="/pricing" onClick={toggleMenu}>Pricing</a></MobileMenuItem>
          <MobileMenuItem><a href="/demo" onClick={toggleMenu}>Demo</a></MobileMenuItem>
          <MobileMenuItem><a href="/contact" onClick={toggleMenu}>Contact</a></MobileMenuItem>
        </MobileMenuItems>
      </MobileMenuContainer>
    </>
  );
};

export default MobileNavbar;
