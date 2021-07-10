let isRightKeyPressed = false;
let isLeftKeyPressed = false;
let isUpKeyPressed = false;
let isDownKeyPressed = false;
let isSpacebarKeyPressed = false;

const handleKeyDownPress = (event) => {
    log(`handleKeyDownPress: ${event.key}`);
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
            isSpacebarKeyPressed = true;
            break;

        default:
            break;
    }
}

const handleKeyUpPress = (event) => {
    log(`handleKeyUpPress: ${event.key}`);
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

    player.direction = DIRECTION.STATIONARY;
};


export const init = () => {
    document.addEventListener('keydown', handleKeyDownPress);
    document.addEventListener('keyup', handleKeyUpPress);
}