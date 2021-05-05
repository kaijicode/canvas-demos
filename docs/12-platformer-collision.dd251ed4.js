(function () {
  // ASSET: /home/vova/src/canvas-demos/src/12-platformer-collision/index.js

  /** Pallete
  #fcf0c0
  #ef8f4f
  #f8d803
  #8dc267
  #66dcfe
  #49a0e1
  #b399c9
  */
  const $a56047e223ac22f7993a2ceb280bc6a$var$sum = arr => {
    return arr.reduce((total, x) => total + x, 0);
  };

  const $a56047e223ac22f7993a2ceb280bc6a$var$keyboard = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
  };

  function $a56047e223ac22f7993a2ceb280bc6a$var$createJumpAnimation(height) {
    let frame = 0;
    let isRunning = false;
    const movement = [// ascend
    -0.3, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, // apex
    0, 0, 0, 0, // descend
    0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3];
    return {
      step: () => {
        const velocity = height * movement[frame];
        frame += 1;
        return velocity;
      },
      next: () => {
        const velocity = height * movement[frame];
        frame += 1;
        return velocity;
      },
      previous: () => {
        frame = frame - 1 >= 0 ? frame - 1 : 0;
        return height * movement[frame];
      },
      start: () => {
        isRunning = true;
      },
      stop: () => {
        frame = 0;
        isRunning = false;
      },
      isRunning: () => {
        return isRunning;
      },
      isLastFrame: () => {
        return frame >= movement.length;
      }
    };
  }

  class $a56047e223ac22f7993a2ceb280bc6a$var$Player {
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
      this.isJumping = false;
      this.jumpAnimation = $a56047e223ac22f7993a2ceb280bc6a$var$createJumpAnimation(this.height * 5);
      this.gravity = 1;
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
    } // returns closest object to player


    closest(player, objects) {
      return objects.reduce((closest, object) => {
        const {
          top: closestTop,
          right: closestRight,
          bottom: closestBottom,
          left: closestLeft
        } = closest.distance(player);
        const {
          top,
          right,
          bottom,
          left
        } = object.distance(player);
        const closestMin = $a56047e223ac22f7993a2ceb280bc6a$var$sum([closestTop, closestRight, closestBottom, closestLeft].filter(x => x >= 0));
        const objectMin = $a56047e223ac22f7993a2ceb280bc6a$var$sum([top, right, bottom, left].filter(x => x >= 0));

        if (objectMin < closestMin) {
          return object;
        }

        return closest;
      }, objects[0]);
    }

    update(scene, objects) {
      // check for collision with other objects
      // const collisions = [];
      //
      // let collision = {};
      // for (const object of objects) {
      //     collision = object.checkAABB(this);
      //
      //     if (collision) {
      //         console.log('collision! ', collision);
      //         collisions.push(object);
      //     }
      // }
      // calculate movement velocity per direction
      // const velocity = objects.reduce((closest, object) => {
      //     const { top, right, bottom, left } = object.distance(this);
      //     closest.top = top >= 0 ? Math.min(closest.top, top) : closest.top;
      //     closest.right = right >= 0 ? Math.min(closest.right, right) : closest.right;
      //     closest.bottom = bottom >= 0 ? Math.min(closest.bottom, bottom) : closest.bottom;
      //     closest.left = left >= 0 ? Math.min(closest.left, left) : closest.left;
      //
      //     return closest;
      // }, { top: this.yVelocity, right: this.xVelocity, bottom: this.yVelocity, left: this.xVelocity });
      //
      // const canMoveRightLeft = velocity.left >= 0 || velocity.right >= 0;
      // const canMoveUpDown = velocity.top >= 0 || velocity.bottom >= 0;
      // const { top, right, bottom, left } = objects[0].distance(this);
      // const { top: top2, right: right2, bottom: bottom2, left: left2 } = objects[1].distance(this);
      // console.log(objects[0].name, top, right, bottom, left);
      // console.log(objects[1].name, top2, right2, bottom2, left2);
      const closestObject = this.closest(this, objects); // console.log('closest object is: ', closestObject.name);

      const distance = closestObject.distance(this); // subtract one pixel to avoid collision
      // const velocity = {
      //     top: this.xVelocity,
      //     right: distance.right - 1 >= 0 ? Math.min(this.baseXVelocity, distance.right - 1) : this.baseXVelocity,
      //     bottom: this.xVelocity,
      //     left: distance.left - 1 >= 0 ? Math.min(this.baseXVelocity, distance.left - 1) : this.baseXVelocity,
      // }

      const velocity = {
        top: this.baseXVelocity,
        bottom: this.baseXVelocity
      };
      const isTopOrBottomCollision = distance.top - 1 <= 0 && distance.bottom - 1 <= 0;
      const isLeftOrRightCollision = distance.left - 1 <= 0 && distance.right - 1 <= 0;

      if (distance.right - 1 >= 0 && isTopOrBottomCollision) {
        velocity.right = Math.min(this.baseXVelocity, distance.right - 1);
      } else {
        velocity.right = this.baseXVelocity;
      } // console.log(distance.top, distance.right, distance.bottom, distance.left)


      if (distance.left - 1 >= 0 && isTopOrBottomCollision) {
        // can not pass below or above
        velocity.left = Math.min(this.baseXVelocity, distance.left - 1);
      } else {
        velocity.left = this.baseXVelocity;
      }

      if (distance.top - 1 >= 0 && isLeftOrRightCollision) {
        velocity.top = Math.min(this.baseYVelocity, distance.top - 1);
      } else {
        velocity.top = this.baseYVelocity;
      }

      if (distance.bottom - 1 >= 0 && isLeftOrRightCollision) {
        velocity.bottom = Math.min(this.baseYVelocity, distance.bottom - 1);
      } else {
        velocity.bottom = this.baseYVelocity;
      } // const velocity = {
      //     top: this.xVelocity,
      //     right: this.xVelocity,
      //     bottom: this.xVelocity,
      //     left: this.xVelocity,
      // }
      // console.log(velocity)
      // this.log(closest);
      // for (const object of objects) {
      //     distance = {};
      //     distance = object.distance(this);
      //
      //     // calculate distance from all objects
      //     // find the closest object
      //     // apply min(xVelocity, distanceX) when player is moving
      //     //
      //
      //     // if (distance.top <= 0 && distance.right <= 0 && distance.bottom <= 0 && distance.left <= 0) {
      //     //     const max = Math.max(distance.top, distance.right, distance.bottom, distance.left);
      //     //     console.log(distance, max);
      //     // }
      //     // this.log(distance);
      //     if (isCollision) {
      //         break;
      //     }
      // }


      if ($a56047e223ac22f7993a2ceb280bc6a$var$keyboard.right) {
        this.moveRight(velocity.right);
      }

      if ($a56047e223ac22f7993a2ceb280bc6a$var$keyboard.left) {
        this.moveLeft(velocity.left);
      } // collision test


      if ($a56047e223ac22f7993a2ceb280bc6a$var$keyboard.up) {
        this.moveUp(velocity.top);
      }

      if ($a56047e223ac22f7993a2ceb280bc6a$var$keyboard.down) {
        this.moveDown(velocity.bottom);
      } // TODO: prevent moving into other objects
      // if (keyboard.right && !collision.right) {
      //     this.moveRight();
      // }
      //
      // if (keyboard.left && !collision.left) {
      //     this.moveLeft();
      // }
      // TODO: cancel gravity when player stands still?
      // if (isSpacebarKeyPressed && !this.jumpAnimation.isRunning()) {
      //     this.jumpAnimation.start();
      //     this.xVelocity *= 2;
      // }
      //
      // if (this.jumpAnimation.isRunning() && !collision.bottom && !collision.top) {
      //     this.y += this.jumpAnimation.step();
      // }
      //
      // if (this.jumpAnimation.isLastFrame() || collision.bottom || collision.top) {
      //     this.jumpAnimation.stop();
      //     this.xVelocity = this.baseXVelocity;
      // }
      //
      // if (collision.bottom) {
      //     this.y = collision.y - this.height;
      // } else {
      //     this.y += this.gravity;
      // }
      //
      // scene boundaries
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

  class $a56047e223ac22f7993a2ceb280bc6a$var$Thing {
    constructor(name, x, y, width, height, color) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
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

  }

  const $a56047e223ac22f7993a2ceb280bc6a$var$canvas = document.getElementById("canvas");
  const $a56047e223ac22f7993a2ceb280bc6a$var$scene = $a56047e223ac22f7993a2ceb280bc6a$var$canvas.getContext("2d"); // const ground = new Thing('ground', 0, canvas.height - 80, canvas.width, 80, '#b399c9');

  const $a56047e223ac22f7993a2ceb280bc6a$var$player = new $a56047e223ac22f7993a2ceb280bc6a$var$Player($a56047e223ac22f7993a2ceb280bc6a$var$canvas.width / 2, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 20, 20, 20, '#8dc267');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width / 2 + 120, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 40, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box2 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-2', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width / 2 - 120, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 120, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box3 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-3', 200, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 220, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box4 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-4', 240, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 220, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box5 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-5', 300, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 260, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box6 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-6', 340, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 270, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box7 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-7', 240, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 350, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box8 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-8', 0, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 40, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box9 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-9', 0, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 80, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box10 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-10', 40, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 40, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box11 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-11', 80, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 140, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box12 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-12', 40, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 140, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box13 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-13', 80, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 100, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box14 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-14', 40, 40, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box15 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-15', 80, 40, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box16 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-16', 120, 40, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box17 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-17', 40, 120, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box18 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-18', 80, 120, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box19 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-19', 120, 120, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box20 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-20', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 80, 40, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box21 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-21', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 80, 80, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box22 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-22', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 80, 120, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box23 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-23', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 160, 40, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box24 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-24', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 160, 80, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box25 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-25', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 160, 120, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box26 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-26', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 200, 200, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box27 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-27', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 160, 200, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box28 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-28', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 120, 200, 40, 40, '#b399c9');
  const $a56047e223ac22f7993a2ceb280bc6a$var$box29 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('box-29', $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width - 80, 200, 40, 40, '#ef8f4f');
  const $a56047e223ac22f7993a2ceb280bc6a$var$platform1 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('platform1', 50, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 60, 150, 10, '#fff');
  const $a56047e223ac22f7993a2ceb280bc6a$var$platform2 = new $a56047e223ac22f7993a2ceb280bc6a$var$Thing('platform2', 250, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height - 120, 150, 10, '#fff');
  const $a56047e223ac22f7993a2ceb280bc6a$var$objects = [// ground,
  $a56047e223ac22f7993a2ceb280bc6a$var$box, $a56047e223ac22f7993a2ceb280bc6a$var$box2, $a56047e223ac22f7993a2ceb280bc6a$var$box3, $a56047e223ac22f7993a2ceb280bc6a$var$box4, $a56047e223ac22f7993a2ceb280bc6a$var$box5, $a56047e223ac22f7993a2ceb280bc6a$var$box6, $a56047e223ac22f7993a2ceb280bc6a$var$box7, $a56047e223ac22f7993a2ceb280bc6a$var$box8, $a56047e223ac22f7993a2ceb280bc6a$var$box9, $a56047e223ac22f7993a2ceb280bc6a$var$box10, $a56047e223ac22f7993a2ceb280bc6a$var$box11, $a56047e223ac22f7993a2ceb280bc6a$var$box12, $a56047e223ac22f7993a2ceb280bc6a$var$box13, $a56047e223ac22f7993a2ceb280bc6a$var$box14, $a56047e223ac22f7993a2ceb280bc6a$var$box15, $a56047e223ac22f7993a2ceb280bc6a$var$box16, $a56047e223ac22f7993a2ceb280bc6a$var$box17, $a56047e223ac22f7993a2ceb280bc6a$var$box18, $a56047e223ac22f7993a2ceb280bc6a$var$box19, $a56047e223ac22f7993a2ceb280bc6a$var$box20, $a56047e223ac22f7993a2ceb280bc6a$var$box21, $a56047e223ac22f7993a2ceb280bc6a$var$box22, $a56047e223ac22f7993a2ceb280bc6a$var$box23, $a56047e223ac22f7993a2ceb280bc6a$var$box24, $a56047e223ac22f7993a2ceb280bc6a$var$box25, $a56047e223ac22f7993a2ceb280bc6a$var$box26, $a56047e223ac22f7993a2ceb280bc6a$var$box27, $a56047e223ac22f7993a2ceb280bc6a$var$box28, $a56047e223ac22f7993a2ceb280bc6a$var$box29, $a56047e223ac22f7993a2ceb280bc6a$var$player // platform1,
  // platform2
  ];

  const $a56047e223ac22f7993a2ceb280bc6a$var$handleKeyDownPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.up = true;
        break;

      case 'ArrowLeft':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.left = true;
        break;

      case 'ArrowDown':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.down = true;
        break;

      case 'ArrowRight':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.right = true;
        break;

      case ' ':
        if (!$a56047e223ac22f7993a2ceb280bc6a$var$keyboard.space) {
          $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.space = true;
        }

        break;

      default:
        break;
    }
  };

  const $a56047e223ac22f7993a2ceb280bc6a$var$handleKeyUpPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.up = false;
        break;

      case 'ArrowLeft':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.left = false;
        break;

      case 'ArrowDown':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.down = false;
        break;

      case 'ArrowRight':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.right = false;
        break;

      case ' ':
        $a56047e223ac22f7993a2ceb280bc6a$var$keyboard.space = false;
        break;

      default:
        break;
    }
  };

  document.addEventListener('keydown', $a56047e223ac22f7993a2ceb280bc6a$var$handleKeyDownPress);
  document.addEventListener('keyup', $a56047e223ac22f7993a2ceb280bc6a$var$handleKeyUpPress);

  function $a56047e223ac22f7993a2ceb280bc6a$var$draw() {
    requestAnimationFrame($a56047e223ac22f7993a2ceb280bc6a$var$draw);
    $a56047e223ac22f7993a2ceb280bc6a$var$scene.clearRect(0, 0, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.width, $a56047e223ac22f7993a2ceb280bc6a$var$canvas.height);

    for (const object of $a56047e223ac22f7993a2ceb280bc6a$var$objects) {
      object.update($a56047e223ac22f7993a2ceb280bc6a$var$scene, $a56047e223ac22f7993a2ceb280bc6a$var$objects.filter(current => current !== object));
      object.render($a56047e223ac22f7993a2ceb280bc6a$var$scene);
    }
  }

  $a56047e223ac22f7993a2ceb280bc6a$var$draw();
})();
//# sourceMappingURL=12-platformer-collision.dd251ed4.js.map
