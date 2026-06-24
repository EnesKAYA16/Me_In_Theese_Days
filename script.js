// ============================================================
// SCROLL-BASED COLOR TRANSITION
// ============================================================
const colorStops = [
  { pct: 0, a: [236, 72, 153], b: [249, 115, 22] }, // pink → orange
  { pct: 0.33, a: [168, 85, 247], b: [236, 72, 153] }, // purple → pink
  { pct: 0.66, a: [59, 130, 246], b: [168, 85, 247] }, // blue → purple
  { pct: 1, a: [20, 184, 166], b: [59, 130, 246] }  // teal → blue
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
let matrixDrawFn = null;
let matrixRainSpeed = 33; // ms per frame (normal speed)
let agentModeActive = false;

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
  const fontSize = 20;
  let columns = canvas.width / fontSize;

  const rainDrops = [];
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = Math.random() * -100; // staggered entry
  }

  matrixDrawFn = function draw() {
    ctx.fillStyle = agentModeActive ? 'rgba(12, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rainDrops.length; i++) {
      const text = characters[Math.floor(Math.random() * characters.length)];

      let yPos, trail1Y, trail2Y;
      let headColor = '#ffffff';
      let shadowColor = agentModeActive ? '#ff0000' : '#00ff66';
      let trail1Color = agentModeActive ? '#ff2a2a' : '#00ff66';
      let trail2Color = agentModeActive ? 'rgba(255, 42, 42, 0.6)' : 'rgba(0, 255, 102, 0.6)';

      if (agentModeActive) {
        yPos = canvas.height - (rainDrops[i] * fontSize);
        trail1Y = yPos + fontSize;
        trail2Y = yPos + fontSize * 2;
      } else {
        yPos = rainDrops[i] * fontSize;
        trail1Y = yPos - fontSize;
        trail2Y = yPos - fontSize * 2;
      }

      // Bright white head character
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 15;
      ctx.fillStyle = headColor;
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.fillText(text, i * fontSize, yPos);

      // Trail character (one step behind)
      ctx.shadowBlur = 8;
      ctx.fillStyle = trail1Color;
      ctx.font = `${fontSize}px monospace`;
      const trailText = characters[Math.floor(Math.random() * characters.length)];
      ctx.fillText(trailText, i * fontSize, trail1Y);

      // Dimmer trail (two steps behind)
      ctx.shadowBlur = 0;
      ctx.fillStyle = trail2Color;
      const dimTrailText = characters[Math.floor(Math.random() * characters.length)];
      ctx.fillText(dimTrailText, i * fontSize, trail2Y);

      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  };

  if (matrixInterval) clearInterval(matrixInterval);
  matrixRainSpeed = 33;
  matrixInterval = setInterval(matrixDrawFn, matrixRainSpeed);
}

function setMatrixRainSpeed(speed) {
  if (!matrixDrawFn) return;
  if (matrixInterval) clearInterval(matrixInterval);
  matrixRainSpeed = speed;
  matrixInterval = setInterval(matrixDrawFn, matrixRainSpeed);
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
      pillScreen.style.display = 'none';
      pillScreen.classList.remove('active', 'closing');
    }
    return;
  }

  if (!pillScreen) return;

  showPillScreen(pillScreen);
}

function showPillScreen(pillScreen) {
  document.body.style.overflow = 'hidden';
  // Remove theme-selected class so CSS doesn't hide the pill screen
  document.documentElement.classList.remove('theme-selected');
  pillScreen.style.display = 'flex';
  pillScreen.classList.remove('closing');

  // Reset pill matrix canvas
  const canvas = document.getElementById('pill-matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Start matrix rain on pill screen
  requestAnimationFrame(() => {
    startPillMatrixRain();
    requestAnimationFrame(() => {
      pillScreen.classList.add('active');
    });
  });
}

function setupPillListeners() {
  const pillScreen = document.getElementById('pill-selection-screen');
  if (!pillScreen) return;

  // Blue pill → Fluid colorful theme
  document.getElementById('pill-blue').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);

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
  document.documentElement.classList.add('theme-selected');

  setTimeout(() => {
    screen.style.display = 'none';
    screen.classList.remove('active', 'closing');
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
  initPillReturnBtn();
  initMusicToggle();
  updateMusicBtnIcon();
}

// ============================================================
// 10. FLOATING BUTTONS (Theme Toggle + Music Toggle)
// ============================================================
function initPillReturnBtn() {
  // Don't create duplicate
  if (document.getElementById('pill-return-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'pill-return-btn';
  btn.className = 'pill-return-floating';
  btn.title = 'Hap Seçimine Geri Dön';
  btn.innerHTML = '<span class="material-symbols-outlined">replay</span>';

  btn.addEventListener('click', () => {
    const pillScreen = document.getElementById('pill-selection-screen');
    if (!pillScreen) return;

    // Stop current theme effects
    stopMatrixRain();
    fadeOutMusic(500);

    // Clear saved theme
    sessionStorage.removeItem('selected-theme');

    // Show pill screen again
    showPillScreen(pillScreen);
    showToast('Yeniden seçim zamanı! 💊', 'restart_alt');
  });

  document.body.appendChild(btn);
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

  // Pill selection & listeners
  setupPillListeners();
  initPillSelection();

  // Easter egg: hidden terminal
  initHackerTerminal();

  // Easter egg: bullet time
  initBulletTime();

  updateScrollColors();
  updateScrollOverlay();

  window.addEventListener('scroll', () => {
    updateScrollColors();
    updateScrollOverlay();
  }, { passive: true });
});

// ============================================================
// 🥚 EASTER EGG: HIDDEN HACKER TERMINAL (Press T in Matrix mode)
// ============================================================
let terminalOpen = false;
let terminalEl = null;
let terminalHistory = [];
let historyIndex = -1;
let matrixTimeStart = null;

function initHackerTerminal() {
  document.addEventListener('keydown', (e) => {
    // Only activate in hacker mode, ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 't' || e.key === 'T') {
      if (activeTheme !== 'hacker') return;
      e.preventDefault();
      toggleTerminal();
    }

    // ESC closes terminal
    if (e.key === 'Escape' && terminalOpen) {
      closeTerminal();
    }
  });

  // Header hint button click
  const hintBtn = document.getElementById('terminal-hint-btn');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      if (activeTheme !== 'hacker') return;
      toggleTerminal();
    });
  }

  // Track time spent in matrix mode
  if (activeTheme === 'hacker') {
    matrixTimeStart = Date.now();
  }
}

function createTerminalElement() {
  const terminal = document.createElement('div');
  terminal.id = 'hacker-terminal';
  terminal.className = 'hacker-terminal';
  terminal.innerHTML = `
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="terminal-dot dot-red"></span>
        <span class="terminal-dot dot-yellow"></span>
        <span class="terminal-dot dot-green"></span>
      </div>
      <span class="terminal-title">enes@matrix:~$</span>
      <button class="terminal-close-btn" title="Kapat (ESC)">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="terminal-body" id="terminal-body">
      <div class="terminal-output" id="terminal-output"></div>
      <div class="terminal-input-line">
        <span class="terminal-prompt">enes@matrix:~$</span>
        <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false" autofocus />
      </div>
    </div>
    <div class="terminal-scanlines"></div>
  `;

  document.body.appendChild(terminal);

  // Close button
  terminal.querySelector('.terminal-close-btn').addEventListener('click', closeTerminal);

  // Input handling
  const input = terminal.querySelector('#terminal-input');
  input.addEventListener('keydown', handleTerminalKeydown);

  return terminal;
}

function toggleTerminal() {
  if (terminalOpen) {
    closeTerminal();
  } else {
    openTerminal();
  }
}

function openTerminal() {
  if (!terminalEl) {
    terminalEl = createTerminalElement();
    // Show welcome message
    printToTerminal([
      '<span class="term-green-bright">╔══════════════════════════════════════════════════╗</span>',
      '<span class="term-green-bright">║</span>  <span class="term-white">MATRIX TERMINAL v2.6</span> — <span class="term-dim">Erişim Sağlandı</span>           <span class="term-green-bright">║</span>',
      '<span class="term-green-bright">║</span>  <span class="term-dim">Komut listesi için</span> <span class="term-cyan">help</span> <span class="term-dim">yazın.</span>                  <span class="term-green-bright">║</span>',
      '<span class="term-green-bright">╚══════════════════════════════════════════════════╝</span>',
      ''
    ]);
  }

  terminalEl.classList.add('open');
  terminalOpen = true;
  document.body.style.overflow = 'hidden';

  // Focus input
  setTimeout(() => {
    const input = document.getElementById('terminal-input');
    if (input) input.focus();
  }, 400);
}

function closeTerminal() {
  if (terminalEl) {
    terminalEl.classList.remove('open');
  }
  terminalOpen = false;
  document.body.style.overflow = '';
}

function handleTerminalKeydown(e) {
  const input = e.target;

  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) {
      terminalHistory.push(cmd);
      historyIndex = terminalHistory.length;
      processCommand(cmd);
    }
    input.value = '';
  }

  // Arrow up/down for history
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = terminalHistory[historyIndex];
    }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < terminalHistory.length - 1) {
      historyIndex++;
      input.value = terminalHistory[historyIndex];
    } else {
      historyIndex = terminalHistory.length;
      input.value = '';
    }
  }
}

function printToTerminal(lines, isCommand = false) {
  const output = document.getElementById('terminal-output');
  if (!output) return;

  lines.forEach((line, i) => {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    if (isCommand) {
      div.innerHTML = `<span class="terminal-prompt">enes@matrix:~$</span> <span class="term-white">${escapeHtml(line)}</span>`;
    } else {
      div.innerHTML = line;
    }
    // Typing animation delay
    div.style.animationDelay = `${i * 0.03}s`;
    output.appendChild(div);
  });

  // Scroll to bottom
  const body = document.getElementById('terminal-body');
  if (body) body.scrollTop = body.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function processCommand(cmd) {
  // Echo the command first
  printToTerminal([cmd], true);

  const parts = cmd.toLowerCase().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      printToTerminal([
        '',
        '<span class="term-cyan">Kullanılabilir Komutlar:</span>',
        '  <span class="term-green-bright">help</span>          <span class="term-dim">—  Bu yardım mesajını gösterir</span>',
        '  <span class="term-green-bright">whoami</span>        <span class="term-dim">—  Kim olduğunu gösterir</span>',
        '  <span class="term-green-bright">hack</span> <span class="term-yellow">[hedef]</span>   <span class="term-dim">—  Bir sisteme sızmayı dene</span>',
        '  <span class="term-green-bright">skills</span>        <span class="term-dim">—  Yetkinlik taraması başlat</span>',
        '  <span class="term-green-bright">fight</span>         <span class="term-dim">—  <span class="term-red">⚠️ AJANLARLA SAVAŞ (Mini Oyun)</span></span>',
        '  <span class="term-green-bright">sudo rm -rf /</span> <span class="term-dim">—  ⚠️  Her şeyi sil</span>',
        '  <span class="term-green-bright">clear</span>         <span class="term-dim">—  Terminali temizle</span>',
        '  <span class="term-green-bright">exit</span>          <span class="term-dim">—  Terminali kapat</span>',
        ''
      ]);
      break;

    case 'whoami':
      printToTerminal([
        '',
        '<span class="term-green-bright">  ╭─────────────────────────────────╮</span>',
        '<span class="term-green-bright">  │</span> <span class="term-white">Kullanıcı:</span>  Enes Kaya            <span class="term-green-bright">│</span>',
        '<span class="term-green-bright">  │</span> <span class="term-white">Rol:</span>       Bilgisayar Mühendisi  <span class="term-green-bright">│</span>',
        '<span class="term-green-bright">  │</span> <span class="term-white">Seviye:</span>    2. Sınıf              <span class="term-green-bright">│</span>',
        '<span class="term-green-bright">  │</span> <span class="term-white">Üniversite:</span> Balıkesir Üni.       <span class="term-green-bright">│</span>',
        '<span class="term-green-bright">  │</span> <span class="term-white">Durum:</span>     <span class="term-green-bright">● ONLINE</span>              <span class="term-green-bright">│</span>',
        '<span class="term-green-bright">  ╰─────────────────────────────────╯</span>',
        ''
      ]);
      break;

    case 'hack':
      handleHackCommand(args);
      break;

    case 'fight':
      printToTerminal([
        '',
        '<span class="term-red term-blink">WARNING: SYSTEM OVERRIDE INITIATED</span>',
        '<span class="term-red">Ajanlar sisteme sızıyor... Hazırlan!</span>',
        ''
      ]);
      setTimeout(() => {
        closeTerminal();
        startAgentMode();
      }, 2500);
      break;

    case 'sudo':
      if (cmd.toLowerCase().includes('rm -rf')) {
        handleSudoRm();
      } else {
        printToTerminal([
          `<span class="term-red">sudo: komut bulunamadı: ${escapeHtml(args.join(' '))}</span>`,
          ''
        ]);
      }
      break;

    case 'clear':
      const output = document.getElementById('terminal-output');
      if (output) {
        output.innerHTML = '';
        printToTerminal([
          '<span class="term-green-bright">╔══════════════════════════════════════════════════╗</span>',
          '<span class="term-green-bright">║</span>  <span class="term-white">MATRIX TERMINAL v2.6</span> — <span class="term-dim">Erişim Sağlandı</span>           <span class="term-green-bright">║</span>',
          '<span class="term-green-bright">║</span>  <span class="term-dim">Komut listesi için</span> <span class="term-cyan">help</span> <span class="term-dim">yazın.</span>                  <span class="term-green-bright">║</span>',
          '<span class="term-green-bright">╚══════════════════════════════════════════════════╝</span>',
          ''
        ]);
      }
      break;

    case 'exit':
    case 'quit':
      printToTerminal(['<span class="term-dim">Bağlantı kesiliyor...</span>', '']);
      setTimeout(() => closeTerminal(), 600);
      break;

    case 'skills':
      handleSkillsCommand();
      break;

    case 'cd':
      printToTerminal([
        `<span class="term-red">cd: izin reddedildi: Matrix\'ten çıkamazsın</span>`,
        ''
      ]);
      break;

    case 'rm':
      printToTerminal([
        '<span class="term-red">rm: izin reddedildi. sudo kullanmayı denedin mi? 😏</span>',
        ''
      ]);
      break;

    case 'ping':
      handlePingCommand(args);
      break;

    default:
      printToTerminal([
        `<span class="term-red">-bash: ${escapeHtml(command)}: komut bulunamadı</span>`,
        `<span class="term-dim">Komut listesi için <span class="term-cyan">help</span> yazın.</span>`,
        ''
      ]);
  }
}

// ── HACK COMMAND ──
function handleHackCommand(args) {
  const target = args.join(' ') || 'bilinmeyen';

  printToTerminal([
    '',
    `<span class="term-yellow">⚡ Hedef tespit edildi: ${escapeHtml(target)}</span>`,
    '<span class="term-dim">Bağlantı kuruluyor...</span>'
  ]);

  const output = document.getElementById('terminal-output');
  const body = document.getElementById('terminal-body');

  const steps = [
    { delay: 600, text: '<span class="term-green-bright">[▓░░░░░░░░░]</span> <span class="term-dim">Port tarama...</span> <span class="term-yellow">10%</span>' },
    { delay: 1200, text: '<span class="term-green-bright">[▓▓▓░░░░░░░]</span> <span class="term-dim">Güvenlik duvarı analiz ediliyor...</span> <span class="term-yellow">30%</span>' },
    { delay: 1800, text: '<span class="term-green-bright">[▓▓▓▓▓░░░░░]</span> <span class="term-dim">SSH açığı bulundu!</span> <span class="term-yellow">50%</span>' },
    { delay: 2400, text: '<span class="term-green-bright">[▓▓▓▓▓▓▓░░░]</span> <span class="term-dim">Şifre kırılıyor...</span> <span class="term-yellow">70%</span>' },
    { delay: 3000, text: '<span class="term-green-bright">[▓▓▓▓▓▓▓▓▓░]</span> <span class="term-dim">Root erişimi sağlanıyor...</span> <span class="term-yellow">90%</span>' },
    { delay: 3600, text: '<span class="term-green-bright">[▓▓▓▓▓▓▓▓▓▓]</span> <span class="term-green-bright">ACCESS GRANTED</span> <span class="term-green-bright">100%</span> ✅' },
    { delay: 4200, text: '' },
    { delay: 4400, text: `<span class="term-green-bright">root@${escapeHtml(target)}:~#</span> <span class="term-white">Sisteme başarıyla sızdın!</span>` },
    { delay: 4800, text: '<span class="term-dim">(Tabii ki gerçek değil, ama havalı göründü değil mi? 😎)</span>' },
    { delay: 5000, text: '' }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'terminal-line term-fade-in';
      div.innerHTML = step.text;
      output.appendChild(div);
      if (body) body.scrollTop = body.scrollHeight;
    }, step.delay);
  });

  // Green flash on ACCESS GRANTED
  setTimeout(() => {
    if (terminalEl) {
      terminalEl.classList.add('terminal-flash');
      setTimeout(() => terminalEl.classList.remove('terminal-flash'), 400);
    }
    fireConfetti(window.innerWidth / 2, window.innerHeight / 2, ['#00ff66', '#009933', '#00cc44', '#ffffff']);
  }, 3600);
}

// ── SUDO RM -RF / ──
function handleSudoRm() {
  printToTerminal([
    '',
    '<span class="term-red">⚠️  UYARI: TÜM SİSTEM SİLİNİYOR...</span>'
  ]);

  const output = document.getElementById('terminal-output');
  const body = document.getElementById('terminal-body');

  const files = [
    '/usr/bin/hope',
    '/etc/feelings.conf',
    '/var/log/memories.log',
    '/home/enes/dreams/',
    '/root/matrix/reality.dll',
    '/sys/kernel/universe.ko',
    '/opt/free_will/'
  ];

  files.forEach((file, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'terminal-line term-fade-in';
      div.innerHTML = `<span class="term-red">Siliniyor: ${file}</span>`;
      output.appendChild(div);
      if (body) body.scrollTop = body.scrollHeight;
    }, 400 + i * 350);
  });

  // Fake system crash
  setTimeout(() => {
    const div = document.createElement('div');
    div.className = 'terminal-line term-fade-in';
    div.innerHTML = '<span class="term-red term-blink">KERNEL PANIC — System halted</span>';
    output.appendChild(div);
    if (body) body.scrollTop = body.scrollHeight;

    // Screen glitch effect
    document.body.classList.add('system-glitch');
    setTimeout(() => document.body.classList.remove('system-glitch'), 2000);
  }, 400 + files.length * 350 + 500);

  setTimeout(() => {
    printToTerminal([
      '',
      '<span class="term-green-bright">Şaka şaka 😄 Her şey yerli yerinde.</span>',
      '<span class="term-dim">Ama bi an korktun, değil mi?</span>',
      ''
    ]);
  }, 400 + files.length * 350 + 3000);
}


// ── MATRIX COMMAND DELETED ──
// ── UPTIME COMMAND DELETED ──
// ── SKILLS SCAN ──
function handleSkillsCommand() {
  printToTerminal([
    '',
    '<span class="term-cyan">🔍 Yetkinlik taraması başlatılıyor...</span>'
  ]);

  const output = document.getElementById('terminal-output');
  const body = document.getElementById('terminal-body');

  const skills = [
    { name: 'Python', pct: 40 },
    { name: 'Pandas', pct: 60 },
    { name: 'NumPy', pct: 50 },
    { name: 'HTML', pct: 85 },
    { name: 'CSS', pct: 80 },
    { name: 'JavaScript', pct: 65 },
    { name: 'React', pct: 55 }
  ];

  skills.forEach((skill, i) => {
    setTimeout(() => {
      const barLength = 20;
      const filled = Math.round(skill.pct / 100 * barLength);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

      const div = document.createElement('div');
      div.className = 'terminal-line term-fade-in';
      div.innerHTML = `  <span class="term-white">${skill.name.padEnd(12)}</span> <span class="term-green-bright">[${bar}]</span> <span class="term-yellow">${skill.pct}%</span>`;
      output.appendChild(div);
      if (body) body.scrollTop = body.scrollHeight;
    }, 400 + i * 300);
  });

  setTimeout(() => {
    printToTerminal([
      '',
      '<span class="term-green-bright">✓ Tarama tamamlandı.</span>',
      '<span class="term-dim">  Toplam threat level: <span class="term-yellow">DANGEROUS 🔥</span></span>',
      ''
    ]);
  }, 400 + skills.length * 300 + 400);
}

// ── CAT COMMAND DELETED ──
// ── PING COMMAND ──
function handlePingCommand(args) {
  const target = args[0] || 'matrix.local';

  printToTerminal([`<span class="term-dim">PING ${escapeHtml(target)} (192.168.1.${Math.floor(Math.random() * 254 + 1)}): 56 data bytes</span>`]);

  const output = document.getElementById('terminal-output');
  const body = document.getElementById('terminal-body');

  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      const ms = (Math.random() * 50 + 1).toFixed(1);
      const div = document.createElement('div');
      div.className = 'terminal-line term-fade-in';
      div.innerHTML = `<span class="term-dim">64 bytes from ${escapeHtml(target)}: icmp_seq=${i + 1} ttl=64 time=</span><span class="term-green-bright">${ms} ms</span>`;
      output.appendChild(div);
      if (body) body.scrollTop = body.scrollHeight;
    }, (i + 1) * 800);
  }

  setTimeout(() => {
    printToTerminal([
      '',
      `<span class="term-dim">--- ${escapeHtml(target)} ping istatistikleri ---</span>`,
      '<span class="term-dim">4 paket gönderildi, 4 alındı, 0% kayıp</span>',
      ''
    ]);
  }, 4200);
}

// ============================================================
// 🥚 EASTER EGG: BULLET TIME (Hold Space in Matrix mode)
// ============================================================
let bulletTimeActive = false;
let bulletTimeTrailInterval = null;
let lastMouseX = 0;
let lastMouseY = 0;
let bulletTimeToastShown = false;

function initBulletTime() {
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    // Spawn trail particles while bullet time is active
    if (bulletTimeActive) {
      spawnBulletTrail(e.clientX, e.clientY);
    }
  });

  initBulletTimeBtn();
}

function initBulletTimeBtn() {
  // Don't create duplicate
  if (document.getElementById('bullet-time-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'bullet-time-btn';
  btn.className = 'bullet-time-floating';
  btn.title = 'Bullet Time Modülü';
  // "mode_standby" or "slow_motion_video" for icon
  btn.innerHTML = '<span class="material-symbols-outlined">adjust</span>';

  btn.addEventListener('click', () => {
    if (activeTheme !== 'hacker') return;

    if (bulletTimeActive) {
      deactivateBulletTime();
      btn.classList.remove('active');
    } else {
      activateBulletTimeWithDownload();
      btn.classList.add('active');
    }
  });

  document.body.appendChild(btn);
}

function activateBulletTimeWithDownload() {
  // 1. Show the "Module Downloaded" glitch text
  showMatrixOverlayText('> MODULE DOWNLOADED:<br>BULLET_TIME.exe');

  // 2. Add system glitch effect briefly
  document.body.classList.add('system-glitch');
  setTimeout(() => document.body.classList.remove('system-glitch'), 600);

  // 3. Activate the actual bullet time slightly after the text appears
  setTimeout(() => {
    activateBulletTime();
  }, 400);
}

function showMatrixOverlayText(text, duration = 2500) {
  let overlay = document.getElementById('matrix-overlay-text');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'matrix-overlay-text';
    overlay.className = 'matrix-overlay-text';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<span class="glitch-text" data-text="${text.replace(/<br>/g, ' ')}">${text}</span>`;
  overlay.classList.add('active');

  // Hide after duration
  setTimeout(() => {
    overlay.classList.remove('active');
  }, duration);
}

function activateBulletTime() {
  bulletTimeActive = true;
  document.body.classList.add('bullet-time');

  // Slow down matrix rain (5x slower)
  setMatrixRainSpeed(160);

  // Spawn ambient floating characters
  bulletTimeTrailInterval = setInterval(() => {
    spawnAmbientMatrixChar();
  }, 120);
}

function deactivateBulletTime() {
  bulletTimeActive = false;
  document.body.classList.remove('bullet-time');

  // Restore normal speed
  setMatrixRainSpeed(33);

  if (bulletTimeTrailInterval) {
    clearInterval(bulletTimeTrailInterval);
    bulletTimeTrailInterval = null;
  }

  showToast('Normal zamana dönüldü', 'restore');
}

function spawnBulletTrail(x, y) {
  const chars = 'アイウエオカキクケコ0123456789ABCDEF'.split('');

  // Spawn 1-2 trail particles per mouse move
  const count = Math.random() > 0.5 ? 2 : 1;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'bullet-trail-particle';
    particle.textContent = chars[Math.floor(Math.random() * chars.length)];

    // Offset slightly from cursor
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;

    particle.style.left = (x + offsetX) + 'px';
    particle.style.top = (y + offsetY) + 'px';
    particle.style.fontSize = (Math.random() * 14 + 10) + 'px';

    document.body.appendChild(particle);

    // Animate: float down slowly and fade out
    const duration = Math.random() * 1500 + 1000;
    const driftX = (Math.random() - 0.5) * 40;
    const driftY = Math.random() * 60 + 30;

    particle.animate([
      {
        transform: 'translate(0, 0) scale(1)',
        opacity: 0.9
      },
      {
        transform: `translate(${driftX}px, ${driftY}px) scale(0.3)`,
        opacity: 0
      }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    });

    setTimeout(() => particle.remove(), duration);
  }
}

function spawnAmbientMatrixChar() {
  const chars = 'アイウエオカキクケコサシスセソタチツテト'.split('');

  const particle = document.createElement('div');
  particle.className = 'bullet-ambient-char';
  particle.textContent = chars[Math.floor(Math.random() * chars.length)];

  // Random position on screen
  particle.style.left = (Math.random() * window.innerWidth) + 'px';
  particle.style.top = (Math.random() * window.innerHeight) + 'px';
  particle.style.fontSize = (Math.random() * 20 + 14) + 'px';

  document.body.appendChild(particle);

  // Freeze in place then fade
  const duration = Math.random() * 2000 + 1500;

  particle.animate([
    { opacity: 0, transform: 'scale(0.5)' },
    { opacity: 0.6, transform: 'scale(1)', offset: 0.2 },
    { opacity: 0.6, transform: 'scale(1)', offset: 0.7 },
    { opacity: 0, transform: 'scale(0.8)' }
  ], {
    duration: duration,
    easing: 'ease-in-out',
    fill: 'forwards'
  });

  setTimeout(() => particle.remove(), duration);
}

// ============================================================
// 🥚 EASTER EGG: FIGHT WITH AGENTS MINIGAME
// ============================================================
let agentScore = 0;
let agentsOnScreen = 0;
let agentTargetScore = 20;
let agentMaxAllowed = 10;
let agentSpawnInterval = null;
let agentElements = [];


function startAgentMode() {
  if (agentModeActive) return;
  agentModeActive = true;
  document.body.classList.add('agent-mode');

  // Update matrix rain visually immediately
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = setInterval(matrixDrawFn, matrixRainSpeed);
  }

  // Show UI glitch text
  showMatrixOverlayText('! SYSTEM BREACH !<br>AGENTS DETECTED', 3500);

  // Add huge system glitch effect
  document.body.classList.add('system-glitch');
  setTimeout(() => document.body.classList.remove('system-glitch'), 1500);

  // Init game state
  agentScore = 0;
  agentsOnScreen = 0;
  agentElements = [];
  updateAgentScoreUI();

  // Start spawning agents
  let spawnRate = 1200; // ms
  agentSpawnInterval = setInterval(spawnAgent, spawnRate);

  // Also speed up spawn rate over time
  setTimeout(() => {
    if (agentModeActive) {
      clearInterval(agentSpawnInterval);
      agentSpawnInterval = setInterval(spawnAgent, 800);
    }
  }, 10000);
}

function spawnAgent() {
  if (!agentModeActive) return;

  if (agentsOnScreen >= agentMaxAllowed) {
    stopAgentMode(false); // Game Over (Loss)
    return;
  }

  const agent = document.createElement('div');
  agent.className = 'agent-target material-symbols-outlined';
  agent.textContent = 'crisis_alert';

  // Random position, keep away from edges
  const x = Math.random() * (window.innerWidth - 100) + 50;
  const y = Math.random() * (window.innerHeight - 100) + 50;

  agent.style.left = `${x}px`;
  agent.style.top = `${y}px`;

  // Random scale for difficulty
  const scale = Math.random() * 0.5 + 0.8;
  agent.style.transform = `scale(0) translate(-50%, -50%)`;

  agent.addEventListener('click', (e) => {
    destroyAgent(agent, e.clientX, e.clientY);
  });

  document.body.appendChild(agent);
  agentElements.push(agent);
  agentsOnScreen++;

  // Animate pop in
  setTimeout(() => {
    if (agent && agent.parentNode) {
      agent.style.transform = `scale(${scale}) translate(-50%, -50%)`;
      agent.style.opacity = '1';
    }
  }, 50);
}

function destroyAgent(agent, x, y) {
  if (!agent.parentNode) return;

  // Remove agent
  agent.remove();
  agentsOnScreen--;
  agentScore++;

  // Remove from tracking array
  const index = agentElements.indexOf(agent);
  if (index > -1) agentElements.splice(index, 1);

  // Particle explosion
  fireConfetti(x, y, ['#ff2a2a', '#ff0000', '#ffffff', '#aa0000']);

  updateAgentScoreUI();

  if (agentScore >= agentTargetScore) {
    stopAgentMode(true); // Game Over (Win)
  }
}

function updateAgentScoreUI() {
  let scoreUI = document.getElementById('agent-score-ui');
  if (!scoreUI) {
    scoreUI = document.createElement('div');
    scoreUI.id = 'agent-score-ui';
    scoreUI.className = 'agent-score-ui';
    document.body.appendChild(scoreUI);
  }

  if (agentModeActive) {
    scoreUI.style.display = 'block';
    scoreUI.innerHTML = `SİSTEM SAVUNMASI: <span class="term-white">${agentScore}</span> / ${agentTargetScore} <br> <span class="term-red">SIZAN AJANLAR: ${agentsOnScreen} / ${agentMaxAllowed}</span>`;
  } else {
    scoreUI.style.display = 'none';
  }
}

function stopAgentMode(win) {
  agentModeActive = false;
  document.body.classList.remove('agent-mode');

  clearInterval(agentSpawnInterval);
  agentSpawnInterval = null;

  // Cleanup remaining agents
  agentElements.forEach(a => a.remove());
  agentElements = [];
  updateAgentScoreUI();

  // Reset matrix rain colors visually
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = setInterval(matrixDrawFn, matrixRainSpeed);
  }

  if (win) {
    showMatrixOverlayText('SYSTEM SECURED<br>AGENTS DEFEATED', 4000);

    // Epic victory flash
    document.body.style.background = '#00ff66';
    setTimeout(() => { document.body.style.background = ''; }, 150);

    // Huge confetti shower
    const end = Date.now() + 3000;
    (function frame() {
      fireConfetti(Math.random() * window.innerWidth, Math.random() * window.innerHeight, ['#00ff66', '#ffffff', '#00cc44']);
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  } else {
    document.body.classList.add('system-glitch');
    showMatrixOverlayText('SYSTEM FAILURE<br>MATRIX COMPROMISED', 5000);
    setTimeout(() => document.body.classList.remove('system-glitch'), 4000);
  }
}
