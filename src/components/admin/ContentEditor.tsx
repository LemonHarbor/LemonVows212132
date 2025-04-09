import React, { useState } from 'react';

interface ContentEditorProps {
  content?: any;
  onSave?: (content: any) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ 
  content = {}, 
  onSave = () => {} 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [editedContent, setEditedContent] = useState(content);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (section: string, field: string, value: string) => {
    setEditedContent({
      ...editedContent,
      [section]: {
        ...editedContent[section],
        [field]: value
      }
    });
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: string) => {
    setEditedContent({
      ...editedContent,
      [section]: {
        ...editedContent[section],
        [subsection]: {
          ...editedContent[section]?.[subsection],
          [field]: value
        }
      }
    });
  };

  const handleArrayItemChange = (section: string, arrayName: string, index: number, field: string, value: string) => {
    const newArray = [...(editedContent[section]?.[arrayName] || [])];
    newArray[index] = {
      ...newArray[index],
      [field]: value
    };

    setEditedContent({
      ...editedContent,
      [section]: {
        ...editedContent[section],
        [arrayName]: newArray
      }
    });
  };

  const handleAddArrayItem = (section: string, arrayName: string, template: any) => {
    const newArray = [...(editedContent[section]?.[arrayName] || []), { ...template }];

    setEditedContent({
      ...editedContent,
      [section]: {
        ...editedContent[section],
        [arrayName]: newArray
      }
    });
  };

  const handleRemoveArrayItem = (section: string, arrayName: string, index: number) => {
    const newArray = [...(editedContent[section]?.[arrayName] || [])];
    newArray.splice(index, 1);

    setEditedContent({
      ...editedContent,
      [section]: {
        ...editedContent[section],
        [arrayName]: newArray
      }
    });
  };

  const handleSave = () => {
    onSave(editedContent);
    setSuccessMessage('Änderungen erfolgreich gespeichert!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="content-editor">
      <div className="content-editor__header">
        <h2>Content-Editor</h2>
        <div className="content-editor__actions">
          {successMessage && (
            <span className="content-editor__success-message">{successMessage}</span>
          )}
          <button className="btn btn-primary" onClick={handleSave}>Speichern</button>
        </div>
      </div>
      
      <div className="content-editor__tabs">
        <button 
          className={`content-editor__tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Allgemein
        </button>
        <button 
          className={`content-editor__tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          Features
        </button>
        <button 
          className={`content-editor__tab ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Preise
        </button>
        <button 
          className={`content-editor__tab ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials
        </button>
        <button 
          className={`content-editor__tab ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
        <button 
          className={`content-editor__tab ${activeTab === 'cta' ? 'active' : ''}`}
          onClick={() => setActiveTab('cta')}
        >
          CTA
        </button>
        <button 
          className={`content-editor__tab ${activeTab === 'footer' ? 'active' : ''}`}
          onClick={() => setActiveTab('footer')}
        >
          Footer
        </button>
      </div>
      
      <div className="content-editor__content">
        {activeTab === 'general' && (
          <div className="content-editor__section">
            <h3>Allgemeine Einstellungen</h3>
            
            <div className="form-group">
              <label htmlFor="title">Titel</label>
              <input
                type="text"
                id="title"
                value={editedContent.title || ''}
                onChange={(e) => handleInputChange('', 'title', e.target.value)}
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subtitle">Untertitel</label>
              <textarea
                id="subtitle"
                value={editedContent.subtitle || ''}
                onChange={(e) => handleInputChange('', 'subtitle', e.target.value)}
                className="textarea"
                rows={3}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'features' && (
          <div className="content-editor__section">
            <h3>Features</h3>
            
            {Object.keys(editedContent.features || {}).map((featureKey) => (
              <div key={featureKey} className="content-editor__subsection">
                <h4>{editedContent.features[featureKey].title || featureKey}</h4>
                
                <div className="form-group">
                  <label htmlFor={`feature-${featureKey}-title`}>Titel</label>
                  <input
                    type="text"
                    id={`feature-${featureKey}-title`}
                    value={editedContent.features[featureKey].title || ''}
                    onChange={(e) => handleNestedInputChange('features', featureKey, 'title', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`feature-${featureKey}-description`}>Beschreibung</label>
                  <textarea
                    id={`feature-${featureKey}-description`}
                    value={editedContent.features[featureKey].description || ''}
                    onChange={(e) => handleNestedInputChange('features', featureKey, 'description', e.target.value)}
                    className="textarea"
                    rows={4}
                  />
                </div>
                
                <div className="array-editor">
                  <div className="array-editor__header">
                    <h3>Highlights</h3>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleAddArrayItem('features', `${featureKey}.highlights`, '')}
                    >
                      Highlight hinzufügen
                    </button>
                  </div>
                  
                  <div className="array-editor__items">
                    {(editedContent.features[featureKey].highlights || []).map((highlight: string, index: number) => (
                      <div key={index} className="array-editor__item">
                        <div className="array-editor__item-header">
                          <span className="array-editor__item-number">Highlight {index + 1}</span>
                          <button 
                            className="array-editor__item-remove"
                            onClick={() => handleRemoveArrayItem('features', `${featureKey}.highlights`, index)}
                          >
                            Entfernen
                          </button>
                        </div>
                        <div className="array-editor__item-content">
                          <div className="form-group">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => handleArrayItemChange('features', `${featureKey}.highlights`, index, '', e.target.value)}
                              className="input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'pricing' && (
          <div className="content-editor__section">
            <h3>Preispläne</h3>
            
            <div className="content-editor__subsection">
              <h4>Überschriften</h4>
              
              <div className="form-group">
                <label htmlFor="pricing-title">Titel</label>
                <input
                  type="text"
                  id="pricing-title"
                  value={editedContent.pricing?.title || ''}
                  onChange={(e) => handleNestedInputChange('pricing', '', 'title', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pricing-subtitle">Untertitel</label>
                <textarea
                  id="pricing-subtitle"
                  value={editedContent.pricing?.subtitle || ''}
                  onChange={(e) => handleNestedInputChange('pricing', '', 'subtitle', e.target.value)}
                  className="textarea"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pricing-popular">Text für beliebten Plan</label>
                <input
                  type="text"
                  id="pricing-popular"
                  value={editedContent.pricing?.popular || ''}
                  onChange={(e) => handleNestedInputChange('pricing', '', 'popular', e.target.value)}
                  className="input"
                />
              </div>
            </div>
            
            {Object.keys(editedContent.pricing?.plans || {}).map((planKey) => (
              <div key={planKey} className="content-editor__subsection">
                <h4>{editedContent.pricing.plans[planKey].title || planKey}</h4>
                
                <div className="form-group">
                  <label htmlFor={`plan-${planKey}-title`}>Titel</label>
                  <input
                    type="text"
                    id={`plan-${planKey}-title`}
                    value={editedContent.pricing.plans[planKey].title || ''}
                    onChange={(e) => handleNestedInputChange('pricing', `plans.${planKey}`, 'title', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`plan-${planKey}-price`}>Preis</label>
                  <input
                    type="text"
                    id={`plan-${planKey}-price`}
                    value={editedContent.pricing.plans[planKey].price || ''}
                    onChange={(e) => handleNestedInputChange('pricing', `plans.${planKey}`, 'price', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`plan-${planKey}-period`}>Zeitraum</label>
                  <input
                    type="text"
                    id={`plan-${planKey}-period`}
                    value={editedContent.pricing.plans[planKey].period || ''}
                    onChange={(e) => handleNestedInputChange('pricing', `plans.${planKey}`, 'period', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`plan-${planKey}-cta`}>Call-to-Action Text</label>
                  <input
                    type="text"
                    id={`plan-${planKey}-cta`}
                    value={editedContent.pricing.plans[planKey].cta || ''}
                    onChange={(e) => handleNestedInputChange('pricing', `plans.${planKey}`, 'cta', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div className="array-editor">
                  <div className="array-editor__header">
                    <h3>Features</h3>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleAddArrayItem('pricing', `plans.${planKey}.features`, '')}
                    >
                      Feature hinzufügen
                    </button>
                  </div>
                  
                  <div className="array-editor__items">
                    {(editedContent.pricing.plans[planKey].features || []).map((feature: string, index: number) => (
                      <div key={index} className="array-editor__item">
                        <div className="array-editor__item-header">
                          <span className="array-editor__item-number">Feature {index + 1}</span>
                          <button 
                            className="array-editor__item-remove"
                            onClick={() => handleRemoveArrayItem('pricing', `plans.${planKey}.features`, index)}
                          >
                            Entfernen
                          </button>
                        </div>
                        <div className="array-editor__item-content">
                          <div className="form-group">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => handleArrayItemChange('pricing', `plans.${planKey}.features`, index, '', e.target.value)}
                              className="input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'testimonials' && (
          <div className="content-editor__section">
            <h3>Testimonials</h3>
            
            <div className="content-editor__subsection">
              <div className="form-group">
                <label htmlFor="testimonials-title">Titel</label>
                <input
                  type="text"
                  id="testimonials-title"
                  value={editedContent.testimonials?.title || ''}
                  onChange={(e) => handleNestedInputChange('testimonials', '', 'title', e.target.value)}
                  className="input"
                />
              </div>
            </div>
            
            <div className="array-editor">
              <div className="array-editor__header">
                <h3>Kundenstimmen</h3>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleAddArrayItem('testimonials', 'list', { content: '', name: '', location: '' })}
                >
                  Testimonial hinzufügen
                </button>
              </div>
              
              <div className="array-editor__items">
                {(editedContent.testimonials?.list || []).map((testimonial: any, index: number) => (
                  <div key={index} className="array-editor__item">
                    <div className="array-editor__item-header">
                      <span className="array-editor__item-number">Testimonial {index + 1}</span>
                      <button 
                        className="array-editor__item-remove"
                        onClick={() => handleRemoveArrayItem('testimonials', 'list', index)}
                      >
                        Entfernen
                      </button>
                    </div>
                    <div className="array-editor__item-content">
                      <div className="form-group">
                        <label htmlFor={`testimonial-${index}-content`}>Inhalt</label>
                        <textarea
                          id={`testimonial-${index}-content`}
                          value={testimonial.content || ''}
                          onChange={(e) => handleArrayItemChange('testimonials', 'list', index, 'content', e.target.value)}
                          className="textarea"
                          rows={4}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor={`testimonial-${index}-name`}>Name</label>
                        <input
                          type="text"
                          id={`testimonial-${index}-name`}
                          value={testimonial.name || ''}
                          onChange={(e) => handleArrayItemChange('testimonials', 'list', index, 'name', e.target.value)}
                          className="input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor={`testimonial-${index}-location`}>Ort</label>
                        <input
                          type="text"
                          id={`testimonial-${index}-location`}
                          value={testimonial.location || ''}
                          onChange={(e) => handleArrayItemChange('testimonials', 'list', index, 'location', e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'faq' && (
          <div className="content-editor__section">
            <h3>FAQ</h3>
            
            <div className="content-editor__subsection">
              <div className="form-group">
                <label htmlFor="faq-title">Titel</label>
                <input
                  type="text"
                  id="faq-title"
                  value={editedContent.faq?.title || ''}
                  onChange={(e) => handleNestedInputChange('faq', '', 'title', e.target.value)}
                  className="input"
                />
              </div>
            </div>
            
            <div className="array-editor">
              <div className="array-editor__header">
                <h3>Fragen</h3>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleAddArrayItem('faq', 'items', { question: '', answer: '' })}
                >
                  Frage hinzufügen
                </button>
              </div>
              
              <div className="array-editor__items">
                {(editedContent.faq?.items || []).map((item: any, index: number) => (
                  <div key={index} className="array-editor__item">
                    <div className="array-editor__item-header">
                      <span className="array-editor__item-number">Frage {index + 1}</span>
                      <button 
                        className="array-editor__item-remove"
                        onClick={() => handleRemoveArrayItem('faq', 'items', index)}
                      >
                        Entfernen
                      </button>
                    </div>
                    <div className="array-editor__item-content">
                      <div className="form-group">
                        <label htmlFor={`faq-${index}-question`}>Frage</label>
                        <input
                          type="text"
                          id={`faq-${index}-question`}
                          value={item.question || ''}
                          onChange={(e) => handleArrayItemChange('faq', 'items', index, 'question', e.target.value)}
                          className="input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor={`faq-${index}-answer`}>Antwort</label>
                        <textarea
                          id={`faq-${index}-answer`}
                          value={item.answer || ''}
                          onChange={(e) => handleArrayItemChange('faq', 'items', index, 'answer', e.target.value)}
                          className="textarea"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cta' && (
          <div className="content-editor__section">
            <h3>Call-to-Action Bereich</h3>
            
            <div className="content-editor__subsection">
              <div className="form-group">
                <label htmlFor="cta-title">Titel</label>
                <input
                  type="text"
                  id="cta-title"
                  value={editedContent.ctaSection?.title || ''}
                  onChange={(e) => handleNestedInputChange('ctaSection', '', 'title', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cta-subtitle">Untertitel</label>
                <textarea
                  id="cta-subtitle"
                  value={editedContent.ctaSection?.subtitle || ''}
                  onChange={(e) => handleNestedInputChange('ctaSection', '', 'subtitle', e.target.value)}
                  className="textarea"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cta-try-free">Text für "Kostenlos testen" Button</label>
                <input
                  type="text"
                  id="cta-try-free"
                  value={editedContent.ctaSection?.tryFree || ''}
                  onChange={(e) => handleNestedInputChange('ctaSection', '', 'tryFree', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cta-view-pricing">Text für "Preise ansehen" Button</label>
                <input
                  type="text"
                  id="cta-view-pricing"
                  value={editedContent.ctaSection?.viewPricing || ''}
                  onChange={(e) => handleNestedInputChange('ctaSection', '', 'viewPricing', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'footer' && (
          <div className="content-editor__section">
            <h3>Footer</h3>
            
            <div className="content-editor__subsection">
              <div className="form-group">
                <label htmlFor="footer-features">Features Text</label>
                <input
                  type="text"
                  id="footer-features"
                  value={editedContent.footer?.features || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'features', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-company">Unternehmen Text</label>
                <input
                  type="text"
                  id="footer-company"
                  value={editedContent.footer?.company || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'company', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-about">Über uns Text</label>
                <input
                  type="text"
                  id="footer-about"
                  value={editedContent.footer?.about || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'about', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-contact">Kontakt Text</label>
                <input
                  type="text"
                  id="footer-contact"
                  value={editedContent.footer?.contact || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'contact', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-blog">Blog Text</label>
                <input
                  type="text"
                  id="footer-blog"
                  value={editedContent.footer?.blog || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'blog', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-careers">Karriere Text</label>
                <input
                  type="text"
                  id="footer-careers"
                  value={editedContent.footer?.careers || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'careers', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-legal">Rechtliches Text</label>
                <input
                  type="text"
                  id="footer-legal"
                  value={editedContent.footer?.legal || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'legal', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-terms">AGB Text</label>
                <input
                  type="text"
                  id="footer-terms"
                  value={editedContent.footer?.terms || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'terms', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-privacy">Datenschutz Text</label>
                <input
                  type="text"
                  id="footer-privacy"
                  value={editedContent.footer?.privacy || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'privacy', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-cookies">Cookies Text</label>
                <input
                  type="text"
                  id="footer-cookies"
                  value={editedContent.footer?.cookies || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'cookies', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-social">Social Media Text</label>
                <input
                  type="text"
                  id="footer-social"
                  value={editedContent.footer?.social || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'social', e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="footer-copyright">Copyright Text</label>
                <input
                  type="text"
                  id="footer-copyright"
                  value={editedContent.footer?.copyright || ''}
                  onChange={(e) => handleNestedInputChange('footer', '', 'copyright', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
