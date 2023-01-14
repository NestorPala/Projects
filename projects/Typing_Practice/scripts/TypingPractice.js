const DEFAULT_LETTER_COLOR = "white";
const CORRECT_LETTER = "green";
const WRONG_LETTER = "red";

const description = document.getElementById('description');
const startButton = document.getElementById('button-start');
const stopButton = document.getElementById('button-stop');
const pauseButton = document.getElementById('button-pause');
const resumeButton = document.getElementById('button-resume');
const mobileInput = document.getElementById('mobile-input');
const randomWordWrapper = document.getElementById('random-word-wrapper');
const scoreContainer = document.getElementById('score-container');
const wpmValue = document.getElementById("wpm-value");
const accuracyValue = document.getElementById('accuracy-value');

let randomWordBox = document.getElementById('random-word-box');
let input;

let currentLetter = 0;
let typedCharacters = 0;
let startTime = 0;
let hits = 0;
let misses = 0;
let pauseStartTime = 0;
let pauseMinutes = 0;
let currentWpm = 0;


function isMobileDevice() {
    const matchesMobileScreen = window.matchMedia("only screen and (max-width: 760px)").matches;
    return matchesMobileScreen === true;
}


function getAccuracy() {
    const accuracyPercentage = Math.round(hits / (hits + misses) * 100);
    return accuracyPercentage;
}


function msToMinutes(ms) {
    return (ms / 1000) / 60;
}


function resetScoreContainer() {
    scoreContainer.style.color = DEFAULT_LETTER_COLOR;
}


function closeMobileKeyboard() {
    mobileInput.removeChild(input);
}


function openMobileKeyboard() {
    input = document.createElement("textarea");
    input.setAttribute("type", "text");
    mobileInput.appendChild(input);
    input.focus();
};


// https://indiatyping.com/index.php/typing-tips/typing-speed-calculation-formula
function calculateWPM() {
    const minutesElapsed = msToMinutes(Date.now() - startTime) - pauseMinutes;
    const calculatedWpm = ((typedCharacters - misses) / 5) / minutesElapsed;
    currentWpm = calculatedWpm;
}


function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * (wordList.length - 1));
    return wordList[randomIndex];
}


function removeCurrentWord() {
    randomWordWrapper.removeChild(randomWordBox);
    randomWordBox = document.createElement("div");
    randomWordBox.id = "random-word-box";
    randomWordBox.hidden = true;
    randomWordWrapper.appendChild(randomWordBox);
}


function addNewWord() {
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

    calculateWPM();
    typedCharacters++;

    wpmValue.innerHTML = ((currentWpm >= 0) ? currentWpm : 0).toFixed(2);

    if (currentLetter == randomWordBox.childNodes.length) {
        if (isMobileDevice()) {
            closeMobileKeyboard();
            openMobileKeyboard();
        }
        removeCurrentWord();
        addNewWord();
        currentLetter = 0;
    }
}


function disableKeyRegister() {
    if (isMobileDevice()) {
        closeMobileKeyboard();
        window.removeEventListener('input', registerKey);
    } else {
        window.removeEventListener('keydown', registerKey);
    }
}


function enableKeyRegister() {
    if (isMobileDevice()) {
        openMobileKeyboard();
        window.addEventListener('input', registerKey);
    } else {
        window.addEventListener('keydown', registerKey);
    }
}


function disableElements(...elements) {
    elements.forEach(element => element.hidden = true);
}


function enableElements(...elements) {
    elements.forEach(element => element.hidden = false);
}


function stop() {
    removeCurrentWord();
    disableKeyRegister();
    enableElements(description, startButton);
    disableElements(randomWordBox, stopButton, pauseButton, scoreContainer);
    resetScoreContainer();

    currentLetter = 0;
    typedCharacters = 0;
    startTime = 0;
    pauseMinutes = 0;
    
    alert("You have stopped typing");
    alert(`Your accuracy is ${getAccuracy()}%`);
    alert("Your WPM is: " + currentWpm.toFixed(2));

    currentWpm = 0;
    wpmValue.innerHTML = 0.00;
    accuracyValue.innerHTML = 0;

    scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};


function start() {
    addNewWord();
    enableKeyRegister();
    disableElements(description, startButton);
    enableElements(randomWordBox, stopButton, pauseButton, scoreContainer);

    currentLetter = 0;
    typedCharacters = 0;
    startTime = Date.now();
    hits = 0;
    misses = 0;

    alert("You have started typing");
};


function pause() {
    disableElements(stopButton, pauseButton);
    enableElements(resumeButton);
    pauseStartTime = Date.now();
    disableKeyRegister();
}


function resume() {
    enableElements(stopButton, pauseButton);
    disableElements(resumeButton);
    pauseMinutes += msToMinutes(Date.now() - pauseStartTime);
    pauseStartTime = 0;
    enableKeyRegister();
}