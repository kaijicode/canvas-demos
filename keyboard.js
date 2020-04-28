export const keyboard = () => {
    const keyPressedState = {}

    const keyEventHandler = (event, isPressed) => {
        keyPressedState[event.key] = isPressed;
        console.log(event.key, isPressed);
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

// usage:
// const keyPressed = keyboard();
// if (keyPressed['ArrowLeft']) { ... }