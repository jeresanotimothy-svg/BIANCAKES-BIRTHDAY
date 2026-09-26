/* ===================================================================
   EDIT EVERYTHING IN THIS ONE BLOCK. Nothing below it needs touching.

   Where to put your files:
     assets/photos/  -> .jpg .jpeg .png .webp
     assets/audio/   -> .mp3

   Any path ending in .mp4 or .webm is rendered as a video automatically,
   so you can mix photos and clips in the same gallery.
   =================================================================== */

const CONFIG = {

  // ---- Who & when ----
  name: "Bianca Salvador",
  birthday: "2026-09-27T00:00:00",   // YYYY-MM-DDTHH:MM:SS  (her next birthday)
  unlockEarly: true ,                // true = "Open her gift" works before the date

  // ---- Photos floating around the hero (4-6 works best) ----
  heroPhotos: [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg"
  ],

  // ---- Polaroid gallery. Mix photos and short clips freely ----
  gallery: [
    { src: "7.jpg", caption: "first date" },
    { src: "11.jpg", caption: "december" },
    { src: "9.jpg", caption: "mall trip" },
    { src: "10.jpg", caption: "flowers" },
    { src: "13.jpg", caption: "your laugh" },
    { src: "8.jpg", caption: "rainy day" },
    { src: "12.jpg", caption: "us" },
    { src: "14.jpg", caption: "last week" }
  ],

  // ---- Background music (leave "" for no music) ----
  music: "hehe.mp3",

  // ---- The letter. Each string is one paragraph ----
  letter: [
    "Happy 19th birthday, my Bianca.",
    "Nineteen looks so good on you. I wanted today to feel like more than just another text on a screen, so I built you this instead. A little corner of the internet just to remind you how much you mean to me.",
    "Thank you for the ordinary days. The late night calls, the stupid jokes, the food we promised each other we wouldn't order. You make the most normal parts of life feel like something I want to keep forever.",
    "But honestly, thank you for putting up with me on the hard days, too. I know I have been a bad boyfriend sometimes. I mess up, and I know I can be a lot to handle, but you never give up on me. You are always just there. Even when our wallets are completely empty and we literally have zero money, we somehow still find a way to laugh and be completely happy just having each other.",
    "I love you for exactly who you are. Please never shrink yourself to fit anywhere. I hope this year is so kind to you, and that you get all the things you have been quietly hoping for.",
    "Whatever happens this year, I am right here for all of it. Happy birthday."
  ],

  // ---- Wishes card ----
  wishGreeting: "Happy birthday, my love ♥",
  wishText: "I wish you happiness, good health, and endless blessings in this new chapter. May your dreams come true, may your days be full of joy, and may your heart always find peace. Thank you for being such a wonderful part of my life. Stay happy, stay healthy, and keep shining.",

  // ---- Closing line ----
  finaleText: "Thank you for being part of my life. I hope this little gift made your special day even more beautiful."
};

/* ===================== NOTHING TO EDIT BELOW ===================== */

const $ = (id) => document.getElementById(id);
const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

/* ---------- Media element builder ---------- */
function mediaEl(src, caption) {
  const wrap = document.createElement("div");
  wrap.className = "polaroid";

  let el;
  if (isVideo(src)) {
    el = document.createElement("video");
    el.src = src;
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.addEventListener("mouseenter", () => el.play().catch(() => {}));
    el.addEventListener("mouseleave", () => el.pause());
  } else {
    el = document.createElement("img");
    el.src = src;
    el.alt = caption || "";
    el.loading = "lazy";
  }
  el.addEventListener("error", () => { wrap.style.opacity = "0.25"; });

  wrap.appendChild(el);
  const cap = document.createElement("span");
  cap.className = "cap";
  cap.textContent = caption || "";
  wrap.appendChild(cap);
  return wrap;
}

/* ---------- Hero scatter ---------- */
const SPOTS = [
  { top: "12%", left: "6%",  rot: -8 },
  { top: "52%", left: "3%",  rot: 6 },
  { top: "74%", left: "13%", rot: -4 },
  { top: "14%", left: "80%", rot: 7 },
  { top: "45%", left: "86%", rot: -6 },
  { top: "72%", left: "76%", rot: 5 }
];

CONFIG.heroPhotos.slice(0, SPOTS.length).forEach((src, i) => {
  const p = mediaEl(src, "");
  p.querySelector(".cap").remove();
  Object.assign(p.style, {
    top: SPOTS[i].top,
    left: SPOTS[i].left,
    transform: `rotate(${SPOTS[i].rot}deg)`
  });
  $("scatter").appendChild(p);
});

/* ---------- Gallery ---------- */
CONFIG.gallery.forEach((item, i) => {
  const p = mediaEl(item.src, item.caption);
  p.style.transform = `rotate(${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg)`;
  $("polagrid").appendChild(p);
});

/* ---------- Text content ---------- */
CONFIG.letter.forEach(text => {
  const p = document.createElement("p");
  p.textContent = text;
  $("letterCard").appendChild(p);
});
$("wishHi").textContent = CONFIG.wishGreeting;
$("wishBody").textContent = CONFIG.wishText;
$("finaleText").textContent = CONFIG.finaleText;
document.title = `${CONFIG.name} — Happy Birthday`;

/* ---------- Countdown ---------- */
const target = new Date(CONFIG.birthday).getTime();
const openBtn = $("openGift");
const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

function tick() {
  const gap = target - Date.now();

  if (gap <= 0 || CONFIG.unlockEarly) {
    openBtn.disabled = false;
    $("gateNote").textContent = gap <= 0
      ? "It's her day. Go ahead."
      : "Preview mode — the gift is unlocked";
    if (gap <= 0) {
      ["cdDays", "cdHours", "cdMins", "cdSecs"].forEach(id => $(id).textContent = "00");
      return;
    }
  }

  $("cdDays").textContent  = pad(Math.floor(gap / 86400000));
  $("cdHours").textContent = pad(Math.floor(gap / 3600000) % 24);
  $("cdMins").textContent  = pad(Math.floor(gap / 60000) % 60);
  $("cdSecs").textContent  = pad(Math.floor(gap / 1000) % 60);
}
tick();
setInterval(tick, 1000);

/* ---------- Gate open / replay ---------- */
document.body.classList.add("locked");

openBtn.addEventListener("click", () => {
  $("gate").classList.add("gone");
  document.body.classList.remove("locked");
  window.scrollTo({ top: 0, behavior: "auto" });
  if (CONFIG.music) playMusic();
  setTimeout(() => topnav.classList.add("show"), 600);
});

$("replay").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- Navigation ---------- */
const topnav = $("topnav");
const navLinks = [...topnav.querySelectorAll("a")];

window.addEventListener("scroll", () => {
  topnav.classList.toggle("solid", window.scrollY > 40);
}, { passive: true });

const navSpy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("active", a.hash === `#${e.target.id}`));
  });
}, { threshold: 0.4 });

["hero", "letter", "gallery", "wishes"].forEach(id => navSpy.observe($(id)));

/* ---------- Hamburger toggle (mobile/tablet) ---------- */
const hamburger = $("hamburger");

hamburger.addEventListener("click", () => {
  const isOpen = topnav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

navLinks.forEach(a => {
  a.addEventListener("click", () => {
    topnav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Music ---------- */
const bgm = $("bgm");
const musicBtn = $("musicToggle");

if (CONFIG.music) {
  bgm.src = CONFIG.music;
  bgm.volume = 0.45;
} else {
  musicBtn.style.display = "none";
}

function playMusic() {
  bgm.play()
    .then(() => { musicBtn.classList.add("playing"); musicBtn.title = "Pause music"; })
    .catch(() => {});
}

musicBtn.addEventListener("click", () => {
  if (bgm.paused) {
    playMusic();
  } else {
    bgm.pause();
    musicBtn.classList.remove("playing");
    musicBtn.title = "Play music";
  }
});

/* ---------- Reveal on scroll ---------- */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.2 });

  document.querySelectorAll(".panel > *, .hero-inner").forEach(el => {
    el.classList.add("reveal");
    io.observe(el);
  });
}

/* ---------- Starfield ---------- */
(function starfield() {
  if (reduced) return;
  const cv = $("stars");
  const ctx = cv.getContext("2d");
  let stars = [];

  function build() {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    const count = Math.round((cv.width * cv.height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.012 + 0.003
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    stars.forEach(st => {
      st.a += st.s;
      const alpha = 0.25 + Math.abs(Math.sin(st.a)) * 0.6;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 228, 216, ${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  build();
  draw();
  window.addEventListener("resize", build);
})();