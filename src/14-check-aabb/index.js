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
    SOFT_BLUE: '#c0ccfc'
};

const keyboard = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
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

class Player {
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
            if (checkAABB(this, object)) {
                object.mark();
            }
        }

        //////////////////////////////////////// movement
        if (keyboard.right) {
            this.moveRight(this.baseXVelocity);
        }

        if (keyboard.left) {
            this.moveLeft(this.baseXVelocity);
        }

        if (keyboard.up) {
            this.moveUp(this.baseYVelocity);
        }

        if (keyboard.down) {
            this.moveDown(this.baseYVelocity);
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
    }

    render(scene) {
        scene.fillStyle = this.color;
        scene.fillRect(this.x, this.y, this.width, this.height);
        scene.fillStyle = 'rgba(0, 0, 0, 1)';
        scene.font = '12px monospace';
        scene.fillText(`${this.x},${this.y}`, this.x, this.y);
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

    isInside = (n, min, max) => {
        // TODO: or > and <?
        return (n > min) && (n < max);
    }

    // AABB - axis aligned bounding boxes
    checkCollision(object) {
        let collision = { top: false, right: false, bottom: false, left: false };

        const topOverlap = this.isInside(object.y, this.y, this.y + this.height);
        const leftOverlap = this.isInside(object.x, this.x, this.x + this.width);
        const bottomOverlap = this.isInside(object.y + object.height, this.y, this.y + this.height);
        const rightOverlap = this.isInside(object.x + object.width, this.x, this.x + this.width);

        const leftOrRightOverlap = leftOverlap || rightOverlap;
        const topOrBottomOverlap = topOverlap || bottomOverlap;

        if (topOverlap && leftOrRightOverlap) {
            collision = { ...collision, top: true };
        }

        if (bottomOverlap && leftOrRightOverlap) {
            collision = { ...collision, bottom: true };
        }

        if (leftOverlap && topOrBottomOverlap) {
            collision = { ...collision, left: true };
        }

        if (rightOverlap && topOrBottomOverlap) {
            collision = { ...collision, right: true };
        }

        return {
            ...collision,
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
        const left = object.x > this.x + this.width;

        // if any of (top, right, bottom, left) is true, then there is no collision because
        // one edge is far away from the other
        return !(top || right || bottom || left);

        // const left = object.y

        // if any of (top, right, bottom, left) is true, then there is no collision because
        // one edge is far away from the other
        // return ;
    }

    checkAABB2(player) {
        return (
            (player.y < this.y + this.height) && (player.y + player.height > this.y) &&
            (player.x < this.x + this.width) && (player.x + player.width > this.x)
        )
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
        }
    }

    mark() {
        this.color = COLORS.YELLOW;
    }

    unmark() {
        this.color = this.originalColor;
    }
}

const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");

const player = new Player(canvas.width / 2, canvas.height - 20, 20, 20, '#8dc267');
const box4 = new Thing('box-4', 240, canvas.height - 220, 40, 40, '#b399c9');
const box7 = new Thing('box-7', 340, canvas.height - 250, 15, 15, '#b399c9');

const objects = [
    box4,
    box7,
    player,
    // platform1,
    // platform2

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
