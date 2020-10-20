(function () {
  // ASSET: /home/vova/src/canvas-demos/src/03-movable-rectangle/index.js
  const $e54dee6a5673b421405d9c95263bf251$var$log = (...args) => {
    console.log(...args);
  };

  const $e54dee6a5673b421405d9c95263bf251$var$rectangle = (x, y, width, height, color) => {
    const speed = 2;
    return {
      x,
      y,
      width,
      height,
      color,

      move(x, y) {
        this.x = x;
        this.y = y;
      },

      moveLeft() {
        this.x -= speed;
      },

      moveRight() {
        this.x += speed;
      },

      draw(scene) {
        scene.fillStyle = this.color;
        scene.fillRect(this.x, this.y, this.width, this.height);
      }

    };
  };

  const $e54dee6a5673b421405d9c95263bf251$var$canvas = document.getElementById("canvas");
  const $e54dee6a5673b421405d9c95263bf251$var$scene = $e54dee6a5673b421405d9c95263bf251$var$canvas.getContext("2d");
  const $e54dee6a5673b421405d9c95263bf251$var$player = $e54dee6a5673b421405d9c95263bf251$var$rectangle(0, $e54dee6a5673b421405d9c95263bf251$var$canvas.height - 100, 100, 100, 'magenta');
  let $e54dee6a5673b421405d9c95263bf251$var$isRightKeyPressed = false;
  let $e54dee6a5673b421405d9c95263bf251$var$isLeftKeyPressed = false;

  const $e54dee6a5673b421405d9c95263bf251$var$handleKeyDownPress = event => {
    $e54dee6a5673b421405d9c95263bf251$var$log(`handleKeyDownPress: ${event.key}`);

    switch (event.key) {
      case 'Right':
      case 'ArrowRight':
        {
          $e54dee6a5673b421405d9c95263bf251$var$isRightKeyPressed = true;
          break;
        }

      case 'Left':
      case 'ArrowLeft':
        {
          $e54dee6a5673b421405d9c95263bf251$var$isLeftKeyPressed = true;
          break;
        }

      default:
        break;
    }
  };

  const $e54dee6a5673b421405d9c95263bf251$var$handleKeyUpPress = event => {
    $e54dee6a5673b421405d9c95263bf251$var$log(`handleKeyUpPress: ${event.key}`);

    switch (event.key) {
      case 'Right':
      case 'ArrowRight':
        {
          $e54dee6a5673b421405d9c95263bf251$var$isRightKeyPressed = false;
          break;
        }

      case 'Left':
      case 'ArrowLeft':
        {
          $e54dee6a5673b421405d9c95263bf251$var$isLeftKeyPressed = false;
          break;
        }

      default:
        break;
    }
  };

  document.addEventListener('keydown', $e54dee6a5673b421405d9c95263bf251$var$handleKeyDownPress);
  document.addEventListener('keyup', $e54dee6a5673b421405d9c95263bf251$var$handleKeyUpPress);

  function $e54dee6a5673b421405d9c95263bf251$var$draw() {
    requestAnimationFrame($e54dee6a5673b421405d9c95263bf251$var$draw);
    $e54dee6a5673b421405d9c95263bf251$var$scene.clearRect(0, 0, $e54dee6a5673b421405d9c95263bf251$var$canvas.width, $e54dee6a5673b421405d9c95263bf251$var$canvas.height);
    $e54dee6a5673b421405d9c95263bf251$var$player.draw($e54dee6a5673b421405d9c95263bf251$var$scene);

    if ($e54dee6a5673b421405d9c95263bf251$var$isRightKeyPressed) {
      $e54dee6a5673b421405d9c95263bf251$var$player.moveRight();
    }

    if ($e54dee6a5673b421405d9c95263bf251$var$isLeftKeyPressed) {
      $e54dee6a5673b421405d9c95263bf251$var$player.moveLeft();
    }
  }

  $e54dee6a5673b421405d9c95263bf251$var$draw();
})();
//# sourceMappingURL=03-movable-rectangle.8e8f50a3.js.map
