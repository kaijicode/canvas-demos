import {clearScene, newCanvas, renderLoop} from "../canvas";
import { line } from "../primitives";


const CUBE_SIZE = 128;
const CUBE_COLOR = '#000';
const CUBE_THICKNESS = 1;
const CANVAS_SIZE = 512;
const cubes = [];

const { canvas, scene } = newCanvas(CANVAS_SIZE, CANVAS_SIZE, '#fff');

const getCubePosition = (event) => {
    const {x: canvasX, y: canvasY} = canvas.getBoundingClientRect();
    return {x: (event.clientX - canvasX) - CUBE_SIZE / 2, y: (event.clientY - canvasY) - CUBE_SIZE / 2};
}

let floatingCubeX = 200;
let floatingCubeY = 150;
canvas.addEventListener('mousemove', (event) => {
    const position = getCubePosition(event);
    floatingCubeX = position.x;
    floatingCubeY = position.y;
});

canvas.addEventListener('click', (event) => {
    cubes.push(getCubePosition(event));
});

const drawCube = (scene, size, x, y, width, color) => {
    line(scene, x, y, x + size, y, width, color);
    line(scene, x, y, x - (size / 2), y + (size / 2), width, color)
    line(scene, x + size, y, x + (size / 2), y + (size / 2), width, color);
    line(scene, x - (size / 2), y + (size / 2), x + (size / 2), y + (size / 2), width, color);

    line(scene, x, y, x, y + size, width, color);
    line(scene, x + size, y, x + size, y + size, width, color)
    line(scene, x - (size / 2), y + (size / 2), x - (size / 2), y + (size / 2) + size, width, color);
    line(scene, x + (size / 2), y + (size / 2), x + (size / 2), y + (size / 2) + size, width, color);

    line(scene, x, y + size, x + size, y + size, width, color);
    line(scene, x, y + size, x - (size / 2), y + (size * 2) - (size / 2), width, color)
    line(scene, x + size, y + size, x + size - (size / 2), y + (size * 2) - (size / 2), width, color);
    line(scene, x - (size / 2), y + (size * 2) - (size / 2), x + size - (size / 2), y + (size * 2) - (size / 2), width, color);
}

const draw = () => {
    clearScene(scene, canvas);

    drawCube(scene, CUBE_SIZE, floatingCubeX, floatingCubeY, CUBE_THICKNESS, CUBE_COLOR);

    for (const cube of cubes) {
        const {x, y} = cube;
        drawCube(scene, CUBE_SIZE, x, y, CUBE_THICKNESS, CUBE_COLOR);
    }
}

renderLoop(draw, 0);
