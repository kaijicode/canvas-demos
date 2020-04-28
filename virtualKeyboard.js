import { keyboard } from "./keyboard.js";

const canvas = document.getElementById('canvas');
const scene = canvas.getContext('2d');

const isKeyPressed = keyboard();


// const {
//     key: 'ESC',
//     display: 'Escape'
// }

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


// const drawKey = (scene, key) => {
//     scene.fillRect(0)
// };


// const key = (char, x = 0, y = 0, width = 0, height = 0, color = 'white') => {
//     return {
//         x,
//         y,
//         width,
//         height,
//         color,
//         char,
//
//         setPosition(x, y) {
//             this.x = x;
//             this.y = y;
//         },
//
//         setHeight(height) {
//             this.height = height;
//         },
//
//         getHeight() {
//             return this.height;
//         },
//
//         getWidth() {
//             return this.width;
//         }
//     }
// };

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

const keys = [
    [
        button({key: 'ESC'}, {columnRatio: 2}),
        button({key: 'F1'}, {columnRatio: 1}),
        button({key: 'F2'}, {columnRatio: 1}),
        button({key: 'F3'}, {columnRatio: 1}),
        button({key: 'F4'}, {columnRatio: 1}),
        button({key: 'F5'}, {columnRatio: 1}),
        button({key: 'F6'}, {columnRatio: 1}),
        button({key: 'F7'}, {columnRatio: 1}),
        button({key: 'F8'}, {columnRatio: 1}),
        button({key: 'F9'}, {columnRatio: 1}),
        button({key: 'F10'}, {columnRatio: 1}),
        button({key: 'F11'}, {columnRatio: 1}),
        button({key: 'F12'}, {columnRatio: 1}),
        button({key: 'Delete'}, {columnRatio: 2}),
        button({key: 'Power'}, {columnRatio: 1}),
    ],

    [
        button({key: '`', altKey: '~'}, {columnRatio: 1}),
        button({key: '1', altKey: '!'}, {columnRatio: 1}),
        button({key: '2', altKey: '@'}, {columnRatio: 1}),
        button({key: '3', altKey: '#'}, {columnRatio: 1}),
        button({key: '4', altKey: '$'}, {columnRatio: 1}),
        button({key: '5', altKey: '%'}, {columnRatio: 1}),
        button({key: '6', altKey: '^'}, {columnRatio: 1}),
        button({key: '7', altKey: '&'}, {columnRatio: 1}),
        button({key: '8', altKey: '*'}, {columnRatio: 1}),
        button({key: '9', altKey: '('}, {columnRatio: 1}),
        button({key: '0', altKey: ')'}, {columnRatio: 1}),
        button({key: '-', altKey: '_'}, {columnRatio: 1}),
        button({key: '=', altKey: '+'}, {columnRatio: 1}),
        button({key: 'Backspace'}, {columnRatio: 2.5}),
        button({key: 'Home'}, {columnRatio: 1}),
    ],

    [
        button({key: 'Tab'}, {columnRatio: 2}),
        button({key: 'q', altKey: 'Q'}, {columnRatio: 1}),
        button({key: 'w', altKey: 'W'}, {columnRatio: 1}),
        button({key: 'e', altKey: 'E'}, {columnRatio: 1}),
        button({key: 'r', altKey: 'R'}, {columnRatio: 1}),
        button({key: 't', altKey: 'T'}, {columnRatio: 1}),
        button({key: 'y', altKey: 'Y'}, {columnRatio: 1}),
        button({key: 'u', altKey: 'U'}, {columnRatio: 1}),
        button({key: 'i', altKey: 'I'}, {columnRatio: 1}),
        button({key: 'o', altKey: 'O'}, {columnRatio: 1}),
        button({key: 'p', altKey: 'P'}, {columnRatio: 1}),
        button({key: '[', altKey: '{'}, {columnRatio: 1}),
        button({key: ']', altKey: '}'}, {columnRatio: 1}),
        button({key: '\\', altKey: '|'}, {columnRatio: 2}),
        button({key: 'End'}, {columnRatio: 1}),
    ],

    [
        button({key: 'Caps lock'}, {columnRatio: 2}),
        button({key: 'a', altKey: 'A'}, {columnRatio: 1}),
        button({key: 's', altKey: 'S'}, {columnRatio: 1}),
        button({key: 'd', altKey: 'D'}, {columnRatio: 1}),
        button({key: 'f', altKey: 'F'}, {columnRatio: 1}),
        button({key: 'g', altKey: 'G'}, {columnRatio: 1}),
        button({key: 'h', altKey: 'H'}, {columnRatio: 1}),
        button({key: 'j', altKey: 'J'}, {columnRatio: 1}),
        button({key: 'k', altKey: 'K'}, {columnRatio: 1}),
        button({key: 'l', altKey: 'L'}, {columnRatio: 1}),
        button({key: ';', altKey: ':'}, {columnRatio: 1}),
        button({key: '\'', altKey: '"'}, {columnRatio: 1}),
        button({key: 'Enter'}, {columnRatio: 3}),
        button({key: 'PageUp', display: 'PgUp'}, {columnRatio: 1}),
    ],

    [
        button({key: 'Shift'}, {columnRatio: 3}),
        button({key: 'z', altKey: 'Z'}, {columnRatio: 1}),
        button({key: 'x', altKey: 'X'}, {columnRatio: 1}),
        button({key: 'c', altKey: 'C'}, {columnRatio: 1}),
        button({key: 'v', altKey: 'V'}, {columnRatio: 1}),
        button({key: 'b', altKey: 'B'}, {columnRatio: 1}),
        button({key: 'n', altKey: 'N'}, {columnRatio: 1}),
        button({key: 'm', altKey: 'M'}, {columnRatio: 1}),
        button({key: ',', altKey: '<'}, {columnRatio: 1}),
        button({key: '.', altKey: '>'}, {columnRatio: 1}),
        button({key: '/', altKey: '?'}, {columnRatio: 1}),
        button({key: 'Shift'}, {columnRatio: 2}),
        button({key: 'ArrowUp', display: 'Up'}, {columnRatio: 1}),
        button({key: 'PageDown', display: 'PgDn'}, {columnRatio: 1}),
    ],

    [
        button({key: 'Control', display: 'Ctrl'}, {columnRatio: 2}),
        button({key: 'Fn'}, {columnRatio: 1}),
        button({key: 'Win'}, {columnRatio: 1}),
        button({key: 'Alt'}, {columnRatio: 1}),
        button({key: '', display: 'Spacebar'}, {columnRatio: 5.5}),
        button({key: 'Alt'}, {columnRatio: 1}),
        button({key: 'Control', display: 'Ctrl'}, {columnRatio: 2}),
        button({key: 'ArrowLeft', display: 'Left'}, {columnRatio: 1}),
        button({key: 'ArrowDown', display: 'Down'}, {columnRatio: 1}),
        button({key: 'ArrowRight', display: 'Right'}, {columnRatio: 1}),
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
                scene.fillStyle = 'orange'
                scene.fillRect(x, y, boxesWithWidth[i][j].width, height);

                const symbol = getKeyRepresentation(boxesWithWidth[i][j], isKeyPressed['Shift']);

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