import React from 'react';

interface BudgetPlannerProps {
  // Props can be added as needed
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = () => {
  return (
    <div className="budget-planner">
      <div className="budget-planner__demo-notice">
        <p>Dies ist eine Demo-Version des Budgetplaners. In der vollständigen Version können Sie:</p>
        <ul>
          <li>Gesamtbudget und Kategorien festlegen</li>
          <li>Ausgaben in Echtzeit verfolgen</li>
          <li>Visuelle Diagramme zur Budgetverteilung anzeigen</li>
          <li>Belege hochladen und verwalten</li>
          <li>Berichte exportieren</li>
        </ul>
      </div>
      
      <div className="budget-planner__overview">
        <div className="budget-planner__total">
          <div className="budget-planner__total-header">
            <h3>Gesamtbudget</h3>
            <div className="budget-planner__total-amount">€15.000</div>
          </div>
          
          <div className="budget-planner__progress">
            <div className="budget-planner__progress-bar">
              <div className="budget-planner__progress-fill" style={{ width: '65%' }}></div>
            </div>
            <div className="budget-planner__progress-labels">
              <span>Ausgegeben: €9.750</span>
              <span>Verbleibend: €5.250</span>
            </div>
          </div>
        </div>
        
        <div className="budget-planner__chart">
          <div className="budget-planner__chart-placeholder">
            <div className="budget-planner__pie-chart">
              <div className="budget-planner__pie-segment budget-planner__pie-segment--1"></div>
              <div className="budget-planner__pie-segment budget-planner__pie-segment--2"></div>
              <div className="budget-planner__pie-segment budget-planner__pie-segment--3"></div>
              <div className="budget-planner__pie-segment budget-planner__pie-segment--4"></div>
              <div className="budget-planner__pie-segment budget-planner__pie-segment--5"></div>
            </div>
          </div>
          
          <div className="budget-planner__chart-legend">
            <div className="budget-planner__legend-item">
              <span className="budget-planner__legend-color budget-planner__legend-color--1"></span>
              <span className="budget-planner__legend-label">Location (30%)</span>
            </div>
            <div className="budget-planner__legend-item">
              <span className="budget-planner__legend-color budget-planner__legend-color--2"></span>
              <span className="budget-planner__legend-label">Catering (25%)</span>
            </div>
            <div className="budget-planner__legend-item">
              <span className="budget-planner__legend-color budget-planner__legend-color--3"></span>
              <span className="budget-planner__legend-label">Dekoration (15%)</span>
            </div>
            <div className="budget-planner__legend-item">
              <span className="budget-planner__legend-color budget-planner__legend-color--4"></span>
              <span className="budget-planner__legend-label">Kleidung (20%)</span>
            </div>
            <div className="budget-planner__legend-item">
              <span className="budget-planner__legend-color budget-planner__legend-color--5"></span>
              <span className="budget-planner__legend-label">Sonstiges (10%)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="budget-planner__categories">
        <h3>Kategorien</h3>
        
        <div className="budget-planner__category">
          <div className="budget-planner__category-header">
            <div className="budget-planner__category-name">Location</div>
            <div className="budget-planner__category-amounts">
              <span className="budget-planner__category-spent">€4.500</span>
              <span className="budget-planner__category-separator">/</span>
              <span className="budget-planner__category-budget">€4.500</span>
            </div>
          </div>
          
          <div className="budget-planner__category-progress">
            <div className="budget-planner__category-progress-bar">
              <div className="budget-planner__category-progress-fill" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="budget-planner__category">
          <div className="budget-planner__category-header">
            <div className="budget-planner__category-name">Catering</div>
            <div className="budget-planner__category-amounts">
              <span className="budget-planner__category-spent">€3.000</span>
              <span className="budget-planner__category-separator">/</span>
              <span className="budget-planner__category-budget">€3.750</span>
            </div>
          </div>
          
          <div className="budget-planner__category-progress">
            <div className="budget-planner__category-progress-bar">
              <div className="budget-planner__category-progress-fill" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="budget-planner__category">
          <div className="budget-planner__category-header">
            <div className="budget-planner__category-name">Dekoration</div>
            <div className="budget-planner__category-amounts">
              <span className="budget-planner__category-spent">€1.500</span>
              <span className="budget-planner__category-separator">/</span>
              <span className="budget-planner__category-budget">€2.250</span>
            </div>
          </div>
          
          <div className="budget-planner__category-progress">
            <div className="budget-planner__category-progress-bar">
              <div className="budget-planner__category-progress-fill" style={{ width: '67%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="budget-planner__category">
          <div className="budget-planner__category-header">
            <div className="budget-planner__category-name">Kleidung</div>
            <div className="budget-planner__category-amounts">
              <span className="budget-planner__category-spent">€2.500</span>
              <span className="budget-planner__category-separator">/</span>
              <span className="budget-planner__category-budget">€3.000</span>
            </div>
          </div>
          
          <div className="budget-planner__category-progress">
            <div className="budget-planner__category-progress-bar">
              <div className="budget-planner__category-progress-fill" style={{ width: '83%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="budget-planner__category">
          <div className="budget-planner__category-header">
            <div className="budget-planner__category-name">Sonstiges</div>
            <div className="budget-planner__category-amounts">
              <span className="budget-planner__category-spent">€750</span>
              <span className="budget-planner__category-separator">/</span>
              <span className="budget-planner__category-budget">€1.500</span>
            </div>
          </div>
          
          <div className="budget-planner__category-progress">
            <div className="budget-planner__category-progress-bar">
              <div className="budget-planner__category-progress-fill" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="budget-planner__controls">
        <button className="budget-planner__button budget-planner__button--disabled">Ausgabe hinzufügen</button>
        <button className="budget-planner__button budget-planner__button--disabled">Kategorie hinzufügen</button>
        <button className="budget-planner__button budget-planner__button--disabled">Bericht exportieren</button>
      </div>
      
      <style jsx>{`
        .budget-planner {
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .budget-planner__demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .budget-planner__demo-notice p {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .budget-planner__demo-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .budget-planner__overview {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .budget-planner__total {
          flex: 1;
          min-width: 300px;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .budget-planner__total-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .budget-planner__total-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }
        
        .budget-planner__total-amount {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }
        
        .budget-planner__progress {
          margin-bottom: 1rem;
        }
        
        .budget-planner__progress-bar {
          height: 10px;
          background-color: #f0f0f0;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .budget-planner__progress-fill {
          height: 100%;
          background-color: #ffbd00;
          border-radius: 5px;
        }
        
        .budget-planner__progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #666;
        }
        
        .budget-planner__chart {
          flex: 1;
          min-width: 300px;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }
        
        .budget-planner__chart-placeholder {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .budget-planner__pie-chart {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #f0f0f0;
          overflow: hidden;
        }
        
        .budget-planner__pie-segment {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-origin: 50% 50%;
        }
        
        .budget-planner__pie-segment--1 {
          background-color: #ffbd00;
          clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 60%, 50% 50%);
        }
        
        .budget-planner__pie-segment--2 {
          background-color: #ff9500;
          clip-path: polygon(50% 50%, 100% 60%, 100% 100%, 60% 100%, 50% 50%);
        }
        
        .budget-planner__pie-segment--3 {
          background-color: #00a699;
          clip-path: polygon(50% 50%, 60% 100%, 0% 100%, 0% 70%, 50% 50%);
        }
        
        .budget-planner__pie-segment--4 {
          background-color: #ff5a5f;
          clip-path: polygon(50% 50%, 0% 70%, 0% 0%, 30% 0%, 50% 50%);
        }
        
        .budget-planner__pie-segment--5 {
          background-color: #7a5195;
          clip-path: polygon(50% 50%, 30% 0%, 50% 0%, 50% 50%);
        }
        
        .budget-planner__chart-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        
        .budget-planner__legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        
        .budget-planner__legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        
        .budget-planner__legend-color--1 {
          background-color: #ffbd00;
        }
        
        .budget-planner__legend-color--2 {
          background-color: #ff9500;
        }
        
        .budget-planner__legend-color--3 {
          background-color: #00a699;
        }
        
        .budget-planner__legend-color--4 {
          background-color: #ff5a5f;
        }
        
        .budget-planner__legend-color--5 {
          background-color: #7a5195;
        }
        
        .budget-planner__categories {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .budget-planner__categories h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          color: #333;
        }
        
        .budget-planner__category {
          margin-bottom: 1.5rem;
        }
        
        .budget-planner__category:last-child {
          margin-bottom: 0;
        }
        
        .budget-planner__category-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .budget-planner__category-name {
          font-weight: 500;
          color: #333;
        }
        
        .budget-planner__category-amounts {
          font-size: 0.9rem;
          color: #666;
        }
        
        .budget-planner__category-spent {
          font-weight: 500;
        }
        
        .budget-planner__category-separator {
          margin: 0 0.25rem;
          color: #ccc;
        }
        
        .budget-planner__category-progress-bar {
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .budget-planner__category-progress-fill {
          height: 100%;
          background-color: #ffbd00;
          border-radius: 4px;
        }
        
        .budget-planner__controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .budget-planner__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .budget-planner__button:hover {
          background-color: #e6a800;
        }
        
        .budget-planner__button--disabled {
          background-color: #ddd;
          color: #666;
          cursor: not-allowed;
        }
        
        .budget-planner__button--disabled:hover {
          background-color: #ddd;
        }
        
        @media (max-width: 768px) {
          .budget-planner__overview {
            flex-direction: column;
          }
          
          .budget-planner__controls {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default BudgetPlanner;
