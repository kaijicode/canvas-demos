import { line } from "./primitives";

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

export class Ruler {
    constructor(mouseX, mouseY, width, color) {
        this.x1 = mouseX;
        this.y1 = mouseY;
        this.x2 = 0;
        this.y2 = 0;
        this.color = color;
        this.width = width;
    }

    draw(scene) {
        line(scene, this.x1, this.y1, this.x2, this.y2, this.width, this.color);
    }
}


export class HorizontalRuler extends Ruler {
    constructor(mouseX, mouseY, width, color) {
        super(mouseX, mouseY, width, color);
        this.update(mouseX, mouseY);
    }

    update(mouseX, mouseY) {
        this.x1 = 0;
        this.y1 = mouseY;
        this.x2 = mouseX;
        this.y2 = mouseY;
    }
}

export class VerticalRuler extends Ruler {
    constructor(mouseX, mouseY, width, color) {
        super(mouseX, mouseY, width, color);
        this.update(mouseX, mouseY);
    }

    update(mouseX, mouseY) {
        this.x1 = mouseX;
        this.y1 = 0;
        this.x2 = mouseX;
        this.y2 = mouseY;
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
