(() => {
const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");
const speedLevelEl = document.getElementById("speed-level");
const flash = document.getElementById("flash");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreEl = document.getElementById("final-score");
const finalBestScoreEl = document.getElementById("final-best-score");
const restartBtn = document.getElementById("restart-btn");
const coinCountEl = document.getElementById("coin-count");
const rollBtn = document.getElementById("roll-btn");
const rollResult = document.getElementById("roll-result");
const totalDeathsEl = document.getElementById("total-deaths");
const highestSpeedEl = document.getElementById("highest-speed");
const totalRollsEl = document.getElementById("total-rolls");
const timePlayedEl = document.getElementById("time-played");
const shieldStatus = document.getElementById("shield-status");
const slowStatus = document.getElementById("slow-status");
const multiplierStatus = document.getElementById("multiplier-status");
const shieldIndicator =document.getElementById("shield-indicator");
const slowIndicator = document.getElementById("slow-indicator");
const multiplierIndicator = document.getElementById("multiplier-indicator");
const shieldTimer = document.getElementById("shield-timer");
const slowTimer = document.getElementById("slow-timer");
const multiplierTimer = document.getElementById("multiplier-timer");
const voidIndicator = document.getElementById("void-indicator");
const voidTimer = document.getElementById("void-timer");
const phantomIndicator =
  document.getElementById(
    "phantom-indicator"
  );

const phantomTimer =
  document.getElementById(
    "phantom-timer"
  );

const celestialIndicator =
  document.getElementById(
    "celestial-indicator"
  );

const celestialTimer =
  document.getElementById(
    "celestial-timer"
  );
const tripleIndicator = document.getElementById("triple-indicator");
const tripleTimer = document.getElementById("triple-timer");
const homeScreen = document.getElementById("home-screen");
const startGameBtn = document.getElementById("start-game-btn");
const homeBestScore = document.getElementById("home-best-score");
const homeCoins = document.getElementById("home-coins");
const homeHighestSpeed = document.getElementById("home-highest-speed");
const musicToggleBtn = document.getElementById("music-toggle-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const pauseBtn = document.getElementById("pause-btn");
const homeBtn = document.getElementById("home-btn");
const pauseOverlay = document.getElementById("pause-overlay");

let playerX = 0;
let playerSpeed = 8;

let keys = {};

let obstacles = [];
let powerUps = [];
let coins = [];
let moneyBags = [];

let score = 0;
let coinCount = 0;

const SAVE_KEY = "neonChaosSecureSave";
const SECRET_KEY = "NEON_SECRET_2026";

function createChecksum(data) {
  return btoa(
    JSON.stringify(data) + SECRET_KEY
  );
}

function saveGame() {

  const data = {
  coins: coinCount,
  bestScore,
  totalDeaths,
  highestSpeed,
  totalRolls,
  ownedSkins,
  equippedSkin,

  voidVerified:
  localStorage.getItem("voidVerified") === "true",

phantomVerified:
  localStorage.getItem("phantomVerified") === "true",

celestialVerified:
  localStorage.getItem("celestialVerified") === "true"
};

  const save = {
    data,
    checksum: createChecksum(data)
  };

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(save)
  );
}

function loadGame() {

  const raw =
    localStorage.getItem(SAVE_KEY);

  if (!raw) {
    return;
  }

  try {

    const save = JSON.parse(raw);

    const valid =
      save.checksum ===
      createChecksum(save.data);

    if (!valid) {

      triggerCheatDetection(
        "Save tampering detected."
      );

      return;
    }

    coinCount =
      save.data.coins || 0;

    bestScore =
      save.data.bestScore || 0;

    totalDeaths =
      save.data.totalDeaths || 0;

    highestSpeed =
      save.data.highestSpeed || 1;

    totalRolls =
      save.data.totalRolls || 0;

    ownedSkins =
      save.data.ownedSkins || [];

    equippedSkin =
      save.data.equippedSkin || "default";

    if (save.data.voidVerified) {

  localStorage.setItem(
    "voidVerified",
    "true"
  );
}

if (save.data.phantomVerified) {

  localStorage.setItem(
    "phantomVerified",
    "true"
  );
}

if (save.data.celestialVerified) {

  localStorage.setItem(
    "celestialVerified",
    "true"
  );
}

  }

  catch {

    triggerCheatDetection(
      "Corrupted save detected."
    );
  }
}

let bestScore = parseInt(
  localStorage.getItem("neonChaosBest") || "0",
  10
);

let lastCoinCount = coinCount;
let lastScore = score;

let gameRunning = false;
let tabHidden = false;
let paused = false;
let pauseStartTime = 0;

/* HIDDEN DEV SYSTEM */

let x93FluxState = false;
let devMode = false;

let shiftHeldTime = 0;
let escPresses = 0;
let escTimer = null;

let spawnInterval = 700;
let lastSpawn = 0;
let lastTime = 0;

let speedLevel = 1;

let powerUpInterval = 6000;
let lastPowerUp = 0;

let coinInterval = 4000;
let lastCoin = 0;

/* VOID */

let voidBlastCooldown = false;
let voidBlastReady = true;

let voidBlastActive = false;

let voidBlastEndTime = 0;
let voidBlastCooldownEndTime = 0;

/* PHANTOM */

let phantomShiftActive = false;
let phantomCooldown = false;
let phantomReady = true;
let phantomEndTime = 0;
let phantomCooldownEndTime = 0;

/* CELESTIAL */

let celestialSurgeActive = false;
let celestialCooldown = false;
let celestialReady = true;
let celestialEndTime = 0;
let celestialCooldownEndTime = 0;

let shieldEndTime = 0;
let slowEndTime = 0;
let multiplierEndTime = 0;

let shieldTimeout = null;
let slowTimeout = null;
let multiplierTimeout = null;

let shieldActive = false;
let slowActive = false;
let multiplierActive = false;

let tripleEndTime = 0;
let tripleTimeout = null;
let tripleActive = false;

let totalDeaths =
  parseInt(
    localStorage.getItem("neonChaosDeaths") || "0",
    10
  );

let highestSpeed =
  parseInt(
    localStorage.getItem("neonChaosHighestSpeed") || "1"
  );

let totalRolls =
  parseInt(
    localStorage.getItem("neonChaosRolls") || "0"
  );

let totalPlaySeconds =
  parseInt(
    localStorage.getItem("neonChaosPlayTime") || "0"
  );

let ownedSkins = JSON.parse(
  localStorage.getItem("neonChaosSkins") || "[]"
);

let equippedSkin =
  localStorage.getItem("neonChaosSkin") || "default";

  const rareSkins = [
  "void",
  "phantom",
  "celestial"
];

function hasVerifiedRareSkin(skin) {

  return localStorage.getItem(
    `${skin}Verified`
  ) === "true";
}

function ownsVerifiedRareSkin(skin) {

  return (
    ownedSkins.includes(skin) &&
    hasVerifiedRareSkin(skin)
  );
}

function remainingRareSkins() {

  return rareSkins.filter(
    skin => !ownsVerifiedRareSkin(skin)
  );
}

const VOID_VERSION = "v2";

const savedVoidVersion =
  localStorage.getItem("voidVersion");

if (savedVoidVersion !== VOID_VERSION) {

  ownedSkins =
    ownedSkins.filter(
      skin => skin !== "void"
    );

    

  if (equippedSkin === "void") {

    equippedSkin = "default";

    localStorage.setItem(
      "neonChaosSkin",
      "default"
    );
  }

  localStorage.setItem(
    "neonChaosSkins",
    JSON.stringify(ownedSkins)
  );

  localStorage.removeItem(
    "voidVerified"
  );

  totalRolls = 0;

  localStorage.setItem(
    "neonChaosRolls",
    "0"
  );

  localStorage.setItem(
    "voidVersion",
    VOID_VERSION
  );
}

loadGame();

lastCoinCount = coinCount;
lastScore = score;

bestScoreEl.textContent = bestScore;
coinCountEl.textContent = coinCount;
totalDeathsEl.textContent = totalDeaths;
highestSpeedEl.textContent = highestSpeed;
totalRollsEl.textContent = totalRolls;
timePlayedEl.textContent = totalPlaySeconds;

/* INPUT */

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

window.addEventListener("keydown", (e) => {

  if (
    e.code === "Space" &&
    gameRunning
  ) {

    /* VOID */

    if (
      equippedSkin === "void" &&
      !voidBlastCooldown
    ) {

      activateVoidBlast();
    }

    /* PHANTOM */

    if (
      equippedSkin === "phantom" &&
      !phantomCooldown
    ) {

      activatePhantomShift();
    }

    /* CELESTIAL */

    if (
      equippedSkin === "celestial" &&
      !celestialCooldown
    ) {

      activateCelestialSurge();
    }
  }
});

/* SECRET DEV MODE ACTIVATOR */

window.addEventListener("keydown", (e) => {

  /* HOLD SHIFT */

  if (e.key === "Shift") {

    if (shiftHeldTime === 0) {

      shiftHeldTime = Date.now();
    }
  }

  /* DOUBLE ESC */

  if (e.key === "Escape") {

    if (
      shiftHeldTime !== 0 &&
      Date.now() - shiftHeldTime > 3000
    ) {

      escPresses++;

      clearTimeout(escTimer);

      escTimer = setTimeout(() => {

        escPresses = 0;

      }, 1000);

      if (escPresses >= 2) {

        devMode = !devMode;

        escPresses = 0;

        console.log(
          "DEV MODE:",
          devMode ? "ENABLED" : "DISABLED"
        );

        rollResult.textContent =
          devMode
            ? "⚡ DEV MODE ENABLED"
            : "DEV MODE DISABLED";
      }
    }
  }
});

window.addEventListener("keyup", (e) => {

  if (e.key === "Shift") {

    shiftHeldTime = 0;
  }
});

/* DEVTOOLS SHORTCUT BLOCKER */

window.addEventListener("keydown", (e) => {

  /* F12 */

  if (e.key === "F12") {

    e.preventDefault();

    return false;
  }

  /* CTRL + SHIFT + I */

  if (
    e.ctrlKey &&
    e.shiftKey &&
    e.key.toLowerCase() === "i"
  ) {

    e.preventDefault();

    return false;
  }

  /* CTRL + SHIFT + J */

  if (
    e.ctrlKey &&
    e.shiftKey &&
    e.key.toLowerCase() === "j"
  ) {

    e.preventDefault();

    return false;
  }

  /* CTRL + U */

  if (
    e.ctrlKey &&
    e.key.toLowerCase() === "u"
  ) {

    e.preventDefault();

    return false;
  }
});

document.addEventListener(
  "contextmenu",
  (e) => e.preventDefault()
);

/* SECRET DEV ACTIVATOR */

window.addEventListener("keydown", (e) => {

  /* HOLD SHIFT */

  if (e.key === "Shift") {

    if (shiftHeldTime === 0) {

      shiftHeldTime = Date.now();
    }
  }

  /* DOUBLE ESC */

  if (e.key === "Escape") {

    if (
      shiftHeldTime !== 0 &&
      Date.now() - shiftHeldTime > 3000
    ) {

      escPresses++;

      clearTimeout(escTimer);

      escTimer = setTimeout(() => {

        escPresses = 0;

      }, 1000);

      if (escPresses >= 2) {

        x93FluxState = !x93FluxState;

        escPresses = 0;

        console.log(
          "SYSTEM:",
          x93FluxState
            ? "ONLINE"
            : "OFFLINE"
        );

        rollResult.textContent =
          x93FluxState
            ? "⚡ SYSTEM ONLINE"
            : "SYSTEM OFFLINE";
      }
    }
  }
});

window.addEventListener("keyup", (e) => {

  if (e.key === "Shift") {

    shiftHeldTime = 0;
  }
});

/* TAB VISIBILITY PROTECTION */

document.addEventListener("visibilitychange", () => {

  if (document.hidden) {

    tabHidden = true;

    if (
      gameRunning &&
      !gameOverScreen.classList.contains("show")
    ) {

      gameRunning = false;

      paused = true;

      pauseBtn.innerHTML = "<span>▶</span>";

      gameContainer.classList.add("paused");
    }
  }

  else {

    tabHidden = false;

    if (
      !gameOverScreen.classList.contains("show") &&
      homeScreen.style.display === "none"
    ) {

      gameRunning = false;

      paused = true;

      pauseBtn.innerHTML = "<span>▶</span>";

      gameContainer.classList.add("paused");
    }
  }
});

/* SKINS */

const skinCosts = {
  cyan: 20,
  pink: 35,
  gold: 50,
  galaxy: 120,
  lava: 150,
  matrix: 180,
  rainbow: 220,
  
};

function applySkin(skin) {

  player.classList.remove(
  "galaxy-skin",
  "lava-skin",
  "matrix-skin",
  "rainbow-skin",
  "phantom-skin",
  "phantom-shift",
  "celestial-surge"
);

  player.style.boxShadow = "";

  if (skin === "cyan") {

    player.style.background =
      "linear-gradient(135deg, #00ffff, #0088ff)";
  }

  else if (skin === "gold") {

    player.style.background =
      "linear-gradient(135deg, #ffdd33, #ffaa00)";
  }

  else if (skin === "pink") {

    player.style.background =
      "linear-gradient(135deg, #ff00ff, #ff66cc)";
  }

  else if (skin === "galaxy") {

    player.style.background =
      "linear-gradient(135deg, #2b1055, #7597de, #ff00ff)";

    player.classList.add("galaxy-skin");
  }

  else if (skin === "lava") {

    player.style.background =
      "linear-gradient(135deg, #ff2200, #ff8800, #ffff00)";

    player.classList.add("lava-skin");
  }

  else if (skin === "matrix") {

    player.style.background =
      "linear-gradient(135deg, #001100, #00ff66, #003300)";

    player.classList.add("matrix-skin");
  }

  else if (skin === "rainbow") {

    player.style.background =
      "linear-gradient(135deg, red, orange, yellow, green, cyan, blue, violet)";

    player.classList.add("rainbow-skin");
  }

  else if (skin === "void") {

    player.style.background =
      "linear-gradient(135deg, #000000, #220044, #00ffff, #ffffff, #6600ff)";

    player.style.boxShadow =
      "0 0 25px #00ffff, 0 0 50px #ffffff";
  }

  else if (skin === "phantom") {

  player.style.background =
    "linear-gradient(135deg, #111111, #5500aa, #00ffee)";

  player.style.boxShadow =
    "0 0 25px #5500aa, 0 0 50px #00ffee";
  player.classList.add("phantom-skin");
}

else if (skin === "celestial") {

  player.style.background =
    "linear-gradient(135deg, #ffffff, #88ccff, #ffee88)";

  player.style.boxShadow =
    "0 0 25px #88ccff, 0 0 50px #ffee88";
}

else {

  player.style.background =
    "linear-gradient(135deg, #8e9191, #4e474e)";

  player.style.boxShadow =
    "0 0 15px #8e9191, 0 0 30px #4e474e";
      }
}

function updateSkinButtons() {

  document.querySelectorAll(".skin").forEach((skinEl) => {

    const skin =
      skinEl.dataset.skin;

    const status =
      skinEl.querySelector(".skin-status");

    skinEl.classList.remove("selected");

    /* VISUAL PREVIEW */

    if (skin === "cyan") {

      skinEl.style.background =
        "linear-gradient(135deg, #00ffff22, #0088ff22)";
    }

    if (skin === "pink") {

      skinEl.style.background =
        "linear-gradient(135deg, #ff00ff22, #ff66cc22)";
    }

    if (skin === "gold") {

      skinEl.style.background =
        "linear-gradient(135deg, #ffdd3322, #ffaa0022)";
    }

    if (skin === "galaxy") {

      skinEl.style.background =
        "linear-gradient(135deg, #2b1055, #7597de55, #ff00ff33)";
    }

    if (skin === "lava") {

      skinEl.style.background =
        "linear-gradient(135deg, #ff220055, #ff880055, #ffff0033)";
    }

    if (skin === "matrix") {

      skinEl.style.background =
        "linear-gradient(135deg, #001100, #00ff6633, #003300)";
    }

    if (skin === "rainbow") {

      skinEl.style.background =
        "linear-gradient(135deg, red, orange, yellow, green, cyan, blue, violet)";
    }

    if (skin === "void") {

      skinEl.style.background =
        "linear-gradient(135deg, #000000, #220044, #00ffff, #ffffff, #6600ff)";
    }

    if (skin === "phantom") {

  skinEl.style.background =
    "linear-gradient(135deg, #111111, #5500aa, #00ffee)";
  }

  if (skin === "celestial") {

  skinEl.style.background =
    "linear-gradient(135deg, #ffffff, #88ccff, #ffee88)";
  }

    if (ownedSkins.includes(skin)) {

      if (equippedSkin === skin) {

        status.textContent = "Selected";

        skinEl.classList.add("selected");
      }

      else {

        status.textContent = "Select";
      }
    }

    else {

      if (
  skin === "void" ||
  skin === "phantom" ||
  skin === "celestial"
) {

  const verified =
    localStorage.getItem(
      `${skin}Verified`
    ) === "true";

  if (
    ownedSkins.includes(skin) &&
    verified
  ) {

    status.textContent = "Select";
  }

  else {

    if (skin === "void") {
      status.textContent =
        "0.1% Roll Chance";
    }

    if (skin === "phantom") {
      status.textContent =
        "0.2% Roll Chance";
    }

    if (skin === "celestial") {
      status.textContent =
        "0.3% Roll Chance";
    }
  }
}

else {

  status.textContent =
    `${skinCosts[skin]} Coins`;
    }
    }
  });
}

if (
  equippedSkin === "void" &&
  localStorage.getItem("voidVerified") !== "true"
) {

  equippedSkin = "default";
}

if (
  equippedSkin === "phantom" &&
  localStorage.getItem("phantomVerified") !== "true"
) {

  equippedSkin = "default";
}

if (
  equippedSkin === "celestial" &&
  localStorage.getItem("celestialVerified") !== "true"
) {

  equippedSkin = "default";
}

if (
  equippedSkin !== "default" &&
  equippedSkin !== "void" &&
  !ownedSkins.includes(equippedSkin)
) {

  equippedSkin = "default";
}

applySkin(equippedSkin);

updateSkinButtons();
updateRollButton();

    document.querySelectorAll(".skin").forEach((skinEl) => {

  skinEl.addEventListener("click", () => {

    const skin =
      skinEl.dataset.skin;

    /* VOID SPECIAL CASE */

    if (skin === "void") {

      if (
        !ownedSkins.includes("void") ||
        localStorage.getItem("voidVerified") !== "true"
      ) {

        rollResult.textContent =
          "Unlock Void Skin from rolling!";

        return;
      }
    }

    /* CELESTIAL SPECIAL CASE */

    if (skin === "celestial") {

      if (
        !ownedSkins.includes("celestial") ||
        localStorage.getItem("celestialVerified") !== "true"
      ) {

        rollResult.textContent =
          "Unlock Celestial Skin from rolling!";

        return;
      }
    }

    /* PHANTOM SPECIAL CASE */

    if (skin === "phantom") {

      if (
        !ownedSkins.includes("phantom") ||
        localStorage.getItem("phantomVerified") !== "true"
      ) {

        rollResult.textContent =
          "Unlock Phantom Skin from rolling!";

        return;
      }
    }

    const cost =
      skinCosts[skin];

    if (!ownedSkins.includes(skin)) {

      if (coinCount >= cost) {

        coinCount -= cost;

        ownedSkins.push(skin);

        saveGame();

        localStorage.setItem(
          "neonChaosCoins",
          coinCount.toString()
        );

        localStorage.setItem(
          "neonChaosSkins",
          JSON.stringify(ownedSkins)
        );

        coinCountEl.textContent =
          coinCount;
      }

      else {

        alert("Not enough coins!");

        return;
      }
    }

    equippedSkin = skin;

    localStorage.setItem(
      "neonChaosSkin",
      skin
    );

    saveGame();

    applySkin(equippedSkin);

    updateSkinButtons();

    updateRollButton();

    updateHomeStats();

  });

});

/* HIDDEN SYSTEM FUNCTIONS */

function fluxCoins(amount) {

  if (!x93FluxState) return;

  coinCount += amount;

  coinCountEl.textContent =
    coinCount;

  saveGame();
}

function fluxScore(amount) {

  if (!x93FluxState) return;

  score += amount;

  scoreEl.textContent =
    score;
}

function fluxRareUnlock() {

  if (!x93FluxState) return;

  ["void", "phantom", "celestial"]
    .forEach((skin) => {

      if (!ownedSkins.includes(skin)) {

        ownedSkins.push(skin);
      }

      localStorage.setItem(
        `${skin}Verified`,
        "true"
      );
    });

  localStorage.setItem(
    "neonChaosSkins",
    JSON.stringify(ownedSkins)
  );

  updateSkinButtons();

  saveGame();
}

function fluxUnlockEverything() {

  if (!x93FluxState) return;

  const allSkins = [

    "cyan",
    "pink",
    "gold",
    "galaxy",
    "lava",
    "matrix",
    "rainbow",

    "void",
    "phantom",
    "celestial"
  ];

  allSkins.forEach((skin) => {

    if (!ownedSkins.includes(skin)) {

      ownedSkins.push(skin);
    }
  });

  localStorage.setItem(
    "voidVerified",
    "true"
  );

  localStorage.setItem(
    "phantomVerified",
    "true"
  );

  localStorage.setItem(
    "celestialVerified",
    "true"
  );

  localStorage.setItem(
    "neonChaosSkins",
    JSON.stringify(ownedSkins)
  );

  updateSkinButtons();

  saveGame();
}

function fluxMaxStats() {

  if (!x93FluxState) return;

  bestScore = 999999;

  highestSpeed = 999;

  totalRolls = 99999;

  totalDeaths = 0;

  bestScoreEl.textContent =
    bestScore;

  highestSpeedEl.textContent =
    highestSpeed;

  totalRollsEl.textContent =
    totalRolls;

  totalDeathsEl.textContent =
    totalDeaths;

  saveGame();
}

/* ROLL SYSTEM */

function updateRollButton() {

  const remaining =
    remainingRareSkins();

  /* ALL RARES OWNED */

  if (remaining.length === 0) {

    rollBtn.disabled = true;

    rollBtn.textContent =
      "ALL RARE SKINS UNLOCKED";

    rollBtn.style.opacity = "0.5";

    rollBtn.style.cursor = "default";

    rollBtn.classList.add(
      "void-unlocked"
    );

    return;
  }

  /* CAN STILL ROLL */

  rollBtn.disabled = false;

  rollBtn.textContent =
    "ROLL FOR RARE SKINS — 15 COINS";

  rollBtn.style.opacity = "1";

  rollBtn.style.cursor = "pointer";

  rollBtn.classList.remove(
    "void-unlocked"
  );
}

/* HIDDEN SYSTEM HOTKEYS */

window.addEventListener("keydown", (e) => {

  if (!x93FluxState) return;

  /* ALT + 1 = MAX STATS */

  if (
    e.altKey &&
    e.key === "1"
  ) {

    e.preventDefault();

    fluxMaxStats();

    rollResult.textContent =
      "📊 STATS BOOST";
  }

  /* ALT + 2 = COINS */

  if (
    e.altKey &&
    e.key === "2"
  ) {

    e.preventDefault();

    fluxCoins(500);

    rollResult.textContent =
      "💰 +500";
  }

  /* ALT + 3 = SCORE */

  if (
    e.altKey &&
    e.key === "3"
  ) {

    e.preventDefault();

    fluxScore(100000);

    rollResult.textContent =
      "SCORE +100000";
  }

  /* ALT + 4 = UNLOCK ALL SKINS */

  if (
    e.altKey &&
    e.key === "4"
  ) {

    e.preventDefault();

    fluxUnlockEverything();

    rollResult.textContent =
      "ALL SKINS UNLOCKED";
  }
});

/* SECRET DEV PANEL */

window.addEventListener("keydown", (e) => {

  if (!x93FluxState) return;

  /* OPEN PANEL */

  if (e.key === "`") {

    const command = prompt(
      "X93 FLUX CONSOLE"
    );

    if (!command) return;

    /* COINS */

    if (command === "coins") {

      fluxCoins(5000);

      rollResult.textContent =
        "💰 +5000 COINS";
    }

    /* SCORE */

    else if (command === "score") {

      fluxScore(500000);

      rollResult.textContent =
        "+500000 SCORE";
    }

    /* ALL SKINS */

    else if (command === "skins") {

      fluxRareUnlock();

      rollResult.textContent =
        " UNLOCK ALL RARE SKINS";
    }

    /* MAX */

    else if (command === "max") {

      fluxMaxStats();

      rollResult.textContent =
        "📊 MAX STATS";
    }

    /* UNKNOWN */

    else {

      rollResult.textContent =
        "UNKNOWN COMMAND";
    }
  }
});

/* STATS FORMATTING */

function formatPlayTime(seconds) {

  const days =
    Math.floor(seconds / 86400);

  const hours =
    Math.floor((seconds % 86400) / 3600);

  const mins =
    Math.floor((seconds % 3600) / 60);

  if (days > 0) {

    return `${days}d ${hours}h ${mins}m`;
  }

  if (hours > 0) {

    return `${hours}h ${mins}m`;
  }

  return `${mins} mins`;
}

timePlayedEl.textContent =
  formatPlayTime(totalPlaySeconds);

/* HOME SCREEN STATS */

function updateHomeStats() {

  homeBestScore.textContent =
    bestScore;

  homeCoins.textContent =
    coinCount;

  homeHighestSpeed.textContent =
    highestSpeed;
}

/* PLAYER */

function updatePlayer() {

  if (!gameRunning) {
  return;
}

  const rect =
    gameContainer.getBoundingClientRect();

  const width = rect.width;

  const playerWidth =
  player.getBoundingClientRect().width;

  if (keys["arrowleft"] || keys["a"]) {
    playerX -= playerSpeed;
  }

  if (keys["arrowright"] || keys["d"]) {
    playerX += playerSpeed;
  }

  const playerRect =
  player.getBoundingClientRect();

const containerRect =
  gameContainer.getBoundingClientRect();

/* LEFT WALL */

if (playerRect.left < containerRect.left) {

  playerX +=
    containerRect.left - playerRect.left;
}

/* RIGHT WALL */

if (playerRect.right > containerRect.right) {

  playerX -=
    playerRect.right - containerRect.right;
}

  player.style.left = `${playerX}px`;
}


/* OBSTACLES */

function spawnObstacle() {

  const rect =
    gameContainer.getBoundingClientRect();

  const obstacle =
    document.createElement("div");

  obstacle.classList.add("obstacle");

  const size =
    20 + Math.random() * 30;

  obstacle.style.width = `${size}px`;
  obstacle.style.height = `${size}px`;

  obstacle.style.left =
    `${Math.random() * (rect.width - size)}px`;

  obstacle.dataset.speed =
    2 + Math.random() * (2 + speedLevel * 0.7);

  gameContainer.appendChild(obstacle);

  obstacles.push(obstacle);
}

function updateObstacles(delta) {

  const height =
    gameContainer.offsetHeight;

  for (
    let i = obstacles.length - 1;
    i >= 0;
    i--
  ) {

    const o = obstacles[i];

    const speed =
      parseFloat(o.dataset.speed);

    const top =
      (parseFloat(o.style.top || "-40") || -40)
      + speed * (delta / 16.67);

    o.style.top = `${top}px`;

    if (top > height + 50) {

      o.remove();

      obstacles.splice(i, 1);

      continue;
    }

    if (checkCollision(player, o)) {

    if (phantomShiftActive) {

      o.remove();

      obstacles.splice(i, 1);

      continue;
    }

      if (shieldActive) {

  shieldActive = false;

  /* RESET SHIELD TIMER */

  shieldEndTime = 0;

  /* REMOVE INDICATOR */

  shieldIndicator.classList.remove("active");

  /* STOP EXISTING TIMEOUT */

  clearTimeout(shieldTimeout);

  o.remove();

  obstacles.splice(i, 1);

  continue;
}
    
      if (equippedSkin === "void") {

  const voidSaveChance = Math.random();

  if (voidSaveChance < 0.2) {

    o.remove();

    obstacles.splice(i, 1);

    rollResult.textContent =
      "VOID GOD consumed an obstacle!";

    continue;
  }
}
      handleGameOver();

      return;
    }
  }
}

/* COINS */

function spawnCoin() {

  const rect =
    gameContainer.getBoundingClientRect();

  const c =
    document.createElement("div");

  c.classList.add("coin");

  c.style.width = "22px";
  c.style.height = "22px";

  c.style.left =
    `${Math.random() * (rect.width - 22)}px`;

  c.style.top = "-40px";

  c.dataset.speed = 3;

  gameContainer.appendChild(c);

  coins.push(c);
}

/* MONEY BAGS */

function spawnMoneyBag() {

  const rect =
    gameContainer.getBoundingClientRect();

  const bag =
    document.createElement("div");

  bag.classList.add("money-bag");

  bag.textContent = "💰";

  bag.style.left =
    `${Math.random() * (rect.width - 36)}px`;

  bag.style.top = "-40px";

  bag.dataset.speed = 2.5;

  gameContainer.appendChild(bag);

  moneyBags.push(bag);
}

function updateMoneyBags(delta) {

  const height =
    gameContainer.offsetHeight;

  for (
    let i = moneyBags.length - 1;
    i >= 0;
    i--
  ) {

    const bag = moneyBags[i];

    const speed =
      parseFloat(bag.dataset.speed);

    const top =
      (parseFloat(bag.style.top || "-40") || -40)
      + speed * (delta / 16.67);

    bag.style.top = `${top}px`;

    if (top > height + 50) {

      bag.remove();

      moneyBags.splice(i, 1);

      continue;
    }

    if (checkCollision(player, bag)) {

      const reward = 
      Math.floor(Math.random() * 18) + 8;


      coinCount += reward;
      saveGame();

      localStorage.setItem(
        "neonChaosCoins",
        coinCount.toString()
      );

      coinCountEl.textContent =
        coinCount;

      rollResult.textContent =
        `+${reward} BONUS COINS!`;

      bag.remove();

      moneyBags.splice(i, 1);
    }
  }
}

function updateCoins(delta) {

  const height =
    gameContainer.offsetHeight;

  for (
    let i = coins.length - 1;
    i >= 0;
    i--
  ) {

    const c = coins[i];

    const speed =
      parseFloat(c.dataset.speed);

    const top =
      (parseFloat(c.style.top || "-40") || -40)
      + speed * (delta / 16.67);

    c.style.top = `${top}px`;

    if (top > height + 50) {

      c.remove();

      coins.splice(i, 1);

      continue;
    }

    if (checkCollision(player, c)) {

      let reward = 1;

if (multiplierActive) {
  reward *= 2;
}

if (tripleActive) {
  reward *= 3;
}

coinCount += reward;
saveGame();

      localStorage.setItem(
        "neonChaosCoins",
        coinCount.toString()
      );

      coinCountEl.textContent =
        coinCount;

      c.remove();

      coins.splice(i, 1);
    }
  }
}

/* POWERUPS */

function formatEffectTime(ms) {

  const totalSeconds =
    Math.max(0, Math.ceil(ms / 1000));

  const mins =
    String(Math.floor(totalSeconds / 60))
    .padStart(2, "0");

  const secs =
    String(totalSeconds % 60)
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

function spawnPowerUp() {

  const types = [
  "shield",
  "slow",
  "multiplier",
  "triple"
];

  const type =
    types[Math.floor(Math.random() * types.length)];

  const rect =
    gameContainer.getBoundingClientRect();

  const p =
    document.createElement("div");

  p.classList.add("powerup", type);

const icon =
  document.createElement("div");

icon.classList.add("powerup-icon");

if (type === "shield") {
  icon.textContent = "🛡";
}

if (type === "slow") {
  icon.textContent = "⏱";
}

if (type === "multiplier") {
  icon.textContent = "×2";
}

if (type === "triple") {
  icon.textContent = "×3";
}

p.appendChild(icon);

  p.style.width = "30px";
  p.style.height = "30px";

  p.style.left =
    `${Math.random() * (rect.width - 30)}px`;

  p.style.top = "-40px";

  p.dataset.type = type;
  p.dataset.speed = 2.5;

  gameContainer.appendChild(p);

  powerUps.push(p);
}

function updatePowerUps(delta) {

  const height =
    gameContainer.offsetHeight;

  for (
    let i = powerUps.length - 1;
    i >= 0;
    i--
  ) {

    const p = powerUps[i];

    const speed =
      parseFloat(p.dataset.speed);

    const top =
      (parseFloat(p.style.top || "-40") || -40)
      + speed * (delta / 16.67);

    p.style.top = `${top}px`;

    if (top > height + 50) {

      p.remove();

      powerUps.splice(i, 1);

      continue;
    }

    if (checkCollision(player, p)) {

      activatePowerUp(p.dataset.type);

      p.remove();

      powerUps.splice(i, 1);
    }
  }
}

function showPowerupTimer(
  element,
  seconds
) {

  element.style.display = "flex";

  const timerEl =
    element.querySelector(".powerup-timer");

  let timeLeft = seconds;

  timerEl.textContent =
    `00:0${timeLeft}`;

  const interval =
    setInterval(() => {

      timeLeft--;

      const formatted =
        timeLeft < 10
        ? `00:0${timeLeft}`
        : `00:${timeLeft}`;

      timerEl.textContent =
        formatted;

      if (timeLeft <= 0) {

        clearInterval(interval);

        element.style.display = "none";
      }

    }, 1000);
}

function activatePowerUp(type) {

  const now = Date.now();

  /* SHIELD */

  if (type === "shield") {

    shieldActive = true;

    shieldEndTime =
      Math.max(shieldEndTime, now) + 4000;

    shieldIndicator.classList.add("active");

    clearTimeout(shieldTimeout);

    shieldTimeout = setTimeout(() => {

      shieldActive = false;

      shieldIndicator.classList.remove("active");

    }, shieldEndTime - now);
  }

  /* SLOW */

  if (type === "slow") {

    if (!slowActive) {

      slowActive = true;

      spawnInterval *= 1.8;

      obstacles.forEach((o) => {

        o.dataset.speed =
          parseFloat(o.dataset.speed) / 1.8;
      });
    }

    slowEndTime =
      Math.max(slowEndTime, now) + 5000;

    slowIndicator.classList.add("active");

    clearTimeout(slowTimeout);

    slowTimeout = setTimeout(() => {

      slowActive = false;

      slowIndicator.classList.remove("active");

      spawnInterval /= 1.8;

      obstacles.forEach((o) => {

        o.dataset.speed =
          parseFloat(o.dataset.speed) * 1.8;
      });

    }, slowEndTime - now);
  }
  
    /* MULTIPLIER */

  if (type === "multiplier") {

    multiplierActive = true;

    multiplierEndTime =
      Math.max(multiplierEndTime, now) + 8000;

    multiplierIndicator.classList.add("active");

    clearTimeout(multiplierTimeout);

    multiplierTimeout = setTimeout(() => {

      multiplierActive = false;

      multiplierIndicator.classList.remove("active");

    }, multiplierEndTime - now);
  }

  /* TRIPLE */

  if (type === "triple") {

    tripleActive = true;

    tripleEndTime =
      Math.max(tripleEndTime, now) + 8000;

    tripleIndicator.classList.add("active");

    clearTimeout(tripleTimeout);

    tripleTimeout = setTimeout(() => {

      tripleActive = false;

      tripleIndicator.classList.remove("active");

    }, tripleEndTime - now);
  }
}

function activateVoidBlast() {

  voidBlastCooldown = true;

  voidBlastReady = false;

  voidBlastActive = true;

  voidBlastEndTime =
    Date.now() + 3000;

  /* DESTROY ALL OBSTACLES */

  obstacles.forEach((o) => {

    o.classList.add("void-destroy");

    setTimeout(() => {

      o.remove();

    }, 250);
  });

  obstacles = [];

  /* END ACTIVE */

  setTimeout(() => {

    voidBlastActive = false;

    voidBlastCooldownEndTime =
      Date.now() + 10000;

  }, 3000);

  /* END COOLDOWN */

  setTimeout(() => {

    voidBlastCooldown = false;

    voidBlastReady = true;

    voidTimer.textContent =
      "READY";

  }, 13000);
}

function activatePhantomShift() {

  phantomCooldown = true;

  phantomReady = false;

  phantomShiftActive = true;

  phantomEndTime =
    Date.now() + 10000;

  phantomIndicator.classList.add("active");

  player.classList.add("phantom-shift");

  rollResult.textContent =
    "PHANTOM SHIFT ACTIVATED";

  /* END ACTIVE STATE */

  setTimeout(() => {

    phantomShiftActive = false;

    player.classList.remove(
      "phantom-shift"
    );

    phantomCooldownEndTime =
      Date.now() + 10000;

  }, 10000);

  /* END COOLDOWN */

  setTimeout(() => {

    phantomCooldown = false;

    phantomReady = true;

    phantomTimer.textContent =
      "READY";

  }, 20000);
}

function activateCelestialSurge() {

  celestialCooldown = true;

  celestialReady = false;

  celestialSurgeActive = true;

  celestialEndTime =
    Date.now() + 10000;

  celestialIndicator.classList.add("active");

  player.classList.add(
    "celestial-surge"
  );

  rollResult.textContent =
    "CELESTIAL SURGE";

  /* COIN MAGNET EFFECT */

  const magnetInterval = setInterval(() => {

    if (!celestialSurgeActive) {

      clearInterval(magnetInterval);

      return;
    }

    coins.forEach((coin) => {

      coin.style.transition =
        "all 0.25s linear";

      coin.style.left =
        `${playerX + 8}px`;

      coin.style.top =
        `${player.offsetTop}px`;
    });

  }, 250);

  /* END ACTIVE */

  setTimeout(() => {

    celestialSurgeActive = false;

    player.classList.remove(
      "celestial-surge"
    );

    celestialCooldownEndTime =
      Date.now() + 10000;

  }, 10000);

  /* END COOLDOWN */

  setTimeout(() => {

    celestialCooldown = false;

    celestialReady = true;

    celestialTimer.textContent =
      "READY";

  }, 20000);
}

/* COLLISION */

function checkCollision(a, b) {

  const ar =
    a.getBoundingClientRect();

  const br =
    b.getBoundingClientRect();

  return !(
    ar.right < br.left ||
    ar.left > br.right ||
    ar.bottom < br.top ||
    ar.top > br.bottom
  );
}

/* GAME OVER */

function handleGameOver() {

  if (!gameRunning) {
    return;
  }

  gameRunning = false;

/* CLEAR ALL ACTIVE POWERUPS */

shieldActive = false;
slowActive = false;
multiplierActive = false;
tripleActive = false;

phantomShiftActive = false;
celestialSurgeActive = false;

phantomCooldown = false;
celestialCooldown = false;
voidBlastCooldown = false;

phantomReady = true;
celestialReady = true;
voidBlastReady = true;

/* RESET EFFECT TIMERS */

shieldEndTime = 0;
slowEndTime = 0;
multiplierEndTime = 0;
tripleEndTime = 0;
voidBlastEndTime = 0;
phantomEndTime = 0;
celestialEndTime = 0;

/* REMOVE INDICATORS */

shieldIndicator.classList.remove("active");
slowIndicator.classList.remove("active");
multiplierIndicator.classList.remove("active");

phantomTimer.textContent = "READY";
celestialTimer.textContent = "READY";
voidTimer.textContent = "READY";

/* CLEAR TIMEOUTS */

clearTimeout(shieldTimeout);
clearTimeout(slowTimeout);
clearTimeout(multiplierTimeout);
clearTimeout(tripleTimeout);

  totalDeaths++;

localStorage.setItem(
  "neonChaosDeaths",
  totalDeaths
);

totalDeathsEl.textContent =
  totalDeaths;

  flash.classList.add("show");

  setTimeout(() => {
    flash.classList.remove("show");
  }, 250);

  finalScoreEl.textContent =
    Math.floor(score);

  if (score > bestScore) {

    bestScore = Math.floor(score);

    localStorage.setItem(
      "neonChaosBest",
      bestScore.toString()
    );
  }

  finalBestScoreEl.textContent =
    bestScore;

  bestScoreEl.textContent =
    bestScore;

  gameOverScreen.classList.add("show");
  saveGame();
}

/* RESTART */

restartBtn.addEventListener("click", () => {
  restartBtn.blur();

  obstacles.forEach((o) => o.remove());
  powerUps.forEach((p) => p.remove());
  coins.forEach((c) => c.remove());

  obstacles = [];
  powerUps = [];
  coins = [];

  score = 0;

  scoreEl.textContent = score;

  speedLevel = 1;

  speedLevelEl.textContent =
    speedLevel;

  spawnInterval = 700;

  lastSpawn = 0;
  lastTime = 0;
  lastPowerUp = 0;
  lastCoin = 0;

  shieldActive = false;
  slowActive = false;
  multiplierActive = false;
  tripleActive = false;

  player.classList.remove(
    "shielded",
    "multiplier"
  );

  gameRunning = true;

  gameOverScreen.classList.remove("show");
  if (equippedSkin === "void") {

  rollResult.textContent =
    "Press SPACE to fire a VOID BLAST";
}

  const rect =
    gameContainer.getBoundingClientRect();

  playerX =
    rect.width / 2
    - player.offsetWidth / 2;

  player.style.left = `${playerX}px`;
});

/* INFO OVERLAY */

const infoBtn =
  document.getElementById("info-btn");

const infoOverlay =
  document.getElementById("info-overlay");

const closeInfoBtn =
  document.getElementById("close-info-btn");

infoBtn.addEventListener("click", () => {

  infoOverlay.classList.add("show");
});

closeInfoBtn.addEventListener("click", () => {

  infoOverlay.classList.remove("show");
});

infoOverlay.addEventListener(
  "click",
  (event) => {

    if (event.target === infoOverlay) {

      infoOverlay.classList.remove("show");
    }
  }
);

/* RESET SYSTEM */

const resetBtn =
  document.getElementById("reset-btn");

const resetOverlay =
  document.getElementById("reset-overlay");

const resetConfirmInput =
  document.getElementById("reset-confirm-input");

const cancelResetBtn =
  document.getElementById("cancel-reset-btn");

const confirmResetBtn =
  document.getElementById("confirm-reset-btn");

function openResetOverlay() {

  resetConfirmInput.value = "";

  resetOverlay.classList.add("show");

  setTimeout(() => {
    resetConfirmInput.focus();
  }, 150);
}

function closeResetOverlay() {

  resetOverlay.classList.remove("show");
}

function performReset() {

  localStorage.removeItem("neonChaosBest");
  localStorage.removeItem("neonChaosCoins");
  localStorage.removeItem("neonChaosSkins");
  localStorage.removeItem("neonChaosSkin");
  localStorage.removeItem("neonChaosDeaths");
  localStorage.removeItem("neonChaosHighestSpeed");
  localStorage.removeItem("neonChaosRolls");
  localStorage.removeItem("neonChaosPlayTime");
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem("voidVerified");
  localStorage.removeItem("phantomVerified");
  localStorage.removeItem("celestialVerified");
  localStorage.removeItem("voidVersion");

  ownedSkins = [];
  equippedSkin = "default";
  bestScore = 0;
  coinCount = 0;
  totalDeaths = 0;
  highestSpeed = 1;
  totalRolls = 0;
  totalPlaySeconds = 0;
  speedLevel = 1;
  score = 0;

  localStorage.setItem(
    "neonChaosSkins",
    JSON.stringify(ownedSkins)
  );

  localStorage.setItem(
    "neonChaosSkin",
    equippedSkin
  );

  bestScoreEl.textContent =
    bestScore;

  coinCountEl.textContent =
    coinCount;

  scoreEl.textContent =
    score;

  speedLevelEl.textContent =
    speedLevel;

  highestSpeedEl.textContent =
    highestSpeed;

  totalDeathsEl.textContent =
    totalDeaths;

  totalRollsEl.textContent =
    totalRolls;

  timePlayedEl.textContent =
    formatPlayTime(totalPlaySeconds);

  applySkin(equippedSkin);

  updateHomeStats();
  location.reload();
}

resetBtn.addEventListener(
  "click",
  openResetOverlay
);

cancelResetBtn.addEventListener(
  "click",
  closeResetOverlay
);

resetOverlay.addEventListener(
  "click",
  (event) => {

    if (event.target === resetOverlay) {
      closeResetOverlay();
    }
  }
);

confirmResetBtn.addEventListener(
  "click",
  () => {

    const value =
      resetConfirmInput.value
      .trim()
      .toUpperCase();

    if (value !== "RESET") {

      resetConfirmInput.value = "";

      resetConfirmInput.placeholder =
        "Type RESET to confirm";

      resetConfirmInput.classList.add(
        "input-error"
      );

      setTimeout(() => {

        resetConfirmInput.classList.remove(
          "input-error"
        );

      }, 500);

      return;
    }

    performReset();
  }
);

resetConfirmInput.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {
      confirmResetBtn.click();
    }
  }
);

/* ROLL FEATURE */

rollBtn.addEventListener("click", () => {

    if (coinCount < 15) {

      rollResult.textContent = 
      "Not enough coins!";
    
      return;
    }

    coinCount -= 15;
    saveGame();

    totalRolls++;

localStorage.setItem(
  "neonChaosRolls",
  totalRolls
);

totalRollsEl.textContent =
  totalRolls;

    localStorage.setItem(
      "neonChaosCoins",
      coinCount
    );

    coinCountEl.textContent =
      coinCount;

      const availableRareSkins = [];

if (!ownsVerifiedRareSkin("void")) {

  availableRareSkins.push({
    skin: "void",
    chance: 0.001
  });
}

if (!ownsVerifiedRareSkin("phantom")) {

  availableRareSkins.push({
    skin: "phantom",
    chance: 0.002
  });
}

if (!ownsVerifiedRareSkin("celestial")) {

  availableRareSkins.push({
    skin: "celestial",
    chance: 0.003
  });
}

let wonSkin = null;

for (const rare of availableRareSkins) {

  if (Math.random() < rare.chance) {

    wonSkin = rare.skin;

    break;
  }
}

if (wonSkin) {

  ownedSkins.push(wonSkin);

  localStorage.setItem(
    "neonChaosSkins",
    JSON.stringify(ownedSkins)
  );

  localStorage.setItem(
    wonSkin + "Verified",
    "true"
  );

  saveGame();

  rollResult.textContent =
    `YOU WON THE ${wonSkin.toUpperCase()} SKIN!`;

  updateSkinButtons();
  updateRollButton();
}

      else {

  rollResult.textContent =
    "Unlucky... Try again next time!";

  setTimeout(() => {

    rollResult.classList.add("roll-fade");

    setTimeout(() => {

      rollResult.textContent =
        "Roll for ultra rare mythical skins...";

      rollResult.classList.remove("roll-fade");

    }, 500);

  }, 1800);
}
  }
);


/* HOME SCREEN */

updateHomeStats();

const bgMusic =
  document.getElementById("bg-music");

let musicEnabled = false;

musicToggleBtn.addEventListener(
  "click",
  () => {

    musicEnabled = !musicEnabled;

    if (musicEnabled) {

      bgMusic.volume = 0.22;

      bgMusic.play();

      musicToggleBtn.textContent =
        "MUSIC: ON";
    }

    else {

      bgMusic.pause();

      musicToggleBtn.textContent =
        "MUSIC: OFF";
    }
  }
);

fullscreenBtn.addEventListener(
  "click",
  async () => {

    try {

      if (!document.fullscreenElement) {

        await document.documentElement.requestFullscreen();
      }

    }

    catch (err) {

      console.log(
        "Fullscreen blocked"
      );
    }
  }
);

startGameBtn.addEventListener(
  "click",
  async () => {

    try {

      if (!document.fullscreenElement) {

        await document.documentElement.requestFullscreen();
      }

    }

    catch (err) {

      console.log("Fullscreen blocked");
    }

    homeScreen.classList.add(
      "fade-out"
    );

    setTimeout(() => {

      homeScreen.style.display =
        "none";

      gameRunning = true;
      pauseOverlay.classList.remove("show");

      if (equippedSkin === "void") {

        rollResult.textContent =
          "Press SPACE to fire VOID BLAST";
      }

    }, 700);
  }
);

function runAntiCheat() {

  if (x93FluxState) {
  lastCoinCount = coinCount;
  lastScore = score;
  return;
}

  /* COIN SPIKE DETECTION */

  const coinIncrease =
    coinCount - lastCoinCount;
if (
  coinIncrease > 35 &&
  !multiplierActive &&
  !tripleActive
)
   {

    triggerCheatDetection(
      "Suspicious coin increase detected."
    );

    return;
  }

  /* IMPOSSIBLE VALUES */

  if (
    coinCount > 1000000 ||
    score > 1000000 ||
    highestSpeed > 999
  ) {

    triggerCheatDetection(
      "Impossible stats detected."
    );

    return;
  }

  rareSkins.forEach((skin) => {

  if (
    ownedSkins.includes(skin) &&
    !hasVerifiedRareSkin(skin)
  ) {

    triggerCheatDetection(
      `Fake rare skin detected: ${skin}`
    );
  }
});

  lastCoinCount = coinCount;
  lastScore = score;
}

let cheatDetected = false;

const triggerCheatDetection = Object.freeze(
  function(reason) {

    if (cheatDetected) {
      return;
    }

    cheatDetected = true;

    /* STOP GAME */

    gameRunning = false;

    /* STOP ALL ARRAYS */

    obstacles.forEach(o => o.remove());
    powerUps.forEach(p => p.remove());
    coins.forEach(c => c.remove());
    moneyBags.forEach(b => b.remove());

    obstacles = [];
    powerUps = [];
    coins = [];
    moneyBags = [];

    /* STOP POWERUPS */

    shieldActive = false;
    slowActive = false;
    multiplierActive = false;
    tripleActive = false;

    clearTimeout(shieldTimeout);
    clearTimeout(slowTimeout);
    clearTimeout(multiplierTimeout);
    clearTimeout(tripleTimeout);

    alert(
      `CHEATING DETECTED\n\n${reason}\n\nSave data reset.`
    );

    localStorage.clear();

    location.reload();
  }
);

/* PAUSE SYSTEM */

pauseBtn.addEventListener("click", () => {

  if (
    gameOverScreen.classList.contains("show")
  ) return;

  paused = !paused;

  if (paused) {
    
  pauseStartTime = Date.now();
  gameRunning = false;

  pauseBtn.innerHTML = "<span>▶</span>";

  gameContainer.classList.add("paused");

} else {

  const pausedDuration =
  Date.now() - pauseStartTime;

/* VOID */

if (voidBlastActive) {
  voidBlastEndTime += pausedDuration;
}

if (voidBlastCooldown) {
  voidBlastCooldownEndTime += pausedDuration;
}

/* PHANTOM */

if (phantomShiftActive) {
  phantomEndTime += pausedDuration;
}

if (phantomCooldown) {
  phantomCooldownEndTime += pausedDuration;
}

/* CELESTIAL */

if (celestialSurgeActive) {
  celestialEndTime += pausedDuration;
}

if (celestialCooldown) {
  celestialCooldownEndTime += pausedDuration;
}

/* POWERUPS */

if (shieldActive) {
  shieldEndTime += pausedDuration;
}

if (slowActive) {
  slowEndTime += pausedDuration;
}

if (multiplierActive) {
  multiplierEndTime += pausedDuration;
}

if (tripleActive) {
  tripleEndTime += pausedDuration;
}

  gameRunning = true;

  pauseBtn.innerHTML = "<span>⏸</span>";

  gameContainer.classList.remove("paused");

  lastTime = performance.now();
}
});

/* HOME BUTTON */

homeBtn.addEventListener(
  "click",
  () => {

    paused = false;

    gameRunning = false;

    pauseBtn.textContent = "⏸";

    gameOverScreen.classList.remove(
      "show"
    );

    homeScreen.style.display =
      "flex";

    homeScreen.classList.remove(
      "fade-out"
    );

    updateHomeStats();
  }
);

/* GAME LOOP */

function gameLoop(timestamp) {

  if (!lastTime) {
    lastTime = timestamp;
  }

  const delta =
  Math.min(timestamp - lastTime, 16.67);

  lastTime = timestamp;

  if (gameRunning && !tabHidden) {
if (
  typeof runAntiCheat !== "function"
) {

  location.reload();
}

if (
  typeof triggerCheatDetection !== "function"
) {

  location.reload();
}

    const now = Date.now();
    runAntiCheat();
    saveGame();

    if (shieldActive) {
      shieldTimer.textContent =
        formatEffectTime(
          shieldEndTime - now
        );
    }

    if (slowActive) {
      slowTimer.textContent =
        formatEffectTime(
          slowEndTime - now
        );
    }

    if (multiplierActive) {
      multiplierTimer.textContent =
        formatEffectTime(
          multiplierEndTime - now
        );
    }

    if (tripleActive) {
      tripleTimer.textContent =
        formatEffectTime(
          tripleEndTime - now
        );
    }

/* VOID INDICATOR */

if (equippedSkin === "void") {

  voidIndicator.classList.add("active");

  if (voidBlastActive) {

    voidTimer.textContent =
      "ACTIVE: " +
      Math.ceil(
        (voidBlastEndTime - now) / 1000
      ) + "s";

  }

  else if (voidBlastCooldown) {

    voidTimer.textContent =
      "COOLING DOWN: " +
      Math.ceil(
        (voidBlastCooldownEndTime - now) / 1000
      ) + "s";

  }

  else {

    voidTimer.textContent =
      "READY";
  }

} else {

  voidIndicator.classList.remove("active");
}

/* PHANTOM INDICATOR */

if (equippedSkin === "phantom") {

  phantomIndicator.classList.add("active");

  if (phantomShiftActive) {

    phantomTimer.textContent =
      "ACTIVE: " +
      Math.ceil(
        (phantomEndTime - now) / 1000
      ) + "s";

  }

  else if (phantomCooldown) {

    phantomTimer.textContent =
      "COOLING DOWN: " +
      Math.ceil(
        (phantomCooldownEndTime - now) / 1000
      ) + "s";

  }

  else {

    phantomTimer.textContent =
      "READY";
  }

} else {

  phantomIndicator.classList.remove("active");
}

/* CELESTIAL INDICATOR */

if (equippedSkin === "celestial") {

  celestialIndicator.classList.add("active");

  if (celestialSurgeActive) {

    celestialTimer.textContent =
      "ACTIVE: " +
      Math.ceil(
        (celestialEndTime - now) / 1000
      ) + "s";

  }

  else if (celestialCooldown) {

    celestialTimer.textContent =
      "COOLING DOWN: " +
      Math.ceil(
        (celestialCooldownEndTime - now) / 1000
      ) + "s";

  }

  else {

    celestialTimer.textContent =
      "READY";
  }

} else {

  celestialIndicator.classList.remove("active");
}

    if (!tripleActive) {
      tripleIndicator.classList.remove("active");
    }

    updatePlayer();
    updateObstacles(delta);
    updatePowerUps(delta);
    updateCoins(delta);
    updateMoneyBags(delta);

    let gain =
      delta * 0.01;

    if (multiplierActive) {
      gain *= 2;
    }

    if (tripleActive) {
      gain *= 3;
    }

    score += gain;
    scoreEl.textContent =
      Math.floor(score);

    if (score > speedLevel * 50) {
      speedLevel++;
      speedLevelEl.textContent =
        speedLevel;

      if (speedLevel > highestSpeed) {
        highestSpeed = speedLevel;
        localStorage.setItem(
          "neonChaosHighestSpeed",
          highestSpeed
        );
        highestSpeedEl.textContent =
          highestSpeed;
      }

      spawnInterval =
        Math.max(
          200,
          spawnInterval - 60
        );
    }

    if (
      timestamp - lastSpawn
      > spawnInterval
    ) {
      spawnObstacle();
      lastSpawn = timestamp;
    }

    if (
      timestamp - lastPowerUp
      > powerUpInterval
    ) {
      spawnPowerUp();
      lastPowerUp = timestamp;
    }

    const currentCoinInterval =
        celestialSurgeActive
          ? coinInterval / 3
          : coinInterval;

      if (
        timestamp - lastCoin
        > currentCoinInterval
      ) {
      spawnCoin();

      if (equippedSkin === "void") {
        voidIndicator.classList.add("active");

        if (voidBlastCooldown) {
          const remaining =
            Math.max(
              0,
              ((voidBlastEndTime - Date.now()) / 1000)
            );

          voidTimer.textContent =
            `${remaining.toFixed(1)}s`;
        } else {
          voidTimer.textContent =
            "READY";
        }
      } else {
        voidIndicator.classList.remove("active");
      }

      if (Math.random() < 0.05) {
        spawnMoneyBag();
      }

      lastCoin = timestamp;
    }
  }

  requestAnimationFrame(gameLoop);
}

/* PLAY TIME TRACKER */

setInterval(() => {

  if (gameRunning) {

    totalPlaySeconds++;

    localStorage.setItem(
      "neonChaosPlayTime",
      totalPlaySeconds
    );

    timePlayedEl.textContent =
      formatPlayTime(totalPlaySeconds);
  }

}, 1000);

/* AUTO FULLSCREEN */

window.addEventListener("load", async () => {

  try {

    if (!document.fullscreenElement) {

      await document.documentElement.requestFullscreen();
    }

  }

  catch (err) {

    console.log(
      "Fullscreen blocked until user interaction."
    );
  }
});

/* INIT */

window.addEventListener("load", () => {

  const rect =
    gameContainer.getBoundingClientRect();

  playerX =
    rect.width / 2
    - player.offsetWidth / 2;

  player.style.left = `${playerX}px`;

  lastCoin = performance.now();
  lastPowerUp = performance.now();
  lastSpawn = performance.now();

  requestAnimationFrame(gameLoop);
});
})();