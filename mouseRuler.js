import {clearScene, newCanvas} from "./canvas";
import {line} from "./primitives";


const { canvas, scene } = newCanvas(500, 380, '#e2e2e2');


let horizontalRuler, verticalRuler;
canvas.addEventListener('mousemove', (event) => {
    horizontalRuler = createHorizontalRuler(event.offsetX, event.offsetY, 'orange');
    verticalRuler = createVerticalRuler(event.offsetX, event.offsetY, 'orange');
});

function createHorizontalRuler(mouseX, mouseY, color) {
    return {
        x1: 0,
        y1: mouseY,
        x2: mouseX,
        y2: mouseY,
        color: color,
    }
}

function createVerticalRuler(mouseX, mouseY, color) {
    return {
        x1: mouseX,
        y1: 0,
        x2: mouseX,
        y2: mouseY,
        color: color,
    }
}

function drawRuler(scene, ruler) {
    line(scene, ruler.x1, ruler.y1, ruler.x2, ruler.y2, ruler.color);
}

function drawLabel(scene, ruler, color, fontSize, position) {
    scene.fillStyle = color;
    scene.font = `${fontSize}x monospace`;

    scene.fillText(`(${ruler.x2}, ${ruler.y2})`, ruler.x2, ruler.y2);
}

function draw() {
    requestAnimationFrame(draw);

    clearScene(scene, canvas);

    if (horizontalRuler) {
        drawRuler(scene, horizontalRuler);
    }

    if (verticalRuler) {
        drawRuler(scene, verticalRuler);
        drawLabel(scene, verticalRuler, '#000000');
    }
}

draw();



// class Ruler {
//     constructor(offsetX, offsetY, color, isHorizontal) {
//         this.x1 = isHorizontal ? 0 : offsetX;
//         this.y1 = isHorizontal ? offsetY : 0;
//         this.x2 = offsetX;
//         this.y2 = offsetY;
//         this.color = color;
//     }
//
//     draw(scene) {
//         line(scene, this.x1, this.y1, this.x2, this.y2, this.color);
//     }
// }

