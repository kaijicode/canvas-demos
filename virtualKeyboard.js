import { keyboard } from "./keyboard.js";

const calcDimensions = (gapSize) => {
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
    const calcSize = (physicalButtonSizeInCm) => 100 / (gapSize / physicalButtonSizeInCm * 100)

    return {
        // gap between the keys is 0.3mm
        // entire keyboard layout is 30cm, 0.3mm is 1% of 30cm
        width: gapSize * 100,
        button: {
            // regular key such as 'A'
            // 1.5cm
            // 0.3 / 1.5 = 20% of 1.5
            base: calcSize(1.5),

            // e.g 'Esc', 'Delete'
            // 2.1cm
            // 0.3 / 2.1 * 100 = 14.28%, 100 / 14.28 = 7
            'base+': calcSize(2.1),

            // 'Backspace', 'Caps Lock'
            // 3cm
            // 0.3 / 3 * 100 = 10%
            '2xbase': calcSize(3),

            // 'Enter'
            // 3.5cm
            // 0.3 / 3.5 * 100 = 8.571%, 100 / 8.571 = 11.666
            '2xbase+': calcSize(3.5),

            // 'L_Shift'
            // 4.2cm
            // 0.3 / 4.2 = 7.14%
            large: calcSize(4.2),

            // 'Spacebar'
            // 11.3cm
            // 0.3 / 11.3 = 2.65%
            max: calcSize(11.3),
        }
    }
}
const dimensions = calcDimensions(8);

function newCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    document.body.appendChild(canvas);
    return canvas;
}


const canvas = newCanvas(dimensions.width, 400);
const scene = canvas.getContext('2d');

const keyPressedStatus = keyboard();


const char = (symbol, symbol2, align) => {
    return {
        symbol,
        symbol2,
        align: 'left', // 'center', 'left', 'right'
    }
};

const chars = [
    [char('ESC'), char('F1'), char('F2')],
    [char('!', '1'), char('@', '2')],
    [char('Tab'), char('Q')],
    [char('Caps lock'), char('A')],
    [char('Shift'), char('Z')],
    [char('Ctrl'), char('Fn')]
];

const button = (key, box, backgroundColor) => {
    // {key, display, altKey, altKeyDisplay}
    // key = {key: 'ArrowUp', display: 'Up'}
    // key = {key: 'w', altKey: 'W'}
    return {
        ...key,
        ...box,
        backgroundColor,
    }
};

const getKeyRepresentation = (key, isShiftPressed) => {
    if (isShiftPressed) {
        return key.altKey && key.altKeyDisplay ? key.altKeyDisplay : key.altKey || key.display || key.key;
    }

    return key.display ? key.display : key.key;
}

// TODO: bug, if you press Shift+D and release it, the key rendered as pressed
// TODO: and the other way around
const isKeyPressed = (currentPressedKey, key) => {
    return currentPressedKey[key.key] || currentPressedKey[key.altKey];
}

const keys = [
    [
        button({key: 'ESC'}, {columnRatio: dimensions.button['base+']}),
        button({key: 'F1'}, {columnRatio: dimensions.button.base}),
        button({key: 'F2'}, {columnRatio: dimensions.button.base}),
        button({key: 'F3'}, {columnRatio: dimensions.button.base}),
        button({key: 'F4'}, {columnRatio: dimensions.button.base}),
        button({key: 'F5'}, {columnRatio: dimensions.button.base}),
        button({key: 'F6'}, {columnRatio: dimensions.button.base}),
        button({key: 'F7'}, {columnRatio: dimensions.button.base}),
        button({key: 'F8'}, {columnRatio: dimensions.button.base}),
        button({key: 'F9'}, {columnRatio: dimensions.button.base}),
        button({key: 'F10'}, {columnRatio: dimensions.button.base}),
        button({key: 'F11'}, {columnRatio: dimensions.button.base}),
        button({key: 'F12'}, {columnRatio: dimensions.button.base}),
        button({key: 'Delete'}, {columnRatio: dimensions.button['base+']}),
        button({key: '⦿'}, {columnRatio: dimensions.button.base}), // on/off
    ],

    [
        button({key: '`', altKey: '~'}, {columnRatio: dimensions.button.base}),
        button({key: '1', altKey: '!'}, {columnRatio: dimensions.button.base}),
        button({key: '2', altKey: '@'}, {columnRatio: dimensions.button.base}),
        button({key: '3', altKey: '#'}, {columnRatio: dimensions.button.base}),
        button({key: '4', altKey: '$'}, {columnRatio: dimensions.button.base}),
        button({key: '5', altKey: '%'}, {columnRatio: dimensions.button.base}),
        button({key: '6', altKey: '^'}, {columnRatio: dimensions.button.base}),
        button({key: '7', altKey: '&'}, {columnRatio: dimensions.button.base}),
        button({key: '8', altKey: '*'}, {columnRatio: dimensions.button.base}),
        button({key: '9', altKey: '('}, {columnRatio: dimensions.button.base}),
        button({key: '0', altKey: ')'}, {columnRatio: dimensions.button.base}),
        button({key: '-', altKey: '_'}, {columnRatio: dimensions.button.base}),
        button({key: '=', altKey: '+'}, {columnRatio: dimensions.button.base}),
        button({key: 'Backspace'}, {columnRatio: dimensions.button['2xbase']}),
        button({key: 'Home'}, {columnRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Tab'}, {columnRatio: dimensions.button['base+']}),
        button({key: 'q', altKey: 'Q'}, {columnRatio: dimensions.button.base}),
        button({key: 'w', altKey: 'W'}, {columnRatio: dimensions.button.base}),
        button({key: 'e', altKey: 'E'}, {columnRatio: dimensions.button.base}),
        button({key: 'r', altKey: 'R'}, {columnRatio: dimensions.button.base}),
        button({key: 't', altKey: 'T'}, {columnRatio: dimensions.button.base}),
        button({key: 'y', altKey: 'Y'}, {columnRatio: dimensions.button.base}),
        button({key: 'u', altKey: 'U'}, {columnRatio: dimensions.button.base}),
        button({key: 'i', altKey: 'I'}, {columnRatio: dimensions.button.base}),
        button({key: 'o', altKey: 'O'}, {columnRatio: dimensions.button.base}),
        button({key: 'p', altKey: 'P'}, {columnRatio: dimensions.button.base}),
        button({key: '[', altKey: '{'}, {columnRatio: dimensions.button.base}),
        button({key: ']', altKey: '}'}, {columnRatio: dimensions.button.base}),
        button({key: '\\', altKey: '|'}, {columnRatio: dimensions.button["base+"]}),
        button({key: 'End'}, {columnRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Caps lock'}, {columnRatio: dimensions.button['2xbase+']}),
        button({key: 'a', altKey: 'A'}, {columnRatio: dimensions.button.base}),
        button({key: 's', altKey: 'S'}, {columnRatio: dimensions.button.base}),
        button({key: 'd', altKey: 'D'}, {columnRatio: dimensions.button.base}),
        button({key: 'f', altKey: 'F'}, {columnRatio: dimensions.button.base}),
        button({key: 'g', altKey: 'G'}, {columnRatio: dimensions.button.base}),
        button({key: 'h', altKey: 'H'}, {columnRatio: dimensions.button.base}),
        button({key: 'j', altKey: 'J'}, {columnRatio: dimensions.button.base}),
        button({key: 'k', altKey: 'K'}, {columnRatio: dimensions.button.base}),
        button({key: 'l', altKey: 'L'}, {columnRatio: dimensions.button.base}),
        button({key: ';', altKey: ':'}, {columnRatio: dimensions.button.base}),
        button({key: '\'', altKey: '"'}, {columnRatio: dimensions.button.base}),
        button({key: 'Enter'}, {columnRatio: dimensions.button['2xbase+']}),
        button({key: 'PageUp', display: 'PgUp'}, {columnRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Shift'}, {columnRatio: dimensions.button.large}), // L_SHIFT
        button({key: 'z', altKey: 'Z'}, {columnRatio: dimensions.button.base}),
        button({key: 'x', altKey: 'X'}, {columnRatio: dimensions.button.base}),
        button({key: 'c', altKey: 'C'}, {columnRatio: dimensions.button.base}),
        button({key: 'v', altKey: 'V'}, {columnRatio: dimensions.button.base}),
        button({key: 'b', altKey: 'B'}, {columnRatio: dimensions.button.base}),
        button({key: 'n', altKey: 'N'}, {columnRatio: dimensions.button.base}),
        button({key: 'm', altKey: 'M'}, {columnRatio: dimensions.button.base}),
        button({key: ',', altKey: '<'}, {columnRatio: dimensions.button.base}),
        button({key: '.', altKey: '>'}, {columnRatio: dimensions.button.base}),
        button({key: '/', altKey: '?'}, {columnRatio: dimensions.button.base}),
        button({key: 'Shift'}, {columnRatio: dimensions.button['base+']}), // R_SHIFT
        button({key: 'ArrowUp', display: '▲'}, {columnRatio: dimensions.button.base}),
        button({key: 'PageDown', display: 'PgDn'}, {columnRatio: dimensions.button.base}),
    ],

    [
        button({key: 'Control', display: 'Ctrl'}, {columnRatio: dimensions.button["base+"]}), // L_CONTROL
        button({key: 'Fn'}, {columnRatio: dimensions.button.base}),
        button({key: 'Win'}, {columnRatio: dimensions.button.base}),
        button({key: 'Alt'}, {columnRatio: dimensions.button.base}),
        button({key: ' ', display: 'Spacebar'}, {columnRatio: dimensions.button.max}),
        button({key: 'Alt'}, {columnRatio: dimensions.button.base}),
        button({key: 'Control', display: 'Ctrl'}, {columnRatio: dimensions.button["base+"]}), // R_CONTROL
        button({key: 'ArrowLeft', display: '◀'}, {columnRatio: dimensions.button.base}),
        button({key: 'ArrowDown', display: '▼'}, {columnRatio: dimensions.button.base}),
        button({key: 'ArrowRight', display: '▶'}, {columnRatio: dimensions.button.base}),
    ],
]

const drawBox = (scene, x, y, width, height, color) => {
    scene.fillStyle = color;
    scene.fillRect(x, y, width, height);
}

function draw() {
    requestAnimationFrame(draw);
    const esc = chars[0][0].symbol;
    const f1 = chars[0][1].symbol;
    const f2 = chars[0][2].symbol;

    const font = 'monospace';
    const fontSize = '50px';
    const fontColor = 'black';
    const buttonBackgroundColor = 'white';
    // const size = scene.measureText(f1).width;
    scene.font = `${fontSize}px ${font}`;
    scene.strokeStyle = fontColor;


    const gap = 30;
    const height = 50;
    const width = 50;
    const marginTop = 30;
    scene.fillStyle = 'orange'
    // for (let i = 0; i < chars.length; i += 1) {
    //     for (let j = 0; j < chars[i].length; j += 1) {
    //         scene.fillRect(width * j + gap * j, height * i + marginTop * i, 50, 50);
    //     }
    // }

    function drawMultiDimensionalBoxes() {
        const boxes = [
            [1, 2, 3, 4],
            [1, 2, 3],
            [1, 2],
            [1]
        ];

        for (let i = 0; i < boxes.length; i += 1) {
            for (let j = 0; j < boxes[i].length; j += 1) {
                scene.fillRect(width * j + gap * j, height * i + marginTop * i, width, height);
            }
        }
    }
    // drawMultiDimensionalBoxes();

    function drawBoxesEvenly() {
        const gap = 30;
        const height = 50;
        const marginTop = 30;
        const boxes = [
            [1, 2, 3, 4],
            [1, 2, 3],
            [1, 2],
            [1]
        ];

        // spread items in row evenly
        for (let i = 0; i < boxes.length; i += 1) {
            const totalGap = (boxes[i].length - 1) * gap;
            const widthPerBox = (canvas.width - totalGap) / boxes[i].length;
            for (let j = 0; j < boxes[i].length; j += 1) {
                scene.fillRect(widthPerBox * j + gap * j, height * i + marginTop * i, widthPerBox, height);
            }
        }
    }
    // drawBoxesEvenly();

    function drawBoxesProportionally() {
        const gap = 30;
        const height = 50;

        const boxes = [
            {columnRatio: 1}, {columnRatio: 2}, {columnRatio: 1},
        ]

        // solve x for: canvas.width = x + 2x + x;
        const totalGap = (boxes.length - 1) * gap;
        const pointValue = (canvas.width - totalGap) / boxes.reduce((total, point) => total + point.columnRatio, 0);
        const boxesWithWidth = boxes.map((box) => {
            return {...box, width: box.columnRatio * pointValue};
        });

        let x = 0;
        for (let i = 0; i < boxesWithWidth.length; i += 1) {
            scene.fillRect(x, 0, boxesWithWidth[i].width, height);
            x = x + boxesWithWidth[i].width + gap;
        }
    }

    // drawBoxesProportionally();

    function drawMultiDimensionalBoxesProportionally() {
        // calculate gap for each row
        // calculate total width for each row (gap in each row can be different, so is the total available width)
        // for each row:
        //      calculate how much px one point cost
        //      for each item:
        //          calculate it's width
        // for each row:
        //      calculate y
        //      for each item:
        //          calculate x
        //          draw item at x, y, width, height

        const gap = 30;
        const height = 50;
        const marginTop = 30;

        const boxes = [
            [{columnRatio: 1}, {columnRatio: 2}, {columnRatio: 1}],
            [{columnRatio: 2}, {columnRatio: 1}, {columnRatio: 2}],
            [{columnRatio: 1}, {columnRatio: 1}, {columnRatio: 1}],
        ]

        const gapByRow = boxes.map((row) => {
            return gap * (row.length - 1);
        });

        const availableWidthByRow = gapByRow.map((gap) => {
            return canvas.width - gap;
        });

        const boxesWithWidth = boxes.map((row, index) => {
            const countRatio = row.reduce((sum, box) => {
                return sum + box.columnRatio;
            }, 0);

            const oneRatioCostInPixels = availableWidthByRow[index] / countRatio;

            return row.map((box) => {
                return {...box, width: box.columnRatio * oneRatioCostInPixels};
            });
        });

        for (let i = 0; i < boxesWithWidth.length; i += 1) {
            let x = 0;
            let y = i * height + (marginTop * i);
            for (let j = 0; j < boxesWithWidth[i].length; j += 1) {
                scene.fillRect(x, y, boxesWithWidth[i][j].width, height);
                x = x + boxesWithWidth[i][j].width + gap;
            }
        }

    }

    // drawMultiDimensionalBoxesProportionally();


    function placeText(scene, box, text) {
        // x, y, width, height is the box
        const fontHeight = 8;
        scene.font = '8px monospace';
        scene.fillStyle = 'black'
        const metrics = scene.measureText(text);
        scene.fillText(text, (box.x + box.x2) / 2 - (metrics.width / 2), (box.y + box.y4) / 2 + (fontHeight / 2));
    }

    function drawKeys(scene, canvasWidth, canvasHeight, keys) {
        const gap = 15;
        const height = 25;
        const marginTop = 15;

        const gapByRow = keys.map((row) => {
            return gap * (row.length - 1);
        });

        const availableWidthByRow = gapByRow.map((gap) => {
            return canvas.width - gap;
        });

        const boxesWithWidth = keys.map((row, index) => {
            const countRatio = row.reduce((sum, box) => {
                return sum + box.columnRatio;
            }, 0);

            const oneRatioCostInPixels = availableWidthByRow[index] / countRatio;

            return row.map((box) => {
                return {...box, width: box.columnRatio * oneRatioCostInPixels};
            });
        });

        for (let i = 0; i < boxesWithWidth.length; i += 1) {
            let x = 0;
            let y = i * height + (marginTop * i);
            for (let j = 0; j < boxesWithWidth[i].length; j += 1) {
                scene.fillStyle = isKeyPressed(keyPressedStatus, boxesWithWidth[i][j]) ? 'orange' : 'white';
                scene.fillRect(x, y, boxesWithWidth[i][j].width, height);

                const symbol = getKeyRepresentation(boxesWithWidth[i][j], keyPressedStatus['Shift']);

                const box = {
                    x, y, // top-left
                    x2: x + boxesWithWidth[i][j].width, y2: y, // top-right
                    x3: x, y3: y + height, // bottom-left
                    x4: x + boxesWithWidth[i][j].width, y4: y + height// bottom-right
                };
                placeText(scene, box, symbol);

                x = x + boxesWithWidth[i][j].width + gap;
            }
        }

    }

    drawKeys(scene, canvas.width, canvas.height, keys)
}

draw();