import { keyboard } from "./keyboard.js";
import {MousePositionReporter} from "./mousePositionReporter";
import {clearScene} from "./canvas";

// TODO: Mouse interaction
// TODO: it would be cool if I could play with the config in live
const config = {
    canvas: {
        background: '#ffffff',
    },

    font: {
        family: 'monospace',
        size: '8px',
        color: '#000000',
        height: 8, // TODO: is there a way to calculate how much given font family and font size take in height?
    },

    keyboard: {
        gapSize: 8,
        rows: 6,
        buttonHeight: 25,
        buttonBackground: '#000000',
        buttonBackgroundPressed: '#00C853',
    },

    // in cm
    physicalKeyboardDimensions: {
        // mm
        gap: 0.3,

        // cm
        button: {
            base: 1.5,
            'base+': 2.1,
            '2x-base': 3,
            '2x-base+': 3.5,
            large: 4.2,
            max: 11.3,
        }
    }
};

function newCanvas(width, height, background) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.background = background;
    document.body.appendChild(canvas);
    return canvas;
}

/**
 * Calculate button ratios based on real button sizes.
 * gap between any two keys on the keyboard -> 0.3mm
 * keyboard width -> 30cm
 * button sizes:
 *      -> 1.5cm ()
 *          -> 0.3 / 1.5 * 100 = 0.3 is 20% of 1.5, 100 / 20 = 5
 *      -> 2.1cm
 *      -> 3cm
 *      -> 11.3cm
*
 * @param gapSize
 * @returns {{button: {large: *, max: *, "base+": *, "2xbase+": *, "2xbase": *, base: *}, buttonHeight: number, width: number, gapSize: *, height: number}}
 */
function calcDimensions(gapSize) {
    /**
     * 30cm width
        1.5cm = 5% of 30
        2.1cm = 7% of 30
        3cm = 10% of 30
        3.5cm = 11.666% of 30
        11.3cm = 37.66%
        3mm spacing =
            0.3 / 1.5 = 20% of 1.5, regular button
            0.3 / 2.1 = 14.28% of 2.1,
            0.3 / 30 = 1% of 30cm, total width
            0.3 / 3.5 = 8.571% of 3.5
     */
    const calcRatio = (physicalButtonSizeInCm) => 100 / (gapSize / physicalButtonSizeInCm * 100)

    const buttonHeight = 25;
    const rows = 6;
    return {
        // gap between the keys is 0.3mm
        // entire keyboard layout is 30cm, 0.3mm is 1% of 30cm
        gapSize,
        width: gapSize * 100,
        height: buttonHeight * rows + ((rows - 1) * gapSize),// 6 rows
        button: {
            // regular key such as 'A'
            // 1.5cm
            // 0.3 / 1.5 = 20% of 1.5
            base: calcRatio(1.6),

            // e.g 'Esc', 'Delete'
            // 2.1cm
            // 0.3 / 2.1 * 100 = 14.28%, 100 / 14.28 = 7
            'base+': calcRatio(2.3),

            // 'Backspace', 'Caps Lock'
            // 3cm
            // 0.3 / 3 * 100 = 10%
            '2x-base': calcRatio(3),

            // 'Enter'
            // 3.5cm
            // 0.3 / 3.5 * 100 = 8.571%, 100 / 8.571 = 11.666
            '2x-base+': calcRatio(3.6),

            // 'L_Shift'
            // 4.2cm
            // 0.3 / 4.2 = 7.14%
            large: calcRatio(4.2),

            // 'Spacebar'
            // 11.3cm
            // 0.3 / 11.3 = 2.65%
            max: calcRatio(11.1),
        },
        buttonHeight,
    }
}

function button(key, box, backgroundColor) {
    return {
        ...key,
        ...box,
        backgroundColor,
    }
}

function getKeyRepresentation(key, isShiftPressed) {
    if (isShiftPressed) {
        return key.altKey && key.altKeyDisplay ? key.altKeyDisplay : key.altKey || key.display || key.key;
    }

    return key.display ? key.display : key.key;
}

// TODO: bug, if you press Shift+D and release it, the key rendered as pressed
// TODO: and the other way around
function isKeyPressed(currentPressedKey, key) {
    return currentPressedKey[key.key] || currentPressedKey[key.altKey];
}

function placeText(scene, box, font, text) {
    scene.font = `${font.size} ${font.family}`;
    scene.fillStyle = font.color;
    const metrics = scene.measureText(text);

    // center tex inside the box
    scene.fillText(text, (box.x + box.x2) / 2 - (metrics.width / 2), (box.y + box.y4) / 2 + (font.height / 2));
}

function drawKeyboard(scene, config, canvasWidth, canvasHeight, keys) {
        const gapByRow = keys.map((row) => {
            return dimensions.gapSize * (row.length - 1);
        });

        const availableWidthByRow = gapByRow.map((gap) => {
            return canvas.width - gap;
        });

        const boxesWithWidth = keys.map((row, index) => {
            const countRatio = row.reduce((sum, box) => {
                return sum + box.widthRatio;
            }, 0);

            const oneRatioCostInPixels = availableWidthByRow[index] / countRatio;

            return row.map((box) => {
                return {...box, width: box.widthRatio * oneRatioCostInPixels};
            });
        });

        for (let i = 0; i < boxesWithWidth.length; i += 1) {
            let x = 0;
            let y = i * dimensions.buttonHeight + (dimensions.gapSize * i);
            for (let j = 0; j < boxesWithWidth[i].length; j += 1) {
                scene.strokeStyle = isKeyPressed(keyPressedStatus, boxesWithWidth[i][j]) ?
                    config.keyboard.buttonBackgroundPressed :
                    config.keyboard.buttonBackground;

                scene.strokeRect(x, y, boxesWithWidth[i][j].width, dimensions.buttonHeight);

                const symbol = getKeyRepresentation(boxesWithWidth[i][j], keyPressedStatus['Shift']);

                const box = {
                    x, y, // top-left
                    x2: x + boxesWithWidth[i][j].width, y2: y, // top-right
                    x3: x, y3: y + dimensions.buttonHeight, // bottom-left
                    x4: x + boxesWithWidth[i][j].width, y4: y + dimensions.buttonHeight// bottom-right
                };

                placeText(scene, box, config.font,  symbol);

                x = x + boxesWithWidth[i][j].width + dimensions.gapSize;
            }
        }

    }


const dimensions = calcDimensions(config.keyboard.gapSize);
const canvas = newCanvas(dimensions.width, dimensions.height, config.canvas.background);
const scene = canvas.getContext('2d');
const keyPressedStatus = keyboard();
const keys = [
    [
        button({key: 'ESC'}, {widthRatio: dimensions.button['base+']}),
        button({key: 'F1'}, {widthRatio: dimensions.button.base}),
        button({key: 'F2'}, {widthRatio: dimensions.button.base}),
        button({key: 'F3'}, {widthRatio: dimensions.button.base}),
        button({key: 'F4'}, {widthRatio: dimensions.button.base}),
        button({key: 'F5'}, {widthRatio: dimensions.button.base}),
        button({key: 'F6'}, {widthRatio: dimensions.button.base}),
        button({key: 'F7'}, {widthRatio: dimensions.button.base}),
        button({key: 'F8'}, {widthRatio: dimensions.button.base}),
        button({key: 'F9'}, {widthRatio: dimensions.button.base}),
        button({key: 'F10'}, {widthRatio: dimensions.button.base}),
        button({key: 'F11'}, {widthRatio: dimensions.button.base}),
        button({key: 'F12'}, {widthRatio: dimensions.button.base}),
        button({key: 'Delete'}, {widthRatio: dimensions.button['base+']}),
        button({key: '⦿'}, {widthRatio: dimensions.button.base}), // on/off
    ],

    [
        button({key: '`', altKey: '~'}, {widthRatio: dimensions.button.base}),
        button({key: '1', altKey: '!'}, {widthRatio: dimensions.button.base}),
        button({key: '2', altKey: '@'}, {widthRatio: dimensions.button.base}),
        button({key: '3', altKey: '#'}, {widthRatio: dimensions.button.base}),
        button({key: '4', altKey: '$'}, {widthRatio: dimensions.button.base}),
        button({key: '5', altKey: '%'}, {widthRatio: dimensions.button.base}),
        button({key: '6', altKey: '^'}, {widthRatio: dimensions.button.base}),
        button({key: '7', altKey: '&'}, {widthRatio: dimensions.button.base}),
        button({key: '8', altKey: '*'}, {widthRatio: dimensions.button.base}),
        button({key: '9', altKey: '('}, {widthRatio: dimensions.button.base}),
        button({key: '0', altKey: ')'}, {widthRatio: dimensions.button.base}),
        button({key: '-', altKey: '_'}, {widthRatio: dimensions.button.base}),
        button({key: '=', altKey: '+'}, {widthRatio: dimensions.button.base}),
        button({key: 'Backspace'}, {widthRatio: dimensions.button['2x-base']}),
        button({key: 'Home'}, {widthRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Tab'}, {widthRatio: dimensions.button['base+']}),
        button({key: 'q', altKey: 'Q'}, {widthRatio: dimensions.button.base}),
        button({key: 'w', altKey: 'W'}, {widthRatio: dimensions.button.base}),
        button({key: 'e', altKey: 'E'}, {widthRatio: dimensions.button.base}),
        button({key: 'r', altKey: 'R'}, {widthRatio: dimensions.button.base}),
        button({key: 't', altKey: 'T'}, {widthRatio: dimensions.button.base}),
        button({key: 'y', altKey: 'Y'}, {widthRatio: dimensions.button.base}),
        button({key: 'u', altKey: 'U'}, {widthRatio: dimensions.button.base}),
        button({key: 'i', altKey: 'I'}, {widthRatio: dimensions.button.base}),
        button({key: 'o', altKey: 'O'}, {widthRatio: dimensions.button.base}),
        button({key: 'p', altKey: 'P'}, {widthRatio: dimensions.button.base}),
        button({key: '[', altKey: '{'}, {widthRatio: dimensions.button.base}),
        button({key: ']', altKey: '}'}, {widthRatio: dimensions.button.base}),
        button({key: '\\', altKey: '|'}, {widthRatio: dimensions.button["base+"]}),
        button({key: 'End'}, {widthRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Caps lock'}, {widthRatio: dimensions.button['2x-base']}),
        button({key: 'a', altKey: 'A'}, {widthRatio: dimensions.button.base}),
        button({key: 's', altKey: 'S'}, {widthRatio: dimensions.button.base}),
        button({key: 'd', altKey: 'D'}, {widthRatio: dimensions.button.base}),
        button({key: 'f', altKey: 'F'}, {widthRatio: dimensions.button.base}),
        button({key: 'g', altKey: 'G'}, {widthRatio: dimensions.button.base}),
        button({key: 'h', altKey: 'H'}, {widthRatio: dimensions.button.base}),
        button({key: 'j', altKey: 'J'}, {widthRatio: dimensions.button.base}),
        button({key: 'k', altKey: 'K'}, {widthRatio: dimensions.button.base}),
        button({key: 'l', altKey: 'L'}, {widthRatio: dimensions.button.base}),
        button({key: ';', altKey: ':'}, {widthRatio: dimensions.button.base}),
        button({key: '\'', altKey: '"'}, {widthRatio: dimensions.button.base}),
        button({key: 'Enter'}, {widthRatio: dimensions.button['2x-base+']}),
        button({key: 'PageUp', display: 'PgUp'}, {widthRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Shift'}, {widthRatio: dimensions.button.large}), // L_SHIFT
        button({key: 'z', altKey: 'Z'}, {widthRatio: dimensions.button.base}),
        button({key: 'x', altKey: 'X'}, {widthRatio: dimensions.button.base}),
        button({key: 'c', altKey: 'C'}, {widthRatio: dimensions.button.base}),
        button({key: 'v', altKey: 'V'}, {widthRatio: dimensions.button.base}),
        button({key: 'b', altKey: 'B'}, {widthRatio: dimensions.button.base}),
        button({key: 'n', altKey: 'N'}, {widthRatio: dimensions.button.base}),
        button({key: 'm', altKey: 'M'}, {widthRatio: dimensions.button.base}),
        button({key: ',', altKey: '<'}, {widthRatio: dimensions.button.base}),
        button({key: '.', altKey: '>'}, {widthRatio: dimensions.button.base}),
        button({key: '/', altKey: '?'}, {widthRatio: dimensions.button.base}),
        button({key: 'Shift'}, {widthRatio: dimensions.button['base+']}), // R_SHIFT
        button({key: 'ArrowUp', display: '▲'}, {widthRatio: dimensions.button.base}),
        button({key: 'PageDown', display: 'PgDn'}, {widthRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Control', display: 'Ctrl'}, {widthRatio: dimensions.button["base+"]}), // L_CONTROL
        button({key: 'Fn'}, {widthRatio: dimensions.button.base}),
        button({key: 'Win'}, {widthRatio: dimensions.button.base}),
        button({key: 'Alt'}, {widthRatio: dimensions.button.base}),
        button({key: ' ', display: 'Spacebar'}, {widthRatio: dimensions.button.max}),
        button({key: 'Alt'}, {widthRatio: dimensions.button.base}),
        button({key: 'Control', display: 'Ctrl'}, {widthRatio: dimensions.button["base+"]}), // R_CONTROL
        button({key: 'ArrowLeft', display: '◀'}, {widthRatio: dimensions.button.base}),
        button({key: 'ArrowDown', display: '▼'}, {widthRatio: dimensions.button.base}),
        button({key: 'ArrowRight', display: '▶'}, {widthRatio: dimensions.button.base}),
    ],
]

const mousePositionReporter = new MousePositionReporter(canvas, 10, 'red');

function draw() {
    requestAnimationFrame(draw);
    clearScene(scene, canvas);

    drawKeyboard(scene, config, canvas.width, canvas.height, keys);
    mousePositionReporter.draw(scene);
}

draw();
