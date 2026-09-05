const envelope = document.getElementById('envelope');
const bgMusic = document.getElementById('bg-music');
const toggleBtn = document.getElementById('toggle-music');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

let isOpen = false;

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function playAudio() {
  if (bgMusic) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          iconPlay.classList.add('hidden');
          iconPause.classList.remove('hidden');
        })
        .catch(err => {
          console.log("Autoplay dicegah browser, user harus klik manual:", err);
        });
    }
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

// Update Progress Bar & Waktu Berjalan
bgMusic.addEventListener('timeupdate', () => {
  if (!isNaN(bgMusic.duration) && bgMusic.duration > 0) {
    const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.innerText = formatTime(bgMusic.currentTime);
  }
});

const setDuration = () => {
  if (!isNaN(bgMusic.duration)) {
    durationTimeEl.innerText = formatTime(bgMusic.duration);
  }
};
bgMusic.addEventListener('loadedmetadata', setDuration);
bgMusic.addEventListener('canplay', setDuration);

// Klik pada progress bar untuk geser durasi
progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = bgMusic.duration;
  if (!isNaN(duration)) {
    bgMusic.currentTime = (clickX / width) * duration;
  }
});

function createFlowerBurst() {
  const flowers = ['🌸', '🌺', '💮', '✨', '💖'];
  
  for(let i = 0; i < 50; i++) { 
    const flower = document.createElement('div');
    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
    flower.classList.add('burst-flower');
    
    const tx = (Math.random() - 0.5) * 800 + 'px';
    const ty = -(Math.random() * 350 + 250) + 'px';
    const rot = (Math.random() * 1440 - 720) + 'deg';
    
    flower.style.setProperty('--tx', tx);
    flower.style.setProperty('--ty', ty);
    flower.style.setProperty('--rot', rot);
    
    flower.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    flower.style.animationDelay = (Math.random() * 0.3) + 's';
    
    document.body.appendChild(flower);

    setTimeout(() => {
      flower.remove();
    }, 3200);
  }
}

const setupScrollAnimation = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { 
    threshold: 0.15 
  });

  const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
  hiddenElements.forEach((el) => observer.observe(el));
};

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
    }, 1000); 
  }, 2200); 
});