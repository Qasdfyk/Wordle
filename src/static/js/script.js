const maxRows = 6;
const maxCols = 5;
let currentRow = 0;
let correctWord = "";
const guessedWords = new Set();
const letterStates = {}; // To track the state of each letter on the keyboard

// Function to check if a word is valid using an API
async function isWordInDictionary(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.ok;
}

// Function to get a random word from an API
async function getRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
        const data = await response.json();
        if (!isWordInDictionary(data[0])) {
            displayMessage("Error initializing game. Please try again.");
        }
        return data[0].toLowerCase(); // Return the word in lowercase
    } catch (error) {
        console.error('Error fetching random word:', error);
        return null;
    }
}

// Initialize the game and set the correct word
async function initializeGame() {
    correctWord = await getRandomWord();
    if (!correctWord) {
        displayMessage("Error initializing game. Please try again.");
        return;
    }
    console.log(`The correct word is: ${correctWord}`); // For debugging purposes

    const board = document.querySelector('.board');
    for (let r = 0; r < maxRows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        rowDiv.setAttribute('data-row', r);
        for (let c = 0; c < maxCols; c++) {
            const colDiv = document.createElement('div');
            colDiv.className = 'tile';
            colDiv.setAttribute('data-col', c);
            rowDiv.appendChild(colDiv);
        }
        board.appendChild(rowDiv);
    }

    generateKeyboard(); // Initialize the keyboard after the game
}

// Handle a player's guess
async function handleGuess() {
    const guessInput = document.getElementById('guessInput').value.toLowerCase();

    if (guessInput.length !== maxCols) {
        displayMessage("Please enter a 5-letter word.");
        return;
    }

    if (guessedWords.has(guessInput)) {
        displayMessage("You have already guessed that word.");
        return;
    }

    const isValidWord = await isWordInDictionary(guessInput);
    if (!isValidWord) {
        displayMessage("This word is not in the dictionary.");
        return;
    }

    if (currentRow >= maxRows) {
        displayMessage(`Game over! The correct word was "${correctWord}".`);
        return;
    }

    const row = document.querySelector(`.row[data-row="${currentRow}"]`);
    if (!row) return;

    for (let i = 0; i < maxCols; i++) {
        const tile = row.querySelector(`.tile[data-col="${i}"]`);
        tile.textContent = guessInput[i];
        const letter = guessInput[i];
        if (letter === correctWord[i]) {
            tile.classList.add('correct');
            updateKeyboardKey(letter, 'correct');
        } else if (correctWord.includes(letter)) {
            tile.classList.add('present');
            updateKeyboardKey(letter, 'present');
        } else {
            tile.classList.add('absent');
            updateKeyboardKey(letter, 'absent');
        }
    }

    if (guessInput === correctWord) {
        displayMessage("Congratulations! You guessed the word!");
        return;
    }

    guessedWords.add(guessInput);
    currentRow++;
    if (currentRow === maxRows) {
        displayMessage(`Game over! The correct word was "${correctWord}".`);
    }

    document.getElementById('guessInput').value = ""; // Clear the input for the next guess
}

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;

    // Make the message disappear after 5 seconds
    setTimeout(() => {
        messageElement.textContent = "";
    }, 5000); // 5000 milliseconds = 5 seconds
}

// Update the color of the keyboard keys based on the game feedback
function updateKeyboardKey(letter, state) {
    const keyElement = Array.from(document.querySelectorAll('#keyboard .key')).find(key => key.textContent.toLowerCase() === letter);
    if (keyElement && (!letterStates[letter] || letterStates[letter] !== 'correct')) {
        letterStates[letter] = state;
        keyElement.className = `key ${state}`;
    }
}

// Set up event listeners and initialize the game
document.getElementById('guessButton').addEventListener('click', handleGuess);

document.getElementById('refreshButton').addEventListener('click', () => {
    window.location.reload();
}); // Refresh button listener

document.getElementById('guessInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleGuess();
    }
});

window.onload = function() {
    // Check if the user is authenticated
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        // If not authenticated, redirect to the login page
        window.location.href = 'login.html';
    } else {
        // If authenticated, initialize the game
        initializeGame();
    }
};
