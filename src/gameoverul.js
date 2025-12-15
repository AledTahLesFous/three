/**
 * Classe GameOverUI - Gère l'affichage du menu Game Over
 */
export class GameOverUI {
  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'gameOverOverlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
    `;

    this.menu = document.createElement('div');
    this.menu.id = 'gameOverMenu';
    this.menu.style.cssText = `
      padding: 60px 80px;
      background: rgba(0, 0, 0, 0.95);
      border: 4px solid #ff0000;
      border-radius: 15px;
      z-index: 101;
      color: white;
      text-align: center;
      font-family: 'Orbitron', Arial, sans-serif;
      box-shadow: 0 0 30px rgba(255, 0, 0, 0.6);
    `;

    const title = document.createElement('h1');
    title.textContent = 'GAME OVER';
    title.style.cssText = `
      font-size: 64px;
      margin-bottom: 30px;
      text-shadow: 0 0 20px #ff0000;
      color: #ff0000;
      letter-spacing: 4px;
    `;

    const stats = document.createElement('div');
    stats.id = 'gameOverStats';
    stats.style.cssText = `
      font-size: 24px;
      margin-bottom: 50px;
      color: #cccccc;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    `;

    const button = document.createElement('button');
    button.id = 'gameOverBtn';
    button.textContent = 'REJOUER';
    button.style.cssText = `
      padding: 15px 40px;
      font-size: 24px;
      background: #ff0000;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 8px;
      font-family: inherit;
      font-weight: bold;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.6);
      transition: all 0.3s;
    `;

    button.onmouseover = () => {
      button.style.background = '#ff3333';
      button.style.boxShadow = '0 0 25px rgba(255, 0, 0, 0.9)';
    };

    button.onmouseout = () => {
      button.style.background = '#ff0000';
      button.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.6)';
    };

    this.menu.appendChild(title);
    this.menu.appendChild(stats);
    this.menu.appendChild(button);

    this.overlay.appendChild(this.menu);
    document.body.appendChild(this.overlay);

    this.statsElement = stats;
    this.button = button;
  }

  show(score, time) {
    this.overlay.style.display = 'flex';
    this.statsElement.innerHTML = `
      <div>Score final : <span style="color: #00ff00;">${score}</span></div>
      <div>Temps : <span style="color: #0099ff;">${time.toFixed(1)}s</span></div>
    `;
  }

  hide() {
    this.overlay.style.display = 'none';
  }

  onReplay(callback) {
    this.button.onclick = callback;
  }
}
