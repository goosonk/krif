const envelope = document.getElementById('envelope');
const bgMusic = document.getElementById('bg-music');
const toggleBtn = document.getElementById('toggle-music');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
const seekSlider = document.getElementById('seek-slider');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

let isOpen = false;
let isSeeking = false;

// 1. GENERATE BACKGROUND PETAL VECTOR (Estetis, seragam di iOS & Android)
function initBackgroundPetals() {
  const container = document.getElementById('floating-petals-container');
  if (!container) return;

  // Dua variasi siluet bunga sakura dan daun kelopak
  const petalSVGs = [
    `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#f472b6"><path d="M12 2C10 6 7 9 3 11c4 2 7 5 9 9 2-4 5-7 9-9-4-2-7-5-9-9z"/></svg>`,
    `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#fda4af"><path d="M12 3c-2.8 3.5-3.8 6-3.8 8.5 0 3.2 2 5.5 3.8 5.5s3.8-2.3 3.8-5.5C15.8 9 14.8 6.5 12 3z"/></svg>`,
    `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#fbcfe8"><circle cx="12" cy="12" r="7"/></svg>`
  ];

  const totalPetals = 12; // Jumlah pas, tidak bikin lag di HP
  for (let i = 0; i < totalPetals; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.innerHTML = petalSVGs[i % petalSVGs.length];

    const size = Math.floor(Math.random() * 12 + 14); // 14px - 26px (halus)
    const leftPos = Math.random() * 92 + 4; // 4% - 96% lebar layar
    const duration = Math.random() * 6 + 10; // 10s - 16s
    const delay = Math.random() * 10; // 0s - 10s stagger

    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${leftPos}%`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    container.appendChild(el);
  }
}

initBackgroundPetals();

// 2. LOGIKA AUDIO & SLIDER
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateSliderVisual(percent) {
  seekSlider.style.background = `linear-gradient(to right, #f472b6 ${percent}%, #fce7f3 ${percent}%)`;
}

function playAudio() {
  if (!bgMusic) return;

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
      })
      .catch(err => {
        console.warn("Autoplay ditolak browser, user klik manual:", err);
        iconPause.classList.add('hidden');
        iconPlay.classList.remove('hidden');
      });
  }
}

function pauseAudio() {
  if (bgMusic) {
    bgMusic.pause();
    iconPause.classList.add('hidden');
    iconPlay.classList.remove('hidden');
  }
}

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgMusic.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

bgMusic.addEventListener('timeupdate', () => {
  if (!isNaN(bgMusic.duration) && bgMusic.duration > 0 && !isSeeking) {
    const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
    seekSlider.value = progressPercent;
    currentTimeEl.innerText = formatTime(bgMusic.currentTime);
    updateSliderVisual(progressPercent);
  }
});

const updateDuration = () => {
  if (!isNaN(bgMusic.duration) && bgMusic.duration > 0) {
    durationTimeEl.innerText = formatTime(bgMusic.duration);
  }
};
bgMusic.addEventListener('loadedmetadata', updateDuration);
bgMusic.addEventListener('durationchange', updateDuration);
bgMusic.addEventListener('canplay', updateDuration);

seekSlider.addEventListener('input', () => {
  isSeeking = true;
  updateSliderVisual(seekSlider.value);
  if (!isNaN(bgMusic.duration) && bgMusic.duration > 0) {
    const targetTime = (seekSlider.value / 100) * bgMusic.duration;
    currentTimeEl.innerText = formatTime(targetTime);
  }
});

seekSlider.addEventListener('change', () => {
  if (!isNaN(bgMusic.duration) && bgMusic.duration > 0) {
    bgMusic.currentTime = (seekSlider.value / 100) * bgMusic.duration;
  }
  isSeeking = false;
});

// 3. LEDAKAN BUNGA AMPLOB
function createFlowerBurst() {
  const icons = ['🌸', '💮', '💖', '✨'];
  
  for (let i = 0; i < 40; i++) { 
    const flower = document.createElement('div');
    flower.innerText = icons[Math.floor(Math.random() * icons.length)];
    flower.classList.add('burst-flower');
    
    const tx = (Math.random() - 0.5) * 600 + 'px';
    const ty = -(Math.random() * 320 + 200) + 'px';
    const rot = (Math.random() * 1080 - 540) + 'deg';
    
    flower.style.setProperty('--tx', tx);
    flower.style.setProperty('--ty', ty);
    flower.style.setProperty('--rot', rot);
    
    flower.style.fontSize = (1 + Math.random() * 1.3) + 'rem';
    flower.style.animationDelay = (Math.random() * 0.25) + 's';
    
    document.body.appendChild(flower);

    setTimeout(() => {
      flower.remove();
    }, 3000);
  }
}

// 4. SCROLL REVEAL OPTIMASI (Anti-macet di Mobile)
const setupScrollAnimation = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Sekali terlihat, langsung aktifkan secara permanen
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); 
      }
    });
  }, { 
    threshold: 0.05 // Cukup 5% elemen masuk layar, langsung muncul
  });

  const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
  hiddenElements.forEach((el) => observer.observe(el));
};

// 5. EVENT CLICK AMPLOP
envelope.addEventListener('click', function() {
  if (isOpen) return; 
  isOpen = true;
  
  playAudio();
  
  const instruction = document.getElementById('instruction-text');
  instruction.innerHTML = "Opening... 🎁✨";
  instruction.classList.remove('animate-pulse');
  
  document.getElementById('envelope-flap').style.transform = "rotateX(180deg)";
  document.getElementById('envelope-flap').style.zIndex = "0";
  document.getElementById('wax-seal').style.display = "none";

  createFlowerBurst();

  setTimeout(() => {
    document.getElementById('envelope-screen').classList.add('fade-out');
    
    setTimeout(() => {
      document.body.classList.remove('locked'); 
      
      const mainContent = document.getElementById('main-content');
      mainContent.classList.remove('hidden'); 
      mainContent.classList.add('flex'); 
      
      document.getElementById('envelope-screen').style.display = "none"; 
      
      setupScrollAnimation();
    }, 800); 
  }, 1800); 
});