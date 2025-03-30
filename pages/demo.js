// pages/demo.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { auth, rsvp, guests } from '../lib/netlifyApi';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const BackLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DemoTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? props.theme.colors.primary : '#666'};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  background-color: ${props => props.success ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.success ? '#2e7d32' : '#c62828'};
  border: 1px solid ${props => props.success ? '#a5d6a7' : '#ef9a9a'};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState('rsvp');
  const [rsvpCode, setRsvpCode] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [guestInfo, setGuestInfo] = useState(null);
  const [attending, setAttending] = useState(null);
  const [menuChoice, setMenuChoice] = useState('');
  const [allergies, setAllergies] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Demo statistics
  const stats = {
    totalGuests: 124,
    confirmed: 87,
    declined: 12,
    pending: 25,
    vegetarian: 18,
    vegan: 7,
    allergies: 15
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRsvpStatus(null);
    setGuestInfo(null);
    
    try {
      // In a real implementation, this would call the Netlify Function
      // const response = await rsvp.getByCode(rsvpCode);
      
      // For demo purposes, simulate a response
      setTimeout(() => {
        if (rsvpCode.toLowerCase() === 'demo123') {
          setGuestInfo({
            name: 'Max Mustermann',
            email: 'max@example.com',
            wedding: 'Sarah & Thomas',
            date: '15.08.2025'
          });
          setRsvpStatus({
            success: true,
            message: 'RSVP-Code gefunden!'
          });
        } else {
          setRsvpStatus({
            success: false,
            message: 'Ungültiger RSVP-Code. Bitte versuchen Sie es erneut.'
          });
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      setRsvpStatus({
        success: false,
        message: `Fehler: ${error.message}`
      });
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real implementation, this would call the Netlify Function
      // const response = await rsvp.submitResponse({
      //   code: rsvpCode,
      //   attending,
      //   menuChoice,
      //   allergies
      // });
      
      // For demo purposes, simulate a response
      setTimeout(() => {
        setRsvpStatus({
          success: true,
          message: `Vielen Dank für Ihre Antwort! ${attending ? 'Wir freuen uns, Sie bei der Hochzeit begrüßen zu dürfen.' : 'Wir bedauern, dass Sie nicht teilnehmen können.'}`
        });
        setGuestInfo(null);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setRsvpStatus({
        success: false,
        message: `Fehler: ${error.message}`
      });
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Logo>LemonVows</Logo>
        <Link href="/" passHref>
          <BackLink>← Zurück zur Startseite</BackLink>
        </Link>
      </Header>
      
      <DemoTabs>
        <Tab 
          active={activeTab === 'rsvp'} 
          onClick={() => setActiveTab('rsvp')}
        >
          RSVP
        </Tab>
        <Tab 
          active={activeTab === 'statistics'} 
          onClick={() => setActiveTab('statistics')}
        >
          Statistiken
        </Tab>
        <Tab 
          active={activeTab === 'guestlist'} 
          onClick={() => setActiveTab('guestlist')}
        >
          Gästeliste
        </Tab>
      </DemoTabs>
      
      <TabContent>
        {activeTab === 'rsvp' && (
          <>
            {!guestInfo ? (
              <Card>
                <CardTitle>RSVP-Code eingeben</CardTitle>
                <p>Geben Sie Ihren RSVP-Code ein, um auf Ihre Einladung zu antworten.</p>
                <p><strong>Hinweis:</strong> Für diese Demo verwenden Sie bitte den Code <code>demo123</code>.</p>
                
                <form onSubmit={handleRsvpSubmit}>
                  <FormGroup>
                    <Label htmlFor="rsvpCode">RSVP-Code</Label>
                    <Input 
                      id="rsvpCode"
                      type="text" 
                      value={rsvpCode} 
                      onChange={(e) => setRsvpCode(e.target.value)}
                      placeholder="z.B. demo123"
                      required
                    />
                  </FormGroup>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Wird geprüft...' : 'Code prüfen'}
                  </Button>
                </form>
                
                {rsvpStatus && (
                  <StatusMessage success={rsvpStatus.success}>
                    {rsvpStatus.message}
                  </StatusMessage>
                )}
              </Card>
            ) : (
              <Card>
                <CardTitle>Hochzeitseinladung</CardTitle>
                <p>Hallo <strong>{guestInfo.name}</strong>,</p>
                <p>Sie sind herzlich zur Hochzeit von <strong>{guestInfo.wedding}</strong> am <strong>{guestInfo.date}</strong> eingeladen.</p>
                
                <form onSubmit={handleAttendanceSubmit}>
                  <FormGroup>
                    <Label>Werden Sie teilnehmen?</Label>
                    <div>
                      <label style={{ marginRight: '20px' }}>
                        <input 
                          type="radio" 
                          name="attending" 
                          value="yes" 
                          checked={attending === true}
                          onChange={() => setAttending(true)}
                          required
                        /> Ja, ich nehme teil
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          name="attending" 
                          value="no" 
                          checked={attending === false}
                          onChange={() => setAttending(false)}
                          required
                        /> Nein, ich kann leider nicht teilnehmen
                      </label>
                    </div>
                  </FormGroup>
                  
                  {attending === true && (
                    <>
                      <FormGroup>
                        <Label htmlFor="menuChoice">Menüauswahl</Label>
                        <select 
                          id="menuChoice"
                          value={menuChoice} 
                          onChange={(e) => setMenuChoice(e.target.value)}
                          required
                          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                          <option value="">Bitte wählen</option>
                          <option value="meat">Fleisch: Rinderfilet mit Rotweinsoße</option>
                          <option value="fish">Fisch: Lachs mit Zitronenbutter</option>
                          <option value="vegetarian">Vegetarisch: Gemüse-Risotto</option>
                          <option value="vegan">Vegan: Gefüllte Paprika mit Quinoa</option>
                        </select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="allergies">Allergien oder Unverträglichkeiten</Label>
                        <Input 
                          id="allergies"
                          type="text" 
                          value={allergies} 
                          onChange={(e) => setAllergies(e.target.value)}
                          placeholder="z.B. Nüsse, Laktose, etc."
                        />
                      </FormGroup>
                    </>
                  )}
                  
                  <Button type="submit" disabled={loading || attending === null}>
                    {loading ? 'Wird gesendet...' : 'Antwort senden'}
                  </Button>
                </form>
                
                {rsvpStatus && (
                  <StatusMessage success={rsvpStatus.success}>
                    {rsvpStatus.message}
                  </StatusMessage>
                )}
              </Card>
            )}
          </>
        )}
        
        {activeTab === 'statistics' && (
          <>
            <CardTitle>Hochzeitsstatistiken</CardTitle>
            <p>Hier sehen Sie eine Übersicht der RSVP-Antworten und Menüpräferenzen.</p>
            
            <StatsGrid>
              <StatCard>
                <StatNumber>{stats.totalGuests}</StatNumber>
                <StatLabel>Gesamtzahl der Gäste</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatNumber>{stats.confirmed}</StatNumber>
                <StatLabel>Zusagen</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatNumber>{stats.declined}</StatNumber>
                <StatLabel>Absagen</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatNumber>{stats.pending}</StatNumber>
                <StatLabel>Ausstehend</StatLabel>
              </StatCard>
            </StatsGrid>
            
            <CardTitle>Menüpräferenzen</CardTitle>
            <StatsGrid>
              <StatCard>
                <StatNumber>{stats.confirmed - stats.vegetarian - stats.vegan}</StatNumber>
                <StatLabel>Standard</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatNumber>{stats.vegetarian}</StatNumber>
                <StatLabel>Vegetarisch</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatNumber>{stats.vegan}</StatNumber>
                <StatLabel>Vegan</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatNumber>{stats.allergies}</StatNumber>
                <StatLabel>Mit Allergien</StatLabel>
              </StatCard>
            </StatsGrid>
          </>
        )}
        
        {activeTab === 'guestlist' && (
          <>
            <CardTitle>Gästeliste</CardTitle>
            <p>Hier können Sie Ihre Gästeliste verwalten und den RSVP-Status einsehen.</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>E-Mail</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>RSVP-Status</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Menüwahl</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Allergien</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '10px' }}>Max Mustermann</td>
                  <td style={{ padding: '10px' }}>max@example.com</td>
                  <td style={{ padding: '10px', color: 'green' }}>Zugesagt</td>
                  <td style={{ padding: '10px' }}>Fleisch</td>
                  <td style={{ padding: '10px' }}>Keine</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '10px' }}>Anna Schmidt</td>
                  <td style={{ padding: '10px' }}>anna@example.com</td>
                  <td style={{ padding: '10px', color: 'green' }}>Zugesagt</td>
                  <td style={{ padding: '10px' }}>Vegetarisch</td>
                  <td style={{ padding: '10px' }}>Laktose</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '10px' }}>Thomas Weber</td>
                  <td style={{ padding: '10px' }}>thomas@example.com</td>
                  <td style={{ padding: '10px', color: 'red' }}>Abgesagt</td>
                  <td style={{ padding: '10px' }}>-</td>
                  <td style={{ padding: '10px' }}>-</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '10px' }}>Julia Becker</td>
                  <td style={{ padding: '10px' }}>julia@example.com</td>
                  <td style={{ padding: '10px', color: 'orange' }}>Ausstehend</td>
                  <td style={{ padding: '10px' }}>-</td>
                  <td style={{ padding: '10px' }}>-</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '10px' }}>Michael Schneider</td>
                  <td style={{ padding: '10px' }}>michael@example.com</td>
                  <td style={{ padding: '10px', color: 'green' }}>Zugesagt</td>
                  <td style={{ padding: '10px' }}>Fisch</td>
                  <td style={{ padding: '10px' }}>Nüsse</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </TabContent>
    </Container>
  );
};

export default DemoPage;
