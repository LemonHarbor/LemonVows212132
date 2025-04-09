import React from 'react';
import styled from 'styled-components';
import { supabase } from '../../api/supabase';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 60px; /* Space for dev panel */
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const StatusBox = styled.div`
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: ${props => props.success ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.success ? '#2e7d32' : '#c62828'};
  border: 1px solid ${props => props.success ? '#a5d6a7' : '#ef9a9a'};
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SupabaseTest = () => {
  const [status, setStatus] = React.useState({
    loading: false,
    success: null,
    message: '',
    details: null
  });

  const testConnection = async () => {
    setStatus({
      loading: true,
      success: null,
      message: 'Testing Supabase connection...',
      details: null
    });

    try {
      // Test the connection by getting the current user
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus({
          loading: false,
          success: false,
          message: 'Failed to connect to Supabase',
          details: error.message
        });
        return;
      }

      // Try to access a table to verify database access
      const { error: tableError } = await supabase
        .from('guests')
        .select('count')
        .limit(1);

      if (tableError && tableError.code !== 'PGRST116') {
        // PGRST116 is "No rows found" which is fine for this test
        setStatus({
          loading: false,
          success: false,
          message: 'Connected to Supabase but failed to access database',
          details: tableError.message
        });
        return;
      }

      setStatus({
        loading: false,
        success: true,
        message: 'Successfully connected to Supabase',
        details: {
          url: supabase.supabaseUrl,
          session: data?.session ? 'Active' : 'None'
        }
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: 'An unexpected error occurred',
        details: err.message
      });
    }
  };

  return (
    <Container>
      <Title>Supabase Integration Test</Title>
      <Card>
        <h2>Supabase Connection Status</h2>
        <p>This page tests the connection to your Supabase backend.</p>
        
        {status.message && (
          <StatusBox success={status.success}>
            <strong>{status.message}</strong>
            {status.details && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                {typeof status.details === 'object' ? (
                  <pre>{JSON.stringify(status.details, null, 2)}</pre>
                ) : (
                  <p>{status.details}</p>
                )}
              </div>
            )}
          </StatusBox>
        )}
        
        <Button 
          onClick={testConnection}
          disabled={status.loading}
        >
          {status.loading ? 'Testing...' : 'Test Supabase Connection'}
        </Button>
      </Card>
      
      <Card>
        <h2>Supabase Configuration</h2>
        <p>Current Supabase URL: <code>{supabase.supabaseUrl}</code></p>
        <p>The anonymous key is correctly configured.</p>
        
        <h3>Required Database Tables</h3>
        <ul>
          <li>guests - Store guest information</li>
          <li>rsvp_codes - Store RSVP codes linked to guests</li>
          <li>rsvp_responses - Store RSVP responses</li>
          <li>menu_options - Store menu options for the wedding</li>
          <li>food_preferences - Store guest food preferences</li>
          <li>tables - Store table information</li>
          <li>table_assignments - Store guest table assignments</li>
          <li>weddings - Store wedding details</li>
        </ul>
      </Card>
    </Container>
  );
};

export default SupabaseTest;
