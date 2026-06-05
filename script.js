const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const categoryButtons = document.querySelectorAll(".category-grid button");
const playButtons = document.querySelectorAll(".play-work");
const player = document.querySelector(".mini-player");
const playerToggle = document.querySelector(".player-toggle");
const playerClose = document.querySelector(".player-close");
const playerTitle = document.querySelector("#player-title");
const playerArtist = document.querySelector("#player-artist");
const playerProgress = document.querySelector(".mini-progress span");

let isPlaying = false;
let progress = 32;
let progressTimer;

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

function startPlayer() {
  isPlaying = true;
  playerToggle.textContent = "Ⅱ";
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress = progress >= 100 ? 0 : progress + 0.7;
    playerProgress.style.width = `${progress}%`;
  }, 600);
}

function pausePlayer() {
  isPlaying = false;
  playerToggle.textContent = "▶";
  clearInterval(progressTimer);
}

playButtons.forEach((button) => {
  button.addEventListener("click", () => {
    player.classList.remove("is-hidden");
    playerTitle.textContent = button.dataset.title || "اختيار أدبي";
    playerArtist.textContent = button.dataset.artist || "أدب كاست";
    progress = 12;
    playerProgress.style.width = `${progress}%`;
    startPlayer();
  });
});

playerToggle?.addEventListener("click", () => {
  if (isPlaying) {
    pausePlayer();
  } else {
    startPlayer();
  }
});

playerClose?.addEventListener("click", () => {
  pausePlayer();
  player.classList.add("is-hidden");
});

playerProgress.style.width = `${progress}%`;
