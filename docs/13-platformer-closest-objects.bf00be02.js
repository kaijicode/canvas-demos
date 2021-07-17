(function () {
  // ASSET: /home/vova/src/canvas-demos/src/13-platformer-closest-objects/index.js
  const $dc9235a41e76d22216724d588b08fba7$var$COLORS = {
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
  const $dc9235a41e76d22216724d588b08fba7$var$DIRECTION = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  const $dc9235a41e76d22216724d588b08fba7$var$DIRECTION_HORIZONTAL = [$dc9235a41e76d22216724d588b08fba7$var$DIRECTION.LEFT, $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.RIGHT];
  const $dc9235a41e76d22216724d588b08fba7$var$DIRECTION_VERTICAL = [$dc9235a41e76d22216724d588b08fba7$var$DIRECTION.TOP, $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.BOTTOM];
  const $dc9235a41e76d22216724d588b08fba7$var$keyboard = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
  };

  const $dc9235a41e76d22216724d588b08fba7$var$checkAABB = (objectA, objectB) => {
    const top = objectB.y > objectA.y + objectA.height;
    const bottom = objectB.y + objectB.height < objectA.y;
    const right = objectB.x + objectB.width < objectA.x;
    const left = objectB.x > objectA.x + objectA.width; // if any of (top, right, bottom, left) is true, then there is no collision because
    // one edge is far away from the other

    return !(top || right || bottom || left);
  };

  const $dc9235a41e76d22216724d588b08fba7$var$distance = (player, target) => {
    return {
      top: player.y - (target.y + target.height),
      right: target.x - (player.x + player.width),
      bottom: target.y - (player.y + player.height),
      left: player.x - (target.x + target.width)
    };
  };

  const $dc9235a41e76d22216724d588b08fba7$var$closest = (scene, player, objects) => {
    // const { vertical: verticalRay, horizontal: horizontalRay } = raycast(scene, player);
    const map = {
      top: {
        objects: [],
        distance: {}
      },
      right: {
        objects: [],
        distance: {}
      },
      bottom: {
        objects: [],
        distance: {}
      },
      left: {
        objects: [],
        distance: {}
      }
    };

    const insertIfCloser = (object, offset, direction) => {
      if (offset[direction] < 0) {
        return;
      }

      const closestDistance = map[direction].distance; // either current object's distance is same as the closest object found so far OR
      // the closest object does not exist in a list yet

      if (offset[direction] === closestDistance[direction] || !map[direction].objects.length) {
        map[direction].objects.push(object);
        map[direction].distance = offset;
      } else if (offset[direction] < closestDistance[direction]) {
        // found closer object
        map[direction].objects = [object];
        map[direction].distance = offset;
      }
    };

    objects.forEach(object => {
      const offset = $dc9235a41e76d22216724d588b08fba7$var$distance(player, object);

      if ($dc9235a41e76d22216724d588b08fba7$var$checkAABB(player.raycast.horizontal, object)) {
        insertIfCloser(object, offset, $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.LEFT);
        insertIfCloser(object, offset, $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.RIGHT);
      } else if ($dc9235a41e76d22216724d588b08fba7$var$checkAABB(player.raycast.vertical, object)) {
        insertIfCloser(object, offset, $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.TOP);
        insertIfCloser(object, offset, $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.BOTTOM);
      }
    });
    return map;
  };

  class $dc9235a41e76d22216724d588b08fba7$var$Raycast {
    constructor() {
      this.horizontal = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: '#000000'
      };
      this.vertical = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: '#000000'
      };
    }

    update(scene, target) {
      this.horizontal = { ...this.horizontal,
        x: 0,
        y: target.y,
        width: scene.canvas.width,
        height: target.height
      };
      this.vertical = { ...this.vertical,
        x: target.x,
        y: 0,
        width: target.width,
        height: scene.canvas.height
      };
    }

    render(scene) {
      for (const object of [this.horizontal, this.vertical]) {
        scene.lineWidth = "1";
        scene.strokeStyle = object.color;
        scene.strokeRect(object.x, object.y, object.width, object.height);
      }
    }

  }

  class $dc9235a41e76d22216724d588b08fba7$var$Player {
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
      this.raycast = new $dc9235a41e76d22216724d588b08fba7$var$Raycast();
      this.direction = null;
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
      this.direction = $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.LEFT;
    }

    moveRight(velocity) {
      this.x += velocity;
      this.direction = $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.RIGHT;
    }

    moveUp(velocity) {
      this.y -= velocity;
      this.direction = $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.TOP;
    }

    moveDown(velocity) {
      this.y += velocity;
      this.direction = $dc9235a41e76d22216724d588b08fba7$var$DIRECTION.BOTTOM;
    } // returns closest objects to player


    closest(scene, player, objects) {
      // scene.canvas.width, scene.canvas.height
      // const [top, right, bottom, left] = [0, 0, 0, 0];
      const closestObjects = {
        top: {
          objects: [],
          distance: {}
        },
        right: {
          objects: [],
          distance: []
        },
        bottom: {
          objects: [],
          distance: []
        },
        left: {
          objects: [],
          distance: {}
        }
      };
      objects.forEach(object => {
        if ($dc9235a41e76d22216724d588b08fba7$var$checkAABB(this.beam.horizontal, object)) {
          const offset = $dc9235a41e76d22216724d588b08fba7$var$distance(this, object);

          if (offset.left >= 0) {
            if (offset.left === closestObjects.left.distance.left) {
              closestObjects.left.objects.push(object);
            } else if (!closestObjects.left.distance.left || offset.left < closestObjects.left.distance.left) {
              closestObjects.left.objects = [object];
              closestObjects.left.distance = offset;
            }
          } else if (offset.right >= 0) {
            if (offset.right === closestObjects.right.distance.right) {
              closestObjects.right.objects.push(object);
            } else if (!closestObjects.right.distance.right || offset.right < closestObjects.right.distance.right) {
              closestObjects.right.objects = [object];
              closestObjects.right.distance = offset;
            }
          }
        } else if ($dc9235a41e76d22216724d588b08fba7$var$checkAABB(this.beam.vertical, object)) {
          const offset = $dc9235a41e76d22216724d588b08fba7$var$distance(this, object);

          if (offset.top >= 0) {
            if (offset.top === closestObjects.top.distance.top) {
              closestObjects.top.objects.push(object);
            } else if (!closestObjects.top.distance.top || offset.top < closestObjects.top.distance.top) {
              closestObjects.top.objects = [object];
              closestObjects.top.distance = offset;
            }
          } else if (offset.bottom >= 0) {
            if (offset.bottom === closestObjects.bottom.distance.bottom) {
              closestObjects.bottom.objects.push(object);
            } else if (!closestObjects.bottom.distance.bottom || offset.bottom < closestObjects.bottom.distance.bottom) {
              closestObjects.bottom.objects = [object];
              closestObjects.bottom.distance = offset;
            }
          }
        }
      });
      return closestObjects;
    }

    mark(objects) {
      for (const object of objects) {
        object.markAsClosest();
      }
    }

    update(scene, objects) {
      // TODO
      // calculate closest top, right, bottom and left objects
      // player can be close to multiple top objects
      /////////////// mark
      // const nearby = findNearbyObjects(this, objects);
      // this.log(nearby)
      // const closestObjects = groupClosestObjectsByLocation(this, nearby);
      // const closestObjects = this.closest(scene, this, objects);
      // this.log(closestObjects)
      const closestObjects = $dc9235a41e76d22216724d588b08fba7$var$closest(scene, this, objects);

      for (const object of objects) {
        object.unMarkAsClosest();
      }

      this.mark(closestObjects.top.objects);
      this.mark(closestObjects.right.objects);
      this.mark(closestObjects.bottom.objects);
      this.mark(closestObjects.left.objects); ///////////////

      const velocity = {
        top: closestObjects.top.distance.top === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.top.distance.top - 1),
        right: closestObjects.right.distance.right === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.right.distance.right - 1),
        bottom: closestObjects.bottom.distance.bottom === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.bottom.distance.bottom - 1),
        left: closestObjects.left.distance.left === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.left.distance.left - 1)
      }; // const velocity = {
      //     top: closestObjects.top.distance.top === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.top.distance.top),
      //     right: closestObjects.right.distance.right === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.right.distance.right),
      //     bottom: closestObjects.bottom.distance.bottom === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.bottom.distance.bottom),
      //     left: closestObjects.left.distance.left === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.left.distance.left)
      // }
      //////////////////////////////////////// movement

      if ($dc9235a41e76d22216724d588b08fba7$var$keyboard.right) {
        this.moveRight(velocity.right);
      }

      if ($dc9235a41e76d22216724d588b08fba7$var$keyboard.left) {
        this.moveLeft(velocity.left);
      }

      if ($dc9235a41e76d22216724d588b08fba7$var$keyboard.up) {
        this.moveUp(velocity.top);
      }

      if ($dc9235a41e76d22216724d588b08fba7$var$keyboard.down) {
        this.moveDown(velocity.bottom);
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
      } // TODO: Update raycast so that the ray not penetrating the closest objects


      this.raycast.update(scene, this);
    }

    render(scene) {
      scene.fillStyle = this.color;
      scene.fillRect(this.x, this.y, this.width, this.height);
      scene.fillStyle = 'rgba(0, 0, 0, 1)';
      scene.font = '12px monospace';
      scene.fillText(`${this.x},${this.y}`, this.x, this.y);
      this.raycast.render(scene);
    }

  }

  class $dc9235a41e76d22216724d588b08fba7$var$Thing {
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

    markAsClosest() {
      this.color = $dc9235a41e76d22216724d588b08fba7$var$COLORS.YELLOW;
    }

    unMarkAsClosest() {
      this.color = this.originalColor;
    }

  }

  const $dc9235a41e76d22216724d588b08fba7$var$canvas = document.getElementById("canvas");
  const $dc9235a41e76d22216724d588b08fba7$var$scene = $dc9235a41e76d22216724d588b08fba7$var$canvas.getContext("2d"); // const ground = new Thing('ground', 0, canvas.height - 80, canvas.width, 80, '#b399c9');

  const $dc9235a41e76d22216724d588b08fba7$var$player = new $dc9235a41e76d22216724d588b08fba7$var$Player($dc9235a41e76d22216724d588b08fba7$var$canvas.width / 2, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 20, 20, 20, '#8dc267');
  const $dc9235a41e76d22216724d588b08fba7$var$box = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box', 500, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 40, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box2 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-2', $dc9235a41e76d22216724d588b08fba7$var$canvas.width / 2 - 120, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 120, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box3 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-3', 200, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 220, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box4 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-4', 240, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 220, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box5 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-5', 300, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 260, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box6 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-6', 340, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 270, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box7 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-7', 240, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 350, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box8 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-8', 0, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 40, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box9 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-9', 0, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 80, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box10 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-10', 40, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 40, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box11 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-11', 80, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 140, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box12 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-12', 40, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 140, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box13 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-13', 80, $dc9235a41e76d22216724d588b08fba7$var$canvas.height - 100, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box14 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-14', 40, 40, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box15 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-15', 80, 40, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box16 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-16', 120, 40, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box17 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-17', 40, 120, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box18 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-18', 80, 120, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box19 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-19', 120, 120, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box20 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-20', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 80, 40, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box21 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-21', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 80, 80, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box22 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-22', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 80, 120, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box23 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-23', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 160, 40, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box24 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-24', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 160, 80, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box25 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-25', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 160, 120, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box26 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-26', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 200, 200, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box27 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-27', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 160, 200, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box28 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-28', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 120, 200, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box29 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-29', $dc9235a41e76d22216724d588b08fba7$var$canvas.width - 80, 200, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box30 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-30', 400, 300, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box31 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-31', 360, 340, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box32 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-32', 400, 340, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box33 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-33', 400, 380, 40, 40, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box34 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-34', 440, 340, 40, 40, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$box35 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-35', 300, 380, 15, 15, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box36 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-36', 300, 420, 15, 15, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box37 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-37', 80, 200, 10, 10, '#ef8f4f');
  const $dc9235a41e76d22216724d588b08fba7$var$box38 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('box-38', 80, 210, 10, 10, '#b399c9');
  const $dc9235a41e76d22216724d588b08fba7$var$platform1 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('platform1', 50, 480, 150, 10, '#fff');
  const $dc9235a41e76d22216724d588b08fba7$var$platform2 = new $dc9235a41e76d22216724d588b08fba7$var$Thing('platform2', 250, 500, 150, 10, '#fff'); // const beam = new Beam();
  // const rayTop = new Thing('ray-top', 0, 0, 0, 0, '#49a0e1');
  // const rayRight = new Thing('ray-right', 0, 0, 0, 0, '#49a0e1');
  // const rayBottom = new Thing('ray-bottom', 0, 0, 0 , 0, '#49a0e1');
  // const rayLeft = new Thing('ray-left', 0, 0, 0, 0, '#49a0e1');

  const $dc9235a41e76d22216724d588b08fba7$var$objects = [// ground,
  $dc9235a41e76d22216724d588b08fba7$var$box, $dc9235a41e76d22216724d588b08fba7$var$box2, $dc9235a41e76d22216724d588b08fba7$var$box3, $dc9235a41e76d22216724d588b08fba7$var$box4, $dc9235a41e76d22216724d588b08fba7$var$box5, $dc9235a41e76d22216724d588b08fba7$var$box6, $dc9235a41e76d22216724d588b08fba7$var$box7, $dc9235a41e76d22216724d588b08fba7$var$box8, $dc9235a41e76d22216724d588b08fba7$var$box9, $dc9235a41e76d22216724d588b08fba7$var$box10, $dc9235a41e76d22216724d588b08fba7$var$box11, $dc9235a41e76d22216724d588b08fba7$var$box12, $dc9235a41e76d22216724d588b08fba7$var$box13, $dc9235a41e76d22216724d588b08fba7$var$box14, $dc9235a41e76d22216724d588b08fba7$var$box15, $dc9235a41e76d22216724d588b08fba7$var$box16, $dc9235a41e76d22216724d588b08fba7$var$box17, $dc9235a41e76d22216724d588b08fba7$var$box18, $dc9235a41e76d22216724d588b08fba7$var$box19, $dc9235a41e76d22216724d588b08fba7$var$box20, $dc9235a41e76d22216724d588b08fba7$var$box21, $dc9235a41e76d22216724d588b08fba7$var$box22, $dc9235a41e76d22216724d588b08fba7$var$box23, $dc9235a41e76d22216724d588b08fba7$var$box24, $dc9235a41e76d22216724d588b08fba7$var$box25, $dc9235a41e76d22216724d588b08fba7$var$box26, $dc9235a41e76d22216724d588b08fba7$var$box27, $dc9235a41e76d22216724d588b08fba7$var$box28, $dc9235a41e76d22216724d588b08fba7$var$box29, $dc9235a41e76d22216724d588b08fba7$var$box30, $dc9235a41e76d22216724d588b08fba7$var$box31, $dc9235a41e76d22216724d588b08fba7$var$box32, $dc9235a41e76d22216724d588b08fba7$var$box33, $dc9235a41e76d22216724d588b08fba7$var$box34, $dc9235a41e76d22216724d588b08fba7$var$box35, $dc9235a41e76d22216724d588b08fba7$var$box36, $dc9235a41e76d22216724d588b08fba7$var$box37, $dc9235a41e76d22216724d588b08fba7$var$box38, $dc9235a41e76d22216724d588b08fba7$var$player // platform1,
  // platform2
  ];

  const $dc9235a41e76d22216724d588b08fba7$var$handleKeyDownPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.up = true;
        break;

      case 'ArrowLeft':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.left = true;
        break;

      case 'ArrowDown':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.down = true;
        break;

      case 'ArrowRight':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.right = true;
        break;

      case ' ':
        if (!$dc9235a41e76d22216724d588b08fba7$var$keyboard.space) {
          $dc9235a41e76d22216724d588b08fba7$var$keyboard.space = true;
        }

        break;

      default:
        break;
    }
  };

  const $dc9235a41e76d22216724d588b08fba7$var$handleKeyUpPress = event => {
    switch (event.key) {
      case 'ArrowUp':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.up = false;
        break;

      case 'ArrowLeft':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.left = false;
        break;

      case 'ArrowDown':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.down = false;
        break;

      case 'ArrowRight':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.right = false;
        break;

      case ' ':
        $dc9235a41e76d22216724d588b08fba7$var$keyboard.space = false;
        break;

      default:
        break;
    }
  };

  document.addEventListener('keydown', $dc9235a41e76d22216724d588b08fba7$var$handleKeyDownPress);
  document.addEventListener('keyup', $dc9235a41e76d22216724d588b08fba7$var$handleKeyUpPress);

  function $dc9235a41e76d22216724d588b08fba7$var$draw() {
    requestAnimationFrame($dc9235a41e76d22216724d588b08fba7$var$draw);
    $dc9235a41e76d22216724d588b08fba7$var$scene.clearRect(0, 0, $dc9235a41e76d22216724d588b08fba7$var$canvas.width, $dc9235a41e76d22216724d588b08fba7$var$canvas.height);

    for (const object of $dc9235a41e76d22216724d588b08fba7$var$objects) {
      object.update($dc9235a41e76d22216724d588b08fba7$var$scene, $dc9235a41e76d22216724d588b08fba7$var$objects.filter(current => current !== object));
      object.render($dc9235a41e76d22216724d588b08fba7$var$scene);
    }
  }

  $dc9235a41e76d22216724d588b08fba7$var$draw();
})();
//# sourceMappingURL=13-platformer-closest-objects.bf00be02.js.map
