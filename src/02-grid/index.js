
const line = (scene, x1, y1, x2, y2, color) => {
    scene.beginPath();
    scene.strokeStyle = color;

    scene.moveTo(x1, y1);
    scene.lineTo(x2, y2);

    scene.stroke();
}

const grid = (scene, canvasWidth, canvasHeight, gap, color='#e2e2e2') => {
    // columns
    let x = gap;
    for (let i = 1; i < Math.round(canvasWidth / gap); i += 1) {
        line(scene, x * i, 0, x * i, canvasHeight, 1, color);
    }

    // rows
    let y = gap;
    for (let i = 1; i < Math.round(canvasHeight / gap); i += 1) {
        line(scene, 0, y * i, canvasWidth, y * i, 1, color);
    }
};

const canvas = document.getElementById('canvas');
const scene = canvas.getContext('2d');


function draw() {
    requestAnimationFrame(draw);

    grid(scene, canvas.width, canvas.height, 10, '#e2e2e2');

    line(scene, 0, 10, 390, 10, 1, 'blue');
}

draw();