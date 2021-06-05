/** Pallete
#fcf0c0
#ef8f4f
#f8d803
#8dc267
#66dcfe
#49a0e1
#b399c9
*/

const sum = (arr) => {
    return arr.reduce((total, x) => total + x, 0)
}

const keyboard = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
}

function createJumpAnimation(height) {
    let frame = 0;
    let isRunning = false;
    const movement = [
        // ascend
        -0.3, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1,

        // apex
        0, 0, 0, 0,

        // descend
        0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3
    ];

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
        this.baseYVelocity = this.baseXVelocity;
        this.xVelocity = this.baseXVelocity;
        this.yVelocity = this.baseYVelocity;
        this.isJumping = false;
        this.jumpAnimation = createJumpAnimation(this.height * 5);
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
    }

    // returns closest object to player
    closest(player, objects) {
        return objects.reduce((closest, object) => {
            const { top: closestTop, right: closestRight, bottom: closestBottom, left: closestLeft } = closest.distance(player);
            const { top, right, bottom, left } = object.distance(player);


            const closestMin = sum([closestTop, closestRight, closestBottom, closestLeft].filter((x) => x >= 0));
            const objectMin = sum([top, right, bottom, left].filter((x) => x >= 0));

            if (objectMin < closestMin) {
                return object;
            }

            return closest;
        }, objects[0]);
    }

    update(scene, objects) {
        const closestObject = this.closest(this, objects);
        const distance = closestObject.distance(this);

        const velocity = {
            top: this.baseXVelocity,
            bottom: this.baseXVelocity
        };

        const isTopOrBottomCollision = (distance.top - 1 <= 0 && distance.bottom - 1 <= 0);
        const isLeftOrRightCollision = (distance.left - 1 <= 0 && distance.right - 1 <= 0);


        if (distance.right - 1 >= 0 && isTopOrBottomCollision) {
            velocity.right = Math.min(this.baseXVelocity, distance.right - 1);
        } else {
            velocity.right = this.baseXVelocity;
        }

        // console.log(distance.top, distance.right, distance.bottom, distance.left)
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
        }

        // movement
        if (keyboard.right) {
            this.moveRight(velocity.right);
        }

        if (keyboard.left) {
            this.moveLeft(velocity.left);
        }

        if (keyboard.up) {
            this.moveUp(velocity.top);
        }

        if (keyboard.down) {
            this.moveDown(velocity.bottom);
        }


        // scene boundaries
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
}

const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");
// const ground = new Thing('ground', 0, canvas.height - 80, canvas.width, 80, '#b399c9');

const player = new Player(canvas.width / 2, canvas.height - 20, 20, 20, '#8dc267');
const box = new Thing('box', canvas.width / 2 + 120, canvas.height - 40, 40, 40, '#ef8f4f');
const box2 = new Thing('box-2', canvas.width / 2 - 120, canvas.height - 120, 40, 40, '#ef8f4f');
const box3 = new Thing('box-3', 200, canvas.height - 220, 40, 40, '#ef8f4f');
const box4 = new Thing('box-4', 240, canvas.height - 220, 40, 40, '#b399c9');
const box5 = new Thing('box-5', 300, canvas.height - 260, 40, 40, '#ef8f4f');
const box6 = new Thing('box-6', 340, canvas.height - 270, 40, 40, '#b399c9');
const box7 = new Thing('box-7', 240, canvas.height - 350, 40, 40, '#b399c9');

const box8 = new Thing('box-8', 0, canvas.height - 40, 40, 40, '#ef8f4f');
const box9 = new Thing('box-9', 0, canvas.height - 80, 40, 40, '#b399c9');
const box10 = new Thing('box-10', 40, canvas.height - 40, 40, 40, '#b399c9');

const box11 = new Thing('box-11', 80, canvas.height - 140, 40, 40, '#ef8f4f');
const box12 = new Thing('box-12', 40, canvas.height - 140, 40, 40, '#b399c9');
const box13 = new Thing('box-13', 80, canvas.height - 100, 40, 40, '#b399c9');

const box14 = new Thing('box-14', 40, 40, 40, 40, '#b399c9');
const box15 = new Thing('box-15', 80, 40, 40, 40, '#ef8f4f');
const box16 = new Thing('box-16', 120, 40, 40, 40, '#b399c9');
const box17 = new Thing('box-17', 40, 120, 40, 40, '#ef8f4f');
const box18 = new Thing('box-18', 80, 120, 40, 40, '#b399c9');
const box19 = new Thing('box-19', 120, 120, 40, 40, '#ef8f4f');

const box20 = new Thing('box-20', canvas.width-80, 40, 40, 40, '#ef8f4f');
const box21 = new Thing('box-21', canvas.width-80, 80, 40, 40, '#b399c9');
const box22 = new Thing('box-22', canvas.width-80, 120, 40, 40, '#ef8f4f');
const box23 = new Thing('box-23', canvas.width-160, 40, 40, 40, '#ef8f4f');
const box24 = new Thing('box-24', canvas.width-160, 80, 40, 40, '#b399c9');
const box25 = new Thing('box-25', canvas.width-160, 120, 40, 40, '#ef8f4f');

const box26 = new Thing('box-26', canvas.width-200, 200, 40, 40, '#b399c9');
const box27 = new Thing('box-27', canvas.width-160, 200, 40, 40, '#ef8f4f');
const box28 = new Thing('box-28', canvas.width-120, 200, 40, 40, '#b399c9');
const box29 = new Thing('box-29', canvas.width-80, 200, 40, 40, '#ef8f4f');

const platform1 = new Thing('platform1', 50, canvas.height - 60, 150, 10, '#fff');
const platform2 = new Thing('platform2', 250, canvas.height - 120, 150, 10, '#fff');


const objects = [
    // ground,
    box,
    box2,
    box3,
    box4,
    box5,
    box6,
    box7,
    box8,
    box9,
    box10,
    box11,
    box12,
    box13,
    box14,
    box15,
    box16,
    box17,
    box18,
    box19,
    box20,
    box21,
    box22,
    box23,
    box24,
    box25,
    box26,
    box27,
    box28,
    box29,
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
