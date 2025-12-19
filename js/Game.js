import Player from './Player.js';
import Platform from './Platform.js';
import InputHandler from './InputHandler.js';
import Collision from './Collision.js';
import Renderer from './Renderer.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Размеры (должны совпадать с Player.js)
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.renderer = new Renderer(this.ctx, this.width, this.height);
        this.input = new InputHandler();
        
        // Стартовая позиция Пикачу (на земле)
        this.player = new Player(50, 500, 50, 50);

        this.lastDirection = true; 
        this.isVictory = false;

        // Логика сбора ягод
        this.berriesCollected = 0;
        this.totalBerriesNeeded = 5;
        this.berries = [
            { x: 140, y: 410, width: 30, height: 30, collected: false },
            { x: 450, y: 310, width: 30, height: 30, collected: false },
            { x: 620, y: 240, width: 30, height: 30, collected: false },
            { x: 440, y: 160, width: 30, height: 30, collected: false },
            { x: 130, y: 110, width: 30, height: 30, collected: false }
        ];

        // Карта уровней (плотное расположение)
        this.platforms = [
            new Platform(0, 550, 800, 50, { color: '#27ae60' }), // Земля
            new Platform(100, 450, 120, 15, { color: '#f1c40f' }),
            new Platform(280, 380, 120, 15, { color: '#f1c40f' }),
            new Platform(450, 350, 120, 15, { color: '#f1c40f' }),
            new Platform(600, 280, 120, 15, { color: '#f1c40f' }),
            new Platform(420, 200, 120, 15, { color: '#f1c40f' }),
            new Platform(100, 150, 100, 15, { color: '#ecf0f1', isMoving: true, range: 50, speed: 1.2 })
        ];

        this.init();
    }
	
	async init() {
        try {
            // Пытаемся загрузить ассеты
            await this.renderer.loadAssets({
                pikachu: 'https://raw.githubusercontent.com/BKTidswell/Pokemon-Timer/main/Pokemon_Smile_Pokemon/025.png',
                berry: 'https://www.serebii.net/pokemonsleep/berries/grepaberry.png',
				jumpSound: 'assets/sounds/spring.mp3',
                collectSound: 'assets/sounds/pikachu.mp3'
            });
    } catch (e) {
        console.warn("Ошибка при загрузке:", e);
    } finally {
        // Запуск цикла гарантирован, даже если звуки не подгрузились
        this.gameLoop(); 
    }
}

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.isVictory) return;

        // Обновление игрока (передаем размеры холста)
        this.player.update(this.input, this.width, this.height);
        this.player.grounded = false;

        // Обновление платформ и физика столкновений
        this.platforms.forEach(platform => {
            platform.update();
            Collision.handlePlayerPlatform(this.player, platform);
        });

        // Смена направления взгляда
        if (this.player.vx > 0) this.lastDirection = true;
        else if (this.player.vx < 0) this.lastDirection = false;

        // Прыжок
        if (this.input.keys.includes(' ') || this.input.keys.includes('ArrowUp')) {
            if (this.player.grounded) { // Проверяем, что звук играется только при успешном прыжке
               this.renderer.playSound('jumpSound'); 
            }
            this.player.jump();
        }

        // Проверка сбора ягод (AABB collision)
        this.berries.forEach(berry => {
            if (!berry.collected && this.checkSimpleCollision(this.player, berry)) {
                berry.collected = true;
                this.berriesCollected++;
                
                this.renderer.playSound('collectSound'); // Воспроизведение звука сбора
                
                if (this.berriesCollected >= this.totalBerriesNeeded) {
                    this.isVictory = true;
                }
            }
        });
    }

    // Простой метод проверки пересечения прямоугольников
    checkSimpleCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    render() {
        this.renderer.clear();
        
        // 1. Фон
        this.renderer.drawRect(0, 0, this.width, this.height, '#87CEEB');

        // 2. Платформы
        this.platforms.forEach(p => p.draw(this.ctx));

        // 3. Ягоды
        this.berries.forEach(berry => {
            if (!berry.collected) {
                this.renderer.drawImage('berry', berry.x, berry.y, berry.width, berry.height);
            }
        });

        // 4. Пикачу
        this.renderer.drawImage('pikachu', this.player.x, this.player.y, this.player.width, this.player.height, this.lastDirection);

        // 5. Интерфейс
        this.drawUI();

        if (this.isVictory) {
            this.drawWin();
        }
    }

    drawUI() {
    // 1. Координаты для иконки ягоды и текста
    const iconX = 25;
    const iconY = 20; // Подняли выше (было 65)
    const iconSize = 30;

    // 2. Рисуем иконку ягоды вместо слова "Ягоды:"
    // Используем Renderer для отрисовки ассета 'berry'
    this.renderer.drawImage('berry', iconX, iconY, iconSize, iconSize);

    // 3. Рисуем только цифры счетчика рядом с иконкой
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 24px sans-serif';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = "black";
    
    // Сдвигаем текст вправо от иконки (+40 пикселей)
    this.ctx.fillText(`${this.berriesCollected} / ${this.totalBerriesNeeded}`, iconX + 40, iconY + 23);
    
    // Сбрасываем тень, чтобы она не влияла на другие элементы
    this.ctx.shadowBlur = 0;
}

    drawWin() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.font = 'bold 40px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('УРОВЕНЬ ПРОЙДЕН!', this.width / 2, this.height / 2);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('Все ягоды собраны. Пикачу счастлив!', this.width / 2, this.height / 2 + 50);
        this.ctx.textAlign = 'start';
    }
}

export default Game;