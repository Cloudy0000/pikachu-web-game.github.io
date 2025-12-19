import Game from './Game.js';

// Ждем загрузки DOM, чтобы canvas был доступен
window.addEventListener('load', () => {
    const game = new Game('gameCanvas');
    // Метод init() внутри Game.js загрузит ресурсы и запустит gameLoop
});