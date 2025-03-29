'use client';

import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">LemonVows Demo</h1>
      <p className="mb-8">Hier finden Sie unsere interaktiven Demos für die wichtigsten Funktionen von LemonVows.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Gästeliste</h2>
          <p className="mb-4">Verwalten Sie Ihre Gäste und deren Antworten.</p>
          <button 
            onClick={() => alert('Gästeliste-Demo würde hier starten!')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Demo starten
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Tischplaner</h2>
          <p className="mb-4">Erstellen Sie mühelos Ihren Sitzplan mit Drag & Drop.</p>
          <button 
            onClick={() => alert('Tischplaner-Demo würde hier starten!')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Demo starten
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Budgetplaner</h2>
          <p className="mb-4">Behalten Sie Ihre Ausgaben im Blick und planen Sie Ihr Budget effektiv.</p>
          <button 
            onClick={() => alert('Budgetplaner-Demo würde hier starten!')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Demo starten
          </button>
        </div>
      </div>
      
      <Link href="/" className="mt-12 text-yellow-500 hover:text-yellow-600">
        Zurück zur Startseite
      </Link>
    </div>
  );
}
