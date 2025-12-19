/**
 * Класс Player - управляет логикой покемона (Пикачу)
 */
class Player {
    constructor(x, y, width, height) {
        // Позиция и размеры
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Скорость (Velocity)
        this.vx = 0; // Горизонтальная
        this.vy = 0; // Вертикальная (прыжок/падение)

        // Физические параметры (настроены для мягкого геймплея 2025)
        this.gravity = 0.6;      // Сила притяжения
        this.jumpForce = -14;    // Сила прыжка
        this.speed = 6;          // Скорость бега
        
        // Состояния
        this.grounded = false;   // Стоит ли на опоре
    }

    /**
     * Метод прыжка
     */
    jump() {
        if (this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false; // Отрываемся от земли
        }
    }

    /**
     * Обновление состояния персонажа в каждом кадре
     * @param {Object} input - объект с зажатыми клавишами
     * @param {number} canvasWidth - ширина экрана (800)
     * @param {number} canvasHeight - высота экрана (600)
     */
    update(input, canvasWidth = 800, canvasHeight = 600) {
        // 1. Обработка ввода (Движение влево/вправо)
        if (input.keys.includes('ArrowLeft')) {
            this.vx = -this.speed;
        } else if (input.keys.includes('ArrowRight')) {
            this.vx = this.speed;
        } else {
            this.vx = 0; // Остановка, если кнопки не нажаты
        }

        // 2. Применение гравитации к вертикальной скорости
        this.vy += this.gravity;

        // 3. Обновление координат
        this.x += this.vx;
        this.y += this.vy;

        // 4. ОГРАНИЧЕНИЯ (Не даем выпасть за пределы уровня)

        // Левая граница
        if (this.x < 0) {
            this.x = 0;
        }

        // Правая граница
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }

        // Верхняя граница (необязательно, но полезно)
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }

        // Нижняя граница (считается "землей" уровня)
        // Если игрок упал ниже дна экрана
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
            this.vy = 0;
            this.grounded = true; // Теперь можно прыгать от пола
        }
    }

    /**
     * Отрисовка игрока (если Renderer не используется)
     * В текущей архитектуре отрисовкой занимается Renderer.js, 
     * но этот метод можно оставить для отладки.
     */
    draw(ctx) {
        ctx.fillStyle = '#f1c40f'; // Цвет Пикачу
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Player;