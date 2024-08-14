// Generate the on-screen keyboard
function generateKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const rows = [
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm⌫'
    ];

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';

        row.split('').forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.className = 'key';
            keyElement.textContent = key.toUpperCase();
            keyElement.addEventListener('click', () => handleKeyboardInput(key));
            rowDiv.appendChild(keyElement);
        });

        keyboard.appendChild(rowDiv);
    });
}

// Handle input from the on-screen keyboard
function handleKeyboardInput(letter) {
    const guessInput = document.getElementById('guessInput');
    if (letter === '⌫') {
        handleBackspace();
    } else {
        if (guessInput.value.length < maxCols) {
            guessInput.value += letter;
        }
    }
}

// Handle backspace
function handleBackspace() {
    const guessInput = document.getElementById('guessInput');
    guessInput.value = guessInput.value.slice(0, -1);
}
