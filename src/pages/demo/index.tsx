import React, { useState } from 'react';
import { TablePlanner } from '../../components/sections/TablePlanner';
import { GuestManagement } from '../../components/sections/GuestManagement';
import { BudgetPlanner } from '../../components/sections/BudgetPlanner';
import { ChecklistsComponent } from '../../components/sections/Checklists';
import demoContent from '../../data/demo-content.json';

const DemoPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState('tablePlanner');
  const [showContactForm, setShowContactForm] = useState(false);
  
  const renderFeatureDemo = () => {
    switch (activeFeature) {
      case 'tablePlanner':
        return <TablePlanner />;
      case 'guestManagement':
        return <GuestManagement />;
      case 'budgetPlanner':
        return <BudgetPlanner />;
      case 'checklists':
        return <ChecklistsComponent />;
      default:
        return <TablePlanner />;
    }
  };
  
  const renderFeatureDescription = () => {
    const feature = demoContent.features[activeFeature as keyof typeof demoContent.features];
    
    return (
      <div className="demo-page__feature-info">
        <h2>{feature.title}</h2>
        <p>{feature.description}</p>
        
        <ul className="demo-page__feature-highlights">
          {feature.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="demo-page">
      <header className="demo-page__header">
        <div className="demo-page__logo">
          <img src="/logo.png" alt="LemonVows Logo" />
        </div>
        <h1 className="demo-page__title">{demoContent.title}</h1>
        <p className="demo-page__subtitle">{demoContent.subtitle}</p>
        <div className="demo-page__cta">
          <button className="btn btn-primary" onClick={() => setShowContactForm(true)}>
            {demoContent.ctaSection.tryFree}
          </button>
          <button className="btn btn-outline-light">
            {demoContent.ctaSection.viewPricing}
          </button>
        </div>
      </header>
      
      <nav className="demo-page__features-nav">
        <button 
          className={`demo-page__feature-button ${activeFeature === 'tablePlanner' ? 'active' : ''}`}
          onClick={() => setActiveFeature('tablePlanner')}
        >
          <span className="demo-page__feature-icon">🪑</span>
          Tischplan
        </button>
        <button 
          className={`demo-page__feature-button ${activeFeature === 'guestManagement' ? 'active' : ''}`}
          onClick={() => setActiveFeature('guestManagement')}
        >
          <span className="demo-page__feature-icon">👥</span>
          Gästeverwaltung
        </button>
        <button 
          className={`demo-page__feature-button ${activeFeature === 'budgetPlanner' ? 'active' : ''}`}
          onClick={() => setActiveFeature('budgetPlanner')}
        >
          <span className="demo-page__feature-icon">💰</span>
          Budgetplaner
        </button>
        <button 
          className={`demo-page__feature-button ${activeFeature === 'checklists' ? 'active' : ''}`}
          onClick={() => setActiveFeature('checklists')}
        >
          <span className="demo-page__feature-icon">✓</span>
          Checklisten
        </button>
      </nav>
      
      <section className="demo-page__feature-description">
        {renderFeatureDescription()}
      </section>
      
      <section className="demo-page__feature-demo">
        {renderFeatureDemo()}
      </section>
      
      <section className="demo-page__pricing">
        <h2>{demoContent.pricing.title}</h2>
        <p>{demoContent.pricing.subtitle}</p>
        
        <div className="demo-page__pricing-plans">
          {Object.entries(demoContent.pricing.plans).map(([key, plan]: [string, any]) => (
            <div 
              key={key} 
              className={`demo-page__pricing-plan ${key === 'basic' ? 'demo-page__pricing-plan--popular' : ''}`}
            >
              {key === 'basic' && (
                <div className="demo-page__pricing-plan-badge">{demoContent.pricing.popular}</div>
              )}
              
              <div className="demo-page__pricing-plan-header">
                <h3>{plan.title}</h3>
                <div className="demo-page__pricing-plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>
              
              <div className="demo-page__pricing-plan-features">
                <ul>
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="demo-page__pricing-plan-cta">
                <button className="btn btn-primary">{plan.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="demo-page__testimonials">
        <h2>{demoContent.testimonials.title}</h2>
        
        <div className="demo-page__testimonials-list">
          {demoContent.testimonials.list.map((testimonial: any, index: number) => (
            <div key={index} className="demo-page__testimonial">
              <div className="demo-page__testimonial-content">
                "{testimonial.content}"
              </div>
              <div className="demo-page__testimonial-author">
                <div className="demo-page__testimonial-avatar">
                  <img src={`/avatars/avatar-${index + 1}.jpg`} alt={testimonial.name} />
                </div>
                <div className="demo-page__testimonial-info">
                  <div className="demo-page__testimonial-name">{testimonial.name}</div>
                  <div className="demo-page__testimonial-location">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="demo-page__faq">
        <h2>{demoContent.faq.title}</h2>
        
        <div className="demo-page__faq-list">
          {demoContent.faq.items.map((item: any, index: number) => (
            <div key={index} className="demo-page__faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="demo-page__cta-section">
        <h2>{demoContent.ctaSection.title}</h2>
        <p>{demoContent.ctaSection.subtitle}</p>
        
        <div className="demo-page__cta-buttons">
          <button className="btn btn-light" onClick={() => setShowContactForm(true)}>
            {demoContent.ctaSection.tryFree}
          </button>
          <button className="btn btn-outline-light">
            {demoContent.ctaSection.viewPricing}
          </button>
        </div>
      </section>
      
      <footer className="demo-page__footer">
        <div className="demo-page__footer-logo">
          <img src="/logo.png" alt="LemonVows Logo" />
        </div>
        
        <div className="demo-page__footer-links">
          <div className="demo-page__footer-links-column">
            <h3>{demoContent.footer.features}</h3>
            <ul>
              <li><a href="#tablePlanner">Tischplan</a></li>
              <li><a href="#guestManagement">Gästeverwaltung</a></li>
              <li><a href="#budgetPlanner">Budgetplaner</a></li>
              <li><a href="#checklists">Checklisten</a></li>
            </ul>
          </div>
          
          <div className="demo-page__footer-links-column">
            <h3>{demoContent.footer.company}</h3>
            <ul>
              <li><a href="#about">{demoContent.footer.about}</a></li>
              <li><a href="#contact">{demoContent.footer.contact}</a></li>
              <li><a href="#blog">{demoContent.footer.blog}</a></li>
              <li><a href="#careers">{demoContent.footer.careers}</a></li>
            </ul>
          </div>
          
          <div className="demo-page__footer-links-column">
            <h3>{demoContent.footer.legal}</h3>
            <ul>
              <li><a href="#terms">{demoContent.footer.terms}</a></li>
              <li><a href="#privacy">{demoContent.footer.privacy}</a></li>
              <li><a href="#cookies">{demoContent.footer.cookies}</a></li>
            </ul>
          </div>
          
          <div className="demo-page__footer-links-column">
            <h3>{demoContent.footer.social}</h3>
            <div className="demo-page__social-links">
              <a href="#facebook">F</a>
              <a href="#instagram">I</a>
              <a href="#twitter">T</a>
              <a href="#pinterest">P</a>
            </div>
          </div>
        </div>
        
        <div className="demo-page__footer-bottom">
          <p>&copy; 2025 LemonVows. {demoContent.footer.copyright}</p>
          
          <div className="demo-page__language-selector">
            <select>
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </footer>
      
      {showContactForm && (
        <div className="demo-page__modal">
          <div className="demo-page__modal-content">
            <button 
              className="demo-page__modal-close"
              onClick={() => setShowContactForm(false)}
            >
              ×
            </button>
            
            <h2>{demoContent.contactForm.title}</h2>
            <p>{demoContent.contactForm.subtitle}</p>
            
            <form className="demo-page__contact-form">
              <div className="form-group">
                <label htmlFor="name">{demoContent.contactForm.name}</label>
                <input type="text" id="name" className="input" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{demoContent.contactForm.email}</label>
                <input type="email" id="email" className="input" />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">{demoContent.contactForm.phone}</label>
                <input type="tel" id="phone" className="input" />
              </div>
              
              <div className="form-group">
                <label htmlFor="weddingDate">{demoContent.contactForm.weddingDate}</label>
                <input type="date" id="weddingDate" className="input" />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{demoContent.contactForm.message}</label>
                <textarea id="message" className="textarea" rows={5}></textarea>
              </div>
              
              <div className="form-group--checkbox">
                <input type="checkbox" id="privacy" />
                <label htmlFor="privacy">{demoContent.contactForm.privacyConsent}</label>
              </div>
              
              <button type="submit" className="btn btn-primary">
                {demoContent.contactForm.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPage;
