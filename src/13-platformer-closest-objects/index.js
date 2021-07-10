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

const DIRECTION = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
};


// const checkDirection = (object, target) => {
//     if (object.) {
//
//     }
// }

const checkPotentialCollision = (scene, object, target, direction) => {
    switch (direction) {
        case DIRECTION.TOP:
            return checkAABB({x: object.x, y: 0, width: object.width, height: object.y}, target);

        // case DIRECTION.RIGHT:
        //     return checkAABB({x: 0, y: object.y, width: object.x, height: object.y + object.height}, target);
        //
        // case DIRECTION.BOTTOM:
        //     return checkAABB({x: object.x, y: object.y + object.height, width: object.width, height: scene.canvas.height - (object.y + object.height)}, target);
        //
        // case DIRECTION.LEFT:
        //     return checkAABB({x: 0, y: 0, width: 0, height: 0}, target);
    }
}

class Beam {
    constructor() {
        // this.top = {x: 0, y: 0, width: 0, height: 0, color: '#000000'};
        // this.right = {x: 0, y: 0, width: 0, height: 0, color: '#000000'};
        // this.bottom = {x: 0, y: 0, width: 0, height: 0, color: '#000000'};
        // this.left = {x: 0, y: 0, width: 0, height: 0, color: '#000000'};
        this.horizontal = {x: 0, y: 0, width: 0, height: 0, color: '#000000'};
        this.vertical = {x: 0, y: 0, width: 0, height: 0, color: '#000000'};
    }


    update(scene, target) {
        // this.top = {...this.top, x: target.x, y: 0, width: target.width, height: target.y};
        // this.right = {...this.right, x: target.x + target.width, y: target.y, width: scene.canvas.width - (target.x + target.width), height: target.height};
        // this.bottom = {...this.bottom, x: target.x, y: target.y + target.height, width: target.width, height: scene.canvas.height - (target.y + target.height)};
        // this.left = {...this.left, x: 0, y: target.y, height: target.height, width: target.x};
        this.horizontal = {...this.horizontal, x: 0, y: target.y, width: scene.canvas.width, height: target.height};
        this.vertical = {...this.vertical, x: target.x, y: 0, width: target.width, height: scene.canvas.height};
    }

    render(scene) {
        // const objects = [this.top, this.right, this.bottom, this.left];
        const objects = [this.horizontal, this.vertical];
        for (const object of objects) {
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
        this.baseYVelocity = this.baseXVelocity;
        this.xVelocity = this.baseXVelocity;
        this.yVelocity = this.baseYVelocity;
        this.lastLog = {};
        this.beam = new Beam();
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

    // returns closest objects to player
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

        objects.forEach((object) => {
            if (checkAABB(this.beam.horizontal, object)) {
                const offset = distance(this, object);

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
            } else if (checkAABB(this.beam.vertical, object)) {
                const offset = distance(this, object);

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
        const closestObjects = this.closest(scene, this, objects);
        // this.log(closestObjects)

        for (const object of objects) {
            object.unMarkAsClosest();
        }

        this.mark(closestObjects.top.objects);
        this.mark(closestObjects.right.objects);
        this.mark(closestObjects.bottom.objects);
        this.mark(closestObjects.left.objects);
        ///////////////



        const velocity = {
            top: closestObjects.top.distance.top === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.top.distance.top - 1),
            right: closestObjects.right.distance.right === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.right.distance.right - 1),
            bottom: closestObjects.bottom.distance.bottom === undefined ? this.baseYVelocity : Math.min(this.baseYVelocity, closestObjects.bottom.distance.bottom - 1),
            left: closestObjects.left.distance.left === undefined ? this.baseXVelocity : Math.min(this.baseXVelocity, closestObjects.left.distance.left - 1)
        }

        this.log(velocity)


        //////////////////////////////////////// movement
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

        this.beam.update(scene, this);
    }

    render(scene) {
        scene.fillStyle = this.color;
        scene.fillRect(this.x, this.y, this.width, this.height);
        scene.fillStyle = 'rgba(0, 0, 0, 1)';
        scene.font = '12px monospace';
        scene.fillText(`${this.x},${this.y}`, this.x, this.y);
        this.beam.render(scene);
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

    markAsClosest() {
        this.color = '#000000';
    }

    unMarkAsClosest() {
        this.color = this.originalColor;
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

// const beam = new Beam();
// const rayTop = new Thing('ray-top', 0, 0, 0, 0, '#49a0e1');
// const rayRight = new Thing('ray-right', 0, 0, 0, 0, '#49a0e1');
// const rayBottom = new Thing('ray-bottom', 0, 0, 0 , 0, '#49a0e1');
// const rayLeft = new Thing('ray-left', 0, 0, 0, 0, '#49a0e1');

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
