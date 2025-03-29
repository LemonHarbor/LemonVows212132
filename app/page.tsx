'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [demoActive, setDemoActive] = useState({
    guestlist: false,
    tableplan: false,
    budget: false
  });

  // Mock function for handling plan selection
  const handleSelectPlan = (planId: string) => {
    console.log(`Selected plan: ${planId}`);
    // In a real app, this would navigate to a checkout page or similar
    alert(`Plan ${planId} selected! In a complete version, this would take you to checkout.`);
  };

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Demo functions
  const startGuestlistDemo = () => {
    setDemoActive({...demoActive, guestlist: true});
    window.alert('Gästeliste-Demo gestartet!');
  };

  const startTableplanDemo = () => {
    setDemoActive({...demoActive, tableplan: true});
    window.alert('Tischplaner-Demo gestartet!');
  };

  const startBudgetDemo = () => {
    setDemoActive({...demoActive, budget: true});
    window.alert('Budgetplaner-Demo gestartet!');
  };

  const handleContactSubmit = () => {
    window.alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-yellow-500 dark:bg-yellow-700 text-white p-4 sticky top-0 z-40">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-4 sm:mb-0">LemonVows</div>
          <div className="flex flex-wrap justify-center space-x-1 sm:space-x-4">
            <Link href="/" className="px-3 py-2 rounded hover:bg-yellow-600 dark:hover:bg-yellow-800">Home</Link>
            <Link href="#features" className="px-3 py-2 rounded hover:bg-yellow-600 dark:hover:bg-yellow-800">Features</Link>
            <Link href="#pricing" className="px-3 py-2 rounded hover:bg-yellow-600 dark:hover:bg-yellow-800">Pricing</Link>
            <Link href="#demo" className="px-3 py-2 rounded hover:bg-yellow-600 dark:hover:bg-yellow-800">Demo</Link>
            <Link href="#contact" className="px-3 py-2 rounded hover:bg-yellow-600 dark:hover:bg-yellow-800">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              <span className="block">LemonVows</span>
              <span className="block text-yellow-600 dark:text-yellow-400">Hochzeitsplanung leicht gemacht</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Planen Sie Ihre perfekte Hochzeit mit unserer All-in-One-Plattform. Von der Gästeliste bis zum Tischplan - wir machen Ihre Hochzeitsplanung stressfrei.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a href="#pricing" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 md:py-4 md:text-lg md:px-10">
                  Jetzt starten
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-yellow-600 dark:text-yellow-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10">
                  Funktionen entdecken
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-600 dark:text-yellow-400 font-semibold tracking-wide uppercase">Funktionen</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Alles was Sie für Ihre Hochzeitsplanung brauchen
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              LemonVows bietet alle Tools, die Sie für eine stressfreie Hochzeitsplanung benötigen.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 dark:bg-yellow-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Gästeverwaltung</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Verwalten Sie Ihre Gästeliste, Zu- und Absagen, Essensauswahl und mehr an einem Ort.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 dark:bg-yellow-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Checklisten</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Behalten Sie den Überblick mit unseren vorgefertigten Checklisten für jede Phase der Hochzeitsplanung.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 dark:bg-yellow-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Budgetplaner</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Behalten Sie Ihre Ausgaben im Blick und planen Sie Ihr Budget effektiv mit unserem Budgetplaner.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 dark:bg-yellow-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Tischplaner</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Erstellen Sie mühelos Ihren Sitzplan mit unserem intuitiven Drag-and-Drop-Tischplaner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Wähle den perfekten Plan für deine Hochzeit
            </h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
              Alle Pläne beinhalten unsere Kernfunktionen für eine stressfreie Hochzeitsplanung
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Free Plan */}
            <div className="rounded-lg shadow-lg p-6 border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free</h3>
                <p className="text-gray-500 dark:text-gray-300 mt-2">Perfekt für kleine Hochzeiten mit wenigen Gästen.</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">Kostenlos</span>
                </div>
              </div>
              <div className="mt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">RSVP-System</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Einfache To-Do-Listen</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Basis-Tischplan</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Gästeverwaltung (max. 10 Gäste)</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => handleSelectPlan('free')}
                  className="w-full flex items-center justify-center px-4 py-2 border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors border-transparent text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:ring-yellow-500"
                >
                  Kostenlos starten
                </button>
              </div>
            </div>
            
            {/* Basic Plan */}
            <div className="rounded-lg shadow-lg p-6 border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Basic</h3>
                <p className="text-gray-500 dark:text-gray-300 mt-2">Ideal für mittelgroße Hochzeiten mit allen wichtigen Funktionen.</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">12,99 €</span>
                  <span className="text-gray-500 dark:text-gray-300">/Monat</span>
                </div>
              </div>
              <div className="mt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">RSVP-System</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Erweiterte To-Do-Listen</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Budgetplaner</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Gästeverwaltung (max. 50 Gäste)</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => handleSelectPlan('basic')}
                  className="w-full flex items-center justify-center px-4 py-2 border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors border-transparent text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:ring-yellow-500"
                >
                  Plan auswählen
                </button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="rounded-lg shadow-lg p-6 border-2 border-yellow-500 dark:border-yellow-400 bg-white dark:bg-gray-700">
              <div className="text-center">
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">Beliebt</span>
                <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">Premium</h3>
                <p className="text-gray-500 dark:text-gray-300 mt-2">Für anspruchsvolle Paare mit allen Premium-Funktionen.</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">29,99 €</span>
                  <span className="text-gray-500 dark:text-gray-300">/Monat</span>
                </div>
              </div>
              <div className="mt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Alle Basic-Funktionen</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Kompletter Tischplan mit allen Features</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Gästeverwaltung (bis zu 200 Gäste)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Moodboards mit Pinterest-Integration</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => handleSelectPlan('premium')}
                  className="w-full flex items-center justify-center px-4 py-2 border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors border-transparent text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 focus:ring-yellow-500"
                >
                  Plan auswählen
                </button>
              </div>
            </div>
            
            {/* Ultimate Plan */}
            <div className="rounded-lg shadow-lg p-6 border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ultimate</h3>
                <p className="text-gray-500 dark:text-gray-300 mt-2">Das komplette Paket mit allen Funktionen und White-Label.</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">299,99 €</span>
                  <span className="text-gray-500 dark:text-gray-300">/einmalig</span>
                </div>
              </div>
              <div className="mt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Alle Premium-Funktionen</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">White-Label (keine LemonVows-Branding)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">NFT-Gästebuch</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">VIP-Support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => handleSelectPlan('ultimate')}
                  className="w-full flex items-center justify-center px-4 py-2 border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors border-transparent text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:ring-yellow-500"
                >
                  Plan auswählen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-600 dark:text-yellow-400 font-semibold tracking-wide uppercase">Demo</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Testen Sie LemonVows
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Erleben Sie die Funktionen von LemonVows in unserer interaktiven Demo.
            </p>
          </div>

          <div className="mt-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Gästeliste</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Verwalten Sie Ihre Gäste und deren Antworten.</p>
                <button 
                  onClick={startGuestlistDemo}
                  className="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
                >
                  Demo starten
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tischplaner</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Erstellen Sie Ihren Sitzplan mit Drag & Drop.</p>
                <button 
                  onClick={startTableplanDemo}
                  className="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
                >
                  Demo starten
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Budgetplaner</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Behalten Sie Ihre Ausgaben im Überblick.</p>
                <button 
                  onClick={startBudgetDemo}
                  className="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
                >
                  Demo starten
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-600 dark:text-yellow-400 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Was unsere Kunden sagen
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-700 shadow overflow-hidden rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                  <span className="text-yellow-800 dark:text-yellow-200 font-bold">S</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Sarah & Thomas</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Hochzeit im Juni 2024</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  "LemonVows hat unsere Hochzeitsplanung so viel einfacher gemacht! Besonders der Tischplaner war ein Lebensretter."
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-700 shadow overflow-hidden rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                  <span className="text-yellow-800 dark:text-yellow-200 font-bold">M</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Michael & Julia</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Hochzeit im August 2023</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  "Die Budgetplanung hat uns geholfen, den Überblick zu behalten und keine bösen Überraschungen zu erleben."
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-700 shadow overflow-hidden rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                  <span className="text-yellow-800 dark:text-yellow-200 font-bold">L</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Lisa & Mark</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Hochzeit im Mai 2024</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  "Das RSVP-System war fantastisch! Unsere Gäste fanden es einfach zu bedienen und wir hatten alle Informationen an einem Ort."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-500 dark:bg-yellow-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Bereit für Ihre Traumhochzeit?</span>
            <span className="block text-yellow-900 dark:text-yellow-100">Starten Sie heute mit LemonVows.</span>
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a href="#pricing" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-yellow-600 dark:text-yellow-800 bg-white dark:bg-yellow-100 hover:bg-yellow-50 dark:hover:bg-yellow-200">
                Kostenlos starten
              </a>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 inline-flex rounded-md shadow">
              <a href="#contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 dark:bg-yellow-800 hover:bg-yellow-700 dark:hover:bg-yellow-900">
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-600 dark:text-yellow-400 font-semibold tracking-wide uppercase">Kontakt</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Haben Sie Fragen?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Unser Team steht Ihnen gerne zur Verfügung.
            </p>
          </div>

          <div className="mt-10 max-w-xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" id="name" className="mt-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-Mail</label>
                <input type="email" name="email" id="email" className="mt-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nachricht</label>
                <textarea name="message" id="message" rows={4} className="mt-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"></textarea>
              </div>
              <div>
                <button 
                  onClick={() => alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 dark:bg-yellow-700 hover:bg-yellow-700 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Absenden
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h2 className="text-2xl font-bold text-white">LemonVows</h2>
              <p className="text-gray-300 text-base">
                Ihre All-in-One-Plattform für stressfreie Hochzeitsplanung.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Produkt</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#features" className="text-base text-gray-300 hover:text-white">Funktionen</a>
                    </li>
                    <li>
                      <a href="#pricing" className="text-base text-gray-300 hover:text-white">Preise</a>
                    </li>
                    <li>
                      <a href="#demo" className="text-base text-gray-300 hover:text-white">Demo</a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">FAQ</a>
                    </li>
                    <li>
                      <a href="#contact" className="text-base text-gray-300 hover:text-white">Kontakt</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">Hilfe</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Unternehmen</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">Über uns</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">Blog</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">Karriere</a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Rechtliches</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">Datenschutz</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">AGB</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">Impressum</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2025 LemonVows. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
