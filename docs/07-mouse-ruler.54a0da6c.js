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

  function $f3094f620db763263a23e9467cd458d5$export$line(scene, x1, y1, x2, y2, width, color) {
    scene.beginPath();
    scene.lineWidth = width;
    scene.strokeStyle = color;
    scene.moveTo(x1, y1);
    scene.lineTo(x2, y2);
    scene.stroke();
  }

  const {
    canvas: $abdc7aea335bbac1d2833646d408cd6$var$canvas,
    scene: $abdc7aea335bbac1d2833646d408cd6$var$scene
  } = $bf5096e55bb6ae2cfbfaf7e6cb056$export$newCanvas(500, 380, '#e2e2e2');
  let $abdc7aea335bbac1d2833646d408cd6$var$horizontalRuler, $abdc7aea335bbac1d2833646d408cd6$var$verticalRuler;
  $abdc7aea335bbac1d2833646d408cd6$var$canvas.addEventListener('mousemove', event => {
    $abdc7aea335bbac1d2833646d408cd6$var$horizontalRuler = $abdc7aea335bbac1d2833646d408cd6$var$createHorizontalRuler(event.offsetX, event.offsetY, 'orange');
    $abdc7aea335bbac1d2833646d408cd6$var$verticalRuler = $abdc7aea335bbac1d2833646d408cd6$var$createVerticalRuler(event.offsetX, event.offsetY, 'orange');
  });

  function $abdc7aea335bbac1d2833646d408cd6$var$createHorizontalRuler(mouseX, mouseY, color) {
    return {
      x1: 0,
      y1: mouseY,
      x2: mouseX,
      y2: mouseY,
      color: color
    };
  }

  function $abdc7aea335bbac1d2833646d408cd6$var$createVerticalRuler(mouseX, mouseY, color) {
    return {
      x1: mouseX,
      y1: 0,
      x2: mouseX,
      y2: mouseY,
      color: color
    };
  }

  function $abdc7aea335bbac1d2833646d408cd6$var$drawRuler(scene, ruler) {
    $f3094f620db763263a23e9467cd458d5$export$line(scene, ruler.x1, ruler.y1, ruler.x2, ruler.y2, 1, ruler.color);
  }

  function $abdc7aea335bbac1d2833646d408cd6$var$drawLabel(scene, ruler, color, fontSize, position) {
    scene.fillStyle = color;
    scene.font = `${fontSize}x monospace`;
    scene.fillText(`(${ruler.x2}, ${ruler.y2})`, ruler.x2, ruler.y2);
  }

  function $abdc7aea335bbac1d2833646d408cd6$var$draw() {
    requestAnimationFrame($abdc7aea335bbac1d2833646d408cd6$var$draw);
    $bf5096e55bb6ae2cfbfaf7e6cb056$export$clearScene($abdc7aea335bbac1d2833646d408cd6$var$scene, $abdc7aea335bbac1d2833646d408cd6$var$canvas);

    if ($abdc7aea335bbac1d2833646d408cd6$var$horizontalRuler) {
      $abdc7aea335bbac1d2833646d408cd6$var$drawRuler($abdc7aea335bbac1d2833646d408cd6$var$scene, $abdc7aea335bbac1d2833646d408cd6$var$horizontalRuler);
    }

    if ($abdc7aea335bbac1d2833646d408cd6$var$verticalRuler) {
      $abdc7aea335bbac1d2833646d408cd6$var$drawRuler($abdc7aea335bbac1d2833646d408cd6$var$scene, $abdc7aea335bbac1d2833646d408cd6$var$verticalRuler);
      $abdc7aea335bbac1d2833646d408cd6$var$drawLabel($abdc7aea335bbac1d2833646d408cd6$var$scene, $abdc7aea335bbac1d2833646d408cd6$var$verticalRuler, '#000000');
    }
  }

  $abdc7aea335bbac1d2833646d408cd6$var$draw(); // class Ruler {
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
})();
//# sourceMappingURL=07-mouse-ruler.54a0da6c.js.map
