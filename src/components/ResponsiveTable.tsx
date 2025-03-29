import React from 'react';
import styled from 'styled-components';
import { media } from '../styles/ResponsiveComponents';

interface ResponsiveTableProps {
  headers: string[];
  data: Array<Record<string, React.ReactNode>>;
  keyField: string;
  onRowClick?: (item: Record<string, React.ReactNode>) => void;
  className?: string;
}

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: var(--background-light);
`;

const TableRow = styled.tr<{ clickable?: boolean }>`
  border-bottom: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--background-hover);
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-light);
`;

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  headers,
  data,
  keyField,
  onRowClick,
  className
}) => {
  if (!data || data.length === 0) {
    return (
      <TableContainer className={className}>
        <EmptyState>No data available</EmptyState>
      </TableContainer>
    );
  }
  
  return (
    <TableContainer className={className}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <tbody>
          {data.map(item => (
            <TableRow 
              key={String(item[keyField])} 
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              clickable={!!onRowClick}
            >
              {headers.map((header, index) => {
                // Find the corresponding key in the data
                const key = Object.keys(item).find(
                  k => k.toLowerCase() === header.toLowerCase()
                ) || '';
                
                return (
                  <TableCell key={index}>
                    {item[key] || ''}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;
