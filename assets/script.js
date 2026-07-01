document.getElementById('year').textContent = new Date().getFullYear();

// break text into letters with a blue-to-pink neon glow, spray-can style
const GLOW_FROM = [51, 92, 255]; // blue
const GLOW_TO = [214, 20, 158]; // pink

function lerpColor(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function spray(el, { jitter = false } = {}) {
  if (!el) return;
  const chars = [...el.textContent];
  el.textContent = '';
  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = char;
    const t = chars.length > 1 ? i / (chars.length - 1) : 0;
    const [r, g, b] = lerpColor(GLOW_FROM, GLOW_TO, t);
    span.style.textShadow = `0 0 6px rgba(${r},${g},${b},0.95), 0 0 18px rgba(${r},${g},${b},0.55), 0 4px 16px rgba(${r},${g},${b},0.3)`;
    if (jitter) {
      const rotate = (Math.random() * 5 - 2.5).toFixed(2);
      const rise = (Math.random() * 6 - 3).toFixed(2);
      span.style.transform = `rotate(${rotate}deg) translateY(${rise}px)`;
    }
    el.appendChild(span);
  });
}

spray(document.querySelector('.logo'), { jitter: true });
spray(document.querySelector('.section-title'));

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
