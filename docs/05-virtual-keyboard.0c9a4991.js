(function () {
  // ASSET: /home/vova/src/canvas-demos/src/keyboard.js
  const $b4f4953c07db39d2715c73948ed9a054$export$keyboard = () => {
    const keyPressedState = {};

    const keyEventHandler = (event, isPressed) => {
      // if you press Shift+D and release the Shift before D, then D will be still in pressed state.
      // this is erases the state when Shift released.
      if (event.type === 'keyup' && event.key === 'Shift') {
        Object.keys(keyPressedState).forEach(key => {
          delete keyPressedState[key];
        });
      }

      keyPressedState[event.key] = isPressed;
    };

    const handleKeyDownPress = event => {
      // log(`handleKeyDownPress: ${event.key}`);
      keyEventHandler(event, true);
    };

    const handleKeyUpPress = event => {
      // log(`handleKeyUpPress: ${event.key}`);
      keyEventHandler(event, false);
    };

    document.addEventListener('keydown', handleKeyDownPress);
    document.addEventListener('keyup', handleKeyUpPress);
    return keyPressedState;
  }; // usage:
  // const keyPressed = keyboard();
  // if (keyPressed['ArrowLeft']) { ... }


  function $f3094f620db763263a23e9467cd458d5$export$line(scene, x1, y1, x2, y2, width, color) {
    scene.beginPath();
    scene.lineWidth = width;
    scene.strokeStyle = color;
    scene.moveTo(x1, y1);
    scene.lineTo(x2, y2);
    scene.stroke();
  }

  // TODO: Would be cool if the output could be redirected to a different canvas
  class $def38de46b7594389092217affa779d3$export$MousePositionReporter {
    constructor(canvas, fontSize, fontColor) {
      this.canvas = canvas;
      this.x = 0;
      this.y = 0;
      this.fontColor = fontColor;
      this.fontSize = fontSize;
      this.listener = this.listen.bind(this);
      this.canvas.addEventListener('mousemove', this.listener);
    }

    draw(scene) {
      scene.fillStyle = this.fontColor;
      scene.font = `${this.fontSize}px monospace`;
      scene.fillText(`(${this.x}, ${this.y})`, this.x, this.y);
    }

    listen(event) {
      this.x = event.offsetX;
      this.y = event.offsetY;
    }

    destroy() {
      this.canvas.removeEventListener('mousemove', this.listener);
    }

  }

  class $def38de46b7594389092217affa779d3$export$Ruler {
    constructor(mouseX, mouseY, width, color) {
      this.x1 = mouseX;
      this.y1 = mouseY;
      this.x2 = 0;
      this.y2 = 0;
      this.color = color;
      this.width = width;
    }

    draw(scene) {
      $f3094f620db763263a23e9467cd458d5$export$line(scene, this.x1, this.y1, this.x2, this.y2, this.width, this.color);
    }

  }

  class $def38de46b7594389092217affa779d3$export$HorizontalRuler extends $def38de46b7594389092217affa779d3$export$Ruler {
    constructor(mouseX, mouseY, width, color) {
      super(mouseX, mouseY, width, color);
      this.update(mouseX, mouseY);
    }

    update(mouseX, mouseY) {
      this.x1 = 0;
      this.y1 = mouseY;
      this.x2 = mouseX;
      this.y2 = mouseY;
    }

  }

  class $def38de46b7594389092217affa779d3$export$VerticalRuler extends $def38de46b7594389092217affa779d3$export$Ruler {
    constructor(mouseX, mouseY, width, color) {
      super(mouseX, mouseY, width, color);
      this.update(mouseX, mouseY);
    }

    update(mouseX, mouseY) {
      this.x1 = mouseX;
      this.y1 = 0;
      this.x2 = mouseX;
      this.y2 = mouseY;
    }

  } // const positionReporter = new MousePositionReporter(canvas, 10, '#000000');
  // positionReporter.initialize();
  //
  // function draw() {
  //     requestAnimationFrame(draw);
  //
  //     clearScene(scene, canvas);
  //     positionReporter.draw(scene);
  // }
  //
  // draw();


  function $bf5096e55bb6ae2cfbfaf7e6cb056$export$clearScene(scene, canvas) {
    scene.clearRect(0, 0, canvas.width, canvas.height);
  }

  // TODO: Mouse interaction
  // TODO: Add option to use strokeRect
  // note that, the border adds to the dimensions extra px
  // TODO: it would be cool if I could play with the config in live
  // TODO: last row is being cut (should be 38px instead of 33px)
  const $bd6cc929cac6d139fec96c0e$var$config = {
    canvas: {
      background: '#ffffff'
    },
    font: {
      family: 'monospace',
      size: '8px',
      color: '#ffffff',
      height: 8 // TODO: is there a way to calculate how much given font family and font size take in height?

    },
    oneCmInPixels: 25,
    keyboard: {
      size: 8,
      button: {
        background: '#000000',
        backgroundPressed: '#00C853'
      }
    },
    // in cm
    physicalKeyboardModel: {
      gap: 0.3,
      // gap between any two adjacent keys on the keyboard (in mm)
      width: 30.3,
      height: 10.5,
      button: {
        width: {
          size1: 1.6,
          size2: 2.3,
          size3: 3,
          size4: 3.6,
          size5: 4.2,
          size6: 11.1
        },
        height: {
          size1: 1,
          size2: 1.5
        }
      }
    }
  };

  function $bd6cc929cac6d139fec96c0e$var$newCanvas(width, height, background) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.background = background;
    document.body.appendChild(canvas);
    return canvas;
  } // calculate dimensions in pixels


  function $bd6cc929cac6d139fec96c0e$var$calcDimensions(config) {
    const physical = config.physicalKeyboardModel; // gap is the smallest possible unit. ratio's are calculated based on the gap.

    const toPixels = physicalSizeInCm => physicalSizeInCm / physical.gap * config.keyboard.size;

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
          size6: toPixels(physical.button.width.size6)
        },
        height: {
          size1: toPixels(physical.button.height.size1),
          size2: toPixels(physical.button.height.size2)
        }
      }
    };
  }

  function $bd6cc929cac6d139fec96c0e$var$button(key, box, backgroundColor) {
    return { ...key,
      ...box,
      backgroundColor
    };
  }

  function $bd6cc929cac6d139fec96c0e$var$getKeyRepresentation(key, isShiftPressed) {
    if (isShiftPressed) {
      return key.altKey && key.altKeyDisplay ? key.altKeyDisplay : key.altKey || key.display || key.key;
    }

    return key.display ? key.display : key.key;
  }

  function $bd6cc929cac6d139fec96c0e$var$isKeyPressed(currentPressedKey, key) {
    return currentPressedKey[key.key] || currentPressedKey[key.altKey];
  }

  function $bd6cc929cac6d139fec96c0e$var$placeText(scene, box, font, text) {
    scene.font = `${font.size} ${font.family}`;
    scene.fillStyle = font.color;
    const metrics = scene.measureText(text); // center tex inside the box

    scene.fillText(text, (box.x + box.x2) / 2 - metrics.width / 2, (box.y + box.y4) / 2 + font.height / 2);
  }

  function $bd6cc929cac6d139fec96c0e$var$drawKeyboard(scene, config, canvasWidth, canvasHeight, keys) {
    // calculate total gap used by each row
    const gapByRow = keys.map(row => {
      return $bd6cc929cac6d139fec96c0e$var$dimensions.gap * (row.length - 1);
    }); // calculate available width per row

    const availableWidthByRow = gapByRow.map(gap => {
      return $bd6cc929cac6d139fec96c0e$var$canvas.width - gap;
    });
    const boxesWithWidth = keys.map((row, index) => {
      const countRatio = row.reduce((sum, box) => {
        return sum + box.widthRatio;
      }, 0);
      const oneRatioCostInPixels = availableWidthByRow[index] / countRatio;
      return row.map(box => {
        return { ...box,
          width: box.widthRatio * oneRatioCostInPixels
        };
      });
    });

    for (let i = 0; i < boxesWithWidth.length; i += 1) {
      let x = 0;
      let y = i * $bd6cc929cac6d139fec96c0e$var$dimensions.button.height.size2 + $bd6cc929cac6d139fec96c0e$var$dimensions.gap * i;

      for (let j = 0; j < boxesWithWidth[i].length; j += 1) {
        scene.fillStyle = $bd6cc929cac6d139fec96c0e$var$isKeyPressed($bd6cc929cac6d139fec96c0e$var$keyPressedStatus, boxesWithWidth[i][j]) ? config.keyboard.button.backgroundPressed : config.keyboard.button.background;
        scene.fillRect(x, y, boxesWithWidth[i][j].width, $bd6cc929cac6d139fec96c0e$var$dimensions.button.height.size2);
        const symbol = $bd6cc929cac6d139fec96c0e$var$getKeyRepresentation(boxesWithWidth[i][j], $bd6cc929cac6d139fec96c0e$var$keyPressedStatus['Shift']);
        const box = {
          x,
          y,
          // top-left
          x2: x + boxesWithWidth[i][j].width,
          y2: y,
          // top-right
          x3: x,
          y3: y + $bd6cc929cac6d139fec96c0e$var$dimensions.button.height.size2,
          // bottom-left
          x4: x + boxesWithWidth[i][j].width,
          y4: y + $bd6cc929cac6d139fec96c0e$var$dimensions.button.height.size2 // bottom-right

        };
        $bd6cc929cac6d139fec96c0e$var$placeText(scene, box, config.font, symbol);
        x = x + boxesWithWidth[i][j].width + $bd6cc929cac6d139fec96c0e$var$dimensions.gap;
      }
    }
  }

  const $bd6cc929cac6d139fec96c0e$var$dimensions = $bd6cc929cac6d139fec96c0e$var$calcDimensions($bd6cc929cac6d139fec96c0e$var$config);
  const $bd6cc929cac6d139fec96c0e$var$canvas = $bd6cc929cac6d139fec96c0e$var$newCanvas($bd6cc929cac6d139fec96c0e$var$dimensions.width, $bd6cc929cac6d139fec96c0e$var$dimensions.height, $bd6cc929cac6d139fec96c0e$var$config.canvas.background);
  const $bd6cc929cac6d139fec96c0e$var$scene = $bd6cc929cac6d139fec96c0e$var$canvas.getContext('2d');
  const $bd6cc929cac6d139fec96c0e$var$keyPressedStatus = $b4f4953c07db39d2715c73948ed9a054$export$keyboard();
  const $bd6cc929cac6d139fec96c0e$var$keys = [[$bd6cc929cac6d139fec96c0e$var$button({
    key: 'ESC'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size2
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F1'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F2'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F3'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F4'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F5'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F6'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F7'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F8'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F9'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F10'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F11'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'F12'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Delete'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size2
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '⦿'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }) // on/off
  ], [$bd6cc929cac6d139fec96c0e$var$button({
    key: '`',
    altKey: '~'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '1',
    altKey: '!'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '2',
    altKey: '@'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '3',
    altKey: '#'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '4',
    altKey: '$'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '5',
    altKey: '%'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '6',
    altKey: '^'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '7',
    altKey: '&'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '8',
    altKey: '*'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '9',
    altKey: '('
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '0',
    altKey: ')'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '-',
    altKey: '_'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '=',
    altKey: '+'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Backspace'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size3
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Home'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  })], [$bd6cc929cac6d139fec96c0e$var$button({
    key: 'Tab'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size2
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'q',
    altKey: 'Q'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'w',
    altKey: 'W'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'e',
    altKey: 'E'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'r',
    altKey: 'R'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 't',
    altKey: 'T'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'y',
    altKey: 'Y'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'u',
    altKey: 'U'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'i',
    altKey: 'I'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'o',
    altKey: 'O'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'p',
    altKey: 'P'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '[',
    altKey: '{'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: ']',
    altKey: '}'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '\\',
    altKey: '|'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size2
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'End'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  })], [$bd6cc929cac6d139fec96c0e$var$button({
    key: 'Caps lock'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size3
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'a',
    altKey: 'A'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 's',
    altKey: 'S'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'd',
    altKey: 'D'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'f',
    altKey: 'F'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'g',
    altKey: 'G'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'h',
    altKey: 'H'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'j',
    altKey: 'J'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'k',
    altKey: 'K'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'l',
    altKey: 'L'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: ';',
    altKey: ':'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '\'',
    altKey: '"'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Enter'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size4
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'PageUp',
    display: 'PgUp'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  })], [$bd6cc929cac6d139fec96c0e$var$button({
    key: 'Shift'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size5
  }), // L_SHIFT
  $bd6cc929cac6d139fec96c0e$var$button({
    key: 'z',
    altKey: 'Z'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'x',
    altKey: 'X'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'c',
    altKey: 'C'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'v',
    altKey: 'V'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'b',
    altKey: 'B'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'n',
    altKey: 'N'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'm',
    altKey: 'M'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: ',',
    altKey: '<'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '.',
    altKey: '>'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: '/',
    altKey: '?'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Shift'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size2
  }), // R_SHIFT
  $bd6cc929cac6d139fec96c0e$var$button({
    key: 'ArrowUp',
    display: '▲'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'PageDown',
    display: 'PgDn'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  })], [$bd6cc929cac6d139fec96c0e$var$button({
    key: 'Control',
    display: 'Ctrl'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size2
  }), // L_CONTROL
  $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Fn'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Win'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Alt'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: ' ',
    display: 'Spacebar'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size6
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Alt'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'Control',
    display: 'Ctrl'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size2
  }), // R_CONTROL
  $bd6cc929cac6d139fec96c0e$var$button({
    key: 'ArrowLeft',
    display: '◀'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'ArrowDown',
    display: '▼'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  }), $bd6cc929cac6d139fec96c0e$var$button({
    key: 'ArrowRight',
    display: '▶'
  }, {
    widthRatio: $bd6cc929cac6d139fec96c0e$var$dimensions.button.width.size1
  })]];
  const $bd6cc929cac6d139fec96c0e$var$mousePositionReporter = new $def38de46b7594389092217affa779d3$export$MousePositionReporter($bd6cc929cac6d139fec96c0e$var$canvas, 10, 'red');
  const $bd6cc929cac6d139fec96c0e$var$rulers = [new $def38de46b7594389092217affa779d3$export$HorizontalRuler(0, 0, 1, 'red'), new $def38de46b7594389092217affa779d3$export$VerticalRuler(0, 0, 1, 'green')];

  function $bd6cc929cac6d139fec96c0e$var$draw() {
    requestAnimationFrame($bd6cc929cac6d139fec96c0e$var$draw);
    $bf5096e55bb6ae2cfbfaf7e6cb056$export$clearScene($bd6cc929cac6d139fec96c0e$var$scene, $bd6cc929cac6d139fec96c0e$var$canvas);
    $bd6cc929cac6d139fec96c0e$var$drawKeyboard($bd6cc929cac6d139fec96c0e$var$scene, $bd6cc929cac6d139fec96c0e$var$config, $bd6cc929cac6d139fec96c0e$var$canvas.width, $bd6cc929cac6d139fec96c0e$var$canvas.height, $bd6cc929cac6d139fec96c0e$var$keys);
    $bd6cc929cac6d139fec96c0e$var$mousePositionReporter.draw($bd6cc929cac6d139fec96c0e$var$scene);

    for (const ruler of $bd6cc929cac6d139fec96c0e$var$rulers) {
      ruler.update($bd6cc929cac6d139fec96c0e$var$mousePositionReporter.x, $bd6cc929cac6d139fec96c0e$var$mousePositionReporter.y);
      ruler.draw($bd6cc929cac6d139fec96c0e$var$scene);
    }
  }

  $bd6cc929cac6d139fec96c0e$var$draw();
})();
//# sourceMappingURL=05-virtual-keyboard.0c9a4991.js.map
