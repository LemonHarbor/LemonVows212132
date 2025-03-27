import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Stripe client
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

// Preisdefinitionen
export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    description: 'Für kleine Hochzeiten mit bis zu 10 Gästen',
    price: 0,
    currency: 'EUR',
    features: [
      'Gästeverwaltung (bis 10 Gäste)',
      'Einfacher Tischplan',
      'RSVP-Funktion',
      'Einfache Budgetverwaltung',
    ],
    limits: {
      guests: 10,
      tables: 3,
      budget_categories: 5,
      photos: 20,
    },
    stripe_price_id: null, // Kein Stripe-Preis für kostenlosen Plan
  },
  BASIC: {
    id: 'basic',
    name: 'Basic',
    description: 'Für mittelgroße Hochzeiten mit bis zu 50 Gästen',
    price: 9.99,
    currency: 'EUR',
    features: [
      'Gästeverwaltung (bis 50 Gäste)',
      'Erweiterter Tischplan',
      'RSVP-Funktion mit Menüauswahl',
      'Detaillierte Budgetverwaltung',
      'Einfaches Moodboard',
      'Foto-Galerie (100 Fotos)',
    ],
    limits: {
      guests: 50,
      tables: 10,
      budget_categories: 10,
      photos: 100,
    },
    stripe_price_id: 'price_basic', // Wird später mit echtem Stripe-Preis ersetzt
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    description: 'Für größere Hochzeiten mit unbegrenzter Gästeanzahl',
    price: 19.99,
    currency: 'EUR',
    features: [
      'Unbegrenzte Gästeverwaltung',
      'Professioneller Tischplan mit Konfliktwarnung',
      'Erweiterte RSVP-Funktion mit Allergien und Übernachtungsbedarf',
      'Umfassende Budgetverwaltung mit Echtzeit-Übersicht',
      'Erweitertes Moodboard mit Pinterest-Integration',
      'Foto-Galerie (500 Fotos)',
      'Musikwünsche mit Voting-Funktion',
      'Automatischer Hochzeits-Zeitplaner',
    ],
    limits: {
      guests: -1, // Unbegrenzt
      tables: -1, // Unbegrenzt
      budget_categories: 20,
      photos: 500,
    },
    stripe_price_id: 'price_premium', // Wird später mit echtem Stripe-Preis ersetzt
  },
  ULTIMATE: {
    id: 'ultimate',
    name: 'Ultimate',
    description: 'Die komplette Lösung mit White-Labeling und allen Funktionen',
    price: 29.99,
    currency: 'EUR',
    features: [
      'Alle Premium-Funktionen',
      'White-Labeling (eigenes Logo und Farben)',
      'Unbegrenzte Fotos und Dateien',
      'Prioritäts-Support',
      'Erweiterte Statistiken und Berichte',
      'Mehrsprachige Gästeansicht (DE, EN, FR, ES)',
      'Eigene Domain-Integration',
    ],
    limits: {
      guests: -1, // Unbegrenzt
      tables: -1, // Unbegrenzt
      budget_categories: -1, // Unbegrenzt
      photos: -1, // Unbegrenzt
    },
    stripe_price_id: 'price_ultimate', // Wird später mit echtem Stripe-Preis ersetzt
  },
};

// Funktionen für die Stripe-Integration
export const stripeApi = {
  // Checkout-Session erstellen
  createCheckoutSession: async (userId: string, planId: string, successUrl: string, cancelUrl: string) => {
    const plan = PRICING_PLANS[planId.toUpperCase()];
    
    if (!plan || !plan.stripe_price_id) {
      throw new Error('Ungültiger Plan oder kostenloser Plan');
    }
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripe_price_id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId,
        metadata: {
          userId,
          planId,
        },
      });
      
      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error('Fehler beim Erstellen der Checkout-Session:', error);
      throw error;
    }
  },
  
  // Abonnement verwalten
  createPortalSession: async (customerId: string, returnUrl: string) => {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      
      return { url: session.url };
    } catch (error) {
      console.error('Fehler beim Erstellen der Portal-Session:', error);
      throw error;
    }
  },
  
  // Webhook-Handler für Stripe-Events
  handleWebhookEvent: async (event: any) => {
    const { type, data } = event;
    
    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object;
        const { userId, planId } = session.metadata;
        
        // Benutzer-Abonnement in der Datenbank aktualisieren
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_id: planId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: 'active',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Tage ab jetzt
          });
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = data.object;
        
        // Abonnement in der Datenbank aktualisieren
        const { data: subscriptionData, error } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();
        
        if (error || !subscriptionData) {
          console.error('Abonnement nicht gefunden:', error);
          break;
        }
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = data.object;
        
        // Abonnement in der Datenbank als gekündigt markieren
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }
    }
  },
};

// Funktionen für die Abonnementverwaltung
export const subscriptionApi = {
  // Aktuellen Plan eines Benutzers abrufen
  getUserPlan: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      if (error || !data) {
        // Wenn kein aktives Abonnement gefunden wurde, wird der kostenlose Plan zurückgegeben
        return PRICING_PLANS.FREE;
      }
      
      return PRICING_PLANS[data.plan_id.toUpperCase()] || PRICING_PLANS.FREE;
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzerplans:', error);
      return PRICING_PLANS.FREE;
    }
  },
  
  // Prüfen, ob ein Benutzer ein bestimmtes Feature nutzen darf
  canUseFeature: async (userId: string, feature: string) => {
    const plan = await subscriptionApi.getUserPlan(userId);
    
    // Hier können spezifische Feature-Prüfungen implementiert werden
    // Für jetzt geben wir einfach true zurück, wenn der Benutzer einen Premium- oder Ultimate-Plan hat
    return plan.id === 'premium' || plan.id === 'ultimate';
  },
  
  // Prüfen, ob ein Benutzer ein bestimmtes Limit überschritten hat
  checkLimit: async (userId: string, limitType: string, currentCount: number) => {
    const plan = await subscriptionApi.getUserPlan(userId);
    const limit = plan.limits[limitType];
    
    // -1 bedeutet unbegrenzt
    if (limit === -1) {
      return true;
    }
    
    return currentCount < limit;
  },
};

export default {
  supabase,
  stripe,
  PRICING_PLANS,
  stripeApi,
  subscriptionApi,
};
