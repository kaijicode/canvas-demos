import {newCanvas, clearScene} from "./canvas";

// const { canvas, scene } = newCanvas(500, 380, '#e2e2e2');

// TODO: Would be cool if the output could be redirected to a different canvas
export class MousePositionReporter {
    constructor(canvas, fontSize, fontColor) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.fontColor = fontColor;
        this.fontSize = fontSize;
        this.listener = this.listen.bind(this);
        this.canvas.addEventListener('mousemove', this.listener);
    }

    draw(scene) {
        scene.fillStyle = this.fontColor;
        scene.font = `${this.fontSize}px monospace`;
        scene.fillText(`(${this.x}, ${this.y})`, this.x, this.y);
    }

    listen(event) {
        this.x = event.offsetX;
        this.y = event.offsetY;
    }

    destroy() {
        this.canvas.removeEventListener('mousemove', this.listener);
    }
}

// const positionReporter = new MousePositionReporter(canvas, 10, '#000000');
// positionReporter.initialize();
//
// function draw() {
//     requestAnimationFrame(draw);
//
//     clearScene(scene, canvas);
//     positionReporter.draw(scene);
// }
//
// draw();
