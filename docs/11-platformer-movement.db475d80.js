(function () {
  // ASSET: /home/vova/src/canvas-demos/src/11-platformer-movement/index.js
  let $dff73acf91e697791d249709073$var$isRightKeyPressed = false;
  let $dff73acf91e697791d249709073$var$isLeftKeyPressed = false;
  let $dff73acf91e697791d249709073$var$isUpKeyPressed = false;
  let $dff73acf91e697791d249709073$var$isDownKeyPressed = false;
  let $dff73acf91e697791d249709073$var$isSpacebarKeyPressed = false;

  function $dff73acf91e697791d249709073$var$createJumpAnimation(height) {
    let frame = 0;
    let isRunning = false;
    const movement = [// ascend
    -0.3, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, // apex
    0, 0, 0, 0, // descend
    0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3];
    const animation = {
      step: () => {
        if (animation.isFinished()) {
          return 0;
        }

        const velocity = height * movement[frame];
        frame += 1;
        return velocity;
      },
      start: () => {
        isRunning = true;
      },
      reset: () => {
        frame = 0;
        isRunning = false;
      },
      isRunning: () => {
        return isRunning;
      },
      isFinished: () => {
        return frame >= movement.length;
      }
    };
    return animation;
  }

  class $dff73acf91e697791d249709073$var$Player {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.baseXVelocity = 5;
      this.xVelocity = 5;
      this.isJumping = false;
      this.jumpAnimation = $dff73acf91e697791d249709073$var$createJumpAnimation(this.height * 5);
      this.gravity = 1;
    }

    moveLeft() {
      this.x -= this.xVelocity;
    }

    moveRight() {
      this.x += this.xVelocity;
    }

    render(scene) {
      if ($dff73acf91e697791d249709073$var$isRightKeyPressed) {
        this.moveRight();
      }

      if ($dff73acf91e697791d249709073$var$isLeftKeyPressed) {
        this.moveLeft();
      }

      if ($dff73acf91e697791d249709073$var$isSpacebarKeyPressed && !this.jumpAnimation.isRunning()) {
        this.jumpAnimation.start();
        this.xVelocity *= 2;
      }

      if (this.jumpAnimation.isRunning()) {
        this.y += this.jumpAnimation.step();
      }

      if (this.jumpAnimation.isFinished()) {
        this.jumpAnimation.reset();
        this.xVelocity = this.baseXVelocity;
      }

      this.y += this.gravity; // top boundary

      if (this.y < 0) {
        this.y = 0;
        this.isJumping = false;
      } // bottom boundary


      if (scene.canvas.height < this.height + this.y) {
        this.y = scene.canvas.height - this.height;
        this.isJumping = false;
        this.xVelocity = this.baseXVelocity;
      }

      scene.fillStyle = this.color;
      scene.fillRect(this.x, this.y, this.width, this.height);
    }

  }

  const $dff73acf91e697791d249709073$var$canvas = document.getElementById("canvas");
  const $dff73acf91e697791d249709073$var$scene = $dff73acf91e697791d249709073$var$canvas.getContext("2d");
  const $dff73acf91e697791d249709073$var$player = new $dff73acf91e697791d249709073$var$Player($dff73acf91e697791d249709073$var$canvas.width / 2, $dff73acf91e697791d249709073$var$canvas.height - 20, 20, 20, '#fff');

  const $dff73acf91e697791d249709073$var$handleKeyDownPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $dff73acf91e697791d249709073$var$isUpKeyPressed = true;
        break;

      case 'ArrowLeft':
        $dff73acf91e697791d249709073$var$isLeftKeyPressed = true;
        break;

      case 'ArrowDown':
        $dff73acf91e697791d249709073$var$isDownKeyPressed = true;
        break;

      case 'ArrowRight':
        $dff73acf91e697791d249709073$var$isRightKeyPressed = true;
        break;

      case ' ':
        if (!$dff73acf91e697791d249709073$var$isSpacebarKeyPressed) {
          $dff73acf91e697791d249709073$var$isSpacebarKeyPressed = true;
        }

        break;

      default:
        break;
    }
  };

  const $dff73acf91e697791d249709073$var$handleKeyUpPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $dff73acf91e697791d249709073$var$isUpKeyPressed = false;
        break;

      case 'ArrowLeft':
        $dff73acf91e697791d249709073$var$isLeftKeyPressed = false;
        break;

      case 'ArrowDown':
        $dff73acf91e697791d249709073$var$isDownKeyPressed = false;
        break;

      case 'ArrowRight':
        $dff73acf91e697791d249709073$var$isRightKeyPressed = false;
        break;

      case ' ':
        $dff73acf91e697791d249709073$var$isSpacebarKeyPressed = false;
        break;

      default:
        break;
    }
  };

  document.addEventListener('keydown', $dff73acf91e697791d249709073$var$handleKeyDownPress);
  document.addEventListener('keyup', $dff73acf91e697791d249709073$var$handleKeyUpPress);

  function $dff73acf91e697791d249709073$var$draw() {
    requestAnimationFrame($dff73acf91e697791d249709073$var$draw);
    $dff73acf91e697791d249709073$var$scene.clearRect(0, 0, $dff73acf91e697791d249709073$var$canvas.width, $dff73acf91e697791d249709073$var$canvas.height);
    $dff73acf91e697791d249709073$var$player.render($dff73acf91e697791d249709073$var$scene);
  }

  $dff73acf91e697791d249709073$var$draw();
})();
//# sourceMappingURL=11-platformer-movement.db475d80.js.map
