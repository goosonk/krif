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

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Fungsi mewarnai track slider agar pink mengikuti lagunya
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
        console.warn("Autoplay dicegah browser, klik tombol play manual:", err);
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

// Update slider dan efek garis saat lagu diputar
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

// Event geser slider
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

// Ledakan Bunga Amplop
function createFlowerBurst() {
  const flowers = ['🌸', '🌺', '💮', '✨', '💖'];
  for (let i = 0; i < 45; i++) { 
    const flower = document.createElement('div');
    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
    flower.classList.add('burst-flower');
    
    const tx = (Math.random() - 0.5) * 650 + 'px';
    const ty = -(Math.random() * 320 + 200) + 'px';
    const rot = (Math.random() * 1080 - 540) + 'deg';
    
    flower.style.setProperty('--tx', tx);
    flower.style.setProperty('--ty', ty);
    flower.style.setProperty('--rot', rot);
    
    flower.style.fontSize = (1 + Math.random() * 1.3) + 'rem';
    flower.style.animationDelay = (Math.random() * 0.25) + 's';
    
    document.body.appendChild(flower);
    setTimeout(() => flower.remove(), 2800);
  }
}

// Logika Scroll Reveal: Sekali masuk layar langsung nampil permanen (anti-macet)
const setupScrollAnimation = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stay visible selamanya!
      }
    });
  }, { 
    threshold: 0.05 // Cukup 5% terlihat langsung animasi muncul
  });

  const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
  hiddenElements.forEach((el) => observer.observe(el));
};

// Klik Amplop
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
      
      // Inisialisasi animasi scroll
      setupScrollAnimation();
      
      // Paksa render elemen paling atas yang udah keliatan
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    }, 800); 
  }, 1800); 
});