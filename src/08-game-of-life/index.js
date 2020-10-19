import {newCanvas} from "../canvas";


const CELL_SIZE = 5;
const WORLD_SIZE = 128;
const REDRAW_EVERY_MS = 100;
const STATUS = {DEAD: 0, ALIVE: 1};


const getRandomStatus = () => {
    return Math.floor(Math.random() * 2) === 0 ? STATUS.DEAD : STATUS.ALIVE;
}

class Cell {
    constructor(status, row, column) {
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.row = row;
        this.column = column;
        this.status = status;
    }

    isAlive() {
        return this.status === STATUS.ALIVE;
    }

    isDead() {
        return this.status === STATUS.DEAD
    }

    die() {
        this.status = STATUS.DEAD;
    }

    live() {
        this.status = STATUS.ALIVE;
    }

    getNeighbors(world) {
        const positionOffset = [
            // top
            {row: -1, column: 0},

            // right
            {row: 0, column: 1},

            // bottom
            {row: 1, column: 0},

            // left
            {row: 0, column: -1},

            // top-left
            {row: -1, column: -1},

            // top-right
            {row: -1, column: 1},

            // bottom-left
            {row: 1, column: -1},

            // bottom-right
            {row: 1, column: 1}
        ];

        return positionOffset.map((offset) => {
            return world?.[this.row + offset.row]?.[this.column + offset.column];
        }).filter((neighbor) => neighbor !== undefined);
    }

    clone() {
        return new Cell(this.status, this.row, this.column);
    }

    draw(scene, x, y) {
        scene.fillStyle = this.isAlive() ? '#000' : '#fff';
        scene.fillRect(x, y, this.width, this.height);
    }
}

class Game {
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
                group.push(new this.cell(getRandomStatus(), i, j));
            }
            world.push(group);
        }
        return world;
    }

    play() {
        this.world = this.world.map((row) => {
            return row.map((cell) => {
                const neighbors = cell.getNeighbors(this.world).filter((neighbor) => neighbor.isAlive());
                const aliveNeighborsCount = neighbors.length;
                const clone = cell.clone();

                if (cell.isAlive() && (aliveNeighborsCount === 2 || aliveNeighborsCount === 3)) {
                    // survived
                } else if (cell.isDead() && aliveNeighborsCount === 3) {
                    clone.live();
                } else {
                    clone.die();
                }

                return clone
            });
        });

        this.generation += 1;
    }

    draw(scene) {
        for (let y = 0; y < this.size; y += 1) {
            for (let x = 0; x < this.size; x += 1) {
                const cell = this.world[x][y];
                cell.draw(scene, x * cell.width, y * cell.height)
            }
        }
    }
}


const { scene } = newCanvas(WORLD_SIZE * CELL_SIZE, WORLD_SIZE * CELL_SIZE, '#fff');
const game = new Game(WORLD_SIZE, Cell);

const render = () => {
    game.play();
    game.draw(scene);
}

// generation=0
game.draw(scene);

let start = performance.now();
let elapsed = 0;

const draw = () => {
    requestAnimationFrame(draw);

    // time elapsed between renders
    elapsed = elapsed + (performance.now() - start)
    start = performance.now();

    if (elapsed >= REDRAW_EVERY_MS) {
        console.log(`elapsed=${elapsed}ms`);
        render();
        elapsed = 0;
    }
}
draw();

