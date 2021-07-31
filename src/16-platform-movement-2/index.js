const DEBUG = false;
const COLORS = {
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
    SOFT_BLUE: '#c0ccfc',
    WHITE: '#ffffff',
    BLACK: '#000000',
    SOFT_BLACK: '#333'
};

const DIRECTION = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
};

const DIRECTION_HORIZONTAL = [DIRECTION.LEFT, DIRECTION.RIGHT];
const DIRECTION_VERTICAL = [DIRECTION.TOP, DIRECTION.BOTTOM];


const keyboard = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
}

const maxVelocity = (limit, ...args) => {
    return args.reduce((highest, number) => {
        if ((number <= limit) && (number > highest)) {
            return number;
        }

        return highest;
    }, args[0]);
}

const checkAABB = (objectA, objectB) => {
    const top = objectB.y > objectA.y + objectA.height;
    const bottom = objectB.y + objectB.height < objectA.y;
    const right = objectB.x + objectB.width < objectA.x;
    const left = objectB.x > objectA.x + objectA.width;

    // if any of (top, right, bottom, left) is true, then there is no collision because
    // one edge is far away from the other
    return !(top || right || bottom || left);
}

const distance = (player, target) => {
    return {
        top: player.y - (target.y + target.height),
        right: target.x - (player.x + player.width),
        bottom: target.y - (player.y + player.height),
        left: player.x - (target.x + target.width)
    }
}

const getObjectDimensions = ({ x, y, width, height, xVelocity, yVelocity }) => {
    return {
        x: x - xVelocity,
        y: y - yVelocity,
        width: xVelocity + width + xVelocity,
        height: yVelocity + height + yVelocity
    }
};

const findNearbyObjects = (player, objects) => {
    const playerDimensions = getObjectDimensions(player);

    return objects.filter((object) => {
        return checkAABB(playerDimensions, object)
    });
}

const getCollisionDirection = (offset) => {
    let side = DIRECTION.TOP, value = offset.top;
    [DIRECTION.RIGHT, DIRECTION.BOTTOM, DIRECTION.LEFT].forEach((direction) => {
        if (offset[direction] < value) {
            value = offset[direction];
            side = direction;
        }
    });

    return { direction: side, value };
}

const closest = (scene, player, objects) => {
    const map = {
        top: { objects: [], distance: {} },
        right: { objects: [], distance: {} },
        bottom: { objects: [], distance: {} },
        left: { objects: [], distance: {} }
    };

    const insertIfCloser = (object, offset, direction) => {
        if (offset[direction] < 0) {
            return;
        }

        const closestDistance = map[direction].distance;

        // either current object's distance is same as the closest object found so far OR
        // the closest object does not exist in a list yet
        if (offset[direction] === closestDistance[direction] || !map[direction].objects.length) {
            map[direction].objects.push(object);
            map[direction].distance = offset;
        } else if (offset[direction] < closestDistance[direction]) {
            // found closer object
            map[direction].objects = [object];
            map[direction].distance = offset;
        }
    }

    objects.forEach((object) => {
        const offset = distance(player, object);

        if (checkAABB(player.raycast.horizontal, object)) {
            insertIfCloser(object, offset, DIRECTION.LEFT);
            insertIfCloser(object, offset, DIRECTION.RIGHT);
        } else if (checkAABB(player.raycast.vertical, object)) {
            insertIfCloser(object, offset, DIRECTION.TOP);
            insertIfCloser(object, offset, DIRECTION.BOTTOM);
        }
    });

    return map;
}


class Raycast {
    constructor() {
        this.color = COLORS.BLACK;
        this.horizontal = {x: 0, y: 0, width: 0, height: 0, color: this.color};
        this.vertical = {x: 0, y: 0, width: 0, height: 0, color: this.color};
    }

    update(scene, target) {
        this.horizontal = {
            ...this.horizontal,
            x: 0,
            y: target.y,
            width: scene.canvas.width,
            height: target.height
        };

        this.vertical = {
            ...this.vertical,
            x: target.x,
            y: 0,
            width: target.width,
            height: scene.canvas.height
        };
    }

    render(scene) {
        if (!DEBUG) {
            return;
        }

        for (const object of [this.horizontal, this.vertical]) {
            scene.lineWidth = "1";
            scene.strokeStyle = object.color;
            scene.strokeRect(object.x, object.y, object.width, object.height);
        }
    }
}

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.baseXVelocity = 8;
        this.baseYVelocity = 20;
        this.xVelocity = this.baseXVelocity;
        this.yVelocity = this.baseYVelocity;
        this.lastLog = {};
        this.raycast = new Raycast();
        this.direction = null;

        // jump
        this.isJumping = false;
        this.gravity = 1;
        this.jumpPower = 12;
        this.isOnGround = true;
        this.jumpVelocity = 60;
        this.jumperSpeedY = 0;
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
        this.direction = DIRECTION.LEFT;
    }

    moveRight(velocity) {
        this.x += velocity;
        this.direction = DIRECTION.RIGHT;
    }

    moveUp(velocity) {
        this.y -= velocity;
        this.direction = DIRECTION.TOP;
    }

    moveDown(velocity) {
        this.y += velocity;
        this.direction = DIRECTION.BOTTOM;
    }

    update(scene, objects) {
        const closestObjects = closest(scene, this, objects);

        const velocity = {
            top: closestObjects.top.distance.top === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.top.distance.top - 1),
            right: closestObjects.right.distance.right === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.right.distance.right - 1),
            bottom: closestObjects.bottom.distance.bottom === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.bottom.distance.bottom - 1),
            left: closestObjects.left.distance.left === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.left.distance.left - 1)
        };

        this.log(velocity.top);

        //////////////////////////////////////// movement
        if (keyboard.right) {
            this.moveRight(velocity.right);
        }

        if (keyboard.left) {
            this.moveLeft(velocity.left);
        }

        if (keyboard.down) {
            this.moveDown(velocity.bottom);
        }

        // jump movement
        if (velocity.bottom > 0) {
            this.isOnGround = false;
        }

        if (velocity.bottom <= 0) {
            this.isOnGround = true;
            this.yVelocity = this.gravity;
        }

        // start jump movement
        if (keyboard.space && this.isOnGround) {
            this.yVelocity = Math.max(-this.baseYVelocity, -velocity.top);
        }

        // when off the ground, decrease yVelocity over time
        if (!this.isOnGround) {
            // this.yVelocity *= 0.9; // resistance
            // eventually yVelocity will become positive number because of applied gravity
            // which will cause player to move into opposite direction (down)
            this.yVelocity = this.yVelocity * 0.9 + this.gravity;

            // update player direction
            if (this.yVelocity > 0) {
                this.direction = DIRECTION.BOTTOM;
            } else if (this.yVelocity < 0) {
                this.direction = DIRECTION.TOP;
            }
        }

        // move player (top or down)
        // calculate player y position. respect max bottom and top velocity.
        if (this.direction !== DIRECTION.TOP) {
            // moving down
            this.y += Math.min(this.yVelocity, velocity.bottom);
        } else if (this.direction !== DIRECTION.BOTTOM) {
            // moving up
            this.y += Math.max(this.yVelocity, -velocity.top);
        }

        /////////////////////////////////////// scene boundaries
        // top boundary
         if (this.y < 0) {
            this.y = 0;
        }

         // right boundary
        if (this.x + this.width > scene.canvas.width) {
            this.x = scene.canvas.width - this.width;
        }

         // left boundary
         if (this.x < 0) {
             this.x = 0;
         }

        // bottom boundary
        if ((this.height + this.y) > scene.canvas.height) {
            this.y = scene.canvas.height - this.height;
        }

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

class Thing {
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
}


const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");


const objects = [
    // ground
    new Thing('ground', 0, canvas.height - 80, canvas.width, 80, COLORS.PURPLE),

    // obstacles
    new Thing('box', 500, canvas.height - 120, 40, 40, COLORS.ORANGE),
    new Thing('box-1', 100, canvas.height - 160, 40, 40, COLORS.ORANGE),
    new Thing('platform', 200, canvas.height - 160, 40, 10, COLORS.YELLOW),
    new Thing('box-2', 350, canvas.height - 200, 120, 40, COLORS.ORANGE),

    new Player(canvas.width / 2, canvas.height - 180, 20, 20, COLORS.GREEN)
];

const handleKeyDownPress = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            keyboard.up = true;
            break;

        case 'ArrowLeft':
            keyboard.left = true;
            break;

        case 'ArrowDown':
            keyboard.down = true;
            break;

        case 'ArrowRight':
            keyboard.right = true;
            break;

        case ' ':
            if (!keyboard.space) {
                keyboard.space = true;
            }
            break;

        default:
            break;
    }
}

const handleKeyUpPress = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            keyboard.up = false;
            break;

        case 'ArrowLeft':
            keyboard.left = false;
            break;

        case 'ArrowDown':
            keyboard.down = false;
            break;

        case 'ArrowRight':
            keyboard.right = false;
            break;

        case ' ':
            keyboard.space = false;
            break;

        default:
            break;
    }
};


document.addEventListener('keydown', handleKeyDownPress);
document.addEventListener('keyup', handleKeyUpPress);


function draw() {
    requestAnimationFrame(draw);

    scene.clearRect(0, 0, canvas.width, canvas.height);

    for (const object of objects) {
        object.update(scene, objects.filter(current => current !== object));
        object.render(scene);
    }
}

draw();
