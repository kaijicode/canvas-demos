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

export function renderLoop(fn, delay) {
    let start = performance.now();
    let elapsed = 0;

    const draw = () => {
        requestAnimationFrame(draw);

        elapsed = elapsed + (performance.now() - start)
        start = performance.now();

        if (elapsed >= delay) {
            fn();
            elapsed = 0;
        }
    }

    draw();
}