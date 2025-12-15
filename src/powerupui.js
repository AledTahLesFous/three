/**
 * Classe PowerUpUI - Gère l'affichage visuel des PowerUps actifs
 * Affiche des barres avec icônes, labels et temps restant
 */
export class PowerUpUI {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'powerupContainer';
    document.body.appendChild(this.container);
    this.activeBars = {}; // { type: DOM element }
  }

  updatePowerUps(activePowerUps) {
    // Récupérer les types actuels
    const currentTypes = Object.keys(activePowerUps);
    const previousTypes = Object.keys(this.activeBars);

    // Supprimer les barres des powerups qui ne sont plus actifs
    previousTypes.forEach(type => {
      if (!currentTypes.includes(type)) {
        this.activeBars[type].remove();
        delete this.activeBars[type];
      }
    });

    // Ajouter ou mettre à jour les barres
    currentTypes.forEach(type => {
      const powerup = activePowerUps[type];
      if (!this.activeBars[type]) {
        // Créer une nouvelle barre
        this.activeBars[type] = this.createPowerUpBar(type, powerup);
        this.container.appendChild(this.activeBars[type]);
      } else {
        // Mettre à jour la barre existante
        this.updatePowerUpBar(this.activeBars[type], type, powerup);
      }
    });
  }

  createPowerUpBar(type, powerup) {
    const bar = document.createElement('div');
    bar.className = `powerupBar ${type}`;

    const icon = document.createElement('div');
    icon.className = `powerupIcon ${type}`;

    const info = document.createElement('div');
    info.className = 'powerupInfo';

    const label = document.createElement('div');
    label.className = 'powerupLabel';
    label.textContent = this.getPowerUpLabel(type);

    const progressBar = document.createElement('div');
    progressBar.className = 'powerupProgressBar';

    const progress = document.createElement('div');
    progress.className = `powerupProgress ${type}`;
    progress.style.width = '100%';
    progress.dataset.progressBar = true;
    progress.dataset.percentage = '100';

    progressBar.appendChild(progress);
    info.appendChild(label);
    info.appendChild(progressBar);

    const timeContainer = document.createElement('div');
    timeContainer.style.cssText = 'display: flex; flex-direction: column; align-items: flex-end; gap: 3px;';

    const time = document.createElement('div');
    time.className = 'powerupTime';
    time.textContent = '10s';
    time.dataset.timeDisplay = true;

    const percentage = document.createElement('div');
    percentage.style.cssText = `
      color: rgba(255, 255, 255, 0.6);
      font-family: Arial, sans-serif;
      font-size: 11px;
      text-align: right;
    `;
    // Barre textuelle : 10 étoiles pour 10 secondes
    percentage.dataset.percentageDisplay = true;

    timeContainer.appendChild(time);
    timeContainer.appendChild(percentage);

    bar.appendChild(icon);
    bar.appendChild(info);
    bar.appendChild(timeContainer);

    return bar;
  }

  updatePowerUpBar(barElement, type, powerup) {
    const timeRemaining = Math.max(0, powerup.timeRemaining);
    const percentage = (timeRemaining / 10) * 100; // 10 secondes max

    // Mettre à jour la barre de progression
    const progressBar = barElement.querySelector('[data-progressBar]');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
      progressBar.dataset.percentage = percentage.toFixed(0);
    }

    // Mettre à jour le temps avec décompte en secondes entières
    const timeDisplay = barElement.querySelector('[data-timeDisplay]');
    if (timeDisplay) {
      // Affiche 10s, 9s, 8s... 1s, 0s
      const displayTime = Math.ceil(timeRemaining);
      timeDisplay.textContent = displayTime + 's';
    }

    // Mettre à jour l'affichage de la "barre" d'étoiles
    const percentageDisplay = barElement.querySelector('[data-percentageDisplay]');
    if (percentageDisplay) {
      // Exemples :
      // 10s -> "**********"
      //  9s -> "*********"
      //  ...
      //  1s -> "*"
      //  0s -> ""
      const starCount = Math.max(0, Math.min(10, Math.ceil(timeRemaining)));
      percentageDisplay.textContent = '*'.repeat(starCount);
    }
  }

  getPowerUpLabel(type) {
    const labels = {
      'triple_shot': '🔷 Triple Shot',
      'fire_rate': '⚡ Fire Rate',
      'shield': '🛡️ Shield'
    };
    return labels[type] || type;
  }

  clear() {
    Object.keys(this.activeBars).forEach(type => {
      this.activeBars[type].remove();
    });
    this.activeBars = {};
  }
}
