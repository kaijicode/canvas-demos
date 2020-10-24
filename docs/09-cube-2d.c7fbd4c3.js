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

  const $c87df57346dd01cddf23425c23a0767$var$CUBE_SIZE = 128;
  const $c87df57346dd01cddf23425c23a0767$var$CUBE_COLOR = '#000';
  const $c87df57346dd01cddf23425c23a0767$var$CUBE_THICKNESS = 1;
  const $c87df57346dd01cddf23425c23a0767$var$CANVAS_SIZE = 512;
  const $c87df57346dd01cddf23425c23a0767$var$cubes = [];
  const {
    canvas: $c87df57346dd01cddf23425c23a0767$var$canvas,
    scene: $c87df57346dd01cddf23425c23a0767$var$scene
  } = $bf5096e55bb6ae2cfbfaf7e6cb056$export$newCanvas($c87df57346dd01cddf23425c23a0767$var$CANVAS_SIZE, $c87df57346dd01cddf23425c23a0767$var$CANVAS_SIZE, '#fff');

  const $c87df57346dd01cddf23425c23a0767$var$getCubePosition = event => {
    const {
      x: canvasX,
      y: canvasY
    } = $c87df57346dd01cddf23425c23a0767$var$canvas.getBoundingClientRect();
    return {
      x: event.clientX - canvasX - $c87df57346dd01cddf23425c23a0767$var$CUBE_SIZE / 2,
      y: event.clientY - canvasY - $c87df57346dd01cddf23425c23a0767$var$CUBE_SIZE / 2
    };
  };

  let $c87df57346dd01cddf23425c23a0767$var$floatingCubeX = 200;
  let $c87df57346dd01cddf23425c23a0767$var$floatingCubeY = 150;
  $c87df57346dd01cddf23425c23a0767$var$canvas.addEventListener('mousemove', event => {
    const position = $c87df57346dd01cddf23425c23a0767$var$getCubePosition(event);
    $c87df57346dd01cddf23425c23a0767$var$floatingCubeX = position.x;
    $c87df57346dd01cddf23425c23a0767$var$floatingCubeY = position.y;
  });
  $c87df57346dd01cddf23425c23a0767$var$canvas.addEventListener('click', event => {
    $c87df57346dd01cddf23425c23a0767$var$cubes.push($c87df57346dd01cddf23425c23a0767$var$getCubePosition(event));
  });

  const $c87df57346dd01cddf23425c23a0767$var$drawCube = (scene, size, x, y, width, color) => {
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x, y, x + size, y, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x, y, x - size / 2, y + size / 2, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x + size, y, x + size / 2, y + size / 2, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x - size / 2, y + size / 2, x + size / 2, y + size / 2, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x, y, x, y + size, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x + size, y, x + size, y + size, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x - size / 2, y + size / 2, x - size / 2, y + size / 2 + size, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x + size / 2, y + size / 2, x + size / 2, y + size / 2 + size, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x, y + size, x + size, y + size, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x, y + size, x - size / 2, y + size * 2 - size / 2, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x + size, y + size, x + size - size / 2, y + size * 2 - size / 2, width, color);
    $f3094f620db763263a23e9467cd458d5$export$line(scene, x - size / 2, y + size * 2 - size / 2, x + size - size / 2, y + size * 2 - size / 2, width, color);
  };

  const $c87df57346dd01cddf23425c23a0767$var$draw = () => {
    $bf5096e55bb6ae2cfbfaf7e6cb056$export$clearScene($c87df57346dd01cddf23425c23a0767$var$scene, $c87df57346dd01cddf23425c23a0767$var$canvas);
    $c87df57346dd01cddf23425c23a0767$var$drawCube($c87df57346dd01cddf23425c23a0767$var$scene, $c87df57346dd01cddf23425c23a0767$var$CUBE_SIZE, $c87df57346dd01cddf23425c23a0767$var$floatingCubeX, $c87df57346dd01cddf23425c23a0767$var$floatingCubeY, $c87df57346dd01cddf23425c23a0767$var$CUBE_THICKNESS, $c87df57346dd01cddf23425c23a0767$var$CUBE_COLOR);

    for (const cube of $c87df57346dd01cddf23425c23a0767$var$cubes) {
      const {
        x,
        y
      } = cube;
      $c87df57346dd01cddf23425c23a0767$var$drawCube($c87df57346dd01cddf23425c23a0767$var$scene, $c87df57346dd01cddf23425c23a0767$var$CUBE_SIZE, x, y, $c87df57346dd01cddf23425c23a0767$var$CUBE_THICKNESS, $c87df57346dd01cddf23425c23a0767$var$CUBE_COLOR);
    }
  };

  $bf5096e55bb6ae2cfbfaf7e6cb056$export$renderLoop($c87df57346dd01cddf23425c23a0767$var$draw, 0);
})();
//# sourceMappingURL=09-cube-2d.c7fbd4c3.js.map
