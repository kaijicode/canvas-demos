(function () {
  // ASSET: /home/vova/src/canvas-demos/src/04-print-pressed-key/index.js

  /**
      actualBoundingBoxAscent: 30
      actualBoundingBoxDescent: 9
      actualBoundingBoxLeft: 23.08203125
      actualBoundingBoxRight: 23
      width: 48.1640625
   */
  const $bac47689b08b07127bbd772d62ebc5$var$canvas = document.getElementById('canvas');
  const $bac47689b08b07127bbd772d62ebc5$var$scene = $bac47689b08b07127bbd772d62ebc5$var$canvas.getContext('2d');

  const $bac47689b08b07127bbd772d62ebc5$var$keyboard = () => {
    const keyPressedState = {
      right: false,
      left: false,
      up: false,
      down: false,
      spacebar: false
    };

    const keyEventHandler = (event, isPressed) => {
      switch (event.key) {
        case 'Right':
        case 'ArrowRight':
          {
            keyPressedState.right = isPressed;
            break;
          }

        case 'Left':
        case 'ArrowLeft':
          {
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
  };

  const $bac47689b08b07127bbd772d62ebc5$var$keyPressed = $bac47689b08b07127bbd772d62ebc5$var$keyboard();

  function $bac47689b08b07127bbd772d62ebc5$var$draw() {
    requestAnimationFrame($bac47689b08b07127bbd772d62ebc5$var$draw);
    const fontSize = 32;
    const defaultColor = '#9E9E9E';
    const keyPressedColor = '#9C27B0';
    $bac47689b08b07127bbd772d62ebc5$var$scene.font = `${fontSize}px Arial`;
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillStyle = $bac47689b08b07127bbd772d62ebc5$var$keyPressed.up ? keyPressedColor : defaultColor;
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillText('Up', 0, fontSize);
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillStyle = $bac47689b08b07127bbd772d62ebc5$var$keyPressed.right ? keyPressedColor : defaultColor;
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillText('Right', 0, fontSize * 2);
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillStyle = $bac47689b08b07127bbd772d62ebc5$var$keyPressed.down ? keyPressedColor : defaultColor;
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillText('Down', 0, fontSize * 3);
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillStyle = $bac47689b08b07127bbd772d62ebc5$var$keyPressed.left ? keyPressedColor : defaultColor;
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillText('Left', 0, fontSize * 4);
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillStyle = $bac47689b08b07127bbd772d62ebc5$var$keyPressed.spacebar ? keyPressedColor : defaultColor;
    $bac47689b08b07127bbd772d62ebc5$var$scene.fillText('Space', 0, fontSize * 5);
  }

  $bac47689b08b07127bbd772d62ebc5$var$draw();
})();
//# sourceMappingURL=04-print-pressed-key.3aa9301b.js.map
