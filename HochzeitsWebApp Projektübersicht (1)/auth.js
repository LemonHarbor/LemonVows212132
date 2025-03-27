// [Bestehenden Code beibehalten]

class AuthManager {
  // [Existierende Methoden]

  async handleUserLoggedIn(user) {
    this.currentUser = user;
    document.querySelector('.auth-container').style.display = 'none';
    
    // Rollenbasierte Weiterleitung
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (data?.role === 'bestman' || data?.role === 'bestwoman') {
      this.witnessManager = new WitnessManager(data.role);
    } else {
      // Standard-Benutzerbereich laden
      this.loadMainApp();
    }
  }

  loadMainApp() {
    /* Für Manus: Hauptanwendung laden */
  }
}