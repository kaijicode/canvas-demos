/**
    actualBoundingBoxAscent: 30
    actualBoundingBoxDescent: 9
    actualBoundingBoxLeft: 23.08203125
    actualBoundingBoxRight: 23
    width: 48.1640625
 */
const canvas = document.getElementById('canvas');
const scene = canvas.getContext('2d');

const keyboard = () => {
    const keyPressedState = {
        right: false,
        left: false,
        up: false,
        down: false,
        spacebar: false,
    }

    const keyEventHandler = (event, isPressed) => {
        switch (event.key) {
            case 'Right':
            case 'ArrowRight': {
                keyPressedState.right = isPressed;
                break;
            }

            case 'Left':
            case 'ArrowLeft': {
                keyPressedState.left = isPressed;
                break;
            }

            case 'Up':
            case 'ArrowUp':
                keyPressedState.up = isPressed;
                break;

            case 'Down':
            case 'ArrowDown':
                keyPressedState.down = isPressed;
                break;

            case ' ':
            case 'Spacebar':
                keyPressedState.spacebar = isPressed;
                break;

            default:
                break;

    }
    }

    const handleKeyDownPress = (event) => {
        // log(`handleKeyDownPress: ${event.key}`);
        keyEventHandler(event, true);
    }

    const handleKeyUpPress = (event) => {
        // log(`handleKeyUpPress: ${event.key}`);
        keyEventHandler(event, false);
    };

    document.addEventListener('keydown', handleKeyDownPress);
    document.addEventListener('keyup', handleKeyUpPress);

    return keyPressedState;
}
const keyPressed = keyboard();

function draw() {
    requestAnimationFrame(draw);

    const fontSize = 32;
    const defaultColor = '#9E9E9E';
    const keyPressedColor = '#9C27B0';

    scene.font = `${fontSize}px Arial`;

    scene.fillStyle = keyPressed.up ? keyPressedColor : defaultColor;
    scene.fillText('Up', 0, fontSize);

    scene.fillStyle = keyPressed.right ? keyPressedColor : defaultColor;
    scene.fillText('Right', 0, fontSize * 2);

    scene.fillStyle = keyPressed.down ? keyPressedColor : defaultColor;
    scene.fillText('Down', 0, fontSize * 3);

    scene.fillStyle = keyPressed.left ? keyPressedColor : defaultColor;
    scene.fillText('Left', 0, fontSize * 4);

    scene.fillStyle = keyPressed.spacebar ? keyPressedColor : defaultColor;
    scene.fillText('Space', 0, fontSize * 5);
}

draw();