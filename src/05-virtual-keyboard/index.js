import { keyboard } from "../keyboard.js";
import {HorizontalRuler, MousePositionReporter, VerticalRuler} from "../mousePositionReporter";
import {clearScene} from "../canvas";

// TODO: Mouse interaction
// TODO: Add option to use strokeRect
        // note that, the border adds to the dimensions extra px
// TODO: it would be cool if I could play with the config in live
// TODO: last row is being cut (should be 38px instead of 33px)
const config = {
    canvas: {
        background: '#ffffff',
    },

    font: {
        family: 'monospace',
        size: '8px',
        color: '#ffffff',
        height: 8, // TODO: is there a way to calculate how much given font family and font size take in height?
    },

    oneCmInPixels: 25,

    keyboard: {
        size: 8,

        button: {
            background: '#000000',
            backgroundPressed: '#00C853',
        }
    },

    // in cm
    physicalKeyboardModel: {
        gap: 0.3, // gap between any two adjacent keys on the keyboard (in mm)
        width: 30.3,
        height: 10.5,

        button: {
            width: {
                size1: 1.6,
                size2: 2.3,
                size3: 3,
                size4: 3.6,
                size5: 4.2,
                size6: 11.1,
            },

            height: {
                size1: 1,
                size2: 1.5
            },
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

// calculate dimensions in pixels
function calcDimensions(config) {
    const physical = config.physicalKeyboardModel;

    // gap is the smallest possible unit. ratio's are calculated based on the gap.
    const toPixels = (physicalSizeInCm) => physicalSizeInCm / physical.gap * config.keyboard.size;

    return {
        gap: toPixels(physical.gap),
        width: toPixels(physical.width),
        height: toPixels(physical.height),
        button: {
            width: {
                size1: toPixels(physical.button.width.size1),
                size2: toPixels(physical.button.width.size2),
                size3: toPixels(physical.button.width.size3),
                size4: toPixels(physical.button.width.size4),
                size5: toPixels(physical.button.width.size5),
                size6: toPixels(physical.button.width.size6),
            },

            height: {
                size1: toPixels(physical.button.height.size1),
                size2: toPixels(physical.button.height.size2),
            }
        },
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
        // calculate total gap used by each row
        const gapByRow = keys.map((row) => {
            return dimensions.gap * (row.length - 1);
        });

        // calculate available width per row
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
            let y = i * dimensions.button.height.size2 + (dimensions.gap * i);
            for (let j = 0; j < boxesWithWidth[i].length; j += 1) {
                scene.fillStyle = isKeyPressed(keyPressedStatus, boxesWithWidth[i][j]) ?
                    config.keyboard.button.backgroundPressed :
                    config.keyboard.button.background;

                scene.fillRect(x, y, boxesWithWidth[i][j].width, dimensions.button.height.size2);

                const symbol = getKeyRepresentation(boxesWithWidth[i][j], keyPressedStatus['Shift']);

                const box = {
                    x, y, // top-left
                    x2: x + boxesWithWidth[i][j].width, y2: y, // top-right
                    x3: x, y3: y + dimensions.button.height.size2, // bottom-left
                    x4: x + boxesWithWidth[i][j].width, y4: y + dimensions.button.height.size2 // bottom-right
                };

                placeText(scene, box, config.font,  symbol);

                x = x + boxesWithWidth[i][j].width + dimensions.gap;
            }
        }

    }


const dimensions = calcDimensions(config);
const canvas = newCanvas(dimensions.width, dimensions.height, config.canvas.background);
const scene = canvas.getContext('2d');
const keyPressedStatus = keyboard();
const keys = [
    [
        button({key: 'ESC'}, {widthRatio: dimensions.button.width.size2}),
        button({key: 'F1'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F2'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F3'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F4'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F5'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F6'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F7'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F8'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F9'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F10'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F11'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'F12'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'Delete'}, {widthRatio: dimensions.button.width.size2}),
        button({key: '⦿'}, {widthRatio: dimensions.button.width.size1}), // on/off
    ],

    [
        button({key: '`', altKey: '~'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '1', altKey: '!'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '2', altKey: '@'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '3', altKey: '#'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '4', altKey: '$'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '5', altKey: '%'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '6', altKey: '^'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '7', altKey: '&'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '8', altKey: '*'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '9', altKey: '('}, {widthRatio: dimensions.button.width.size1}),
        button({key: '0', altKey: ')'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '-', altKey: '_'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '=', altKey: '+'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'Backspace'}, {widthRatio: dimensions.button.width.size3}),
        button({key: 'Home'}, {widthRatio: dimensions.button.width.size1}),
    ],

    [
        button({key: 'Tab'}, {widthRatio: dimensions.button.width.size2}),
        button({key: 'q', altKey: 'Q'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'w', altKey: 'W'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'e', altKey: 'E'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'r', altKey: 'R'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 't', altKey: 'T'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'y', altKey: 'Y'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'u', altKey: 'U'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'i', altKey: 'I'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'o', altKey: 'O'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'p', altKey: 'P'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '[', altKey: '{'}, {widthRatio: dimensions.button.width.size1}),
        button({key: ']', altKey: '}'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '\\', altKey: '|'}, {widthRatio: dimensions.button.width.size2}),
        button({key: 'End'}, {widthRatio: dimensions.button.width.size1}),
    ],

    [
        button({key: 'Caps lock'}, {widthRatio: dimensions.button.width.size3}),
        button({key: 'a', altKey: 'A'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 's', altKey: 'S'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'd', altKey: 'D'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'f', altKey: 'F'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'g', altKey: 'G'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'h', altKey: 'H'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'j', altKey: 'J'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'k', altKey: 'K'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'l', altKey: 'L'}, {widthRatio: dimensions.button.width.size1}),
        button({key: ';', altKey: ':'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '\'', altKey: '"'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'Enter'}, {widthRatio: dimensions.button.width.size4}),
        button({key: 'PageUp', display: 'PgUp'}, {widthRatio: dimensions.button.width.size1}),
    ],

    [
        button({key: 'Shift'}, {widthRatio: dimensions.button.width.size5}), // L_SHIFT
        button({key: 'z', altKey: 'Z'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'x', altKey: 'X'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'c', altKey: 'C'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'v', altKey: 'V'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'b', altKey: 'B'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'n', altKey: 'N'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'm', altKey: 'M'}, {widthRatio: dimensions.button.width.size1}),
        button({key: ',', altKey: '<'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '.', altKey: '>'}, {widthRatio: dimensions.button.width.size1}),
        button({key: '/', altKey: '?'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'Shift'}, {widthRatio: dimensions.button.width.size2}), // R_SHIFT
        button({key: 'ArrowUp', display: '▲'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'PageDown', display: 'PgDn'}, {widthRatio: dimensions.button.width.size1}),
    ],

    [
        button({key: 'Control', display: 'Ctrl'}, {widthRatio: dimensions.button.width.size2}), // L_CONTROL
        button({key: 'Fn'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'Win'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'Alt'}, {widthRatio: dimensions.button.width.size1}),
        button({key: ' ', display: 'Spacebar'}, {widthRatio: dimensions.button.width.size6}),
        button({key: 'Alt'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'Control', display: 'Ctrl'}, {widthRatio: dimensions.button.width.size2}), // R_CONTROL
        button({key: 'ArrowLeft', display: '◀'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'ArrowDown', display: '▼'}, {widthRatio: dimensions.button.width.size1}),
        button({key: 'ArrowRight', display: '▶'}, {widthRatio: dimensions.button.width.size1}),
    ],
]

const mousePositionReporter = new MousePositionReporter(canvas, 10, 'red');
const rulers = [
    new HorizontalRuler(0, 0, 1, 'red'),
    new VerticalRuler(0, 0, 1, 'green')
];

function draw() {
    requestAnimationFrame(draw);
    clearScene(scene, canvas);

    drawKeyboard(scene, config, canvas.width, canvas.height, keys);
    mousePositionReporter.draw(scene);

    for (const ruler of rulers) {
        ruler.update(mousePositionReporter.x, mousePositionReporter.y);
        ruler.draw(scene);
    }
}

draw();
