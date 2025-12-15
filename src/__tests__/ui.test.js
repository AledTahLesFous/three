/**
 * Tests unitaires pour les systèmes UI
 * Teste l'affichage des vies et des powerups
 */
import { LivesUI } from '../livesui.js';
import { PowerUpUI } from '../powerupui.js';

describe('LivesUI', () => {
  let livesUI;

  beforeEach(() => {
    // Ajouter un conteneur pour le DOM
    document.body.innerHTML = '';
    livesUI = new LivesUI();
  });

  afterEach(() => {
    livesUI.clear();
    document.body.innerHTML = '';
  });

  test('devrait créer un conteneur', () => {
    const container = document.getElementById('livesContainer');
    expect(container).toBeTruthy();
  });

  test('devrait créer 3 coeurs pour 3 vies max', () => {
    livesUI.updateLives(3, 3);

    const hearts = livesUI.hearts;
    expect(hearts.length).toBe(3);
  });

  test('devrait afficher les coeurs rouges lumineux', () => {
    livesUI.updateLives(3, 3);

    const hearts = livesUI.hearts;
    expect(hearts[0].textContent).toBe('❤️');
    expect(hearts[0].className).toContain('heart');
  });

  test('devrait marquer les coeurs vides comme vides', () => {
    livesUI.updateLives(1, 3);

    expect(livesUI.hearts[0].classList.contains('empty')).toBe(false);
    expect(livesUI.hearts[1].classList.contains('empty')).toBe(true);
    expect(livesUI.hearts[2].classList.contains('empty')).toBe(true);
  });

  test('devrait adapter le nombre de coeurs', () => {
    livesUI.updateLives(5, 5);
    expect(livesUI.hearts.length).toBe(5);

    livesUI.updateLives(3, 3);
    expect(livesUI.hearts.length).toBe(3);
  });

  test('devrait nettoyer tous les coeurs', () => {
    livesUI.updateLives(3, 3);
    livesUI.clear();

    expect(livesUI.hearts.length).toBe(0);
  });
});

describe('PowerUpUI', () => {
  let powerupUI;

  beforeEach(() => {
    document.body.innerHTML = '';
    powerupUI = new PowerUpUI();
  });

  afterEach(() => {
    powerupUI.clear();
    document.body.innerHTML = '';
  });

  test('devrait créer un conteneur powerup', () => {
    const container = document.getElementById('powerupContainer');
    expect(container).toBeTruthy();
  });

  test('devrait créer une barre pour chaque powerup actif', () => {
    const activePowerUps = {
      triple_shot: { timeRemaining: 5 },
      fire_rate: { timeRemaining: 7 }
    };

    powerupUI.updatePowerUps(activePowerUps);

    expect(Object.keys(powerupUI.activeBars).length).toBe(2);
  });

  test('devrait utiliser le bon label pour chaque type', () => {
    const label1 = powerupUI.getPowerUpLabel('triple_shot');
    const label2 = powerupUI.getPowerUpLabel('fire_rate');
    const label3 = powerupUI.getPowerUpLabel('shield');

    expect(label1).toContain('Triple Shot');
    expect(label2).toContain('Fire Rate');
    expect(label3).toContain('Shield');
  });

  test('devrait mettre à jour la largeur de la barre correctement', () => {
    const mockElement = document.createElement('div');
    const progressDiv = document.createElement('div');
    progressDiv.setAttribute('data-progressBar', 'true');
    progressDiv.style.width = '100%';
    mockElement.appendChild(progressDiv);

    const powerup = { timeRemaining: 5 };
    powerupUI.updatePowerUpBar(mockElement, 'triple_shot', powerup);

    // 5 secondes restantes / 10 = 50%
    expect(progressDiv.style.width).toBe('50%');
  });

  test('devrait afficher le temps correct au format entier', () => {
    const mockElement = document.createElement('div');
    const timeDiv = document.createElement('div');
    timeDiv.setAttribute('data-timeDisplay', 'true');
    mockElement.appendChild(timeDiv);

    const powerup = { timeRemaining: 5.3 };
    powerupUI.updatePowerUpBar(mockElement, 'triple_shot', powerup);

    // Math.ceil(5.3) = 6
    expect(timeDiv.textContent).toBe('6s');
  });

  test('devrait supprimer les barres des powerups inactifs', () => {
    const activePowerUps1 = {
      triple_shot: { timeRemaining: 5 },
      fire_rate: { timeRemaining: 7 }
    };

    powerupUI.updatePowerUps(activePowerUps1);
    expect(Object.keys(powerupUI.activeBars).length).toBe(2);

    // Mettre à jour avec seulement un powerup
    const activePowerUps2 = {
      triple_shot: { timeRemaining: 5 }
    };

    powerupUI.updatePowerUps(activePowerUps2);
    expect(Object.keys(powerupUI.activeBars).length).toBe(1);
  });

  test('devrait nettoyer toutes les barres', () => {
    const activePowerUps = {
      triple_shot: { timeRemaining: 5 }
    };

    powerupUI.updatePowerUps(activePowerUps);
    powerupUI.clear();

    expect(Object.keys(powerupUI.activeBars).length).toBe(0);
  });
});
