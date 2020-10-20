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

  const $d5834acb362027e13b06ed00734e9$var$CELL_SIZE = 5;
  const $d5834acb362027e13b06ed00734e9$var$WORLD_SIZE = 128;
  const $d5834acb362027e13b06ed00734e9$var$REDRAW_EVERY_MS = 100;
  const $d5834acb362027e13b06ed00734e9$var$STATUS = {
    DEAD: 0,
    ALIVE: 1
  };

  const $d5834acb362027e13b06ed00734e9$var$getRandomStatus = () => {
    return Math.floor(Math.random() * 2) === 0 ? $d5834acb362027e13b06ed00734e9$var$STATUS.DEAD : $d5834acb362027e13b06ed00734e9$var$STATUS.ALIVE;
  };

  class $d5834acb362027e13b06ed00734e9$var$Cell {
    constructor(status, row, column) {
      this.width = $d5834acb362027e13b06ed00734e9$var$CELL_SIZE;
      this.height = $d5834acb362027e13b06ed00734e9$var$CELL_SIZE;
      this.row = row;
      this.column = column;
      this.status = status;
    }

    isAlive() {
      return this.status === $d5834acb362027e13b06ed00734e9$var$STATUS.ALIVE;
    }

    isDead() {
      return this.status === $d5834acb362027e13b06ed00734e9$var$STATUS.DEAD;
    }

    die() {
      this.status = $d5834acb362027e13b06ed00734e9$var$STATUS.DEAD;
    }

    live() {
      this.status = $d5834acb362027e13b06ed00734e9$var$STATUS.ALIVE;
    }

    getNeighbors(world) {
      const positionOffset = [// top
      {
        row: -1,
        column: 0
      }, // right
      {
        row: 0,
        column: 1
      }, // bottom
      {
        row: 1,
        column: 0
      }, // left
      {
        row: 0,
        column: -1
      }, // top-left
      {
        row: -1,
        column: -1
      }, // top-right
      {
        row: -1,
        column: 1
      }, // bottom-left
      {
        row: 1,
        column: -1
      }, // bottom-right
      {
        row: 1,
        column: 1
      }];
      return positionOffset.map(offset => {
        return world?.[this.row + offset.row]?.[this.column + offset.column];
      }).filter(neighbor => neighbor !== undefined);
    }

    clone() {
      return new $d5834acb362027e13b06ed00734e9$var$Cell(this.status, this.row, this.column);
    }

    draw(scene, x, y) {
      scene.fillStyle = this.isAlive() ? '#000' : '#fff';
      scene.fillRect(x, y, this.width, this.height);
    }

  }

  class $d5834acb362027e13b06ed00734e9$var$Game {
    constructor(size, cell) {
      this.generation = 0;
      this.size = size;
      this.cell = cell;
      this.world = this._create();
    }

    _create() {
      const world = [];

      for (let i = 0; i < this.size; i += 1) {
        const group = [];

        for (let j = 0; j < this.size; j += 1) {
          group.push(new this.cell($d5834acb362027e13b06ed00734e9$var$getRandomStatus(), i, j));
        }

        world.push(group);
      }

      return world;
    }

    play() {
      this.world = this.world.map(row => {
        return row.map(cell => {
          const neighbors = cell.getNeighbors(this.world).filter(neighbor => neighbor.isAlive());
          const aliveNeighborsCount = neighbors.length;
          const clone = cell.clone();

          if (cell.isAlive() && (aliveNeighborsCount === 2 || aliveNeighborsCount === 3)) {// survived
          } else if (cell.isDead() && aliveNeighborsCount === 3) {
            clone.live();
          } else {
            clone.die();
          }

          return clone;
        });
      });
      this.generation += 1;
    }

    draw(scene) {
      for (let y = 0; y < this.size; y += 1) {
        for (let x = 0; x < this.size; x += 1) {
          const cell = this.world[x][y];
          cell.draw(scene, x * cell.width, y * cell.height);
        }
      }
    }

  }

  const {
    scene: $d5834acb362027e13b06ed00734e9$var$scene
  } = $bf5096e55bb6ae2cfbfaf7e6cb056$export$newCanvas($d5834acb362027e13b06ed00734e9$var$WORLD_SIZE * $d5834acb362027e13b06ed00734e9$var$CELL_SIZE, $d5834acb362027e13b06ed00734e9$var$WORLD_SIZE * $d5834acb362027e13b06ed00734e9$var$CELL_SIZE, '#fff');
  const $d5834acb362027e13b06ed00734e9$var$game = new $d5834acb362027e13b06ed00734e9$var$Game($d5834acb362027e13b06ed00734e9$var$WORLD_SIZE, $d5834acb362027e13b06ed00734e9$var$Cell);

  const $d5834acb362027e13b06ed00734e9$var$render = () => {
    $d5834acb362027e13b06ed00734e9$var$game.play();
    $d5834acb362027e13b06ed00734e9$var$game.draw($d5834acb362027e13b06ed00734e9$var$scene);
  }; // generation=0


  $d5834acb362027e13b06ed00734e9$var$game.draw($d5834acb362027e13b06ed00734e9$var$scene);
  let $d5834acb362027e13b06ed00734e9$var$start = performance.now();
  let $d5834acb362027e13b06ed00734e9$var$elapsed = 0;

  const $d5834acb362027e13b06ed00734e9$var$draw = () => {
    requestAnimationFrame($d5834acb362027e13b06ed00734e9$var$draw); // time elapsed between renders

    $d5834acb362027e13b06ed00734e9$var$elapsed = $d5834acb362027e13b06ed00734e9$var$elapsed + (performance.now() - $d5834acb362027e13b06ed00734e9$var$start);
    $d5834acb362027e13b06ed00734e9$var$start = performance.now();

    if ($d5834acb362027e13b06ed00734e9$var$elapsed >= $d5834acb362027e13b06ed00734e9$var$REDRAW_EVERY_MS) {
      console.log(`elapsed=${$d5834acb362027e13b06ed00734e9$var$elapsed}ms`);
      $d5834acb362027e13b06ed00734e9$var$render();
      $d5834acb362027e13b06ed00734e9$var$elapsed = 0;
    }
  };

  $d5834acb362027e13b06ed00734e9$var$draw();
})();
//# sourceMappingURL=08-game-of-life.b55daea0.js.map
