document.getElementById('year').textContent = new Date().getFullYear();

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const tracks = document.querySelectorAll('[data-track]');
let currentAudio = null;

tracks.forEach((track) => {
  const audio = track.querySelector('audio');
  const btn = track.querySelector('.play-btn');
  const progress = track.querySelector('.progress');
  const progressFill = track.querySelector('.progress-fill');
  const timeCurrent = track.querySelector('.time-current');
  const timeDuration = track.querySelector('.time-duration');

  audio.addEventListener('loadedmetadata', () => {
    timeDuration.textContent = formatTime(audio.duration);
  });

  btn.addEventListener('click', () => {
    if (audio.paused) {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
      }
      audio.play();
      currentAudio = audio;
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => btn.classList.add('playing'));
  audio.addEventListener('pause', () => btn.classList.remove('playing'));
  audio.addEventListener('ended', () => btn.classList.remove('playing'));

  audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    progressFill.style.width = `${pct}%`;
    timeCurrent.textContent = formatTime(audio.currentTime);
  });

  progress.addEventListener('click', (e) => {
    const rect = progress.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });
});
