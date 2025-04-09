"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

// Define the pricing plans directly in this file to avoid TypeScript errors
const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: '€',
    description: 'Perfekt für kleine Hochzeiten mit wenigen Gästen.',
    maxGuests: 10,
    buttonText: 'Kostenlos starten',
    features: [
      'RSVP-System',
      'Einfache To-Do-Listen',
      'Basis-Tischplan',
      'Gästeverwaltung (max. 10 Gäste)'
    ]
  },
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 12.99,
    currency: '€',
    description: 'Ideal für mittelgroße Hochzeiten mit allen wichtigen Funktionen.',
    maxGuests: 50,
    buttonText: 'Basic wählen',
    features: [
      'RSVP-System',
      'Erweiterte To-Do-Listen',
      'Budgetplaner',
      'Einfacher Tischplan',
      'Gästeverwaltung (max. 50 Gäste)',
      'Musikwünsche & Abstimmung',
      'Einfache Foto-Galerie',
      'Hochzeits-Zeitplaner'
    ]
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 29.99,
    currency: '€',
    description: 'Für anspruchsvolle Paare mit allen Premium-Funktionen.',
    maxGuests: 200,
    popular: true,
    buttonText: 'Premium wählen',
    features: [
      'RSVP-System',
      'Erweiterte To-Do-Listen',
      'Budgetplaner',
      'Kompletter Tischplan mit allen Features',
      'Gästeverwaltung (bis zu 200 Gäste)',
      'Musikwünsche & Abstimmung',
      'Erweiterte Foto-Galerie',
      'Hochzeits-Zeitplaner mit Erinnerungen',
      'Moodboards mit Pinterest-Integration',
      'AI-gestützter Hochzeitsredengenerator',
      'Trauzeugen-Bereich'
    ]
  },
  ULTIMATE: {
    id: 'ultimate',
    name: 'Ultimate',
    price: 299.99,
    currency: '€',
    description: 'Das komplette Paket mit allen Funktionen und White-Label.',
    maxGuests: 500,
    buttonText: 'Ultimate wählen',
    features: [
      'Alle Premium-Funktionen',
      'White-Label (keine LemonVows-Branding)',
      'NFT-Gästebuch',
      'VIP-Support',
      'Personalisiertes Fotoalbum',
      'Unbegrenzte Gäste (bis zu 500)'
    ]
  }
};

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
    maxGuests: number;
    buttonText: string;
    features: string[];
    popular?: boolean;
  };
  isCurrentPlan: boolean;
  onSelectPlan: (planId: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isCurrentPlan, onSelectPlan }) => {
  return (
    <div className={`rounded-lg shadow-lg p-6 ${isCurrentPlan ? 'border-2 border-primary' : 'border border-gray-200'}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-gray-500 mt-2">{plan.description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold">{plan.price === 0 ? 'Kostenlos' : `${plan.price} ${plan.currency}`}</span>
          {plan.price > 0 && <span className="text-gray-500">/Monat</span>}
        </div>
      </div>
      <div className="mt-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <Button
          onClick={() => onSelectPlan(plan.id)}
          className={`w-full ${isCurrentPlan ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Aktueller Plan' : plan.price === 0 ? 'Kostenlos starten' : 'Plan auswählen'}
        </Button>
      </div>
    </div>
  );
};

interface PricingPageProps {
  currentPlanId: string;
  onSelectPlan: (planId: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ currentPlanId, onSelectPlan }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Wähle den perfekten Plan für deine Hochzeit
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Alle Pläne beinhalten unsere Kernfunktionen für eine stressfreie Hochzeitsplanung
        </p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-4 md:grid-cols-2">
        <PricingCard 
          plan={PRICING_PLANS.FREE}
          isCurrentPlan={currentPlanId === PRICING_PLANS.FREE.id} 
          onSelectPlan={onSelectPlan} 
        />
        <PricingCard 
          plan={PRICING_PLANS.BASIC}
          isCurrentPlan={currentPlanId === PRICING_PLANS.BASIC.id} 
          onSelectPlan={onSelectPlan} 
        />
        <PricingCard 
          plan={PRICING_PLANS.PREMIUM}
          isCurrentPlan={currentPlanId === PRICING_PLANS.PREMIUM.id} 
          onSelectPlan={onSelectPlan} 
        />
        <PricingCard 
          plan={PRICING_PLANS.ULTIMATE}
          isCurrentPlan={currentPlanId === PRICING_PLANS.ULTIMATE.id} 
          onSelectPlan={onSelectPlan} 
        />
      </div>
    </div>
  );
};

export default PricingPage;
