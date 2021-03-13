import {clearScene, newCanvas, renderLoop} from "../canvas";
import { line } from "../primitives";


const CANVAS_SIZE = 512;

const { canvas, scene } = newCanvas(CANVAS_SIZE, CANVAS_SIZE, '#fff');

const getMousePosition = (event) => {
    const {x: canvasX, y: canvasY} = canvas.getBoundingClientRect();
    return {x: (event.clientX - canvasX), y: (event.clientY - canvasY)};
}

let mouseX = 0;
let mouseY = 0;
canvas.addEventListener('mousemove', (event) => {
    const position = getMousePosition(event);
    mouseX = position.x;
    mouseY = position.y;
});


const draw = () => {
    clearScene(scene, canvas);

    line(scene, CANVAS_SIZE / 2, CANVAS_SIZE / 2, mouseX, mouseY, 1, '#000');
}

renderLoop(draw, 0);
