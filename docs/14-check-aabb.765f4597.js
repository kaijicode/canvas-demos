(function () {
  // ASSET: /home/vova/src/canvas-demos/src/14-check-aabb/index.js
  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$COLORS = {
    BEIGE: '#fcf0c0',
    ORANGE: '#ef8f4f',
    YELLOW: '#f8d803',
    GREEN: '#8dc267',
    LIGHT_BLUE: '#66dcfe',
    BLUE: '#49a0e1',
    PURPLE: '#b399c9',
    SOFT_RED: '#fcc0cc',
    SOFT_YELLOW: '#fcf0c0',
    SOFT_CYAN: '#c0fcf0',
    SOFT_BLUE: '#c0ccfc'
  };
  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
  };

  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$checkAABB = (objectA, objectB) => {
    const top = objectB.y > objectA.y + objectA.height;
    const bottom = objectB.y + objectB.height < objectA.y;
    const right = objectB.x + objectB.width < objectA.x;
    const left = objectB.x > objectA.x + objectA.width; // if any of (top, right, bottom, left) is true, then there is no collision because
    // one edge is far away from the other

    return !(top || right || bottom || left);
  };

  class $ad43ab7e726c45f4da3ae6fd85a45e2$var$Player {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.baseXVelocity = 8;
      this.baseYVelocity = this.baseXVelocity;
      this.xVelocity = this.baseXVelocity;
      this.yVelocity = this.baseYVelocity;
      this.lastLog = {};
    }

    log(...args) {
      const serialized = JSON.stringify(...args);

      if (serialized !== this.lastLog) {
        this.lastLog = serialized;
        console.log(...args);
      }
    }

    moveLeft(velocity) {
      this.x -= velocity;
    }

    moveRight(velocity) {
      this.x += velocity;
    }

    moveUp(velocity) {
      this.y -= velocity;
    }

    moveDown(velocity) {
      this.y += velocity;
    }

    update(scene, objects) {
      for (const object of objects) {
        object.unmark();

        if ($ad43ab7e726c45f4da3ae6fd85a45e2$var$checkAABB(this, object)) {
          object.mark();
        }
      } //////////////////////////////////////// movement


      if ($ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.right) {
        this.moveRight(this.baseXVelocity);
      }

      if ($ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.left) {
        this.moveLeft(this.baseXVelocity);
      }

      if ($ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.up) {
        this.moveUp(this.baseYVelocity);
      }

      if ($ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.down) {
        this.moveDown(this.baseYVelocity);
      } /////////////////////////////////////// scene boundaries
      // top boundary


      if (this.y < 0) {
        this.y = 0;
      } // right boundary


      if (this.x + this.width > scene.canvas.width) {
        this.x = scene.canvas.width - this.width;
      } // left boundary


      if (this.x < 0) {
        this.x = 0;
      } // bottom boundary


      if (this.height + this.y > scene.canvas.height) {
        this.y = scene.canvas.height - this.height;
      }
    }

    render(scene) {
      scene.fillStyle = this.color;
      scene.fillRect(this.x, this.y, this.width, this.height);
      scene.fillStyle = 'rgba(0, 0, 0, 1)';
      scene.font = '12px monospace';
      scene.fillText(`${this.x},${this.y}`, this.x, this.y);
    }

  }

  class $ad43ab7e726c45f4da3ae6fd85a45e2$var$Thing {
    constructor(name, x, y, width, height, color) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.originalColor = color;
    }

    update() {}

    render(scene) {
      scene.fillStyle = this.color;
      scene.fillRect(this.x, this.y, this.width, this.height);
      scene.fillStyle = 'rgba(0, 0, 0, 1)';
      scene.font = '12px monospace';
      scene.fillText(this.name, this.x, this.y);
    }

    isInside = (n, min, max) => {
      // TODO: or > and <?
      return n > min && n < max;
    }; // AABB - axis aligned bounding boxes

    checkCollision(object) {
      let collision = {
        top: false,
        right: false,
        bottom: false,
        left: false
      };
      const topOverlap = this.isInside(object.y, this.y, this.y + this.height);
      const leftOverlap = this.isInside(object.x, this.x, this.x + this.width);
      const bottomOverlap = this.isInside(object.y + object.height, this.y, this.y + this.height);
      const rightOverlap = this.isInside(object.x + object.width, this.x, this.x + this.width);
      const leftOrRightOverlap = leftOverlap || rightOverlap;
      const topOrBottomOverlap = topOverlap || bottomOverlap;

      if (topOverlap && leftOrRightOverlap) {
        collision = { ...collision,
          top: true
        };
      }

      if (bottomOverlap && leftOrRightOverlap) {
        collision = { ...collision,
          bottom: true
        };
      }

      if (leftOverlap && topOrBottomOverlap) {
        collision = { ...collision,
          left: true
        };
      }

      if (rightOverlap && topOrBottomOverlap) {
        collision = { ...collision,
          right: true
        };
      }

      return { ...collision,
        target: {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height
        }
      };
    }

    checkAABB(object) {
      // my way
      const top = object.y > this.y + this.height;
      const bottom = object.y + object.height < this.y;
      const right = object.x + object.width < this.x;
      const left = object.x > this.x + this.width; // if any of (top, right, bottom, left) is true, then there is no collision because
      // one edge is far away from the other

      return !(top || right || bottom || left); // const left = object.y
      // if any of (top, right, bottom, left) is true, then there is no collision because
      // one edge is far away from the other
      // return ;
    }

    checkAABB2(player) {
      return player.y < this.y + this.height && player.y + player.height > this.y && player.x < this.x + this.width && player.x + player.width > this.x;
    }

    distance(object) {
      // return {
      //     top: object.y - (this.y + this.height),
      //     bottom: this.y - (object.y + object.height),
      //     right: this.x - (object.x + object.width),
      //     left: object.x - (this.x + this.width)
      // }
      return {
        top: object.y - (this.y + this.height),
        bottom: this.y - (object.y + object.height),
        right: this.x - (object.x + object.width),
        left: object.x - (this.x + this.width)
      };
    }

    mark() {
      this.color = $ad43ab7e726c45f4da3ae6fd85a45e2$var$COLORS.YELLOW;
    }

    unmark() {
      this.color = this.originalColor;
    }

  }

  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas = document.getElementById("canvas");
  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$scene = $ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas.getContext("2d");
  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$player = new $ad43ab7e726c45f4da3ae6fd85a45e2$var$Player($ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas.width / 2, $ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas.height - 20, 20, 20, '#8dc267');
  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$box4 = new $ad43ab7e726c45f4da3ae6fd85a45e2$var$Thing('box-4', 240, $ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas.height - 220, 40, 40, '#b399c9');
  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$box7 = new $ad43ab7e726c45f4da3ae6fd85a45e2$var$Thing('box-7', 340, $ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas.height - 250, 15, 15, '#b399c9');
  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$objects = [$ad43ab7e726c45f4da3ae6fd85a45e2$var$box4, $ad43ab7e726c45f4da3ae6fd85a45e2$var$box7, $ad43ab7e726c45f4da3ae6fd85a45e2$var$player // platform1,
  // platform2
  ];

  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$handleKeyDownPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.up = true;
        break;

      case 'ArrowLeft':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.left = true;
        break;

      case 'ArrowDown':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.down = true;
        break;

      case 'ArrowRight':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.right = true;
        break;

      case ' ':
        if (!$ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.space) {
          $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.space = true;
        }

        break;

      default:
        break;
    }
  };

  const $ad43ab7e726c45f4da3ae6fd85a45e2$var$handleKeyUpPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.up = false;
        break;

      case 'ArrowLeft':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.left = false;
        break;

      case 'ArrowDown':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.down = false;
        break;

      case 'ArrowRight':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.right = false;
        break;

      case ' ':
        $ad43ab7e726c45f4da3ae6fd85a45e2$var$keyboard.space = false;
        break;

      default:
        break;
    }
  };

  document.addEventListener('keydown', $ad43ab7e726c45f4da3ae6fd85a45e2$var$handleKeyDownPress);
  document.addEventListener('keyup', $ad43ab7e726c45f4da3ae6fd85a45e2$var$handleKeyUpPress);

  function $ad43ab7e726c45f4da3ae6fd85a45e2$var$draw() {
    requestAnimationFrame($ad43ab7e726c45f4da3ae6fd85a45e2$var$draw);
    $ad43ab7e726c45f4da3ae6fd85a45e2$var$scene.clearRect(0, 0, $ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas.width, $ad43ab7e726c45f4da3ae6fd85a45e2$var$canvas.height);

    for (const object of $ad43ab7e726c45f4da3ae6fd85a45e2$var$objects) {
      object.update($ad43ab7e726c45f4da3ae6fd85a45e2$var$scene, $ad43ab7e726c45f4da3ae6fd85a45e2$var$objects.filter(current => current !== object));
      object.render($ad43ab7e726c45f4da3ae6fd85a45e2$var$scene);
    }
  }

  $ad43ab7e726c45f4da3ae6fd85a45e2$var$draw();
})();
//# sourceMappingURL=14-check-aabb.765f4597.js.map
