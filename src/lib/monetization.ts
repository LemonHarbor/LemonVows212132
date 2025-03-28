// src/lib/monetization.ts
// Pricing plans for LemonVows

export interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number | null;
    yearly: number | null;
    oneTime: number | null;
  };
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  maxGuests: number | null;
  buttonText: string;
  buttonVariant: 'default' | 'secondary' | 'ghost';
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: {
      monthly: null,
      yearly: null,
      oneTime: 0
    },
    description: 'Perfekt für kleine Hochzeiten mit wenigen Gästen.',
    maxGuests: 10,
    buttonText: 'Kostenlos starten',
    buttonVariant: 'default',
    features: [
      { name: 'RSVP-System', included: true },
      { name: 'Einfache To-Do-Listen', included: true },
      { name: 'Basis-Tischplan', included: true },
      { name: 'Gästeverwaltung (max. 10 Gäste)', included: true },
      { name: 'Budgetplaner', included: false },
      { name: 'Erweiterte Tischplanung', included: false },
      { name: 'Moodboards', included: false },
      { name: 'Foto-Galerie', included: false },
      { name: 'Musikwünsche & Abstimmung', included: false },
      { name: 'White-Label', included: false }
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: {
      monthly: 12.99,
      yearly: null,
      oneTime: 49.99
    },
    description: 'Ideal für mittelgroße Hochzeiten mit allen wichtigen Funktionen.',
    maxGuests: 50,
    buttonText: 'Basic wählen',
    buttonVariant: 'default',
    features: [
      { name: 'RSVP-System', included: true },
      { name: 'Erweiterte To-Do-Listen', included: true },
      { name: 'Budgetplaner', included: true },
      { name: 'Einfacher Tischplan', included: true },
      { name: 'Gästeverwaltung (max. 50 Gäste)', included: true },
      { name: 'Musikwünsche & Abstimmung', included: true },
      { name: 'Einfache Foto-Galerie', included: true },
      { name: 'Hochzeits-Zeitplaner', included: true },
      { name: 'Moodboards', included: false },
      { name: 'White-Label', included: false }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: {
      monthly: 29.99,
      yearly: null,
      oneTime: 149.99
    },
    description: 'Für anspruchsvolle Paare mit allen Premium-Funktionen.',
    maxGuests: null, // Unbegrenzt
    popular: true,
    buttonText: 'Premium wählen',
    buttonVariant: 'secondary',
    features: [
      { name: 'RSVP-System', included: true },
      { name: 'Erweiterte To-Do-Listen', included: true },
      { name: 'Budgetplaner', included: true },
      { name: 'Kompletter Tischplan mit allen Features', included: true },
      { name: 'Gästeverwaltung (unbegrenzte Gäste)', included: true },
      { name: 'Musikwünsche & Abstimmung', included: true },
      { name: 'Erweiterte Foto-Galerie', included: true },
      { name: 'Hochzeits-Zeitplaner mit Erinnerungen', included: true },
      { name: 'Moodboards mit Pinterest-Integration', included: true },
      { name: 'AI-gestützter Hochzeitsredengenerator', included: true },
      { name: 'Trauzeugen-Bereich', included: true },
      { name: 'White-Label', included: false }
    ]
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: {
      monthly: null,
      yearly: null,
      oneTime: 299.99
    },
    description: 'Das komplette Paket mit allen Funktionen und White-Label.',
    maxGuests: null, // Unbegrenzt
    buttonText: 'Ultimate wählen',
    buttonVariant: 'default',
    features: [
      { name: 'Alle Premium-Funktionen', included: true },
      { name: 'White-Label (keine LemonVows-Branding)', included: true },
      { name: 'NFT-Gästebuch', included: true },
      { name: 'VIP-Support', included: true },
      { name: 'Personalisiertes Fotoalbum', included: true }
    ]
  }
];

export const ADD_ONS = [
  {
    id: 'white-label',
    name: 'White Label',
    price: 49.99,
    description: 'Entfernen Sie das LemonVows-Branding und nutzen Sie Ihre eigene Marke.'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    price: 29.99,
    description: 'Erhalten Sie Zugriff auf die native mobile App für iOS und Android.'
  }
];
