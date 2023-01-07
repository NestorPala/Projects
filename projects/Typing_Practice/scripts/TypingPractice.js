const DEFAULT_LETTER_COLOR = "white";
const CORRECT_LETTER = "green";
const WRONG_LETTER = "red";

const description = document.getElementById('description');
const startButton = document.getElementById('button-start');
const stopButton = document.getElementById('button-stop');
let input;
const mobileInput = document.getElementById('mobile-input');
const randomWordWrapper = document.getElementById('random-word-wrapper');
let randomWordBox = document.getElementById('random-word-box');
let currentLetter = 0;
let hits = 0;
let misses = 0;
let typedCharacters = 0;
let startTime = 0;
let currentTime = 0;
const scoreContainer = document.getElementById('score-container');
const wpmValue = document.getElementById("wpm-value");
const accuracyValue = document.getElementById('accuracy-value');



const isMobileDevice = () => window.matchMedia("only screen and (max-width: 760px)").matches;


const closeMobileKeyboard = () => mobileInput.removeChild(input);


const openMobileKeyboard = () => {
    input = document.createElement("textarea");
    input.setAttribute("type", "text");
    mobileInput.appendChild(input);
    input.focus();
};


const getAccuracy = () => Math.round(hits / (hits + misses) * 100);


// https://indiatyping.com/index.php/typing-tips/typing-speed-calculation-formula
function calculateWPM() {
    const minutesElapsed = ((currentTime - startTime) / 1000) / 60;
    return (((typedCharacters - misses) / 5) / minutesElapsed).toFixed(2);
}


function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * (wordsList.length - 1));
    return wordsList[randomIndex];
}


function removeWord() {
    randomWordWrapper.removeChild(randomWordBox);
    randomWordBox = document.createElement("div");
    randomWordBox.id = "random-word-box";
    randomWordBox.hidden = true;
    randomWordWrapper.appendChild(randomWordBox);
}


function addWord() {
    const randomWord = getRandomWord();

    for (let i = 0; i < randomWord.length; i++) {
        const newLetter = document.createElement("span");
        newLetter.id = i;
        newLetter.className = "letter";
        newLetter.innerHTML = randomWord[i];
        randomWordBox.appendChild(newLetter);
    }

    randomWordBox.hidden = false;
    randomWordWrapper.appendChild(randomWordBox);
}


function registerKey(event) {
    let key;

    if (isMobileDevice()) {
        key = mobileInput.firstChild.value.slice(-1);
    } else {
        key = event.key;
    }

    const letter = randomWordBox.childNodes[currentLetter];

    if (letter.innerHTML.toLowerCase() == key.toLowerCase()) {
        letter.setAttribute("style", "color: " + CORRECT_LETTER + ";");
        scoreContainer.style.color = CORRECT_LETTER;
        hits += 1;
    } else {
        letter.setAttribute("style", "color: " + WRONG_LETTER + ";");
        scoreContainer.style.color = WRONG_LETTER;
        misses += 1;
    }

    accuracyValue.innerHTML = getAccuracy();

    currentLetter++;
    typedCharacters++;
    currentTime = Date.now();

    wpmValue.innerHTML = calculateWPM();

    if (currentLetter == randomWordBox.childNodes.length) {
        if (isMobileDevice()) {
            closeMobileKeyboard();
            openMobileKeyboard();
        }
        removeWord();
        addWord();
        currentLetter = 0;
    }
}


function stop() {
    removeWord();

    if (isMobileDevice()) {
        closeMobileKeyboard();
        window.removeEventListener('input', registerKey);
    } else {
        window.removeEventListener('keydown', registerKey);
    }

    description.hidden = false;
    startButton.hidden = false;
    randomWordBox.hidden = true;
    stopButton.hidden = true;

    currentLetter = 0;

    scoreContainer.hidden = true;
    scoreContainer.style.color = DEFAULT_LETTER_COLOR;

    accuracyValue.innerHTML = 0;
    wpmValue.innerHTML = 0.00;

    alert("You have stopped typing");
    alert(`Your accuracy is ${getAccuracy()}%`);

    alert("Your WPM is: " + calculateWPM());
    typedCharacters = 0;
    startTime = 0;
    currentTime = 0;

    scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};


function start() {
    description.hidden = true;
    startButton.hidden = true;
    randomWordBox.hidden = false;
    stopButton.hidden = false;

    scoreContainer.hidden = false;

    currentLetter = 0;
    typedCharacters = 0;
    startTime = 0;
    currentTime = 0;

    hits = 0;
    misses = 0;

    addWord();

    startTime = Date.now();

    if (isMobileDevice()) {
        openMobileKeyboard();
        window.addEventListener('input', registerKey);
    } else {
        window.addEventListener('keydown', registerKey);
    }

    alert("You have started typing");
};
