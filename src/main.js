
//  Timer variables
let btn = document.querySelector('.btn');
let btnSkip = document.getElementById('skip');
let stopwatch = document.getElementById('time');
const counterInTheDOM = document.getElementById('streakNumber');
const title = document.getElementById('title');
let interval;
let streakCounter = {
    shortAndStartCounter: 1,
    globalCounter: 1
};
const btnTypes = ['start', 'rest', 'longRest', 'pause'];

// Timer sounds
const blipClick = new Audio('https://github.com/gOdNtavas/pomoMinimalistic.github.io/blob/master/assets/blip.mp3?raw=true');
const soundFinish = new Audio('https://github.com/gOdNtavas/pomoMinimalistic.github.io/blob/master/assets/soundFinish.mp3?raw=true')

// Gear variable
const gear = document.querySelectorAll('.toggleConfig');
const btnSave = document.querySelector('.btn-save');
const containerConfig = document.querySelector('.config-container');

// Timer to Pomodoro
let timeFocous = 30;
let timeRest = 5;
let timeLongRest = 15;

// Set the start value
let timer = dayjs().minute(timeFocous).second(0);
displayCounter()
recordStreak()

// Event Linesteners
btn.addEventListener('click', () => {
    pauseOrStart();
    blipClick.play();
}
);

btnSkip.addEventListener('click', () => {
    // Just to solve the bug with is running stop the stopwatch and change the button
    removeAllClass();
    changeTextToStart();
    btn.classList.add(btnTypes[0]);

    // Add to the counter
    increaseStreak();

    updateTimer();
});

gear.forEach(element => {
    element.addEventListener('click', () => {
        openOrCloseConfig();
    });
})

btnSave.addEventListener('click', () => {
    // Stop the timer and start again
    removeAllClass();
    changeTextToStart();
    btn.classList.add(btnTypes[0]);

    saveConfigs();
});

// Functions

function openOrCloseConfig() {
    containerConfig.classList.toggle('display-config');
}

function saveConfigs() {
    let focous = parseInt(document.getElementById('focous').value);
    let short = parseInt(document.getElementById('short').value);
    let long = parseInt(document.getElementById('long').value);

    // Check if the values are empty
    if (checkIfEmpty(focous)) {
        focous = timeFocous;
    }
    if (checkIfEmpty(short)) {
        short = timeRest;
    }
    if (checkIfEmpty(long)) {
        long = timeLongRest;
    }

    // Change the display
    if (isLongRest()) {
        timer = changeTimer(long);
    } else if (isShortRest()) {
        timer = changeTimer(short);
    } else {
        timer = changeTimer(focous);
    }

    // Change the variables
    timeFocous = focous;
    timeRest = short;
    timeLongRest = long;

    displayCounter();
    openOrCloseConfig();
}

function pauseOrStart() {
    removeAllClass()

    if (interval >= 1) {
        btn.classList.add(btnTypes[0]);
        changeTextToStart();
    } else {
        btn.classList.add(btnTypes[3]);
        btn.innerHTML = 'Pause';
        interval = setInterval(countDown, 1000);
    }
}

function updateTimer() {
    if (isLongRest()) {
        timer = changeTimer(timeLongRest);
    } else if (isShortRest()) {
        timer = changeTimer(timeRest);
    } else {
        timer = changeTimer(timeFocous);
    }
    displayCounter()
}

function displayCounter() {
    stopwatch.innerHTML = timer.format('mm:ss');
    title.innerHTML = 'Pomodoro - ' + timer.format('mm:ss');
}

function countDown() {
    if (timer.$m == 0 && timer.$s == 0) {
        // Play the sound effect
        soundFinish.play();

        // Reset the interval and change the start color and text
        resetInterval();
        removeAllClass();
        btn.classList.add(btnTypes[0]);
        btn.innerHTML = 'Start';

        // Update the timer values to the new one
        increaseStreak();
        updateTimer();
    } else if (timer.$s == 0) {
        timer.$m -= 1;
        timer.$s = 59;
    } else {
        timer.$s -= 1;
    }

    displayCounter()
}

function removeAllClass() {
    btnTypes.forEach(element => {
        btn.classList.remove(element);
    });
}

function increaseStreak() {
    streakCounter.shortAndStartCounter++;
    if (streakCounter.shortAndStartCounter >= 3) {
        streakCounter.shortAndStartCounter = 1;
        streakCounter.globalCounter++;
    }
    recordStreak();
}

function recordStreak() {
    counterInTheDOM.innerHTML = streakCounter.globalCounter;
}

function resetInterval() {
    clearInterval(interval);
    interval = undefined;
}

function changeTextToStart() {
    btn.innerHTML = 'Start';
    resetInterval();
}

// Anonymous functions

isLongRest = () => {
    if (streakCounter.globalCounter % 4 == 0 && isShortRest()) {
        return true;
    }

    return false;
}

isShortRest = () => {
    if (streakCounter.shortAndStartCounter % 2 == 0) {
        return true;
    }
    return false;
}

changeTimer = (time) => {
    return dayjs().minute(time).second(0);
}

checkIfEmpty = (value) => {
    if (value >= 0) {
        return false;
    }

    return true;
}

