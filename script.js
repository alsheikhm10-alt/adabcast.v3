tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Modern indigo
        secondary: "#8b5cf6", // Purple accent
        "bg-dark": "#0f172a", // Darker background for better contrast
        "bg-card": "#1e293b", // Card background
        "bg-sidebar": "#1e293b", // Sidebar background
        "text-primary": "#ffffff", // Pure white for headings
        "text-secondary": "#e2e8f0", // Much brighter secondary text
        "text-muted": "#cbd5e1", // Clear muted text
        "accent": "#f59e0b",
        "warm": "#f97316",
        "sunset": "#ef4444",
        "ocean": "#06b6d4",
      },
      fontFamily: { display: ["Noto Sans Arabic", "sans-serif"], serif: ["Amiri", "serif"] },
      borderRadius: { DEFAULT: "0.75rem", lg: "1.25rem", xl: "2rem", full: "9999px" },
    },
  },
};

// ---- Navigation ----
const navIds = ['home','library','texts','player','submit','studio','profile'];

function showPage(id) {
  navIds.forEach(p => {
    document.getElementById('page-' + p).classList.remove('active');
    const nl = document.getElementById('nl-' + p);
    if (nl) { nl.classList.remove('active'); nl.classList.add('text-slate-400'); }
  });
  document.getElementById('page-' + id).classList.add('active');
  const active = document.getElementById('nl-' + id);
  if (active) { active.classList.add('active'); active.classList.remove('text-slate-400'); }
  window.scrollTo(0,0);
}

// ---- Player ----
let playing = false;
let progress = 38;
let timer;
let currentTrack = 0;

const tracks = [
  { title: "نشيد النهر", artist: "أحمد المنصوري", duration: 315, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80" },
  { title: "رسالة تحت الماء", artist: "ليلى السعدي", duration: 242, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80" },
  { title: "أغنية المطر", artist: "بدر شاكر السياب", duration: 345, image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&q=80" },
  { title: "صباح الخير يا وطني", artist: "خالد العبيد", duration: 190, image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80" },
  { title: "حكايات من الماضي", artist: "سارة جاسم", duration: 735, image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=600&q=80" },
  { title: "وطن من كلمات", artist: "محمود درويش", duration: 510, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80" }
];

function selectTrack(index) {
  currentTrack = index;
  const track = tracks[index];
  const playerImage = document.getElementById('player-image');
  const playerTitle = document.getElementById('player-title');
  const playerArtist = document.getElementById('player-artist');
  if (playerImage) playerImage.src = track.image;
  if (playerTitle) playerTitle.textContent = track.title;
  if (playerArtist) playerArtist.textContent = 'بصوت: ' + track.artist;
  progress = 0;
  updateProgress();
  // Update playlist active
  const playlistItems = document.querySelectorAll('.playlist-item');
  playlistItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('bg-primary/10', 'border-primary/20');
      item.classList.remove('hover:bg-primary/5');
    } else {
      item.classList.remove('bg-primary/10', 'border-primary/20');
      item.classList.add('hover:bg-primary/5');
    }
  });
}

function togglePlay() {
  playing = !playing;
  document.getElementById('play-icon').textContent = playing ? 'pause' : 'play_arrow';
  if (playing) {
    timer = setInterval(() => {
      progress = Math.min(100, progress + 0.05);
      updateProgress();
      if (progress >= 100) { playing = false; document.getElementById('play-icon').textContent = 'play_arrow'; clearInterval(timer); }
    }, 100);
  } else {
    clearInterval(timer);
  }
}

function updateProgress() {
  document.getElementById('progress-fill').style.width = progress + '%';
  const total = 315;
  const secs = Math.floor(progress / 100 * total);
  const m = Math.floor(secs / 60).toString().padStart(2,'0');
  const s = (secs % 60).toString().padStart(2,'0');
  document.getElementById('time-current').textContent = m + ':' + s;
}

function seekAudio(e) {
  const bar = document.getElementById('progress-bar');
  const rect = bar.getBoundingClientRect();
  const rtlX = rect.right - e.clientX;
  progress = Math.max(0, Math.min(100, (rtlX / rect.width) * 100));
  updateProgress();
}

function skipNext() {
  selectTrack((currentTrack + 1) % tracks.length);
}

function skipPrevious() {
  selectTrack((currentTrack - 1 + tracks.length) % tracks.length);
}

// ---- Dark Mode ----
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  updateDarkModeIcon();
}

function updateDarkModeIcon() {
  const icon = document.getElementById('dark-mode-icon');
  if (icon) {
    const isDark = document.documentElement.classList.contains('dark');
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }
}

// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  updateDarkModeIcon();
  
  // Back to top button visibility
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.remove('opacity-0');
        backToTop.classList.add('opacity-100');
      } else {
        backToTop.classList.remove('opacity-100');
        backToTop.classList.add('opacity-0');
      }
    });
  }
  
  // Hide preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    }, 1000);
  }
  
  // Keyboard shortcuts for player
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipPrevious();
        break;
    }
  });
});

// ---- Newsletter ----
function subscribeNewsletter() {
  const email = document.querySelector('input[type="email"]').value;
  if (!email || !email.includes('@')) {
    alert('يرجى إدخال بريد إلكتروني صحيح');
    return;
  }
  alert('تم الاشتراك بنجاح! شكراً لك');
  document.querySelector('input[type="email"]').value = '';
}