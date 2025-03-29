import React, { useState } from 'react';
import TablePlannerDemo from '../table-planner-demo/components/TablePlannerDemo';

const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tischplaner' | 'gaeste' | 'budget' | 'checklisten'>('tischplaner');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  const translations = {
    de: {
      title: 'LemonVows - Deine Hochzeitsplanung leicht gemacht',
      subtitle: 'Plane deine perfekte Hochzeit mit unseren interaktiven Tools',
      features: 'Funktionen',
      tablePlanner: 'Tischplaner',
      guestManagement: 'Gästeverwaltung',
      budgetPlanner: 'Budgetplaner',
      checklists: 'Checklisten',
      darkMode: 'Dark Mode',
      language: 'Sprache',
      german: 'Deutsch',
      english: 'Englisch',
      tryDemo: 'Demo ausprobieren',
      getStarted: 'Jetzt starten',
      pricing: 'Preise',
      contact: 'Kontakt',
      tableDescription: 'Erstelle deinen Sitzplan mit unserem interaktiven Drag & Drop Tischplaner',
      guestDescription: 'Verwalte deine Gästeliste und behalte den Überblick über Zu- und Absagen',
      budgetDescription: 'Behalte dein Budget im Blick und plane deine Ausgaben',
      checklistDescription: 'Organisiere deine Aufgaben mit unseren vorgefertigten Checklisten',
      demoTitle: 'Probiere unsere Demo aus',
      demoDescription: 'Erlebe die Funktionen von LemonVows direkt hier',
      demoInstructions: 'Wähle eine Funktion aus, um sie auszuprobieren',
      developerMode: 'Entwicklermodus',
      moreFeatures: 'Weitere Funktionen',
      moreFeaturesList: [
        'Individuelle Hochzeitswebseite für jedes Brautpaar',
        'Interaktive Musikauswahl mit Gäste-Voting',
        'Interner Bereich für die Planung mit Trauzeugen',
        'Einfache Verwaltung ohne Programmierkenntnisse',
        'Mobile-First Design für alle Geräte'
      ],
      testimonials: 'Das sagen unsere Kunden',
      testimonialsList: [
        {
          name: 'Julia & Thomas',
          text: 'LemonVows hat unsere Hochzeitsplanung so viel einfacher gemacht! Besonders der Tischplaner war ein Lebensretter.'
        },
        {
          name: 'Sarah & Michael',
          text: 'Die Gästeverwaltung hat uns geholfen, den Überblick zu behalten. Absolut empfehlenswert!'
        },
        {
          name: 'Lisa & Mark',
          text: 'Dank der Checklisten haben wir nichts vergessen. Die App ist ihr Geld wirklich wert.'
        }
      ],
      pricingPlans: [
        {
          name: 'Basis',
          price: '49€',
          features: [
            'Tischplaner',
            'Gästeverwaltung',
            'Einfache Checklisten',
            '3 Monate Zugang'
          ]
        },
        {
          name: 'Premium',
          price: '99€',
          features: [
            'Alle Basis-Funktionen',
            'Budgetplaner',
            'Erweiterte Checklisten',
            'Eigene Hochzeitswebseite',
            '12 Monate Zugang'
          ]
        },
        {
          name: 'Deluxe',
          price: '149€',
          features: [
            'Alle Premium-Funktionen',
            'Musikvoting-System',
            'Interner Bereich für Trauzeugen',
            'Priorisierter Support',
            'Unbegrenzter Zugang'
          ]
        }
      ],
      footer: {
        about: 'Über uns',
        terms: 'AGB',
        privacy: 'Datenschutz',
        contact: 'Kontakt',
        copyright: '© 2025 LemonVows. Alle Rechte vorbehalten.'
      }
    },
    en: {
      title: 'LemonVows - Wedding Planning Made Easy',
      subtitle: 'Plan your perfect wedding with our interactive tools',
      features: 'Features',
      tablePlanner: 'Table Planner',
      guestManagement: 'Guest Management',
      budgetPlanner: 'Budget Planner',
      checklists: 'Checklists',
      darkMode: 'Dark Mode',
      language: 'Language',
      german: 'German',
      english: 'English',
      tryDemo: 'Try Demo',
      getStarted: 'Get Started',
      pricing: 'Pricing',
      contact: 'Contact',
      tableDescription: 'Create your seating plan with our interactive drag & drop table planner',
      guestDescription: 'Manage your guest list and keep track of RSVPs',
      budgetDescription: 'Keep your budget in check and plan your expenses',
      checklistDescription: 'Organize your tasks with our pre-made checklists',
      demoTitle: 'Try our Demo',
      demoDescription: 'Experience LemonVows features right here',
      demoInstructions: 'Select a feature to try it out',
      developerMode: 'Developer Mode',
      moreFeatures: 'More Features',
      moreFeaturesList: [
        'Individual wedding website for each couple',
        'Interactive music selection with guest voting',
        'Internal area for planning with best men/maids of honor',
        'Easy management without programming knowledge',
        'Mobile-first design for all devices'
      ],
      testimonials: 'What our customers say',
      testimonialsList: [
        {
          name: 'Julia & Thomas',
          text: 'LemonVows made our wedding planning so much easier! Especially the table planner was a lifesaver.'
        },
        {
          name: 'Sarah & Michael',
          text: 'The guest management helped us keep track of everything. Absolutely recommended!'
        },
        {
          name: 'Lisa & Mark',
          text: 'Thanks to the checklists we didn\'t forget anything. The app is really worth its money.'
        }
      ],
      pricingPlans: [
        {
          name: 'Basic',
          price: '€49',
          features: [
            'Table planner',
            'Guest management',
            'Simple checklists',
            '3 months access'
          ]
        },
        {
          name: 'Premium',
          price: '€99',
          features: [
            'All Basic features',
            'Budget planner',
            'Advanced checklists',
            'Custom wedding website',
            '12 months access'
          ]
        },
        {
          name: 'Deluxe',
          price: '€149',
          features: [
            'All Premium features',
            'Music voting system',
            'Internal area for best men/maids of honor',
            'Priority support',
            'Unlimited access'
          ]
        }
      ],
      footer: {
        about: 'About us',
        terms: 'Terms',
        privacy: 'Privacy',
        contact: 'Contact',
        copyright: '© 2025 LemonVows. All rights reserved.'
      }
    }
  };

  const t = translations[language];

  return (
    <div className={`landing-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="landing-page__header">
        <div className="landing-page__logo">
          <img src="/logo.svg" alt="LemonVows Logo" />
          <span>LemonVows</span>
        </div>
        <nav className="landing-page__nav">
          <ul>
            <li><a href="#features">{t.features}</a></li>
            <li><a href="#demo">{t.tryDemo}</a></li>
            <li><a href="#pricing">{t.pricing}</a></li>
            <li><a href="#contact">{t.contact}</a></li>
          </ul>
        </nav>
        <div className="landing-page__settings">
          <div className="landing-page__language-selector">
            <span>{t.language}:</span>
            <button 
              className={language === 'de' ? 'active' : ''} 
              onClick={() => setLanguage('de')}
            >
              {t.german}
            </button>
            <button 
              className={language === 'en' ? 'active' : ''} 
              onClick={() => setLanguage('en')}
            >
              {t.english}
            </button>
          </div>
          <div className="landing-page__theme-toggle">
            <span>{t.darkMode}:</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </header>

      <section className="landing-page__hero">
        <div className="landing-page__hero-content">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="landing-page__hero-buttons">
            <a href="#demo" className="landing-page__button landing-page__button--primary">
              {t.tryDemo}
            </a>
            <a href="#pricing" className="landing-page__button landing-page__button--secondary">
              {t.getStarted}
            </a>
          </div>
        </div>
        <div className="landing-page__hero-image">
          <img src="/hero-image.jpg" alt="Wedding Planning" />
        </div>
      </section>

      <section id="features" className="landing-page__features">
        <h2>{t.features}</h2>
        <div className="landing-page__features-grid">
          <div className="landing-page__feature-card">
            <div className="landing-page__feature-icon">
              <img src="/icons/table.svg" alt="Table Planner" />
            </div>
            <h3>{t.tablePlanner}</h3>
            <p>{t.tableDescription}</p>
          </div>
          <div className="landing-page__feature-card">
            <div className="landing-page__feature-icon">
              <img src="/icons/guests.svg" alt="Guest Management" />
            </div>
            <h3>{t.guestManagement}</h3>
            <p>{t.guestDescription}</p>
          </div>
          <div className="landing-page__feature-card">
            <div className="landing-page__feature-icon">
              <img src="/icons/budget.svg" alt="Budget Planner" />
            </div>
            <h3>{t.budgetPlanner}</h3>
            <p>{t.budgetDescription}</p>
          </div>
          <div className="landing-page__feature-card">
            <div className="landing-page__feature-icon">
              <img src="/icons/checklist.svg" alt="Checklists" />
            </div>
            <h3>{t.checklists}</h3>
            <p>{t.checklistDescription}</p>
          </div>
        </div>
      </section>

      <section id="demo" className="landing-page__demo">
        <h2>{t.demoTitle}</h2>
        <p className="landing-page__demo-description">{t.demoDescription}</p>
        
        <div className="landing-page__demo-tabs">
          <button 
            className={activeTab === 'tischplaner' ? 'active' : ''} 
            onClick={() => setActiveTab('tischplaner')}
          >
            {t.tablePlanner}
          </button>
          <button 
            className={activeTab === 'gaeste' ? 'active' : ''} 
            onClick={() => setActiveTab('gaeste')}
          >
            {t.guestManagement}
          </button>
          <button 
            className={activeTab === 'budget' ? 'active' : ''} 
            onClick={() => setActiveTab('budget')}
          >
            {t.budgetPlanner}
          </button>
          <button 
            className={activeTab === 'checklisten' ? 'active' : ''} 
            onClick={() => setActiveTab('checklisten')}
          >
            {t.checklists}
          </button>
        </div>
        
        <div className="landing-page__demo-content">
          <p className="landing-page__demo-instructions">{t.demoInstructions}</p>
          
          {activeTab === 'tischplaner' && (
            <div className="landing-page__demo-feature">
              <TablePlannerDemo />
            </div>
          )}
          
          {activeTab === 'gaeste' && (
            <div className="landing-page__demo-feature">
              <div className="landing-page__demo-placeholder">
                <h3>{t.guestManagement}</h3>
                <p>{t.guestDescription}</p>
                <button className="landing-page__button landing-page__button--primary">
                  {t.developerMode}
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'budget' && (
            <div className="landing-page__demo-feature">
              <div className="landing-page__demo-placeholder">
                <h3>{t.budgetPlanner}</h3>
                <p>{t.budgetDescription}</p>
                <button className="landing-page__button landing-page__button--primary">
                  {t.developerMode}
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'checklisten' && (
            <div className="landing-page__demo-feature">
              <div className="landing-page__demo-placeholder">
                <h3>{t.checklists}</h3>
                <p>{t.checklistDescription}</p>
                <button className="landing-page__button landing-page__button--primary">
                  {t.developerMode}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="landing-page__more-features">
        <h2>{t.moreFeatures}</h2>
        <ul className="landing-page__more-features-list">
          {t.moreFeaturesList.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="landing-page__testimonials">
        <h2>{t.testimonials}</h2>
        <div className="landing-page__testimonials-grid">
          {t.testimonialsList.map((testimonial, index) => (
            <div key={index} className="landing-page__testimonial-card">
              <div className="landing-page__testimonial-text">"{testimonial.text}"</div>
              <div className="landing-page__testimonial-author">- {testimonial.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="landing-page__pricing">
        <h2>{t.pricing}</h2>
        <div className="landing-page__pricing-grid">
          {t.pricingPlans.map((plan, index) => (
            <div key={index} className={`landing-page__pricing-card ${index === 1 ? 'landing-page__pricing-card--featured' : ''}`}>
              <h3>{plan.name}</h3>
              <div className="landing-page__pricing-price">{plan.price}</div>
              <ul className="landing-page__pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              <button className="landing-page__button landing-page__button--primary">
                {t.getStarted}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="landing-page__contact">
        <h2>{t.contact}</h2>
        <form className="landing-page__contact-form">
          <div className="landing-page__form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="landing-page__form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="landing-page__form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5}></textarea>
          </div>
          <button type="submit" className="landing-page__button landing-page__button--primary">
            Send
          </button>
        </form>
      </section>

      <footer className="landing-page__footer">
        <div className="landing-page__footer-links">
          <a href="#">{t.footer.about}</a>
          <a href="#">{t.footer.terms}</a>
          <a href="#">{t.footer.privacy}</a>
          <a href="#">{t.footer.contact}</a>
        </div>
        <div className="landing-page__footer-copyright">
          {t.footer.copyright}
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          background-color: #fff;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .landing-page.dark-mode {
          background-color: #121212;
          color: #f5f5f5;
        }

        .landing-page.dark-mode .landing-page__header,
        .landing-page.dark-mode .landing-page__feature-card,
        .landing-page.dark-mode .landing-page__testimonial-card,
        .landing-page.dark-mode .landing-page__pricing-card,
        .landing-page.dark-mode .landing-page__demo-tabs button,
        .landing-page.dark-mode .landing-page__demo-placeholder {
          background-color: #1e1e1e;
          color: #f5f5f5;
        }

        .landing-page.dark-mode .landing-page__nav a,
        .landing-page.dark-mode .landing-page__settings {
          color: #f5f5f5;
        }

        .landing-page.dark-mode .landing-page__button--secondary {
          background-color: #333;
          color: #f5f5f5;
        }

        .landing-page.dark-mode input,
        .landing-page.dark-mode textarea {
          background-color: #333;
          color: #f5f5f5;
          border-color: #555;
        }

        .landing-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .landing-page__logo {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffbd00;
        }

        .landing-page__logo img {
          height: 40px;
          margin-right: 0.5rem;
        }

        .landing-page__nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .landing-page__nav li {
          margin: 0 1rem;
        }

        .landing-page__nav a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .landing-page__nav a:hover {
          color: #ffbd00;
        }

        .landing-page__settings {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .landing-page__language-selector,
        .landing-page__theme-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .landing-page__language-selector button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .landing-page__language-selector button:hover {
          background-color: #f5f5f5;
        }

        .landing-page__language-selector button.active {
          background-color: #ffbd00;
          color: white;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #ffbd00;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .slider.round {
          border-radius: 24px;
        }

        .slider.round:before {
          border-radius: 50%;
        }

        .landing-page__hero {
          display: flex;
          align-items: center;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .landing-page__hero-content {
          flex: 1;
          padding-right: 2rem;
        }

        .landing-page__hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #ffbd00;
        }

        .landing-page__hero p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .landing-page__hero-buttons {
          display: flex;
          gap: 1rem;
        }

        .landing-page__hero-image {
          flex: 1;
        }

        .landing-page__hero-image img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .landing-page__button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .landing-page__button--primary {
          background-color: #ffbd00;
          color: white;
          border: none;
        }

        .landing-page__button--primary:hover {
          background-color: #e6a800;
        }

        .landing-page__button--secondary {
          background-color: #f5f5f5;
          color: #333;
          border: none;
        }

        .landing-page__button--secondary:hover {
          background-color: #e9e9e9;
        }

        .landing-page__features,
        .landing-page__more-features,
        .landing-page__testimonials,
        .landing-page__pricing,
        .landing-page__contact,
        .landing-page__demo {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .landing-page__features h2,
        .landing-page__more-features h2,
        .landing-page__testimonials h2,
        .landing-page__pricing h2,
        .landing-page__contact h2,
        .landing-page__demo h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2.5rem;
          color: #ffbd00;
        }

        .landing-page__features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .landing-page__feature-card {
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .landing-page__feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .landing-page__feature-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 1rem;
        }

        .landing-page__feature-icon img {
          width: 100%;
          height: 100%;
        }

        .landing-page__feature-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .landing-page__feature-card p {
          color: #666;
          line-height: 1.6;
        }

        .landing-page__demo-description {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .landing-page__demo-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .landing-page__demo-tabs button {
          padding: 0.75rem 1.5rem;
          background-color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .landing-page__demo-tabs button:hover {
          background-color: #f5f5f5;
        }

        .landing-page__demo-tabs button.active {
          background-color: #ffbd00;
          color: white;
        }

        .landing-page__demo-instructions {
          text-align: center;
          margin-bottom: 2rem;
          font-style: italic;
        }

        .landing-page__demo-feature {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .landing-page__demo-placeholder {
          background-color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .landing-page__demo-placeholder h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .landing-page__demo-placeholder p {
          margin-bottom: 2rem;
          color: #666;
        }

        .landing-page__more-features-list {
          max-width: 800px;
          margin: 0 auto;
          padding-left: 2rem;
        }

        .landing-page__more-features-list li {
          margin-bottom: 1rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .landing-page__testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .landing-page__testimonial-card {
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .landing-page__testimonial-text {
          font-style: italic;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .landing-page__testimonial-author {
          font-weight: 500;
          text-align: right;
        }

        .landing-page__pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .landing-page__pricing-card {
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .landing-page__pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .landing-page__pricing-card--featured {
          border: 2px solid #ffbd00;
          transform: scale(1.05);
        }

        .landing-page__pricing-card--featured:hover {
          transform: translateY(-5px) scale(1.05);
        }

        .landing-page__pricing-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .landing-page__pricing-price {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #ffbd00;
        }

        .landing-page__pricing-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          text-align: left;
        }

        .landing-page__pricing-features li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }

        .landing-page__pricing-features li:before {
          content: "✓";
          color: #ffbd00;
          margin-right: 0.5rem;
        }

        .landing-page__contact-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .landing-page__form-group {
          margin-bottom: 1.5rem;
        }

        .landing-page__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .landing-page__form-group input,
        .landing-page__form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: inherit;
        }

        .landing-page__footer {
          background-color: #f5f5f5;
          padding: 2rem;
          text-align: center;
        }

        .landing-page.dark-mode .landing-page__footer {
          background-color: #1e1e1e;
        }

        .landing-page__footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .landing-page__footer-links a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .landing-page__footer-links a:hover {
          color: #ffbd00;
        }

        .landing-page__footer-copyright {
          color: #999;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .landing-page__header {
            flex-direction: column;
            padding: 1rem;
          }

          .landing-page__logo {
            margin-bottom: 1rem;
          }

          .landing-page__nav {
            margin-bottom: 1rem;
          }

          .landing-page__nav ul {
            flex-wrap: wrap;
            justify-content: center;
          }

          .landing-page__settings {
            flex-direction: column;
            gap: 0.5rem;
          }

          .landing-page__hero {
            flex-direction: column;
            padding: 2rem 1rem;
          }

          .landing-page__hero-content {
            padding-right: 0;
            margin-bottom: 2rem;
          }

          .landing-page__hero h1 {
            font-size: 2rem;
          }

          .landing-page__hero p {
            font-size: 1rem;
          }

          .landing-page__features,
          .landing-page__more-features,
          .landing-page__testimonials,
          .landing-page__pricing,
          .landing-page__contact,
          .landing-page__demo {
            padding: 2rem 1rem;
          }

          .landing-page__features h2,
          .landing-page__more-features h2,
          .landing-page__testimonials h2,
          .landing-page__pricing h2,
          .landing-page__contact h2,
          .landing-page__demo h2 {
            font-size: 1.8rem;
          }

          .landing-page__demo-tabs {
            flex-direction: column;
            width: 100%;
          }

          .landing-page__demo-tabs button {
            width: 100%;
          }

          .landing-page__pricing-card--featured {
            transform: none;
          }

          .landing-page__pricing-card--featured:hover {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
