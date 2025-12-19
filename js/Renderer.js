class Renderer {
    /**
     * @param {CanvasRenderingContext2D} ctx - контекст холста
     * @param {number} width - ширина холста
     * @param {number} height - высота холста
     */
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.assets = {}; // Хранилище изображений
        this.sounds = {}; // Хранилище звуков
    }

    /**
     * Очистка экрана
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Универсальный загрузчик ресурсов (картинки и звуки)
     */
    async loadAssets(sources) {
        const promises = Object.keys(sources).map(key => {
            const url = sources[key];
            
            // Загрузка аудио (mp3, wav)
            if (url.endsWith('.mp3') || url.endsWith('.wav')) {
                return new Promise((resolve) => {
                    const audio = new Audio();
                    audio.src = url;
                    audio.oncanplaythrough = () => {
                        this.sounds[key] = audio;
                        resolve();
                    };
                    audio.onerror = () => {
                        console.warn(`Ошибка загрузки звука: ${url}`);
                        resolve(); // Разрешаем, чтобы игра не висла
                    };
                });
			} else if (url.endsWith('.mp3') || url.endsWith('.wav')) {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto'; // Принудительная загрузка

        const handleLoad = () => {
            this.sounds[key] = audio;
            resolve();
        };

        const handleError = () => {
            console.error("Звук не найден:", url);
            resolve(); // Обязательно вызываем resolve, чтобы игра не зависла!
        };

        audio.addEventListener('canplaythrough', handleLoad, { once: true });
        audio.addEventListener('error', handleError, { once: true });
        
        // На случай, если браузер вообще заблокировал загрузку
        setTimeout(resolve, 2000); 
    });	
            }
			
            
            // Загрузка изображений
            return new Promise((resolve) => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    this.assets[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Ошибка загрузки изображения: ${url}`);
                    resolve(); // Разрешаем, чтобы игра не висла
                };
            });
        });

        await Promise.all(promises);
    }

    /**
     * Отрисовка изображения с поддержкой отзеркаливания
     */
    drawImage(assetKey, x, y, width, height, flip = false) {
        const img = this.assets[assetKey];

        if (img && img.complete && img.naturalWidth !== 0) {
            this.ctx.save();
            if (flip) {
                // Магия отзеркаливания
                this.ctx.translate(x + width / 2, y + height / 2);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(img, -width / 2, -height / 2, width, height);
            } else {
                this.ctx.drawImage(img, x, y, width, height);
            }
            this.ctx.restore();
        } else {
            // Заглушка, если картинка не загрузилась
            this.drawRect(x, y, width, height, assetKey === 'pikachu' ? '#f1c40f' : '#e74c3c');
        }
    }

    /**
     * Отрисовка простых прямоугольников (платформы)
     */
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    /**
     * Воспроизведение звука
     */
    playSound(key) {
        const sound = this.sounds[key];
        if (sound) {
            // Клонируем узел, чтобы звуки могли накладываться друг на друга
            const soundClone = sound.cloneNode();
            soundClone.volume = 0.5; // Умеренная громкость
            soundClone.play().catch(e => console.warn("Звук заблокирован браузером до первого клика"));
        }
    }
}

export default Renderer;