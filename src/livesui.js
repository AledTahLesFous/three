/**
 * Classe LivesUI - Gère l'affichage des vies du joueur
 * Affiche des coeurs rouges lumineux
 */
export class LivesUI {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'livesContainer';
    document.body.appendChild(this.container);
    this.hearts = [];
  }

  updateLives(currentLives, maxLives) {
    // Créer ou supprimer des coeurs si le nombre change
    while (this.hearts.length < maxLives) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '❤️';
      this.container.appendChild(heart);
      this.hearts.push(heart);
    }

    while (this.hearts.length > maxLives) {
      this.hearts.pop().remove();
    }

    // Mettre à jour l'état des coeurs (pleins ou vides)
    this.hearts.forEach((heart, index) => {
      if (index < currentLives) {
        heart.classList.remove('empty');
      } else {
        heart.classList.add('empty');
      }
    });
  }

  clear() {
    this.hearts.forEach(heart => heart.remove());
    this.hearts = [];
  }
}
