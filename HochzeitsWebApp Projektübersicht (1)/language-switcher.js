import { i18n } from './i18n.js';

class LanguageSwitcher {
  constructor() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'language-switcher';
    container.innerHTML = `
      <button data-lang="de">DE</button>
      <button data-lang="en">EN</button>
    `;
    document.body.prepend(container);
    this.container = container;
  }

  setupEventListeners() {
    this.container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        i18n.changeLanguage(btn.dataset.lang);
        this.updateActiveState();
      });
    });
  }

  updateActiveState() {
    this.container.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === i18n.lang);
    });
  }
}

// Für Manus: Initialisierung
// new LanguageSwitcher();