(function () {
  // ASSET: /home/vova/src/canvas-demos/src/02-grid/index.js
  const $d37dd1ef1528e42b34ecf1e442f3798$var$line = (scene, x1, y1, x2, y2, color) => {
    scene.beginPath();
    scene.strokeStyle = color;
    scene.moveTo(x1, y1);
    scene.lineTo(x2, y2);
    scene.stroke();
  };

  const $d37dd1ef1528e42b34ecf1e442f3798$var$grid = (scene, canvasWidth, canvasHeight, gap, color = '#e2e2e2') => {
    // columns
    let x = gap;

    for (let i = 1; i < Math.round(canvasWidth / gap); i += 1) {
      $d37dd1ef1528e42b34ecf1e442f3798$var$line(scene, x * i, 0, x * i, canvasHeight, 1, color);
    } // rows


    let y = gap;

    for (let i = 1; i < Math.round(canvasHeight / gap); i += 1) {
      $d37dd1ef1528e42b34ecf1e442f3798$var$line(scene, 0, y * i, canvasWidth, y * i, 1, color);
    }
  };

  const $d37dd1ef1528e42b34ecf1e442f3798$var$canvas = document.getElementById('canvas');
  const $d37dd1ef1528e42b34ecf1e442f3798$var$scene = $d37dd1ef1528e42b34ecf1e442f3798$var$canvas.getContext('2d');

  function $d37dd1ef1528e42b34ecf1e442f3798$var$draw() {
    requestAnimationFrame($d37dd1ef1528e42b34ecf1e442f3798$var$draw);
    $d37dd1ef1528e42b34ecf1e442f3798$var$grid($d37dd1ef1528e42b34ecf1e442f3798$var$scene, $d37dd1ef1528e42b34ecf1e442f3798$var$canvas.width, $d37dd1ef1528e42b34ecf1e442f3798$var$canvas.height, 10, '#e2e2e2');
    $d37dd1ef1528e42b34ecf1e442f3798$var$line($d37dd1ef1528e42b34ecf1e442f3798$var$scene, 0, 10, 390, 10, 1, 'blue');
  }

  $d37dd1ef1528e42b34ecf1e442f3798$var$draw();
})();
//# sourceMappingURL=02-grid.87375e6a.js.map
