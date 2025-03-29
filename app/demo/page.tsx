'use client';

import React from 'react';
import { DataProvider } from '../../src/lib/data-context';
import GuestManagementDemo from '../../src/components/demo/GuestManagementDemo';
import TablePlannerDemo from '../../src/components/demo/TablePlannerDemo';
import BudgetPlannerDemo from '../../src/components/demo/BudgetPlannerDemo';

export default function DemoComponents() {
  const [activeDemo, setActiveDemo] = React.useState<string | null>(null);

  const startGuestlistDemo = () => {
    setActiveDemo('guestlist');
  };

  const startTableplanDemo = () => {
    setActiveDemo('tableplan');
  };

  const startBudgetDemo = () => {
    setActiveDemo('budget');
  };

  return (
    <DataProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">LemonVows Demo</h1>
        <p className="mb-8">Hier finden Sie unsere interaktiven Demos für die wichtigsten Funktionen von LemonVows.</p>
        
        {!activeDemo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Gästeliste</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Verwalten Sie Ihre Gäste und deren Antworten.</p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                onClick={startGuestlistDemo}
              >
                Demo starten
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Tischplaner</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Erstellen Sie Ihren Sitzplan mit Drag & Drop.</p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                onClick={startTableplanDemo}
              >
                Demo starten
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Budgetplaner</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Behalten Sie Ihre Ausgaben im Überblick.</p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                onClick={startBudgetDemo}
              >
                Demo starten
              </button>
            </div>
          </div>
        )}
        
        {activeDemo === 'guestlist' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Gästeliste Demo</h2>
              <button 
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-1 px-3 rounded"
                onClick={() => setActiveDemo(null)}
              >
                Zurück
              </button>
            </div>
            <GuestManagementDemo />
          </div>
        )}
        
        {activeDemo === 'tableplan' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Tischplaner Demo</h2>
              <button 
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-1 px-3 rounded"
                onClick={() => setActiveDemo(null)}
              >
                Zurück
              </button>
            </div>
            <TablePlannerDemo />
          </div>
        )}
        
        {activeDemo === 'budget' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Budgetplaner Demo</h2>
              <button 
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-1 px-3 rounded"
                onClick={() => setActiveDemo(null)}
              >
                Zurück
              </button>
            </div>
            <BudgetPlannerDemo />
          </div>
        )}
      </div>
    </DataProvider>
  );
}
