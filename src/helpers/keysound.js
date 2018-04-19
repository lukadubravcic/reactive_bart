const TIME_BETWEEN_KEYS_THRESHOLD = 200;

let keysound = null;
let audioElement = null;
let timeoutID = null;

let availableKeySounds = [
    'chalkboard_1.mp3',
    'chalkboard_2.mp3',
    'chalkboard_3.mp3',
    'chalkboard_4.mp3',
    'chalkboard_5.mp3',
    'chalkboard_6.mp3',
    'chalkboard_7.mp3',
    'chalkboard_8.mp3',
];

let currentKeySound = null;

const initSound = () => {
    audioElement = document.createElement('audio');
    audioElement.style.display = "none";

    currentKeySound = availableKeySounds[0];
    availableKeySounds.splice(0, 1);

    audioElement.src = currentKeySound;
    audioElement.addEventListener("ended", setNewCurrentKeySound);
};

const playAudio = () => {
    audioElement.play();
};

const pauseAudio = () => {
    audioElement.pause();
};

const onKeyPress = () => {
    startControlTimer();
    playAudio();
};

const resetAudio = () => {
    audioElement.currentTime = 0;
};

const startControlTimer = () => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        pauseAudio();
    }, TIME_BETWEEN_KEYS_THRESHOLD);
};

const setNewCurrentKeySound = () => {
    currentKeySound = getRandomKeySoundClip();
    audioElement.src = currentKeySound;
    audioElement.currentTime = 0;
}

const getRandomKeySoundClip = () => {
    let newKeySound = availableKeySounds[Math.floor(Math.random() * availableKeySounds.length)];
    let index = availableKeySounds.indexOf(newKeySound);
    availableKeySounds.splice(index, 1);
    availableKeySounds.push(currentKeySound);
    return newKeySound;
}

export default {
    initSound,
    onKeyPress,
    resetAudio
}

