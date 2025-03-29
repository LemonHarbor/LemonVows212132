import React from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';

interface ResponsiveTableProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    title: string;
    render?: (value: any, record: Record<string, any>) => React.ReactNode;
  }>;
  onRowClick?: (record: Record<string, any>) => void;
  className?: string;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  ${media.sm} {
    min-width: 600px; // Ensure horizontal scrolling on small screens
  }
`;

const TableHeader = styled.thead`
  background-color: var(--background-light);
  border-bottom: 1px solid var(--border-color);
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  
  ${media.sm} {
    padding: 0.75rem;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ clickable?: boolean }>`
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.clickable && `
    cursor: pointer;
    
    &:hover {
      background-color: var(--background-light);
    }
  `}
`;

const TableCell = styled.td`
  padding: 1rem;
  
  ${media.sm} {
    padding: 0.75rem;
  }
`;

// Mobile card view for tables on very small screens
const MobileCardView = styled.div`
  display: none;
  
  ${media.xs} {
    display: block;
  }
`;

const MobileCard = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--background-light);
  }
`;

const MobileCardItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MobileCardLabel = styled.div`
  font-weight: 600;
  width: 40%;
  padding-right: 0.5rem;
`;

const MobileCardValue = styled.div`
  width: 60%;
`;

const DesktopTableView = styled.div`
  ${media.xs} {
    display: none;
  }
`;

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  onRowClick,
  className
}) => {
  return (
    <div className={className}>
      {/* Desktop/Tablet View */}
      <DesktopTableView>
        <TableContainer>
          <StyledTable>
            <TableHeader>
              <tr>
                {columns.map(column => (
                  <TableHeaderCell key={column.key}>
                    <TranslatedText i18nKey={column.title} />
                  </TableHeaderCell>
                ))}
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((record, index) => (
                <TableRow 
                  key={index} 
                  clickable={!!onRowClick}
                  onClick={() => onRowClick && onRowClick(record)}
                >
                  {columns.map(column => (
                    <TableCell key={column.key}>
                      {column.render 
                        ? column.render(record[column.key], record)
                        : record[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </DesktopTableView>
      
      {/* Mobile Card View */}
      <MobileCardView>
        {data.map((record, index) => (
          <MobileCard 
            key={index}
            onClick={() => onRowClick && onRowClick(record)}
          >
            {columns.map(column => (
              <MobileCardItem key={column.key}>
                <MobileCardLabel>
                  <TranslatedText i18nKey={column.title} />
                </MobileCardLabel>
                <MobileCardValue>
                  {column.render 
                    ? column.render(record[column.key], record)
                    : record[column.key]}
                </MobileCardValue>
              </MobileCardItem>
            ))}
          </MobileCard>
        ))}
      </MobileCardView>
    </div>
  );
};

export default ResponsiveTable;
