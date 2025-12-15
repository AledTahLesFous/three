import { Menu } from '../menu.js';
import { GameOverUI } from '../gameoverul.js';

/**
 * Tests for Menu and GameOverUI components
 */

describe('Menu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('show should render menu and trigger onModeSelected when a mode is chosen', () => {
    const menu = new Menu();
    const onModeSelected = jest.fn();
    menu.onModeSelected = onModeSelected;

    menu.show();

    const container = document.getElementById('menu');
    expect(container).toBeTruthy();

    const buttons = container.querySelectorAll('.mode-btn');
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    // Click on the normal mode button
    const normalButton = Array.from(buttons).find(
      (btn) => btn.dataset.mode === 'normal'
    );
    normalButton.click();

    expect(onModeSelected).toHaveBeenCalledWith('normal');

    // After selection, the menu should be removed from the DOM
    expect(document.getElementById('menu')).toBeNull();
  });
});


describe('GameOverUI', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('show should display overlay with correct stats', () => {
    const ui = new GameOverUI();

    ui.show(1234, 12.3);

    const overlay = document.getElementById('gameOverOverlay');
    expect(overlay).toBeTruthy();
    expect(overlay.style.display).toBe('flex');

    const stats = document.getElementById('gameOverStats');
    expect(stats.textContent).toContain('1234');
  });

  test('hide should hide the overlay', () => {
    const ui = new GameOverUI();

    ui.show(100, 5.5);
    ui.hide();

    const overlay = document.getElementById('gameOverOverlay');
    expect(overlay.style.display).toBe('none');
  });

  test('onReplay should register a callback on the button', () => {
    const ui = new GameOverUI();
    const callback = jest.fn();

    ui.onReplay(callback);

    // Click the replay button
    ui.button.click();

    expect(callback).toHaveBeenCalled();
  });
});
