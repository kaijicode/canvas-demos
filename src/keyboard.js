export const keyboard = () => {
    const keyPressedState = {}

    const keyEventHandler = (event, isPressed) => {
        // if you press Shift+D and release the Shift before D, then D will be still in pressed state.
        // this is erases the state when Shift released.
        if (event.type === 'keyup' && event.key === 'Shift') {
            Object.keys(keyPressedState).forEach((key) => {
                delete keyPressedState[key];
            });
        }

        keyPressedState[event.key] = isPressed;
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