const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colors = [
    '#f44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#607D8B',
];

const balls = new Array(20).fill(null).map((x, index) => {
    return createBall(
        randomBetween(canvas.width * 0.1, canvas.width * 0.9),
        randomBetween(canvas.height * 0.1, canvas.height * 0.9),
        10, // radius
        // {x: randomBetween(-2, 2), y: randomBetween(-2, 2)},
        randomItem([
            {x: 1, y: 1},
            {x: 2, y: 2},
            {x: 3, y: 3},
            {x: -1, y: -1},
            {x: -2, y: -2},
            {x: -3, y: -3},
        ]),
        colors[randomBetween(0, colors.length-1)]
    );
});

function randomItem(items) {
    return items[randomBetween(0, items.length-1)];
}

function createBall(x, y, radius, speed, color = "#0095DD") {
    return {x, y, radius, speed, color};
}

// random between min (inclusive) and max (inclusive)
function randomBetween(min, max) {
    return Math.floor((Math.random() * ((max+1) - min))) + min;
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function detectWallCollision(ball) {
    const collision = {x: ball.speed.x, y: ball.speed.y};

    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        collision.y = -collision.y;
    }

    // if collides with left wall or right wall
    if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
        collision.x = -collision.x;
    }

    return collision;
}

function applyCollision(ball, collision) {
    ball.speed = {...ball.speed, ...collision};
    ball.x += ball.speed.x;
    ball.y += ball.speed.y;
}

function detectBallCollision(first, second) {
    const collision = {first: {}, second: {}};

    const distance = Math.sqrt((first.x - second.x)**2 + (first.y - second.y)**2);
    const isCollided = distance < first.radius + second.radius;

    if (!isCollided) {
        return collision;
    }

    // second hits first from left
    const isLeftCollision = second.x + second.radius >= first.x - first.radius;

    // second hits first from right
    const isRightCollision = second.x - second.radius <= first.x + first.radius;

    // second hits first from top
    const isTopCollision = second.y + second.radius >= first.y - first.radius;

    // second hits first from bottom
    const isBottomCollision = second.y - second.radius <= first.y + first.radius;


    if (isTopCollision || isBottomCollision) {
        collision.isCollision = true;
        collision.first.y = -first.speed.y;
        collision.second.y = -second.speed.y;
    }

    if (isRightCollision || isLeftCollision) {
        collision.isCollision = true;
        collision.first.x = -first.speed.x;
        collision.second.x = -second.speed.x;
    }

    return collision;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i += 1) {
        const ball = balls[i];
        drawBall(ball);
        applyCollision(ball, detectWallCollision(ball));

        for (let j = 0; j < balls.length; j += 1) {
            if (i !== j && j+1 < balls.length) {
                const nextBall = balls[j];
                const ballCollision = detectBallCollision(ball, nextBall);

                if (ballCollision.isCollision) {
                    applyCollision(ball, ballCollision.first);
                    applyCollision(nextBall, ballCollision.second);
                }
            }
        }
    }

    // balls.forEach((ball) => {
    //     drawBall(ball);
    //     applyCollision(ball, detectWallCollision(ball));
    // });

    requestAnimationFrame(draw);
}

draw();