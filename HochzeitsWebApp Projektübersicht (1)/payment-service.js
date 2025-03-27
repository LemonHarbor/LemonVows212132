// Zahlungsabwicklung mit Stripe
// lemonvows/frontend/services/payment-service.js

class PaymentService {
  constructor() {
    this.stripePublicKey = 'pk_test_YOUR_STRIPE_PUBLIC_KEY';
    this.stripe = null;
    this.elements = null;
    this.plans = {
      free: {
        id: 'free',
        name: 'Kostenlos',
        price: 0,
        currency: 'EUR',
        features: [
          'RSVP bis 20 Gäste',
          'Einfache Gästeverwaltung',
          'Grundlegende Zeitplanung'
        ],
        limits: {
          guests: 20,
          tables: 3,
          photos: 10
        }
      },
      basic: {
        id: 'basic',
        name: 'Basic',
        price: 49,
        currency: 'EUR',
        features: [
          'Bis zu 75 Gäste',
          'Interaktiver Tischplan',
          'Budgetplaner',
          'Gästeverwaltung mit RSVP',
          'Zeitplaner'
        ],
        limits: {
          guests: 75,
          tables: 10,
          photos: 100
        },
        stripePriceId: 'price_YOUR_STRIPE_PRICE_ID_BASIC'
      },
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 89,
        currency: 'EUR',
        features: [
          'Unbegrenzte Gäste',
          'Alle Funktionen',
          'Trauzeugen-Bereich',
          'Moodboard',
          'Foto-Galerie',
          'Musikwünsche',
          'Prioritäts-Support'
        ],
        limits: {
          guests: Infinity,
          tables: Infinity,
          photos: Infinity
        },
        stripePriceId: 'price_YOUR_STRIPE_PRICE_ID_PREMIUM'
      }
    };
  }

  // Stripe initialisieren
  async init() {
    if (!window.Stripe) {
      // Stripe.js laden
      await this.loadScript('https://js.stripe.com/v3/');
    }
    
    this.stripe = window.Stripe(this.stripePublicKey);
    return this.stripe;
  }

  // Hilfsfunktion zum Laden von Skripten
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Zahlungsformular erstellen
  async createPaymentForm(containerId, planId) {
    if (!this.stripe) {
      await this.init();
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container mit ID ${containerId} nicht gefunden`);
    }
    
    const plan = this.plans[planId];
    if (!plan) {
      throw new Error(`Plan mit ID ${planId} nicht gefunden`);
    }
    
    // Stripe Elements initialisieren
    this.elements = this.stripe.elements();
    
    // Kartenfeld erstellen
    const cardElement = this.elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });
    
    // Kartenfeld in Container einfügen
    cardElement.mount(`#${containerId}`);
    
    return {
      stripe: this.stripe,
      elements: this.elements,
      cardElement
    };
  }

  // Zahlung durchführen
  async processPayment(planId, cardElement, customerData) {
    if (!this.stripe) {
      await this.init();
    }
    
    const plan = this.plans[planId];
    if (!plan || !plan.stripePriceId) {
      throw new Error(`Ungültiger Plan: ${planId}`);
    }
    
    try {
      // Payment Intent vom Server anfordern
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId,
          customerData
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Zahlungsabwicklung');
      }
      
      const { clientSecret } = await response.json();
      
      // Zahlung mit Stripe bestätigen
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerData.name,
            email: customerData.email,
            address: {
              line1: customerData.address?.line1,
              city: customerData.address?.city,
              postal_code: customerData.address?.postalCode,
              country: customerData.address?.country || 'DE'
            }
          }
        }
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      if (result.paymentIntent.status === 'succeeded') {
        // Erfolgreiche Zahlung
        return {
          success: true,
          paymentId: result.paymentIntent.id,
          planId
        };
      } else {
        throw new Error(`Zahlung fehlgeschlagen: ${result.paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Fehler bei der Zahlungsabwicklung:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Abonnement erstellen
  async createSubscription(planId, cardElement, customerData) {
    if (!this.stripe) {
      await this.init();
    }
    
    const plan = this.plans[planId];
    if (!plan || !plan.stripePriceId) {
      throw new Error(`Ungültiger Plan: ${planId}`);
    }
    
    try {
      // Zahlungsmethode erstellen
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerData.name,
          email: customerData.email,
          address: {
            line1: customerData.address?.line1,
            city: customerData.address?.city,
            postal_code: customerData.address?.postalCode,
            country: customerData.address?.country || 'DE'
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Abonnement auf dem Server erstellen
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId,
          paymentMethodId: paymentMethod.id,
          customerData
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler beim Erstellen des Abonnements');
      }
      
      const subscription = await response.json();
      
      // Abonnement bestätigen, falls erforderlich
      if (subscription.status === 'incomplete' && subscription.latest_invoice?.payment_intent) {
        const { client_secret } = subscription.latest_invoice.payment_intent;
        
        const result = await this.stripe.confirmCardPayment(client_secret);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
      }
      
      return {
        success: true,
        subscriptionId: subscription.id,
        planId
      };
    } catch (error) {
      console.error('Fehler beim Erstellen des Abonnements:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Abonnement kündigen
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler beim Kündigen des Abonnements');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        canceled: result.canceled
      };
    } catch (error) {
      console.error('Fehler beim Kündigen des Abonnements:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Abonnement upgraden/downgraden
  async updateSubscription(subscriptionId, newPlanId) {
    const plan = this.plans[newPlanId];
    if (!plan || !plan.stripePriceId) {
      throw new Error(`Ungültiger Plan: ${newPlanId}`);
    }
    
    try {
      const response = await fetch(`/api/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId,
          newPlanId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler beim Aktualisieren des Abonnements');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        subscriptionId: result.id,
        planId: newPlanId
      };
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Abonnements:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Rechnungen abrufen
  async getInvoices() {
    try {
      const response = await fetch('/api/invoices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler beim Abrufen der Rechnungen');
      }
      
      const invoices = await response.json();
      
      return {
        success: true,
        invoices
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Rechnungen:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Rechnung herunterladen
  async downloadInvoice(invoiceId) {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler beim Herunterladen der Rechnung');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rechnung-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Aufräumen
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Fehler beim Herunterladen der Rechnung:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verfügbare Pläne abrufen
  getPlans() {
    return this.plans;
  }

  // Plan-Details abrufen
  getPlan(planId) {
    return this.plans[planId];
  }
}

// Singleton-Instanz exportieren
export const paymentService = new PaymentService();
export default paymentService;
