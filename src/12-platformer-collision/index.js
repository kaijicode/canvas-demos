let isRightKeyPressed = false;
let isLeftKeyPressed = false;
let isUpKeyPressed = false;
let isDownKeyPressed = false;
let isSpacebarKeyPressed = false;


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
        this.baseXVelocity = 5;
        this.xVelocity = 5;
        this.isJumping = false;
        this.jumpAnimation = createJumpAnimation(this.height * 5);
        this.gravity = 1;

    }

    moveLeft() {
        this.x -= this.xVelocity;
    }

    moveRight() {
        this.x += this.xVelocity;
    }

    render(scene, objects) {
        let collision;
        for (const object of objects) {
            collision = object.checkCollision(this);

            if (collision.top || collision.right || collision.bottom || collision.left) {
                break;
            }
        }

        if (isRightKeyPressed && !collision.right) {
            this.moveRight();
        }

        if (isLeftKeyPressed && !collision.left) {
            this.moveLeft();
        }

        if (isSpacebarKeyPressed && !this.jumpAnimation.isRunning()) {
            this.jumpAnimation.start();
            this.xVelocity *= 2;
        }

        if (this.jumpAnimation.isRunning() && !collision.bottom) {
            this.y += this.jumpAnimation.step();
        }

        if (this.jumpAnimation.isLastFrame() || collision.bottom) {
            this.jumpAnimation.stop();
            this.xVelocity = this.baseXVelocity;
        }


        if (collision.bottom) {
            this.y = collision.y - this.height;
        } else {
            this.y += this.gravity;
        }


        // top boundary
         if (this.y < 0) {
            this.y = 0;
            this.isJumping = false;
        }

        // bottom boundary
        if ((this.height + this.y) > scene.canvas.height) {
            this.y = scene.canvas.height - this.height;
            this.isJumping = false;
            this.xVelocity = this.baseXVelocity;
        }

        scene.fillStyle = this.color;
        scene.fillRect(this.x, this.y, this.width, this.height);
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

    render(scene) {
        scene.fillStyle = this.color;
        scene.fillRect(this.x, this.y, this.width, this.height);
    }

    isInside = (n, min, max) => {
        // TODO: or > and <?
        return (n > min) && (n < max);
    }

    checkCollision(object) {
        let collision = { top: false, right: false, bottom: false, left: false };

        const topOverlap = this.isInside(object.y, this.y, this.y + this.height);
        const leftOverlap = this.isInside(object.x, this.x, this.x + this.width);
        const bottomOverlap = this.isInside(object.y + object.height, this.y, this.y + this.height);
        const rightOverlap = this.isInside(object.x + object.width, this.x, this.x + this.width);

        if (topOverlap && (leftOverlap || rightOverlap)) {
            collision = { ...collision, top: true };
        }

        if (bottomOverlap && (leftOverlap || rightOverlap)) {
            collision = { ...collision, bottom: true };
        }

        if (leftOverlap && (topOverlap || bottomOverlap)) {
            collision = { ...collision, left: true };
        }

        if (rightOverlap && (topOverlap || bottomOverlap)) {
            collision = { ...collision, right: true };
        }

        return { ...collision, x: this.x, width: this.width, y: this.y, height: this.height };
    }
}

const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");
const player = new Player(canvas.width / 2, canvas.height - 20, 20, 20, '#fff');
const box = new Thing('box', canvas.width / 2 + 120, canvas.height - 40, 40, 40, '#fff');
const platform1 = new Thing('platform1', 50, canvas.height - 60, 150, 10, '#fff');
const platform2 = new Thing('platform2', 250, canvas.height - 120, 150, 10, '#fff');

const objects = [
    box,
    player,
    platform1,
    platform2
];

const handleKeyDownPress = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            isUpKeyPressed = true;
            break;

        case 'ArrowLeft':
            isLeftKeyPressed = true;
            break;

        case 'ArrowDown':
            isDownKeyPressed = true;
            break;

        case 'ArrowRight':
            isRightKeyPressed = true;
            break;

        case ' ':
            if (!isSpacebarKeyPressed) {
                isSpacebarKeyPressed = true;
            }
            break;

        default:
            break;
    }
}

const handleKeyUpPress = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            isUpKeyPressed = false;
            break;

        case 'ArrowLeft':
            isLeftKeyPressed = false;
            break;

        case 'ArrowDown':
            isDownKeyPressed = false;
            break;

        case 'ArrowRight':
            isRightKeyPressed = false;
            break;

        case ' ':
            isSpacebarKeyPressed = false;
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
        object.render(scene, objects.filter(current => current !== object));
    }
}

draw();