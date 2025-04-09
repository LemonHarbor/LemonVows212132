// lib/monetization.ts
// Pricing plans for LemonVows

export interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  maxGuests: number | null;
  buttonText: string;
  buttonVariant?: 'default' | 'secondary' | 'ghost';
}

// Export as an object with named properties to match the usage in PricingPage.tsx
export const PRICING_PLANS = {
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
    price: 49.99,
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
    price: 149.99,
    currency: '€',
    description: 'Für anspruchsvolle Paare mit allen Premium-Funktionen.',
    maxGuests: null, // Unbegrenzt
    popular: true,
    buttonText: 'Premium wählen',
    features: [
      'RSVP-System',
      'Erweiterte To-Do-Listen',
      'Budgetplaner',
      'Kompletter Tischplan mit allen Features',
      'Gästeverwaltung (unbegrenzte Gäste)',
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
    maxGuests: null, // Unbegrenzt
    buttonText: 'Ultimate wählen',
    features: [
      'Alle Premium-Funktionen',
      'White-Label (keine LemonVows-Branding)',
      'NFT-Gästebuch',
      'VIP-Support',
      'Personalisiertes Fotoalbum'
    ]
  }
};

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
