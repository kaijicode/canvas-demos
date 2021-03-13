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
    }

    return animation;
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

    render(scene) {
        if (isRightKeyPressed) {
            this.moveRight();
        }

        if (isLeftKeyPressed) {
            this.moveLeft();
        }

        if (isSpacebarKeyPressed && !this.jumpAnimation.isRunning()) {
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

        this.y += this.gravity;


        // top boundary
         if (this.y < 0) {
            this.y = 0;
            this.isJumping = false;
        }

        // bottom boundary
        if (scene.canvas.height < (this.height + this.y)) {
            this.y = scene.canvas.height - this.height;
            this.isJumping = false;
            this.xVelocity = this.baseXVelocity;
        }

        scene.fillStyle = this.color;
        scene.fillRect(this.x, this.y, this.width, this.height);
    }
}

const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");
const player = new Player(canvas.width / 2, canvas.height - 20, 20, 20, '#fff');


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
    player.render(scene);
}

draw();