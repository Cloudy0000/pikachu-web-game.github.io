class InputHandler {
    constructor() {
        this.keys = []; // Список зажатых клавиш

        // Слушаем нажатие клавиши
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') 
                && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });

        // Слушаем отпускание клавиши
        window.addEventListener('keyup', (e) => {
            const index = this.keys.indexOf(e.key);
            if (index > -1) {
                this.keys.splice(index, 1);
            }
        });
    }
}

export default InputHandler;