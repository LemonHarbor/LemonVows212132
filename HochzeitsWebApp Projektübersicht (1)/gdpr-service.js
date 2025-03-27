// DSGVO-Konformitätsmodul
// lemonvows/frontend/services/gdpr-service.js

class GDPRService {
  constructor() {
    this.consentKey = 'lemonvows_gdpr_consent';
    this.consentVersion = '1.0';
    this.cookieExpiryDays = 365;
    this.requiredCategories = ['essential'];
    this.cookieCategories = {
      essential: {
        name: 'Essentielle Cookies',
        description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
        required: true
      },
      functional: {
        name: 'Funktionale Cookies',
        description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.',
        required: false
      },
      analytics: {
        name: 'Analyse-Cookies',
        description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
        required: false
      },
      marketing: {
        name: 'Marketing-Cookies',
        description: 'Diese Cookies werden verwendet, um Besucher auf Websites zu verfolgen.',
        required: false
      }
    };
  }

  // Initialisierung des GDPR-Moduls
  init() {
    // Prüfen, ob Consent bereits gegeben wurde
    const consent = this.getConsent();
    
    if (!consent || consent.version !== this.consentVersion) {
      // Cookie-Banner anzeigen, wenn kein Consent vorhanden oder Version veraltet
      this.showConsentBanner();
    }
    
    // Event-Listener für Datenschutz-Links hinzufügen
    document.addEventListener('click', (event) => {
      if (event.target.matches('.privacy-settings-link')) {
        event.preventDefault();
        this.showConsentBanner();
      }
    });
  }

  // Cookie-Banner anzeigen
  showConsentBanner() {
    const existingBanner = document.getElementById('gdpr-consent-banner');
    if (existingBanner) {
      existingBanner.style.display = 'flex';
      return;
    }

    const consent = this.getConsent() || {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      version: this.consentVersion
    };

    const banner = document.createElement('div');
    banner.id = 'gdpr-consent-banner';
    banner.className = 'gdpr-consent-banner';
    
    let bannerContent = `
      <div class="gdpr-consent-content">
        <h2>Datenschutzeinstellungen</h2>
        <p>Wir verwenden Cookies und ähnliche Technologien auf unserer Website und verarbeiten personenbezogene Daten über Sie, wie Ihre IP-Adresse. Wir teilen diese Daten auch mit Dritten. Die Datenverarbeitung kann mit Ihrer Einwilligung oder auf Basis eines berechtigten Interesses erfolgen, dem Sie in den individuellen Datenschutzeinstellungen widersprechen können. Sie haben das Recht, nur in essenzielle Services einzuwilligen und Ihre Einwilligung später in der Datenschutzerklärung zu ändern oder zu widerrufen.</p>
        <div class="gdpr-consent-options">
    `;
    
    // Cookie-Kategorien hinzufügen
    for (const [category, info] of Object.entries(this.cookieCategories)) {
      const isChecked = consent[category] || info.required;
      const isDisabled = info.required;
      
      bannerContent += `
        <div class="gdpr-consent-option">
          <label class="gdpr-switch">
            <input type="checkbox" data-category="${category}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
            <span class="gdpr-slider"></span>
          </label>
          <div class="gdpr-option-info">
            <h3>${info.name}</h3>
            <p>${info.description}</p>
          </div>
        </div>
      `;
    }
    
    bannerContent += `
        </div>
        <div class="gdpr-consent-buttons">
          <button id="gdpr-reject-all" class="gdpr-button gdpr-button-secondary">Alle ablehnen</button>
          <button id="gdpr-accept-selected" class="gdpr-button gdpr-button-primary">Auswahl speichern</button>
          <button id="gdpr-accept-all" class="gdpr-button gdpr-button-primary">Alle akzeptieren</button>
        </div>
        <div class="gdpr-consent-links">
          <a href="/datenschutz" target="_blank">Datenschutzerklärung</a>
          <a href="/impressum" target="_blank">Impressum</a>
        </div>
      </div>
    `;
    
    banner.innerHTML = bannerContent;
    document.body.appendChild(banner);
    
    // Event-Listener für Buttons
    document.getElementById('gdpr-reject-all').addEventListener('click', () => {
      this.rejectAll();
      this.hideConsentBanner();
    });
    
    document.getElementById('gdpr-accept-selected').addEventListener('click', () => {
      this.saveSelectedConsent();
      this.hideConsentBanner();
    });
    
    document.getElementById('gdpr-accept-all').addEventListener('click', () => {
      this.acceptAll();
      this.hideConsentBanner();
    });
  }

  // Cookie-Banner ausblenden
  hideConsentBanner() {
    const banner = document.getElementById('gdpr-consent-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }

  // Alle Cookies akzeptieren
  acceptAll() {
    const consent = {
      version: this.consentVersion
    };
    
    for (const category in this.cookieCategories) {
      consent[category] = true;
    }
    
    this.setConsent(consent);
    this.applyConsent(consent);
  }

  // Alle Cookies ablehnen (außer essenzielle)
  rejectAll() {
    const consent = {
      version: this.consentVersion
    };
    
    for (const category in this.cookieCategories) {
      consent[category] = this.cookieCategories[category].required;
    }
    
    this.setConsent(consent);
    this.applyConsent(consent);
  }

  // Ausgewählte Cookies speichern
  saveSelectedConsent() {
    const consent = {
      version: this.consentVersion
    };
    
    // Essenzielle Cookies immer aktivieren
    consent.essential = true;
    
    // Andere Kategorien basierend auf Checkbox-Status
    const checkboxes = document.querySelectorAll('#gdpr-consent-banner input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const category = checkbox.dataset.category;
      if (category) {
        consent[category] = checkbox.checked;
      }
    });
    
    this.setConsent(consent);
    this.applyConsent(consent);
  }

  // Consent im Local Storage speichern
  setConsent(consent) {
    localStorage.setItem(this.consentKey, JSON.stringify(consent));
    
    // Consent-Cookie setzen (für serverseitige Überprüfung)
    const consentCookie = Object.entries(consent)
      .filter(([key, value]) => key !== 'version' && value === true)
      .map(([key]) => key)
      .join(',');
    
    this.setCookie('lemonvows_consent', consentCookie, this.cookieExpiryDays);
  }

  // Gespeicherten Consent abrufen
  getConsent() {
    const consentJson = localStorage.getItem(this.consentKey);
    return consentJson ? JSON.parse(consentJson) : null;
  }

  // Consent anwenden (Skripte laden/entladen)
  applyConsent(consent) {
    // Analytics-Skripte
    if (consent.analytics) {
      this.loadAnalytics();
    } else {
      this.unloadAnalytics();
    }
    
    // Marketing-Skripte
    if (consent.marketing) {
      this.loadMarketing();
    } else {
      this.unloadMarketing();
    }
    
    // Event auslösen, damit andere Komponenten reagieren können
    const event = new CustomEvent('gdprConsentUpdated', { detail: consent });
    document.dispatchEvent(event);
  }

  // Analytics-Skripte laden
  loadAnalytics() {
    // Hier können Analytics-Skripte geladen werden
    // Beispiel: Google Analytics
    if (!document.getElementById('ga-script')) {
      const script = document.createElement('script');
      script.id = 'ga-script';
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID';
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'YOUR_GA_ID', { 'anonymize_ip': true });
    }
  }

  // Analytics-Skripte entladen
  unloadAnalytics() {
    // Google Analytics deaktivieren
    const gaScript = document.getElementById('ga-script');
    if (gaScript) {
      gaScript.remove();
    }
    
    // GA-Cookies löschen
    this.deleteCookie('_ga');
    this.deleteCookie('_gat');
    this.deleteCookie('_gid');
    
    // GA-Objekt zurücksetzen
    window['ga-disable-YOUR_GA_ID'] = true;
  }

  // Marketing-Skripte laden
  loadMarketing() {
    // Hier können Marketing-Skripte geladen werden
    // Beispiel: Facebook Pixel
    if (!document.getElementById('fb-pixel')) {
      const script = document.createElement('script');
      script.id = 'fb-pixel';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }

  // Marketing-Skripte entladen
  unloadMarketing() {
    // Facebook Pixel deaktivieren
    const fbPixel = document.getElementById('fb-pixel');
    if (fbPixel) {
      fbPixel.remove();
    }
    
    // FB-Cookies löschen
    this.deleteCookie('_fbp');
    this.deleteCookie('_fbc');
    
    // FB-Objekt zurücksetzen
    delete window.fbq;
    delete window._fbq;
  }

  // Hilfsfunktion: Cookie setzen
  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = '; expires=' + date.toUTCString();
    document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax; Secure';
  }

  // Hilfsfunktion: Cookie löschen
  deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure';
  }

  // Hilfsfunktion: Prüfen, ob eine Kategorie akzeptiert wurde
  hasConsent(category) {
    const consent = this.getConsent();
    return consent && consent[category] === true;
  }

  // Datenexport für Benutzer (DSGVO-Recht auf Datenportabilität)
  async exportUserData(userId) {
    try {
      const response = await fetch(`/api/users/${userId}/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Exportieren der Benutzerdaten');
      }
      
      const data = await response.json();
      
      // JSON in Datei umwandeln und Download auslösen
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `lemonvows-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Aufräumen
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Fehler beim Exportieren der Benutzerdaten:', error);
      return false;
    }
  }

  // Benutzer löschen (DSGVO-Recht auf Vergessenwerden)
  async deleteUserData(userId, password) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler beim Löschen des Benutzerkontos');
      }
      
      // Lokale Daten löschen
      localStorage.clear();
      sessionStorage.clear();
      
      // Alle Cookies löschen
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        this.deleteCookie(name);
      });
      
      return true;
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzerkontos:', error);
      return false;
    }
  }
}

// Singleton-Instanz exportieren
export const gdprService = new GDPRService();
export default gdprService;
