export function line(scene, x1, y1, x2, y2, width, color) {
    scene.beginPath();
    scene.lineWidth = width;
    scene.strokeStyle = color;

    scene.moveTo(x1, y1);
    scene.lineTo(x2, y2);

    scene.stroke();
}
