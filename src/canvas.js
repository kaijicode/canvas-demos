export function newCanvas(width, height, background, target = document.body) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.background = background;
    target.appendChild(canvas);

    return {
        canvas,
        scene: canvas.getContext('2d')
    };
}

export function clearScene(scene, canvas) {
    scene.clearRect(0, 0, canvas.width, canvas.height);
}