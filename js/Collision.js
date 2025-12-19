class Collision {
    /**
     * Проверка столкновения игрока с платформой (AABB)
     * @param {Player} player 
     * @param {Platform} platform 
     * @returns {string|null} - Возвращает сторону столкновения ('top', 'bottom', 'left', 'right')
     */
    static checkRectCollision(player, platform) {
        // Расстояния между центрами объектов
        const dx = (player.x + player.width / 2) - (platform.x + platform.width / 2);
        const dy = (player.y + player.height / 2) - (platform.y + platform.height / 2);

        // Сумма половин ширины и высоты
        const combinedHalfWidths = (player.width / 2) + (platform.width / 2);
        const combinedHalfHeights = (player.height / 2) + (platform.height / 2);

        // Проверяем пересечение по осям X и Y
        if (Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights) {
            // Вычисляем глубину проникновения
            const overlapX = combinedHalfWidths - Math.abs(dx);
            const overlapY = combinedHalfHeights - Math.abs(dy);

            // Столкновение произошло по той оси, где глубина проникновения меньше
            if (overlapX >= overlapY) {
                if (dy > 0) {
                    return 'bottom'; // Игрок ударился головой снизу платформы
                } else {
                    return 'top';    // Игрок приземлился на платформу
                }
            } else {
                if (dx > 0) {
                    return 'left';   // Игрок ударился левым боком
                } else {
                    return 'right';  // Игрок ударился правым боком
                }
            }
        }
        return null; // Столкновения нет
    }

    /**
     * Обработка физического разрешения столкновения
     */
    static handlePlayerPlatform(player, platform) {
        const side = this.checkRectCollision(player, platform);

        if (side === 'top') {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.grounded = true;
        } else if (side === 'bottom') {
            player.y = platform.y + platform.height;
            player.vy = 0;
        } else if (side === 'left') {
            player.x = platform.x + platform.width;
        } else if (side === 'right') {
            player.x = platform.x - player.width;
        }
    }
}

export default Collision;