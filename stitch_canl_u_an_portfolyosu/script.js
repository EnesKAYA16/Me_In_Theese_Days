// ============================================================
// SCROLL-BASED COLOR TRANSITION
// ============================================================
const colorStops = [
  { pct: 0,    a: [236, 72, 153],  b: [249, 115, 22]  }, // pink → orange
  { pct: 0.33, a: [168, 85, 247],  b: [236, 72, 153]  }, // purple → pink
  { pct: 0.66, a: [59, 130, 246],  b: [168, 85, 247]  }, // blue → purple
  { pct: 1,    a: [20, 184, 166],  b: [59, 130, 246]   }  // teal → blue
];

let activeTheme = 'fluid';


function interpolateColor(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t)
  ];
}

function updateScrollColors() {
  if (typeof activeTheme !== 'undefined' && activeTheme !== 'fluid') return;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? window.scrollY / docH : 0;

  let start = colorStops[0], end = colorStops[1];
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (pct >= colorStops[i].pct && pct <= colorStops[i + 1].pct) {
      start = colorStops[i];
      end = colorStops[i + 1];
      break;
    }
  }

  const range = end.pct - start.pct;
  const t = range > 0 ? (pct - start.pct) / range : 0;

  const a = interpolateColor(start.a, end.a, t);
  const b = interpolateColor(start.b, end.b, t);

  document.documentElement.style.setProperty('--color-a', a.join(', '));
  document.documentElement.style.setProperty('--color-b', b.join(', '));
}

// ============================================================
// SCROLL OVERLAY (darken background on scroll)
// ============================================================
function updateScrollOverlay() {
  const overlay = document.getElementById('scroll-overlay');
  if (!overlay) return;
  if (window.scrollY > 50) {
    overlay.classList.add('scrolled');
  } else {
    overlay.classList.remove('scrolled');
  }
}

// ============================================================
// SCROLL-REVEAL ANIMATIONS (Intersection Observer)
// ============================================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el, i) => {
    // Set stagger index for parent containers
    el.style.setProperty('--reveal-i', i % 6);
    observer.observe(el);
  });
}

// ============================================================
// SKILL BAR ANIMATION (animate width on visibility)
// ============================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.getAttribute('data-width');
        // Small delay so the transition is visible
        requestAnimationFrame(() => {
          bar.style.width = target;
          bar.classList.add('animated');
        });
        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.3
  });

  bars.forEach((bar) => observer.observe(bar));
}

// ============================================================
// LAST UPDATED DATE (auto-generate)
// ============================================================
function setLastUpdatedDate() {
  const el = document.getElementById('last-updated-date');
  if (!el) return;
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = new Date().toLocaleDateString('tr-TR', opts);
}

// ============================================================
// TYPING EFFECT for subtitle
// ============================================================
function initTypingEffect() {
  const el = document.getElementById('typing-target');
  if (!el) return;

  const roles = [
    'Bilgisayar Mühendisliği Öğrencisi',
    'Veri Analizi Tutkunu',
    'Web Geliştirici',
    'Hackathon Yarışmacısı'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ============================================================
// COUNTER ANIMATION for skill percentages
// ============================================================
function initCounters() {
  const counters = document.querySelectorAll('.skill-pct[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, 0, target, 1200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach((c) => observer.observe(c));
}

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(start + (end - start) * ease);
    el.textContent = current + '%';
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ============================================================
// PARALLAX BLOBS (subtle mouse-follow effect)
// ============================================================
function initParallaxBlobs() {
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 8;
      blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

// ============================================================
// LIGHTBOX (click-to-enlarge images)
// ============================================================
function initLightbox() {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<span class="lightbox-close material-symbols-outlined">close</span><img src="" alt="" />';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  // Attach click to all lightbox-trigger elements
  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
      if (!img) return;
      overlayImg.src = img.src;
      overlayImg.alt = img.alt || '';
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close handlers
  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ============================================================
// INTERACTIVE FEATURES
// ============================================================

// 1. CARD SPOTLIGHT EFFECT
function initCardSpotlight() {
  const cards = document.querySelectorAll('.glass-card, .contact-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// 2. TOAST SYSTEM
function createToastContainer() {
  if (document.querySelector('.toast-container')) return;
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
}

function showToast(message, iconName = 'check_circle') {
  createToastContainer();
  const container = document.querySelector('.toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `
    <span class="material-symbols-outlined toast-icon">${iconName}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 2500);
}

// 3. COLORFUL PARTICLES CONFETTI
function fireConfetti(x, y, customColors) {
  const colors = customColors || ['#ec4899', '#f97316', '#a855f7', '#0d9488', '#3b82f6', '#22c55e'];
  const count = 45;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.width = `${Math.random() * 8 + 6}px`;
    p.style.height = `${Math.random() * 8 + 6}px`;
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.pointerEvents = 'none';
    p.style.zIndex = '99999';
    p.style.opacity = '1';
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 7 + 4;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 2.5; // slight upward bias
    let px = x;
    let py = y;
    let gravity = 0.22;
    let opacity = 1;
    
    document.body.appendChild(p);
    
    function updateParticle() {
      vx *= 0.96;
      vy += gravity;
      px += vx;
      py += vy;
      p.style.transform = `translate(${px - x}px, ${py - y}px) rotate(${py * 1.5}deg)`;
      opacity -= 0.015;
      p.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(updateParticle);
      } else {
        p.remove();
      }
    }
    requestAnimationFrame(updateParticle);
  }
}

// 4. COPY EMAIL & FIRE CONFETTI
function initCopyEmail() {
  const btn = document.getElementById('copy-email-btn');
  if (!btn) return;
  
  btn.addEventListener('click', (e) => {
    const email = 'eneskaya16573@gmail.com';
    
    navigator.clipboard.writeText(email).then(() => {
      showToast('E-posta adresi kopyalandı! 🚀');
      
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      let particlesColors;
      if (document.body.classList.contains('hacker-mode')) {
        particlesColors = ['#00ff66', '#009933', '#ffffff', '#003311'];
      }
      fireConfetti(cx, cy, particlesColors);
    }).catch(err => {
      console.error('Kopyalama hatası:', err);
      showToast('Kopyalama başarısız oldu.', 'error');
    });
  });
}

// 5. SIMULATED MUSIC PLAY/PAUSE & EQUALIZER
function initMusicPlayer() {
  const btn = document.getElementById('music-player-btn');
  const icon = document.getElementById('play-icon');
  const status = document.getElementById('play-status');
  const visualizer = document.getElementById('music-visualizer');
  if (!btn || !icon || !status || !visualizer) return;
  
  let isPlaying = false;
  
  btn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      icon.textContent = 'pause_circle';
      status.textContent = 'Şu An Oynatılıyor...';
      visualizer.classList.add('playing');
      showToast('Şarkı simülasyonu başlatıldı 🎵', 'music_note');
    } else {
      icon.textContent = 'play_circle';
      status.textContent = 'Müziği Başlat';
      visualizer.classList.remove('playing');
    }
  });
}

// 6. MATRIX CODE RAIN MOTOR
let matrixInterval = null;

function startMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const fontSize = 16;
  let columns = canvas.width / fontSize;
  
  const rainDrops = [];
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = Math.random() * -100; // staggered entry
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff66';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < rainDrops.length; i++) {
      const text = characters[Math.floor(Math.random() * characters.length)];
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
      
      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  }
  
  if (matrixInterval) clearInterval(matrixInterval);
  matrixInterval = setInterval(draw, 33);
}

function stopMatrixRain() {
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = null;
  }
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ============================================================
// PILL SELECTION MATRIX RAIN (separate canvas for pill screen)
// ============================================================
let pillMatrixInterval = null;

function startPillMatrixRain() {
  const canvas = document.getElementById('pill-matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const fontSize = 14;
  let columns = canvas.width / fontSize;
  
  const rainDrops = [];
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = Math.random() * -50;
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < rainDrops.length; i++) {
      const text = characters[Math.floor(Math.random() * characters.length)];
      
      // Bright head
      const headY = rainDrops[i] * fontSize;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.fillText(text, i * fontSize, headY);
      
      // Trail
      ctx.fillStyle = `rgba(0, 255, 102, ${0.4 + Math.random() * 0.3})`;
      ctx.font = `${fontSize}px monospace`;
      const trailText = characters[Math.floor(Math.random() * characters.length)];
      ctx.fillText(trailText, i * fontSize, headY - fontSize);
      
      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  }
  
  if (pillMatrixInterval) clearInterval(pillMatrixInterval);
  pillMatrixInterval = setInterval(draw, 40);
}

function stopPillMatrixRain() {
  if (pillMatrixInterval) {
    clearInterval(pillMatrixInterval);
    pillMatrixInterval = null;
  }
}

// ============================================================
// 7. PILL SELECTION SCREEN (Matrix Red/Blue Pill)
// ============================================================
function initPillSelection() {
  // Check if user already chose a theme this session
  const savedTheme = sessionStorage.getItem('selected-theme');
  const pillScreen = document.getElementById('pill-selection-screen');
  
  if (savedTheme) {
    applyTheme(savedTheme);
    if (pillScreen) {
      pillScreen.remove();
    }
    return;
  }

  if (!pillScreen) return;

  document.body.style.overflow = 'hidden';

  // Start matrix rain on pill screen
  requestAnimationFrame(() => {
    startPillMatrixRain();
    // Animate in
    requestAnimationFrame(() => {
      pillScreen.classList.add('active');
    });
  });


  // Blue pill → Fluid colorful theme
  document.getElementById('pill-blue').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    
    // Spawn water droplet ripples
    spawnWaterRipples(x, y, false);
    
    fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 
      ['#ec4899', '#f97316', '#a855f7', '#3b82f6', '#22c55e', '#0ea5e9']);
    
    setTimeout(() => {
      closePillScreen(pillScreen, 'fluid');
    }, 600);
  });

  // Red pill → Matrix hacker theme
  document.getElementById('pill-red').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    
    // Spawn water droplet ripples
    spawnWaterRipples(x, y, true);
    
    fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2,
      ['#00ff66', '#009933', '#00cc44', '#ffffff', '#003311']);
    
    setTimeout(() => {
      closePillScreen(pillScreen, 'hacker');
    }, 600);
  });
}

function spawnWaterRipples(x, y, isMatrix) {
  const container = document.createElement('div');
  container.className = 'water-ripple-container';
  
  // Custom colors for blue/matrix theme drops
  const borderColor = isMatrix ? 'rgba(0, 255, 102, 0.45)' : 'rgba(236, 72, 153, 0.45)';
  const shadowColor = isMatrix ? 'rgba(0, 255, 102, 0.35)' : 'rgba(59, 130, 246, 0.4)';
  
  // Spawn 3 staggered concentric ripple waves
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'water-ripple-ring';
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
    ring.style.borderColor = borderColor;
    ring.style.boxShadow = `inset 0 0 20px ${shadowColor}, 0 0 15px ${shadowColor}`;
    ring.style.animationDelay = (i * 0.2) + 's';
    container.appendChild(ring);
  }
  
  document.body.appendChild(container);
  
  // Clean up container after animations end (1.6s duration + 0.4s max delay = 2.0s)
  setTimeout(() => {
    container.remove();
  }, 2200);
}

function closePillScreen(screen, theme) {
  screen.classList.add('closing');
  stopPillMatrixRain();
  
  // Apply theme immediately so that the correct theme page transitions in underneath
  applyTheme(theme);
  sessionStorage.setItem('selected-theme', theme);
  
  setTimeout(() => {
    screen.remove();
    document.body.style.overflow = '';
  }, 1200);
}



// ============================================================
// 8. MATRIX THEME MUSIC SYSTEM
// ============================================================
let matrixAudio = null;
let isMusicMuted = false;
let musicFadeInterval = null;

function initMatrixMusic() {
  if (matrixAudio) return; // Already initialized
  
  matrixAudio = new Audio('assets/matrix_theme_[cut_262sec].mp3');
  matrixAudio.loop = true;
  matrixAudio.volume = 0;
  matrixAudio.preload = 'auto';
  
  // Check saved mute preference
  const savedMute = localStorage.getItem('matrix-music-muted');
  if (savedMute === 'true') {
    isMusicMuted = true;
  }
}

function fadeInMusic(duration = 2000) {
  if (!matrixAudio || isMusicMuted) return;
  
  const targetVolume = 0.35;
  const steps = 40;
  const stepTime = duration / steps;
  const volumeStep = targetVolume / steps;
  let currentStep = 0;
  
  matrixAudio.volume = 0;
  
  // Try to play (may fail due to autoplay policy)
  const playPromise = matrixAudio.play();
  if (playPromise) {
    playPromise.catch(() => {
      // Autoplay blocked, will start on first user interaction
      console.log('Müzik autoplay engellendi, kullanıcı etkileşimi bekleniyor...');
    });
  }
  
  if (musicFadeInterval) clearInterval(musicFadeInterval);
  musicFadeInterval = setInterval(() => {
    currentStep++;
    matrixAudio.volume = Math.min(volumeStep * currentStep, targetVolume);
    if (currentStep >= steps) {
      clearInterval(musicFadeInterval);
      musicFadeInterval = null;
    }
  }, stepTime);
}

function fadeOutMusic(duration = 1500) {
  if (!matrixAudio) return;
  
  const startVolume = matrixAudio.volume;
  if (startVolume === 0) {
    matrixAudio.pause();
    return;
  }
  
  const steps = 30;
  const stepTime = duration / steps;
  const volumeStep = startVolume / steps;
  let currentStep = 0;
  
  if (musicFadeInterval) clearInterval(musicFadeInterval);
  musicFadeInterval = setInterval(() => {
    currentStep++;
    matrixAudio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
    if (currentStep >= steps) {
      clearInterval(musicFadeInterval);
      musicFadeInterval = null;
      matrixAudio.pause();
      matrixAudio.currentTime = 0;
    }
  }, stepTime);
}

function toggleMusicMute() {
  isMusicMuted = !isMusicMuted;
  localStorage.setItem('matrix-music-muted', isMusicMuted);
  
  if (isMusicMuted) {
    fadeOutMusic(500);
    showToast('Matrix müziği kapatıldı 🔇', 'volume_off');
  } else {
    if (activeTheme === 'hacker') {
      fadeInMusic(1000);
      showToast('Matrix müziği açıldı 🔊', 'volume_up');
    }
  }
  
  updateMusicBtnIcon();
}

function updateMusicBtnIcon() {
  const btn = document.getElementById('music-toggle-btn');
  if (!btn) return;
  
  if (activeTheme !== 'hacker') {
    // Hide music button when not in matrix theme
    btn.style.display = 'none';
    return;
  }
  
  btn.style.display = 'flex';
  
  if (isMusicMuted) {
    btn.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';
    btn.title = 'Matrix Müziğini Aç';
    btn.classList.add('muted');
  } else {
    btn.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
    btn.title = 'Matrix Müziğini Kapat';
    btn.classList.remove('muted');
  }
}

// ============================================================
// 9. APPLY THEME (with music integration)
// ============================================================
function applyTheme(theme) {
  activeTheme = theme;
  document.body.classList.remove('hacker-mode');
  stopMatrixRain();
  
  // Initialize music system if not done
  initMatrixMusic();
  
  if (theme === 'hacker') {
    activeTheme = 'hacker';
    document.body.classList.add('hacker-mode');
    startMatrixRain();
    // Start music
    fadeInMusic();
  } else {
    activeTheme = 'fluid';
    updateScrollColors();
    // Stop music
    fadeOutMusic();
  }
  
  // Add floating buttons
  initThemeToggle();
  initMusicToggle();
  updateMusicBtnIcon();
}

// ============================================================
// 10. FLOATING BUTTONS (Theme Toggle + Music Toggle)
// ============================================================
function initThemeToggle() {
  // Don't create duplicate
  if (document.getElementById('theme-toggle-btn')) return;
  
  const btn = document.createElement('button');
  btn.id = 'theme-toggle-btn';
  btn.className = 'theme-toggle-floating';
  btn.title = 'Tema Değiştir';
  
  updateToggleIcon(btn);
  
  btn.addEventListener('click', () => {
    if (activeTheme === 'hacker') {
      // Switch to fluid
      document.body.classList.remove('hacker-mode');
      stopMatrixRain();
      activeTheme = 'fluid';
      updateScrollColors();
      sessionStorage.setItem('selected-theme', 'fluid');
      showToast('Renkli dünyaya geri döndün 🌈');
      // Fade out music
      fadeOutMusic();
    } else {
      // Switch to hacker
      document.body.classList.add('hacker-mode');
      startMatrixRain();
      activeTheme = 'hacker';
      sessionStorage.setItem('selected-theme', 'hacker');
      showToast('Matrix protokolü yüklendi 🟢', 'terminal');
      // Fade in music
      fadeInMusic();
    }
    updateToggleIcon(btn);
    updateMusicBtnIcon();
  });
  
  document.body.appendChild(btn);
}

function updateToggleIcon(btn) {
  if (activeTheme === 'hacker') {
    btn.innerHTML = '<span class="material-symbols-outlined">palette</span>';
    btn.title = 'Renkli Temaya Geç';
  } else {
    btn.innerHTML = '<span class="material-symbols-outlined">terminal</span>';
    btn.title = 'Matrix Temasına Geç';
  }
}

function initMusicToggle() {
  // Don't create duplicate
  if (document.getElementById('music-toggle-btn')) return;
  
  const btn = document.createElement('button');
  btn.id = 'music-toggle-btn';
  btn.className = 'music-toggle-floating';
  btn.title = 'Matrix Müziği';
  
  btn.addEventListener('click', toggleMusicMute);
  
  document.body.appendChild(btn);
  updateMusicBtnIcon();
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  setLastUpdatedDate();
  initScrollReveal();
  initSkillBars();
  initTypingEffect();
  initCounters();
  initParallaxBlobs();
  initLightbox();
  
  // Custom interactive features
  initCardSpotlight();
  initCopyEmail();
  initMusicPlayer();
  
  // Pill selection (replaces old theme switcher)
  initPillSelection();
  
  updateScrollColors();
  updateScrollOverlay();

  window.addEventListener('scroll', () => {
    updateScrollColors();
    updateScrollOverlay();
  }, { passive: true });
});
