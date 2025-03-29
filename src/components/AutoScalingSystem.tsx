import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from '../styles/ResponsiveComponents';
import TranslatedText from './TranslatedText';
import TranslatedButton from './TranslatedButton';
import { supabase } from '../services/supabase';

interface AutoScalingSystemProps {
  isDemo?: boolean;
}

interface SalesData {
  date: string;
  count: number;
  revenue: number;
}

interface InstanceData {
  id: string;
  customer: string;
  plan: string;
  created: string;
  status: 'active' | 'pending' | 'suspended';
}

const Container = styled.div`
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const Header = styled.div`
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

const Title = styled.h2`
  font-size: 1.75rem;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: var(--background-light);
  border-radius: var(--border-radius-sm);
  padding: 1.5rem;
  box-shadow: var(--box-shadow-sm);
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: var(--text-light);
  margin: 0 0 0.5rem 0;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 2rem;
  position: relative;
`;

const ChartBar = styled.div<{ height: string }>`
  position: absolute;
  bottom: 0;
  width: 30px;
  height: ${props => props.height};
  background-color: var(--primary-color);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ChartLabel = styled.div`
  position: absolute;
  bottom: -25px;
  width: 30px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-light);
`;

const ChartYAxis = styled.div`
  position: absolute;
  left: -40px;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-light);
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: var(--background-light);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--background-hover);
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: var(--font-weight-medium);
`;

const TableCell = styled.td`
  padding: 1rem;
`;

const StatusBadge = styled.span<{ status: 'active' | 'pending' | 'suspended' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background-color: var(--success-light);
          color: var(--success-color);
        `;
      case 'suspended':
        return `
          background-color: var(--error-light);
          color: var(--error-color);
        `;
      default:
        return `
          background-color: var(--warning-light);
          color: var(--warning-color);
        `;
    }
  }}
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const AutoScalingSystem: React.FC<AutoScalingSystemProps> = ({ isDemo = false }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [instances, setInstances] = useState<InstanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (isDemo) {
      // Load demo data
      const demoSalesData: SalesData[] = [
        { date: '2024-03-01', count: 3, revenue: 267 },
        { date: '2024-03-02', count: 2, revenue: 178 },
        { date: '2024-03-03', count: 5, revenue: 445 },
        { date: '2024-03-04', count: 4, revenue: 356 },
        { date: '2024-03-05', count: 7, revenue: 623 },
        { date: '2024-03-06', count: 6, revenue: 534 },
        { date: '2024-03-07', count: 8, revenue: 712 }
      ];
      
      const demoInstances: InstanceData[] = [
        { id: '1', customer: 'Schmidt & Müller', plan: 'Premium', created: '2024-03-01', status: 'active' },
        { id: '2', customer: 'Weber & Fischer', plan: 'Basic', created: '2024-03-02', status: 'active' },
        { id: '3', customer: 'Becker & Hoffmann', plan: 'Premium', created: '2024-03-03', status: 'active' },
        { id: '4', customer: 'Meyer & Schulz', plan: 'Basic', created: '2024-03-04', status: 'pending' },
        { id: '5', customer: 'Wagner & Koch', plan: 'Premium', created: '2024-03-05', status: 'active' }
      ];
      
      setSalesData(demoSalesData);
      setInstances(demoInstances);
      setLoading(false);
    } else {
      // Load real data from Supabase
      const fetchData = async () => {
        try {
          // Fetch sales data
          const { data: salesData, error: salesError } = await supabase
            .from('sales')
            .select('*')
            .order('date', { ascending: false })
            .limit(7);
          
          if (salesError) throw salesError;
          
          // Fetch instances
          const { data: instancesData, error: instancesError } = await supabase
            .from('instances')
            .select('*')
            .order('created', { ascending: false });
          
          if (instancesError) throw instancesError;
          
          setSalesData(salesData || []);
          setInstances(instancesData || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isDemo]);
  
  const totalSales = salesData.reduce((sum, data) => sum + data.count, 0);
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const activeInstances = instances.filter(instance => instance.status === 'active').length;
  
  const maxRevenue = Math.max(...salesData.map(data => data.revenue));
  
  const handleActivateInstance = (id: string) => {
    if (isDemo) {
      setInstances(prev => 
        prev.map(instance => 
          instance.id === id ? { ...instance, status: 'active' } : instance
        )
      );
    } else {
      // Update in Supabase
      supabase
        .from('instances')
        .update({ status: 'active' })
        .eq('id', id)
        .then(() => {
          setInstances(prev => 
            prev.map(instance => 
              instance.id === id ? { ...instance, status: 'active' } : instance
            )
          );
        })
        .catch(error => {
          console.error('Error activating instance:', error);
        });
    }
  };
  
  const handleSuspendInstance = (id: string) => {
    if (isDemo) {
      setInstances(prev => 
        prev.map(instance => 
          instance.id === id ? { ...instance, status: 'suspended' } : instance
        )
      );
    } else {
      // Update in Supabase
      supabase
        .from('instances')
        .update({ status: 'suspended' })
        .eq('id', id)
        .then(() => {
          setInstances(prev => 
            prev.map(instance => 
              instance.id === id ? { ...instance, status: 'suspended' } : instance
            )
          );
        })
        .catch(error => {
          console.error('Error suspending instance:', error);
        });
    }
  };
  
  if (loading) {
    return (
      <Container>
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <TranslatedText i18nKey="autoscaling.loading" defaultText="Daten werden geladen..." />
          </div>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <TranslatedText i18nKey="autoscaling.title" defaultText="Auto-Skalierungssystem" />
        </Title>
      </Header>
      
      <StatsContainer>
        <StatCard>
          <StatTitle>
            <TranslatedText i18nKey="autoscaling.totalSales" defaultText="Gesamtverkäufe" />
          </StatTitle>
          <StatValue>{totalSales}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>
            <TranslatedText i18nKey="autoscaling.totalRevenue" defaultText="Gesamtumsatz" />
          </StatTitle>
          <StatValue>€{totalRevenue}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>
            <TranslatedText i18nKey="autoscaling.activeInstances" defaultText="Aktive Instanzen" />
          </StatTitle>
          <StatValue>{activeInstances}</StatValue>
        </StatCard>
      </StatsContainer>
      
      <ChartContainer>
        <ChartYAxis>
          <div>€{maxRevenue}</div>
          <div>€{Math.round(maxRevenue * 0.75)}</div>
          <div>€{Math.round(maxRevenue * 0.5)}</div>
          <div>€{Math.round(maxRevenue * 0.25)}</div>
          <div>€0</div>
        </ChartYAxis>
        
        {salesData.map((data, index) => (
          <div key={data.date} style={{ position: 'absolute', left: `${index * 50 + 50}px`, bottom: 0, width: '30px', height: '100%' }}>
            <ChartBar height={`${(data.revenue / maxRevenue) * 100}%`} />
            <ChartLabel>{new Date(data.date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}</ChartLabel>
          </div>
        ))}
      </ChartContainer>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>
                <TranslatedText i18nKey="autoscaling.customer" defaultText="Kunde" />
              </TableHeader>
              <TableHeader>
                <TranslatedText i18nKey="autoscaling.plan" defaultText="Plan" />
              </TableHeader>
              <TableHeader>
                <TranslatedText i18nKey="autoscaling.created" defaultText="Erstellt am" />
              </TableHeader>
              <TableHeader>
                <TranslatedText i18nKey="autoscaling.status" defaultText="Status" />
              </TableHeader>
              <TableHeader>
                <TranslatedText i18nKey="autoscaling.actions" defaultText="Aktionen" />
              </TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {instances.map(instance => (
              <TableRow key={instance.id}>
                <TableCell>{instance.customer}</TableCell>
                <TableCell>{instance.plan}</TableCell>
                <TableCell>{new Date(instance.created).toLocaleDateString('de-DE')}</TableCell>
                <TableCell>
                  <StatusBadge status={instance.status}>
                    {instance.status === 'active' ? 'Aktiv' : 
                     instance.status === 'pending' ? 'Ausstehend' : 'Gesperrt'}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {instance.status !== 'active' && (
                    <ActionButton onClick={() => handleActivateInstance(instance.id)} title="Aktivieren">
                      ✅
                    </ActionButton>
                  )}
                  {instance.status !== 'suspended' && (
                    <ActionButton onClick={() => handleSuspendInstance(instance.id)} title="Sperren">
                      ❌
                    </ActionButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AutoScalingSystem;
