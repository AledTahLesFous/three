/**
 * Menu principal du jeu
 * Affiche les options de mode de jeu
 */
export class Menu {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'menu';
    this.selectedMode = null;
  }

  show() {
    this.container.innerHTML = `
      <div class="menu-content">
        <h1 class="menu-title">SPACE SHOOTER 3D</h1>
        <p class="menu-subtitle">Bienvenue Commandant</p>
        
        <div class="menu-buttons">
          <button class="menu-btn mode-btn" data-mode="normal">
            <span class="btn-title">🎮 Mode Normal</span>
            <span class="btn-desc">Campagne avec niveaux et objectifs</span>
          </button>
          
          <button class="menu-btn mode-btn" data-mode="playground">
            <span class="btn-title">🎪 Mode Playground</span>
            <span class="btn-desc">Vague infinie, pas de limite de temps</span>
          </button>
        </div>
        
        <div class="menu-footer">
          <p>Contrôles: WASD pour se déplacer | Souris pour viser | Clic pour tirer</p>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Ajouter les event listeners
    this.container.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.selectedMode = mode;
        this.hide();
        if (this.onModeSelected) {
          this.onModeSelected(mode);
        }
      });
    });
  }

  hide() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
