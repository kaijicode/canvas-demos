(function () {
  // ASSET: /home/vova/src/canvas-demos/src/06-measure-text-height/index.js
  const $f08a94843949ef8dfd0820d3ad650fe9$var$canvas = document.getElementById('canvas');
  const $f08a94843949ef8dfd0820d3ad650fe9$var$scene = $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.getContext('2d');
  window.canvasWidth = $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.width;
  window.canvasHeight = $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.height;
  window.scene = $f08a94843949ef8dfd0820d3ad650fe9$var$scene;

  function* $f08a94843949ef8dfd0820d3ad650fe9$var$pixels(imageData) {
    for (let i = 0; i < imageData.data.length; i += 4) {
      yield {
        red: imageData.data[i],
        green: imageData.data[i + 1],
        blue: imageData.data[i + 2],
        alpha: imageData.data[i + 3]
      };
    }
  }

  function $f08a94843949ef8dfd0820d3ad650fe9$var$take(iter, n) {
    let i = 0;
    const items = [];

    while (i < n) {
      items.push(iter.next());
      i += 1;
    }

    return items;
  }

  function* $f08a94843949ef8dfd0820d3ad650fe9$var$lines(scene, width, height) {
    const imageData = scene.getImageData(0, 0, width, height);
    const iterator = $f08a94843949ef8dfd0820d3ad650fe9$var$pixels(imageData);

    for (let i = 0; i < width * height; i += width) {
      yield $f08a94843949ef8dfd0820d3ad650fe9$var$take(iterator, width).map(pixel => pixel.value);
    }
  }

  function $f08a94843949ef8dfd0820d3ad650fe9$var$isSamePixel(pixel1, pixel2) {
    return Object.keys(pixel1).every(color => pixel1[color] === pixel2[color]);
  } // read pixels line by line
  // calculate top by finding pixels matching the text color
  // calculate bottom by finding the pixels matching the background color


  function $f08a94843949ef8dfd0820d3ad650fe9$var$calcTextBounds(scene, canvasWidth, canvasHeight, textColor = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 255
  }, backgroundColor = {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 255
  }) {
    const iterator = $f08a94843949ef8dfd0820d3ad650fe9$var$lines(scene, canvasWidth, canvasHeight);
    let line = iterator.next();
    let top = 0;

    while (!line.done) {
      if (line.value.some(pixel => $f08a94843949ef8dfd0820d3ad650fe9$var$isSamePixel(pixel, textColor))) {
        break;
      }

      line = iterator.next();
      top += 1;
    }

    line = iterator.next();
    let bottom = top + 1;

    while (!line.done) {
      if (line.value.every(pixel => $f08a94843949ef8dfd0820d3ad650fe9$var$isSamePixel(pixel, backgroundColor))) {
        break;
      }

      line = iterator.next();
      bottom += 1;
    }

    return {
      top,
      bottom
    };
  }

  function $f08a94843949ef8dfd0820d3ad650fe9$var$draw() {
    // background
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.fillStyle = 'rgba(255, 255, 255, 1)';
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.fillRect(0, 0, $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.width, $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.height); // text

    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.fillStyle = 'rgba(0, 0, 0, 1)';
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.font = '16px monospace';
    const text = 'abcdefghijklmnopqrstuvwxyz';
    const metrics = $f08a94843949ef8dfd0820d3ad650fe9$var$scene.measureText(text);
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.fillText(text, ($f08a94843949ef8dfd0820d3ad650fe9$var$canvas.width - metrics.width) / 2, $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.height / 2);
    const rect = $f08a94843949ef8dfd0820d3ad650fe9$var$calcTextBounds($f08a94843949ef8dfd0820d3ad650fe9$var$scene, $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.width, $f08a94843949ef8dfd0820d3ad650fe9$var$canvas.height);
    console.log(rect, rect.bottom - rect.top);
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.beginPath();
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.strokeStyle = 'green';
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.moveTo(10, rect.top);
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.lineTo(10, rect.bottom);
    $f08a94843949ef8dfd0820d3ad650fe9$var$scene.stroke();
  }

  $f08a94843949ef8dfd0820d3ad650fe9$var$draw();
})();
//# sourceMappingURL=06-measure-text-height.8f73cefb.js.map
