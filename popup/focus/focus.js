document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('timer');
  const startTimerBtn = document.getElementById('start-timer-btn');
  const stopTimerBtn = document.getElementById('stop-timer-btn');
  const resetTimerBtn = document.getElementById('reset-timer-btn');
  const timerInput = document.getElementById('timer-input');
  const musicTiles = document.querySelectorAll('.music-tile');
  const audioPlayer = document.getElementById('audio-player');
  let timerInterval;
  let audio = new Audio();
  let currentPlayingTile = null;

  startTimerBtn.addEventListener('click', () => {
    const minutes = parseInt(timerInput.value, 10);
    startTimer(minutes * 60, timerDisplay);
  });

  stopTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
  });

  resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerDisplay.textContent = "25:00";
    timerInput.value = 25;
  });

  musicTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const src = tile.getAttribute('data-src');
      playMusic(src);

    });
  });

  function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        clearInterval(timerInterval);
        display.textContent = "25:00";
        stopMusic();
      }
    }, 1000);
  }

  function playMusic(src) {
    audioPlayer.src = src;
    audioPlayer.loop = true;
    audioPlayer.play();
  }

  function stopMusic() {
    audioPlayer.pause();
    audio.currentTime = 0;
    if (currentPlayingTile) {
      currentPlayingTile.classList.remove('playing');
      currentPlayingTile.classList.remove('paused');
      currentPlayingTile = null;
    }
  }
});