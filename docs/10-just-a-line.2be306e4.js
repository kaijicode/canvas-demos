(function () {
  // ASSET: /home/vova/src/canvas-demos/src/canvas.js
  function $bf5096e55bb6ae2cfbfaf7e6cb056$export$newCanvas(width, height, background, target = document.body) {
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

  function $bf5096e55bb6ae2cfbfaf7e6cb056$export$clearScene(scene, canvas) {
    scene.clearRect(0, 0, canvas.width, canvas.height);
  }

  function $bf5096e55bb6ae2cfbfaf7e6cb056$export$renderLoop(fn, delay) {
    let start = performance.now();
    let elapsed = 0;

    const draw = () => {
      requestAnimationFrame(draw);
      elapsed = elapsed + (performance.now() - start);
      start = performance.now();

      if (elapsed >= delay) {
        fn();
        elapsed = 0;
      }
    };

    draw();
  }

  function $f3094f620db763263a23e9467cd458d5$export$line(scene, x1, y1, x2, y2, width, color) {
    scene.beginPath();
    scene.lineWidth = width;
    scene.strokeStyle = color;
    scene.moveTo(x1, y1);
    scene.lineTo(x2, y2);
    scene.stroke();
  }

  const $bd9127806cb52f1add009ff1504c670$var$CANVAS_SIZE = 512;
  const {
    canvas: $bd9127806cb52f1add009ff1504c670$var$canvas,
    scene: $bd9127806cb52f1add009ff1504c670$var$scene
  } = $bf5096e55bb6ae2cfbfaf7e6cb056$export$newCanvas($bd9127806cb52f1add009ff1504c670$var$CANVAS_SIZE, $bd9127806cb52f1add009ff1504c670$var$CANVAS_SIZE, '#fff');

  const $bd9127806cb52f1add009ff1504c670$var$getMousePosition = event => {
    const {
      x: canvasX,
      y: canvasY
    } = $bd9127806cb52f1add009ff1504c670$var$canvas.getBoundingClientRect();
    return {
      x: event.clientX - canvasX,
      y: event.clientY - canvasY
    };
  };

  let $bd9127806cb52f1add009ff1504c670$var$mouseX = 0;
  let $bd9127806cb52f1add009ff1504c670$var$mouseY = 0;
  $bd9127806cb52f1add009ff1504c670$var$canvas.addEventListener('mousemove', event => {
    const position = $bd9127806cb52f1add009ff1504c670$var$getMousePosition(event);
    $bd9127806cb52f1add009ff1504c670$var$mouseX = position.x;
    $bd9127806cb52f1add009ff1504c670$var$mouseY = position.y;
  });

  const $bd9127806cb52f1add009ff1504c670$var$draw = () => {
    $bf5096e55bb6ae2cfbfaf7e6cb056$export$clearScene($bd9127806cb52f1add009ff1504c670$var$scene, $bd9127806cb52f1add009ff1504c670$var$canvas);
    $f3094f620db763263a23e9467cd458d5$export$line($bd9127806cb52f1add009ff1504c670$var$scene, $bd9127806cb52f1add009ff1504c670$var$CANVAS_SIZE / 2, $bd9127806cb52f1add009ff1504c670$var$CANVAS_SIZE / 2, $bd9127806cb52f1add009ff1504c670$var$mouseX, $bd9127806cb52f1add009ff1504c670$var$mouseY, 1, '#000');
  };

  $bf5096e55bb6ae2cfbfaf7e6cb056$export$renderLoop($bd9127806cb52f1add009ff1504c670$var$draw, 0);
})();
//# sourceMappingURL=10-just-a-line.2be306e4.js.map
