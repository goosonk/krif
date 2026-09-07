const envelope = document.getElementById('envelope');

// Audio 1 (HIVI! - Jatuh, Bangkit Kembali!)
const bgMusic1 = document.getElementById('bg-music-1');
const toggleBtn1 = document.getElementById('toggle-music-1');
const iconPlay1 = document.getElementById('icon-play-1');
const iconPause1 = document.getElementById('icon-pause-1');
const seekSlider1 = document.getElementById('seek-slider-1');
const currentTimeEl1 = document.getElementById('current-time-1');
const durationTimeEl1 = document.getElementById('duration-time-1');

// Audio 2 (LANY - you!)
const bgMusic2 = document.getElementById('bg-music-2');
const toggleBtn2 = document.getElementById('toggle-music-2');
const iconPlay2 = document.getElementById('icon-play-2');
const iconPause2 = document.getElementById('icon-pause-2');
const seekSlider2 = document.getElementById('seek-slider-2');
const currentTimeEl2 = document.getElementById('current-time-2');
const durationTimeEl2 = document.getElementById('duration-time-2');

// Tombol Next Story & Section Cerita
const btnNextStory = document.getElementById('btn-next-story');
const storySection = document.getElementById('story-section');

let isOpen = false;
let isSeeking1 = false;
let isSeeking2 = false;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateSliderVisual(slider, percent) {
  slider.style.background = `linear-gradient(to right, #f472b6 ${percent}%, #fce7f3 ${percent}%)`;
}

function playAudio(audio, iconPlay, iconPause) {
  if (!audio) return;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
      })
      .catch(err => {
        console.warn("Autoplay dicegah browser, user harus klik manual:", err);
        iconPause.classList.add('hidden');
        iconPlay.classList.remove('hidden');
      });
  }
}

function pauseAudio(audio, iconPlay, iconPause) {
  if (audio) {
    audio.pause();
    iconPause.classList.add('hidden');
    iconPlay.classList.remove('hidden');
  }
}

// === KONTROL LAGU 1 (HIVI) ===
toggleBtn1.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgMusic1.paused) {
    pauseAudio(bgMusic2, iconPlay2, iconPause2);
    playAudio(bgMusic1, iconPlay1, iconPause1);
  } else {
    pauseAudio(bgMusic1, iconPlay1, iconPause1);
  }
});

bgMusic1.addEventListener('timeupdate', () => {
  if (!isNaN(bgMusic1.duration) && bgMusic1.duration > 0 && !isSeeking1) {
    const percent = (bgMusic1.currentTime / bgMusic1.duration) * 100;
    seekSlider1.value = percent;
    currentTimeEl1.innerText = formatTime(bgMusic1.currentTime);
    updateSliderVisual(seekSlider1, percent);
  }
});

const updateDuration1 = () => {
  if (!isNaN(bgMusic1.duration) && bgMusic1.duration > 0) {
    durationTimeEl1.innerText = formatTime(bgMusic1.duration);
  }
};
bgMusic1.addEventListener('loadedmetadata', updateDuration1);
bgMusic1.addEventListener('durationchange', updateDuration1);
bgMusic1.addEventListener('canplay', updateDuration1);

seekSlider1.addEventListener('input', () => {
  isSeeking1 = true;
  updateSliderVisual(seekSlider1, seekSlider1.value);
  if (!isNaN(bgMusic1.duration) && bgMusic1.duration > 0) {
    currentTimeEl1.innerText = formatTime((seekSlider1.value / 100) * bgMusic1.duration);
  }
});

seekSlider1.addEventListener('change', () => {
  if (!isNaN(bgMusic1.duration) && bgMusic1.duration > 0) {
    bgMusic1.currentTime = (seekSlider1.value / 100) * bgMusic1.duration;
  }
  isSeeking1 = false;
});

// === KONTROL LAGU 2 (LANY) ===
toggleBtn2.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgMusic2.paused) {
    pauseAudio(bgMusic1, iconPlay1, iconPause1);
    playAudio(bgMusic2, iconPlay2, iconPause2);
  } else {
    pauseAudio(bgMusic2, iconPlay2, iconPause2);
  }
});

bgMusic2.addEventListener('timeupdate', () => {
  if (!isNaN(bgMusic2.duration) && bgMusic2.duration > 0 && !isSeeking2) {
    const percent = (bgMusic2.currentTime / bgMusic2.duration) * 100;
    seekSlider2.value = percent;
    currentTimeEl2.innerText = formatTime(bgMusic2.currentTime);
    updateSliderVisual(seekSlider2, percent);
  }
});

const updateDuration2 = () => {
  if (!isNaN(bgMusic2.duration) && bgMusic2.duration > 0) {
    durationTimeEl2.innerText = formatTime(bgMusic2.duration);
  }
};
bgMusic2.addEventListener('loadedmetadata', updateDuration2);
bgMusic2.addEventListener('durationchange', updateDuration2);
bgMusic2.addEventListener('canplay', updateDuration2);

seekSlider2.addEventListener('input', () => {
  isSeeking2 = true;
  updateSliderVisual(seekSlider2, seekSlider2.value);
  if (!isNaN(bgMusic2.duration) && bgMusic2.duration > 0) {
    currentTimeEl2.innerText = formatTime((seekSlider2.value / 100) * bgMusic2.duration);
  }
});

seekSlider2.addEventListener('change', () => {
  if (!isNaN(bgMusic2.duration) && bgMusic2.duration > 0) {
    bgMusic2.currentTime = (seekSlider2.value / 100) * bgMusic2.duration;
  }
  isSeeking2 = false;
});

// === EVENT TOMBOL LANJUT KE CHAPTER 2 (OUR STORY) ===
btnNextStory.addEventListener('click', () => {
  // 1. Matikan lagu HIVI
  pauseAudio(bgMusic1, iconPlay1, iconPause1);

  // 2. Munculkan bagian Our Story
  storySection.classList.remove('hidden');
  storySection.classList.add('flex', 'fade-in-section');

  // 3. Putar otomatis lagu LANY
  playAudio(bgMusic2, iconPlay2, iconPause2);

  // 4. Scroll halus ke awal cerita
  setTimeout(() => {
    storySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  // 5. Ubah teks tombol
  btnNextStory.innerHTML = "<span>Selamat Membaca Ceritaku 🤍</span>";
  btnNextStory.classList.add('opacity-75', 'cursor-default');
  btnNextStory.disabled = true;
});

// Efek Bunga Meledak Amplop
function createFlowerBurst() {
  const flowers = ['🌸', '🌺', '💮', '✨', '💖'];
  for (let i = 0; i < 50; i++) { 
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
    setTimeout(() => flower.remove(), 3200);
  }
}

// Scroll Reveal
const setupScrollAnimation = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { 
    threshold: 0.15 
  });

  const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
  hiddenElements.forEach((el) => observer.observe(el));
};

// Event Klik Amplop Pertama
envelope.addEventListener('click', function() {
  if (isOpen) return; 
  isOpen = true;
  
  // Putar lagu 1 (HIVI) begitu amplop dibuka
  playAudio(bgMusic1, iconPlay1, iconPause1);
  
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