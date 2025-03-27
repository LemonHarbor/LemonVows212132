// Zentraler Error Handler
class ErrorHandler {
  static showError(element, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Vorherige Fehler entfernen
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    element.parentElement.appendChild(errorElement);
  }

  static handleAuthError(error) {
    console.error('Auth Error:', error.message);
    // Für Manus: Spezifische Fehlermeldungen implementieren
    return 'Anmeldefehler - Bitte versuchen Sie es später erneut';
  }

  static handleDBError(error) {
    console.error('DB Error:', error.message);
    // Für Manus: Spezifische Fehlermeldungen implementieren
    return 'Datenbankfehler - Bitte versuchen Sie es später erneut';
  }
}

// Beispielintegration:
/*
try {
  // Code der fehlschlagen könnte
} catch (error) {
  const message = ErrorHandler.handleDBError(error);
  ErrorHandler.showError(formElement, message);
}
*/