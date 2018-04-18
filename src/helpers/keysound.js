const TIME_BETWEEN_KEYS_THRESHOLD = 20;

let keysound = null;
let audioElement = null;
let timeoutID = null;

const initSound = () => {
    // postavi sound element na document, save ga u vanjski scope
    audioElement = document.createElement('audio');
    audioElement.style.display = "none";
    audioElement.src = 'chalkboard_sound_effects.mp3';

    audioElement.addEventListener("ended", () => {
        audioElement.currentTime = 0;
        console.log("ended");
    });
    setTimeout(() => {
        console.log(audioElement.duration)
    }, 300)
    // audioElement.play();

}

const playAudio = () => {
    audioElement.play();
}

const stopAudio = () => {
    audioElement.stop();
}

const startControlTimer = () => {
    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
        // jel pritisnuta tipka u meduvremenu
    });
}



export default {
    initSound,
}

