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
const shieldIndicator = document.getElementById("shield-indicator");
const slowIndicator = document.getElementById("slow-indicator");
const multiplierIndicator = document.getElementById("multiplier-indicator");
const shieldTimer = document.getElementById("shield-timer");
const slowTimer = document.getElementById("slow-timer");
const multiplierTimer = document.getElementById("multiplier-timer");
const voidIndicator = document.getElementById("void-indicator");
const voidTimer = document.getElementById("void-timer");
const phantomIndicator = document.getElementById("phantom-indicator");
const phantomTimer = document.getElementById("phantom-timer");
const celestialIndicator = document.getElementById("celestial-indicator");
const celestialTimer = document.getElementById("celestial-timer");
const tripleIndicator = document.getElementById("triple-indicator");
const tripleTimer = document.getElementById("triple-timer");
const homeScreen = document.getElementById("home-screen");
const startGameBtn = document.getElementById("start-game-btn");
const homeBestScore = document.getElementById("home-best-score");
const homeCoins = document.getElementById("home-coins");
const homeHighestSpeed = document.getElementById("home-highest-speed");
const musicToggleBtn = document.getElementById("music-toggle-btn");
const musicToggleLabel = document.querySelector("#music-toggle-btn .music-toggle-label");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const pauseBtn = document.getElementById("pause-btn");
const homeBtn = document.getElementById("home-btn");
const pauseOverlay = document.getElementById("pause-overlay") || {classList: {add: () => {},remove: () => {}}};
const gameAchievementsBtn = document.getElementById("game-achievements-btn");
const sidebarAchievementsBtn = document.getElementById("achievements-btn");
const gameplayAchievementsBtn = document.getElementById("gameplay-achievements-btn");
const achievementsOverlay = document.getElementById("achievements-overlay");
const achievementsList = document.getElementById("achievements-list");
const achievementCompletion = document.getElementById("achievement-progress-text");
const closeAchievementsBtn = document.getElementById("close-achievements-btn");
const settingsBtn = document.getElementById("settings-btn");
const settingsOverlay = document.getElementById("settings-overlay");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const musicVolumeSlider = document.getElementById("music-volume");
const sfxVolumeSlider = document.getElementById("sfx-volume");
const graphicsModeSelect = document.getElementById("graphics-mode");

let musicVolume = 0.22;
let sfxVolume = 0.75;
let graphicsMode = "high";

settingsBtn?.addEventListener("click", () => {
  settingsOverlay?.classList.add("show");
});

closeSettingsBtn?.addEventListener("click", () => {
  settingsOverlay?.classList.remove("show");
});

settingsOverlay?.addEventListener("click", (event) => {
  if (event.target === settingsOverlay) {
    settingsOverlay.classList.remove("show");
  }
});

if (musicVolumeSlider) {
  musicVolumeSlider.value = String(musicVolume);
  musicVolumeSlider.addEventListener("input", (event) => {
    musicVolume = Number(event.target.value);
    bgMusic.volume = musicVolume;
  });
}

if (sfxVolumeSlider) {
  sfxVolumeSlider.value = String(sfxVolume);
  sfxVolumeSlider.addEventListener("input", (event) => {
    sfxVolume = Number(event.target.value);
  });
}

if (graphicsModeSelect) {
  graphicsModeSelect.value = graphicsMode;
  graphicsModeSelect.addEventListener("change", (event) => {
    graphicsMode = event.target.value;
    document.body.dataset.graphicsMode = graphicsMode;
  });
}


let playerX = 0;
let playerSpeed = 8;

let keys = {};

let obstacles = [];
let powerUps = [];
let coins = [];
let moneyBags = [];

let achievementQueue = [];
let achievementShowing = false;

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
let chaosMode = false;

/* x93 FluxState SYSTEM */

let x93FluxState = false;
let devMode = false;

let shiftHeldTime = 0;
let escPresses = 0;
let escTimer = null;
let devHoldReady = false;
let devReadyTimer = null;

const DEV_HOLD_MS = 1200;

let spawnInterval = 700;
let lastSpawn = 0;
let lastTime = 0;

let speedLevel = 1;

let powerUpInterval = 6000;
let lastPowerUp = 0;

let coinInterval = 2500;
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

let slowEndTime = 0;
let multiplierEndTime = 0;
let shieldStacks = 0;

let slowTimeout = null;
let multiplierTimeout = null;

let shieldActive = false;
let slowActive = false;
let multiplierActive = false;

let tripleEndTime = 0;
let tripleTimeout = null;
let tripleActive = false;

/* ACHIEVEMENT TRACKING */
let lastPlayerXPosition = 0;
let lastHorizontalMoveTime = Date.now();
let lastHitTime = 0;
let shieldDamageTaken = false;
let narrowEscapeCount = 0;

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

let unlockedAchievements = JSON.parse(
  localStorage.getItem(
    "neonChaosAchievements"
  ) || "[]"
);

let usedPowerups = JSON.parse(
  localStorage.getItem(
    "neonChaosUsedPowerups"
  ) || "[]"
);

const achievements = [

{
  id: "first_death",
  title: "First Death",
  desc: "Die for the first time",
  reward: 15
},

{
  id: "speed_5",
  title: "Speed Runner I",
  desc: "Reach Speed 5",
  reward: 18
},

{
  id: "coins_50",
  title: "Coin Collector I",
  desc: "Collect 50 Coins",
  reward: 20
},

{
  id: "survive_1",
  title: "Still Standing",
  desc: "Survive 1 Minute",
  reward: 25
},

{
  id: "speed_15",
  title: "Speed Runner II",
  desc: "Reach Speed 15",
  reward: 40
},

{
  id: "coins_500",
  title: "Coin Collector II",
  desc: "Collect 500 Coins",
  reward: 60
},

{
  id: "roll_25",
  title: "Lucky Spinner",
  desc: "Roll 25 Times",
  reward: 50
},

{
  id: "all_powerups",
  title: "Power Master",
  desc: "Use Every Powerup",
  reward: 75
},

{
  id: "speed_20",
  title: "Extreme",
  desc: "Reach Speed 20",
  reward: 90
},

{
  id: "speed_30",
  title: "Beyond Human",
  desc: "Reach Speed 30",
  reward: 150
},

{
  id: "score_1000",
  title: "Champion",
  desc: "Reach Score 1000",
  reward: 125
},

{
  id: "rare_skin",
  title: "Mythical Luck",
  desc: "Win a Rare Skin",
  reward: 125
},

{
  id: "survive_5",
  title: "Unbreakable",
  desc: "Survive 5 Minutes",
  reward: 200
},

{
  id: "coins_10000",
  title: "Wealth God",
  desc: "Collect 10000 Coins",
  reward: 350
},

{
  id: "perfect_dodger",
  title: "Perfect Dodger",
  desc: "Survive 30 seconds without moving left or right",
  reward: 35
},

{
  id: "thread_needle",
  title: "Thread the Needle",
  desc: "Pass between two obstacles with less than 10px clearance",
  reward: 40
},

{
  id: "clutch_save",
  title: "Clutch Save",
  desc: "Activate a powerup within 0.2 seconds of being hit",
  reward: 50
},

{
  id: "zero_damage_run",
  title: "Zero Damage Run",
  desc: "Reach Speed 10 without taking shield damage",
  reward: 60
},

{
  id: "hidden",
  title: "???",
  desc: "Unlock condition unknown",
  reward: 300,
  hidden: true
}

];

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
// SAFETY FIX: Ensure rare skins are always verified if owned
["void", "phantom", "celestial"].forEach(skin => {
  if (ownedSkins.includes(skin)) {
    localStorage.setItem(`${skin}Verified`, "true");
  }
});

lastCoinCount = coinCount;
lastScore = score;

bestScoreEl.textContent = bestScore;
coinCountEl.textContent = coinCount;
totalDeathsEl.textContent = totalDeaths;
highestSpeedEl.textContent = highestSpeed;
totalRollsEl.textContent = totalRolls;
timePlayedEl.textContent = totalPlaySeconds;
updateAchievementBadge();

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

  if (
    e.key === "Shift" ||
    e.key === "ShiftLeft" ||
    e.key === "ShiftRight"
  ) {

    if (shiftHeldTime === 0) {

      shiftHeldTime = Date.now();
      devHoldReady = false;
      clearTimeout(devReadyTimer);
    }
  }

  if (
    shiftHeldTime !== 0 &&
    !devHoldReady &&
    Date.now() - shiftHeldTime >= DEV_HOLD_MS
  ) {

    devHoldReady = true;
    devReadyTimer = setTimeout(() => {
      devHoldReady = false;
    }, 5000);
  }

  /* DOUBLE ESC */

  if (
    e.key === "Escape" ||
    e.key === "Esc" ||
    e.code === "Escape" ||
    e.keyCode === 27
  ) {

    if (devHoldReady) {

      escPresses++;

      clearTimeout(escTimer);

      escTimer = setTimeout(() => {

        escPresses = 0;

      }, 1000);

      if (escPresses >= 2) {

        x93FluxState = !x93FluxState;
        devMode = x93FluxState;

        escPresses = 0;

        rollResult.textContent =
          x93FluxState
            ? "⚡ DEV MODE ENABLED"
            : "DEV MODE DISABLED";
      }
    }
    else {
      // do nothing when not ready yet
    }
  }
});

window.addEventListener("keyup", (e) => {

  if (
    e.key === "Shift" ||
    e.key === "ShiftLeft" ||
    e.key === "ShiftRight"
  ) {

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

    renderAchievements();

  });

});

/* HIDDEN SYSTEM FUNCTIONS */

function fluxCoins(amount) {

  if (!x93FluxState) return;

  coinCount += amount;
  checkAchievements();

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

function unlockAchievement(id) {
  if (unlockedAchievements.includes(id)) return;

  unlockedAchievements.push(id);

  localStorage.setItem(
    "neonChaosAchievements",
    JSON.stringify(unlockedAchievements)
  );

  const achievement = achievements.find(a => a.id === id);
  if (!achievement) return;

  // SHOW POPUP OF UNLOCKED ACHIEVEMENT
  showAchievementPopup(achievement.title, achievement.reward);

  renderAchievements();
  updateAchievementBadge();
}

function resetAchievements() {
  localStorage.removeItem("neonChaosAchievements");

  achievements.forEach(a => {
    localStorage.removeItem("claim_" + a.id);
  });

  unlockedAchievements = [];

  renderAchievements();
  updateAchievementBadge();
}

/* ACHIEVEMENTS */

function checkAchievements() {

  if (totalDeaths >= 1) {
    unlockAchievement("first_death");
  }

  if (highestSpeed >= 5) {
    unlockAchievement("speed_5");
  }

  if (highestSpeed >= 15) {
    unlockAchievement("speed_15");
  }

  if (highestSpeed >= 20) {
    unlockAchievement("speed_20");
  }

  if (highestSpeed >= 30) {
    unlockAchievement("speed_30");
  }

  if (coinCount >= 50) {
    unlockAchievement("coins_50");
  }

  if (coinCount >= 500) {
    unlockAchievement("coins_500");
  }

  if (coinCount >= 10000) {
    unlockAchievement("coins_10000");
  }

  if (totalRolls >= 25) {
    unlockAchievement("roll_25");
  }

  if (
    score >= 1000 ||
    bestScore >= 1000
  ) {
    unlockAchievement("score_1000");
  }

  if (totalPlaySeconds >= 60) {
    unlockAchievement("survive_1");
  }

  if (totalPlaySeconds >= 300) {
    unlockAchievement("survive_5");
  }

  if (
    ownsVerifiedRareSkin("void") ||
    ownsVerifiedRareSkin("phantom") ||
    ownsVerifiedRareSkin("celestial")
  ) {

    unlockAchievement("rare_skin");
  }

  const allPowerups =
    [
      "shield",
      "slow",
      "multiplier",
      "triple"
    ];

  const usedAll =
    allPowerups.every(
      p => usedPowerups.includes(p)
    );

  if (usedAll) {
    unlockAchievement("all_powerups");
  }

  if (
    highestSpeed >= 25 &&
    score >= 2500
  ) {

    unlockAchievement("hidden");
  }

  if ((Date.now() - lastHorizontalMoveTime) >= 30000 && gameRunning) {
    unlockAchievement("perfect_dodger");
  }

  if (highestSpeed >= 10 && !shieldDamageTaken) {
    unlockAchievement("zero_damage_run");
  }

  if ((Date.now() - lastHitTime) <= 200 && lastHitTime > 0) {
    unlockAchievement("clutch_save");
  }
}

function renderAchievements() {
  achievementsList.innerHTML = "";

  // Sort achievements: unlocked not claimed → locked → claimed
  const sorted = achievements.sort((a, b) => {
    const aUnlocked = unlockedAchievements.includes(a.id);
    const bUnlocked = unlockedAchievements.includes(b.id);
    const aClaimed = localStorage.getItem("claim_" + a.id) === "true";
    const bClaimed = localStorage.getItem("claim_" + b.id) === "true";

    // Unlocked not claimed (priority 1)
    if (aUnlocked && !aClaimed && !(bUnlocked && !bClaimed)) return -1;
    if (!(aUnlocked && !aClaimed) && bUnlocked && !bClaimed) return 1;

    // Locked (priority 2)
    if (!aUnlocked && bUnlocked) return -1;
    if (aUnlocked && !bUnlocked) return 1;

    // Claimed (priority 3)
    if (aClaimed && !bClaimed) return 1;
    if (!aClaimed && bClaimed) return -1;

    return 0;
  });

  sorted.forEach((a) => {
    const unlocked = unlockedAchievements.includes(a.id);
    const claimed = localStorage.getItem("claim_" + a.id) === "true";

    const card = document.createElement("div");
    card.className = "achievement";

    if (!unlocked) card.classList.add("locked");
    if (claimed) card.classList.add("claimed");

    card.innerHTML = `
    <div class="achievement-left">
      <div class="achievement-lock"></div>

      <div class="achievement-text">
        <div class="achievement-title">
          ${unlocked || !a.hidden ? a.title : "???"}
        </div>

        <div class="achievement-desc">
          ${unlocked || !a.hidden ? a.desc : "Unlock condition unknown"}
        </div>
      </div>
    </div>

    <div class="achievement-right">
      <div class="achievement-reward-text">+${a.reward}</div>

      <button class="claim-btn" ${unlocked && !claimed ? "" : "disabled"}>
        ${claimed ? "CLAIMED" : "CLAIM"}
      </button>
    </div>
  `;

    const claimBtn = card.querySelector(".claim-btn");

    if (unlocked && !claimed) {
      claimBtn.addEventListener("click", () => {
        coinCount += a.reward;
        coinCountEl.textContent = coinCount;

        localStorage.setItem("claim_" + a.id, "true");
        saveGame();
        renderAchievements();
        updateAchievementBadge();
      });
    }

    achievementsList.appendChild(card);
  });

  const completion = Math.floor((unlockedAchievements.length / achievements.length) * 100);
  achievementCompletion.textContent = `${completion}% COMPLETE`;

  // progress bar fill
  const fill = document.getElementById("achievement-progress-fill");
  fill.style.width = completion + "%";
  updateAchievementBadge();
}

/*ACHIEVEMENT BADGE UPDATE*/

function updateAchievementBadge() {
  const badge = document.getElementById("achievement-badge");

  // Count achievements that are unlocked but not claimed
  const unclaimed = achievements.filter(a =>
    unlockedAchievements.includes(a.id) &&
    !localStorage.getItem("claim_" + a.id)
  ).length;

  if (unclaimed > 0) {
    badge.textContent = unclaimed;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}


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

  const playerWidth =
    player.offsetWidth;

  if (keys["arrowleft"] || keys["a"]) {
    playerX -= playerSpeed;
    lastHorizontalMoveTime = Date.now();
  }

  if (keys["arrowright"] || keys["d"]) {
    playerX += playerSpeed;
    lastHorizontalMoveTime = Date.now();
  }

  /* HARD LIMITS */

  const leftPadding = 12;

  if (playerX < leftPadding) {
    playerX = leftPadding;
  }

  if (playerX > rect.width - playerWidth) {
    playerX = rect.width - playerWidth;
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

  const height = gameContainer.offsetHeight;

  for (let i = obstacles.length - 1; i >= 0; i--) {

    const o = obstacles[i];

    // BASE SPEED
    const baseSpeed = parseFloat(o.dataset.speed) || 0;

    // CHAOS MODE MULTIPLIER
    const finalSpeed = chaosMode ? baseSpeed * 2 : baseSpeed;

    // MOVEMENT
    const top =
      (parseFloat(o.style.top || "-40") || -40)
      + finalSpeed * (delta / 16.67);

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

      if (shieldStacks > 0) {
        shieldStacks--;
        shieldDamageTaken = true;
        lastHitTime = Date.now();
        updateShieldIndicator();

        if (shieldStacks === 0) {
          shieldActive = false;
        }

        o.remove();
        obstacles.splice(i, 1);
        continue;
      }

      if (equippedSkin === "void") {
        const voidSaveChance = Math.random();
        if (voidSaveChance < 0.2) {
          o.remove();
          obstacles.splice(i, 1);
          rollResult.textContent = "VOID GOD consumed an obstacle!";
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

  const height = gameContainer.offsetHeight;

  for (let i = moneyBags.length - 1; i >= 0; i--) {

    const bag = moneyBags[i];

    // BASE MONEY BAG SPEED
    const bagSpeed = parseFloat(bag.dataset.speed) || 1.4;

    // MOVEMENT
    const top =
      (parseFloat(bag.style.top || "-40") || -40)
      + bagSpeed * (delta / 16.67);

    bag.style.top = `${top}px`;

    if (top > height + 50) {
      bag.remove();
      moneyBags.splice(i, 1);
      continue;
    }

    if (checkCollision(player, bag)) {

      const reward = Math.floor(Math.random() * 18) + 8;

      coinCount += reward;
      saveGame();

      localStorage.setItem("neonChaosCoins", coinCount.toString());
      coinCountEl.textContent = coinCount;

      rollResult.textContent = `+${reward} BONUS COINS!`;

      bag.remove();
      moneyBags.splice(i, 1);
    }
  }
}

function updateCoins(delta) {

  const height = gameContainer.offsetHeight;

  for (let i = coins.length - 1; i >= 0; i--) {

    const c = coins[i];

    // BASE COIN SPEED
    const coinSpeed = parseFloat(c.dataset.speed) || 1.2;

    // MOVEMENT
    const top =
      (parseFloat(c.style.top || "-40") || -40)
      + coinSpeed * (delta / 16.67);

    c.style.top = `${top}px`;

    if (top > height + 50) {
      c.remove();
      coins.splice(i, 1);
      continue;
    }

    if (checkCollision(player, c)) {

      let reward = 1;

      if (multiplierActive) reward *= 2;
      if (tripleActive) reward *= 3;

      coinCount += reward;
      saveGame();

      localStorage.setItem("neonChaosCoins", coinCount.toString());
      coinCountEl.textContent = coinCount;

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

function updateShieldIndicator() {
  const indicator = document.getElementById("shield-indicator");
  const timer = document.getElementById("shield-timer");

  if (shieldStacks > 0) {
    indicator.classList.add("active");
    timer.textContent = `${shieldStacks} LEFT`;
  } else {
    indicator.classList.remove("active");
    timer.textContent = "";
  }

  if (shieldStacks === 0) {
    timer.textContent = "";
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

  // Check for Clutch Save achievement
  if (lastHitTime > 0 && (now - lastHitTime) <= 200) {
    unlockAchievement("clutch_save");
  }

  if (!usedPowerups.includes(type)) {

  usedPowerups.push(type);
  checkAchievements();

  localStorage.setItem(
    "neonChaosUsedPowerups",
    JSON.stringify(usedPowerups)
  );
}

/* SHIELD — STACK SYSTEM */

if (type === "shield") {

  shieldStacks++;          // add one shield
  shieldActive = true;     // shields are available

  updateShieldIndicator(); // update UI
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

  let magnetInterval = setInterval(() => {

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

    clearInterval(magnetInterval);

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
tripleIndicator.classList.remove("active");

phantomTimer.textContent = "READY";
celestialTimer.textContent = "READY";
voidTimer.textContent = "READY";

/* CLEAR TIMEOUTS */

clearTimeout(slowTimeout);
clearTimeout(multiplierTimeout);
clearTimeout(tripleTimeout);

  totalDeaths++;
  checkAchievements();

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
  moneyBags.forEach((b) => b.remove());

  obstacles = [];
  powerUps = [];
  coins = [];
  moneyBags = [];

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
  voidBlastCooldown = false;
  phantomCooldown = false;
  celestialCooldown = false;

  voidBlastActive = false;
  phantomShiftActive = false;
  celestialSurgeActive = false;

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

const homeHelpBtn =
  document.getElementById("home-help-btn");

const infoOverlay =
  document.getElementById("info-overlay");

const devOverlay =
  document.getElementById("dev-overlay");

const closeInfoBtn =
  document.getElementById("close-info-btn");

const closeDevBtn =
  document.getElementById("close-dev-btn");

function openInfoOverlay() {
  infoOverlay.classList.add("show");
}

function openDevOverlay() {
  if (!devOverlay) return;
  devOverlay.classList.add("show");
}

if (infoBtn) {
  infoBtn.addEventListener("click", openInfoOverlay);
}

if (homeHelpBtn) {
  homeHelpBtn.addEventListener("click", openDevOverlay);
}

closeInfoBtn.addEventListener("click", () => {
  infoOverlay.classList.remove("show");
});

if (closeDevBtn) {
  closeDevBtn.addEventListener("click", () => {
    devOverlay.classList.remove("show");
  });
}

infoOverlay.addEventListener(
  "click",
  (event) => {

    if (event.target === infoOverlay) {

      infoOverlay.classList.remove("show");
    }
  }
);

if (devOverlay) {
  devOverlay.addEventListener("click", (event) => {
    if (event.target === devOverlay) {
      devOverlay.classList.remove("show");
    }
  });
}

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
  localStorage.removeItem("neonChaosAchievements");
  localStorage.removeItem("claim_first_death");
  localStorage.removeItem("claim_speed_5");
  localStorage.removeItem("claim_speed_15");
  localStorage.removeItem("claim_speed_20");
  localStorage.removeItem("claim_speed_30");
  localStorage.removeItem("claim_coins_50");
  localStorage.removeItem("claim_coins_500");
  localStorage.removeItem("claim_coins_10000");
  localStorage.removeItem("claim_roll_25");
  localStorage.removeItem("claim_score_1000");
  localStorage.removeItem("claim_survive_1");
  localStorage.removeItem("claim_survive_5");
  localStorage.removeItem("claim_rare_skin");
  localStorage.removeItem("claim_all_powerups");
  localStorage.removeItem("claim_hidden");
  localStorage.removeItem("claim_perfect_dodger");
  localStorage.removeItem("claim_zero_damage_run");
  localStorage.removeItem("claim_clutch_save");
  localStorage.removeItem("neonChaosUsedPowerups");

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

if (resetBtn) {

  resetBtn.addEventListener(
    "click",
    openResetOverlay
  );

}

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
    checkAchievements();


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

  if (!ownedSkins.includes(wonSkin)) {
  ownedSkins.push(wonSkin);
}

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

    rollResult.classList.remove("roll-fade");
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

let contextSkin = null;
const menu = document.getElementById("skin-context-menu");
const removeOption = document.getElementById("remove-skin-option");

// Right-click on skin
document.querySelectorAll(".skin").forEach(skinEl => {
  skinEl.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    contextSkin = skinEl.dataset.skin;

    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
    menu.style.display = "block";
  });
});

// Click outside closes menu
document.addEventListener("click", () => {
  menu.style.display = "none";
});

// Remove skin
removeOption.addEventListener("click", () => {
  if (!contextSkin) return;

  // Remove from owned list
  ownedSkins = ownedSkins.filter(s => s !== contextSkin);
  localStorage.setItem("neonChaosSkins", JSON.stringify(ownedSkins));

  // Remove verification flags for rare skins
  if (["void", "phantom", "celestial"].includes(contextSkin)) {
    localStorage.removeItem(contextSkin + "Verified");
  }

  // If equipped, reset to default
  if (equippedSkin === contextSkin) {
    equippedSkin = "default";
    localStorage.setItem("neonChaosSkin", "default");
  }

  saveGame();
  updateSkinButtons();
  applySkin(equippedSkin);

  menu.style.display = "none";
});

/* MUSIC SYSTEM — MULTIPLE TRACKS + DEFAULT ON */

const soundtracks = [
  "assets/music/All I Need.mp3",
  "assets/music/Nevada.mp3"
];

let currentTrackIndex = 0;
let musicEnabled = true;

let bgMusic = new Audio(soundtracks[currentTrackIndex]);
bgMusic.loop = true;
bgMusic.volume = 0.22;
bgMusic.autoplay = true;

function tryPlayBackgroundMusic() {
  bgMusic.muted = false;
  return bgMusic.play().catch(() => {
    return Promise.reject();
  });
}

function enableAutoplayOnInteraction() {
  const resumeAudio = () => {
    bgMusic.muted = false;
    bgMusic.play().catch(() => {
      // Still blocked, but user interaction has been attempted.
    });
  };

  window.addEventListener("click", resumeAudio, { once: true, capture: true });
  window.addEventListener("keydown", resumeAudio, { once: true, capture: true });
  window.addEventListener("touchstart", resumeAudio, { once: true, capture: true });
}

/* AUTO-PLAY ON LOAD */
window.addEventListener("load", () => {
  bgMusic.volume = 0.22;
  tryPlayBackgroundMusic().catch(() => {
    enableAutoplayOnInteraction();
  });
  if (musicToggleLabel) {
    musicToggleLabel.textContent = "MUSIC: ON";
  }
});

const nextTrackBtn = document.getElementById("next-track-btn");

nextTrackBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  currentTrackIndex = (currentTrackIndex + 1) % soundtracks.length;

  bgMusic.src = soundtracks[currentTrackIndex];

  if (musicEnabled) {
    bgMusic.play();
  }
});


/* MUSIC TOGGLE */
musicToggleBtn.addEventListener("click", () => {
  musicEnabled = !musicEnabled;

  if (musicEnabled) {
    bgMusic.volume = 0.22;
    bgMusic.play();
    if (musicToggleLabel) {
      musicToggleLabel.textContent = "MUSIC: ON";
    }
  } else {
    bgMusic.pause();
    if (musicToggleLabel) {
      musicToggleLabel.textContent = "MUSIC: OFF";
    }
  }
});

/* SETTINGS OPTIONS */

const sensitivitySlider = document.getElementById("game-sensitivity");

if (sensitivitySlider) {
  sensitivitySlider.value = playerSpeed; // sync slider with current speed
  sensitivitySlider.addEventListener("input", (event) => {
    playerSpeed = Number(event.target.value);
  });
}

const chaosToggle = document.getElementById("chaos-mode");

if (chaosToggle) {
  chaosToggle.addEventListener("change", () => {
    chaosMode = chaosToggle.checked;
  });
}

/* HOME SCREEN */

updateHomeStats();

fullscreenBtn.addEventListener(
  "click",
  async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        fullscreenBtn.textContent = "⚡ EXIT FULLSCREEN ⚡";
      } else {
        await document.exitFullscreen();
        fullscreenBtn.textContent = "⚡ ENTER FULLSCREEN ⚡";
      }
    } catch (err) {
      console.log("Fullscreen error:", err);
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
  coinIncrease > 500 &&
  !x93FluxState
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

if (pauseBtn) {

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

    } 
    
    else {

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

}

/* ACHIEVEMENT POPUP */

function showAchievementPopup(title, reward) {

  achievementQueue.push({
    title,
    reward
  });

  processAchievementQueue();
}

function processAchievementQueue() {

  if (achievementShowing) return;
  if (achievementQueue.length === 0) return;

  achievementShowing = true;

  const popup = document.getElementById("achievement-popup");
  const titleEl = document.getElementById("achievement-popup-title");
  const rewardEl = document.getElementById("achievement-popup-reward");

  const achievement = achievementQueue.shift();

titleEl.textContent = `${achievement.title} Unlocked`;
rewardEl.textContent = `+${achievement.reward} Coins Available`;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");

    setTimeout(() => {
      achievementShowing = false;
      processAchievementQueue();
      updateAchievementBadge();

    }, 300);

  }, 3000);
}

/* ACHIEVEMENTS OVERLAY */

function openAchievements() {
  if (!achievementsOverlay) return;
  achievementsOverlay.classList.add("show");
  renderAchievements();
}

if (gameAchievementsBtn) {
  gameAchievementsBtn.addEventListener(
    "click",
    openAchievements
  );
}

if (sidebarAchievementsBtn) {
  sidebarAchievementsBtn.addEventListener(
    "click",
    openAchievements
  );
}

if (gameplayAchievementsBtn) {
  gameplayAchievementsBtn.addEventListener(
    "click",
    openAchievements
  );
}

if (closeAchievementsBtn) {

  closeAchievementsBtn.addEventListener(
    "click",
    () => {

      achievementsOverlay.classList.remove(
        "show"
      );
    }
  );

}

achievementsOverlay.addEventListener(
  "click",
  (event) => {

    if (
      event.target === achievementsOverlay
    ) {

      achievementsOverlay.classList.remove(
        "show"
      );
    }
  }
);

/* HOME BUTTON */

if (homeBtn) {

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

}

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
    checkAchievements();
    saveGame();

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

    let gain = delta * (chaosMode ? 0.02 : 0.01);

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
      checkAchievements();
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

    if (timestamp - lastSpawn > (chaosMode ? spawnInterval * 0.5 : spawnInterval)) {
      spawnObstacle();
      lastSpawn = timestamp;
    }

    if (timestamp - lastPowerUp > (chaosMode ? powerUpInterval * 0.7 : powerUpInterval)) {
      spawnPowerUp();
      lastPowerUp = timestamp;
    }

    const currentCoinInterval =
        (equippedSkin === "celestial" && celestialSurgeActive)
          ? 1000   // 1000 = 1s
          : coinInterval;


      if (timestamp - lastCoin > (chaosMode ? currentCoinInterval * 0.7 : currentCoinInterval)) {
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
    checkAchievements();

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