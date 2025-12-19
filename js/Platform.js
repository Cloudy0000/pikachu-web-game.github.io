class Platform {
    /**
     * @param {number} x - начальная координата X
     * @param {number} y - начальная координата Y
     * @param {number} width - ширина платформы
     * @param {number} height - высота платформы
     * @param {object} options - дополнительные параметры (например, для движения)
     */
    constructor(x, y, width, height, options = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Параметры для движущихся платформ
        this.isMoving = options.isMoving || false;
        this.range = options.range || 0;     // Дистанция движения
        this.speed = options.speed || 0;     // Скорость движения
        this.startX = x;                     // Точка отсчета для движения
        this.color = options.color || '#2f3542'; // Цвет платформы
    }

    /**
     * Обновление состояния платформы
     */
    update() {
        if (this.isMoving) {
            // Реализация простого движения влево-вправо через синус
            // Math.sin дает плавное колебание от -1 до 1
            this.x = this.startX + Math.sin(Date.now() * 0.002 * this.speed) * this.range;
        }
    }

    /**
     * Отрисовка платформы
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Добавим небольшую рамку (опционально для красоты)
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

export default Platform;