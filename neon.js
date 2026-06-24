(() => {
function getSafe(id) {
  const el = document.getElementById(id);
  if (el) return el;
  return {
    textContent: "",
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    style: {},
  };
}
const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const playerWrap = document.getElementById("player-wrap");
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
const shieldStatus = getSafe("shield-status");
const slowStatus = getSafe("slow-status");
const multiplierStatus = getSafe("multiplier-status");
const shieldIndicator = getSafe("shield-indicator");
const slowIndicator = getSafe("slow-indicator");
const multiplierIndicator = getSafe("multiplier-indicator");
const shieldTimer = getSafe("shield-timer");
const slowTimer = getSafe("slow-timer");
const multiplierTimer = getSafe("multiplier-timer");
const voidIndicator = getSafe("void-indicator");
const voidTimer = getSafe("void-timer");
const phantomIndicator = getSafe("phantom-indicator");
const phantomTimer = getSafe("phantom-timer");
const celestialIndicator = getSafe("celestial-indicator");
const celestialTimer = getSafe("celestial-timer");
const tripleIndicator = getSafe("triple-indicator");
const tripleTimer = getSafe("triple-timer");
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
const themeMenu = document.getElementById("theme-menu");
const themeBtn = document.getElementById("theme-btn");
const closeThemeMenu = document.getElementById("close-theme-menu");
const prestigeOverlay = document.getElementById("prestige-overlay");
const prestigeConfirmBtn = document.getElementById("prestige-confirm-btn");
const prestigeCloseBtn = document.getElementById("prestige-close-btn");
const prestigeConfirmInput = document.getElementById("prestige-confirm-input");
const prestigeBtn = document.getElementById("prestige-btn");
const prestigeShopBtn = document.getElementById("prestige-shop-btn");
const prestigeShopOverlay = document.getElementById("prestige-shop-overlay");
const prestigeShopTokensEl = document.getElementById("prestige-shop-tokens");
const prestigeShopList = document.getElementById("prestige-shop-list");
const prestigeShopBackBtn = document.getElementById("prestige-shop-back-btn");
const prestigeShopCloseBtn = document.getElementById("prestige-shop-close-btn");


let musicVolume = 0.22;
let sfxVolume = 0.75;
let graphicsMode = "high";

prestigeBtn?.addEventListener("click", () => {
  updatePrestigeRequirementsUI();
  prestigeOverlay.classList.add("show");
});

prestigeShopBtn?.addEventListener("click", () => {
  prestigeOverlay.classList.remove("show");
  openPrestigeShopOverlay();
});

prestigeCloseBtn?.addEventListener("click", () => {
  prestigeOverlay.classList.remove("show");
});

prestigeShopBackBtn?.addEventListener("click", () => {
  closePrestigeShopOverlay();
  prestigeOverlay.classList.add("show");
});

prestigeShopCloseBtn?.addEventListener("click", () => {
  closePrestigeShopOverlay();
});

prestigeShopOverlay?.addEventListener("click", (event) => {
  if (event.target === prestigeShopOverlay) {
    closePrestigeShopOverlay();
  }
});

function updatePrestigeRequirementsUI() {
  const allSkinsUnlocked =
    ownedSkins.length >= 10 &&
    ["void","phantom","celestial"].every(s => localStorage.getItem(`${s}Verified`) === "true");

  const hasEnoughCoins = coinCount >= 1000;
  const typed = (document.getElementById("prestige-confirm-input")?.value || "") === "PRESTIGE";

  const reqSkins = document.getElementById("req-skins");
  const reqCoins = document.getElementById("req-coins");
  const reqType  = document.getElementById("req-type");
  const statusSkins = document.getElementById("req-skins-status");
  const statusCoins = document.getElementById("req-coins-status");
  const statusType  = document.getElementById("req-type-status");

  if (reqSkins) reqSkins.classList.toggle("req-met", allSkinsUnlocked);
  if (reqCoins) reqCoins.classList.toggle("req-met", hasEnoughCoins);
  if (reqType)  reqType.classList.toggle("req-met", typed);

  if (statusSkins) statusSkins.textContent = allSkinsUnlocked ? "✓" : "✗";
  if (statusCoins) statusCoins.textContent = hasEnoughCoins  ? "✓" : "✗";
  if (statusType)  statusType.textContent  = typed           ? "✓" : "✗";
}

document.getElementById("prestige-confirm-input")?.addEventListener("input", updatePrestigeRequirementsUI);

prestigeConfirmBtn?.addEventListener("click", () => {

  // REQUIREMENT 1 — All skins unlocked
  const allSkinsUnlocked =
    ownedSkins.length >= 10 &&
    ["void","phantom","celestial"].every(s => localStorage.getItem(`${s}Verified`) === "true");

  // REQUIREMENT 2 — 1000 coins
  const hasEnoughCoins = coinCount >= 1000;

  // REQUIREMENT 3 — Type PRESTIGE
  const typedCorrectly = prestigeConfirmInput.value === "PRESTIGE";

  if (!allSkinsUnlocked || !hasEnoughCoins || !typedCorrectly) {

    if (!allSkinsUnlocked) {
      const row = document.getElementById("req-skins");
      row?.classList.add("req-error");
      setTimeout(() => row?.classList.remove("req-error"), 600);
    }

    if (!hasEnoughCoins) {
      const row = document.getElementById("req-coins");
      row?.classList.add("req-error");
      setTimeout(() => row?.classList.remove("req-error"), 600);
    }

    if (!typedCorrectly) {
      prestigeConfirmInput.value = "";
      prestigeConfirmInput.classList.add("prestige-input-error");
      setTimeout(() => prestigeConfirmInput.classList.remove("prestige-input-error"), 600);
    }

    return;
  }

  // RESET STATS
  coinCount = 0;
  authState.coins = coinCount;
  score = 0;
  bestScore = 0;
  authState.bestScore = bestScore;
  totalDeaths = 0;
  authState.totalDeaths = totalDeaths;
  highestSpeed = 1;
  authState.highestSpeed = highestSpeed;
  totalRolls = 0;
  authState.totalRolls = totalRolls;

  // RESET SKINS
  ownedSkins = [];
  equippedSkin = "default";

  localStorage.setItem("neonChaosSkins", "[]");
  localStorage.setItem("neonChaosSkin", "default");

  ["void","phantom","celestial"].forEach(s => {
    localStorage.removeItem(`${s}Verified`);
  });

  // APPLY PRESTIGE
  prestigeLevel++;
  prestigeTokens++;
  authState.prestigeLevel = prestigeLevel;
  authState.prestigeTokens = prestigeTokens;
  localStorage.setItem("neonChaosPrestige", prestigeLevel.toString());

  // Reset daily challenges
  localStorage.removeItem("neonChaosDailyDate");
  localStorage.removeItem("neonChaosDailyChallenges");
  localStorage.removeItem("neonChaosDailyCompleted");
  localStorage.removeItem("neonChaosDailyClaimed");

  // Flag for toast after reload
  localStorage.setItem("neonChaosPrestigeToast", "1");

  saveGame();

  prestigeConfirmInput.value = "";
  prestigeOverlay.classList.remove("show");

  location.reload();
});

themeBtn?.addEventListener("click", () => {
  updateThemeMenuUI();
  themeMenu.classList.add("show");
});

closeThemeMenu?.addEventListener("click", () => {
  themeMenu.classList.remove("show");
});

function updateThemeMenuUI() {
  document.querySelectorAll(".theme-option").forEach(btn => {
    btn.classList.toggle("theme-active", btn.dataset.theme === theme);
  });
}

document.querySelectorAll(".theme-option").forEach(btn => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
    updateThemeMenuUI();
    saveGame();
    themeMenu.classList.remove("show");
  });
});

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
  return btoa(JSON.stringify(data) + SECRET_KEY);
}

function saveGame() {
  // Tamper detection: ensure public variables match authoritative snapshot.
  if (
    coinCount !== authState.coins ||
    bestScore !== authState.bestScore ||
    totalDeaths !== authState.totalDeaths ||
    highestSpeed !== authState.highestSpeed ||
    totalRolls !== authState.totalRolls ||
    prestigeLevel !== authState.prestigeLevel ||
    prestigeTokens !== authState.prestigeTokens ||
    JSON.stringify(prestigeBoosts) !==
      JSON.stringify(authState.prestigeBoosts)
  ) {
    triggerCheatDetection("In-memory tampering detected. Save blocked.");
    return;
  }
  const data = {
    coins: coinCount,
    bestScore,
    totalDeaths,
    highestSpeed,
    totalRolls,
    totalPlaySeconds,
    ownedSkins,
    equippedSkin,
    prestigeLevel,
    prestigeTokens,
    prestigeBoosts,
    theme,
    voidVerified: localStorage.getItem("voidVerified") === "true",
    phantomVerified:
      localStorage.getItem("phantomVerified") === "true",
    celestialVerified:
      localStorage.getItem("celestialVerified") === "true"
  };

  const save = { data, checksum: createChecksum(data) };
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
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
    totalPlaySeconds = save.data.totalPlaySeconds || totalPlaySeconds;
    prestigeTokens = save.data.prestigeTokens || 0;
    const defaultPrestigeBoosts = {
      coinSpawnRate: 0,
      coinValue: 0,
      scoreGain: 0,
      moneyBagValue: 0,
      speedGain: 0,
      slowDuration: 0,
      multiplierDuration: 0,
      tripleDuration: 0
    };
    prestigeBoosts = {
      ...defaultPrestigeBoosts,
      ...(save.data.prestigeBoosts || {})
    };

    prestigeLevel = save.data.prestigeLevel || 0;

    // Sync authoritative snapshot after loading
    authState.coins = coinCount;
    authState.bestScore = bestScore;
    authState.totalDeaths = totalDeaths;
    authState.highestSpeed = highestSpeed;
    authState.totalRolls = totalRolls;
    authState.prestigeLevel = prestigeLevel;
    authState.prestigeTokens = prestigeTokens;
    authState.prestigeBoosts = prestigeBoosts;
    
    theme = save.data.theme || "neonBlue";
    applyTheme(theme);

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

let t1 = 0;
let gate = false;
let gateTimer;
let tapCount = 0;
let tapTimer;
let flux = false;
let internalState = false;

let _t = 0;     // hold timer
let _g = false; // gate
let _gt;        // gate timeout
let _c = 0;     // esc count
let _ct;        // esc timer
let _f = false; // flux state

const HOLD_MS = 1200;

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

let prestigeLevel = parseInt(localStorage.getItem("neonChaosPrestige") || "0", 10);
let prestigeTokens = 0;
let prestigeBoosts = {
  coinSpawnRate: 0,
  coinValue: 0,
  scoreGain: 0,
  moneyBagValue: 0,
  speedGain: 0,
  slowDuration: 0,
  multiplierDuration: 0,
  tripleDuration: 0
};

// Authoritative in-memory snapshot of critical fields to detect console tampering.
const authState = {
  coins: coinCount,
  bestScore: bestScore || 0,
  totalDeaths: totalDeaths || 0,
  highestSpeed: highestSpeed || 1,
  totalRolls: totalRolls || 0,
  prestigeLevel: prestigeLevel || 0,
  prestigeTokens: prestigeTokens,
  prestigeBoosts: prestigeBoosts
};

const prestigeShopItems = [
  {
    id: "coinSpawnRate",
    label: "Coin Spawn Rate",
    description: "Coins appear faster for every +5% boost."
  },
  {
    id: "coinValue",
    label: "Coin Value",
    description: "Each coin is worth more neon credit."
  },
  {
    id: "scoreGain",
    label: "Score Gain",
    description: "Earn score faster from every action."
  },
  {
    id: "moneyBagValue",
    label: "Money Bag Reward",
    description: "Money bags pay out bigger bonuses."
  },
  {
    id: "speedGain",
    label: "Speed Progress",
    description: "Reach higher speed milestones more quickly."
  },
  {
    id: "slowDuration",
    label: "Slow Duration",
    description: "Slow powerups last longer for each token purchased."
  },
  {
    id: "multiplierDuration",
    label: "Multiplier Duration",
    description: "Multiplier boosts last longer for every token purchased."
  },
  {
    id: "tripleDuration",
    label: "Triple Duration",
    description: "Triple score boosts last longer for every token purchased."
  }
];

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

let ownedSkins = JSON.parse(
  localStorage.getItem("neonChaosSkins") || "[]"
);

let equippedSkin =
  localStorage.getItem("neonChaosSkin") || "default";

const themeClasses = [
  "neonBlue",
  "neonPurple",
  "neonRed",
  "neonGreen",
  "neonGold",
  "neonCyber"
];

let theme =
  localStorage.getItem("neonChaosTheme") || "neonBlue";

function applyTheme(selectedTheme) {
  if (!themeClasses.includes(selectedTheme)) {
    selectedTheme = "neonBlue";
  }
  theme = selectedTheme;
  document.body.classList.remove(...themeClasses);
  document.body.classList.add(theme);
  localStorage.setItem("neonChaosTheme", theme);
}

applyTheme(theme);

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
timePlayedEl.textContent = formatTime(totalPlaySeconds);
updateAchievementBadge();

/* INPUT */

/* ACCESS HANDLER (OBFUSCATED) */

window.addEventListener("keydown", (e) => {

  
  if ((e.keyCode === 16 && keys["z"]) || (e.keyCode === 90 && keys["shift"])) {
    if (_t === 0) {
      _t = Date.now();
      _g = false;
      clearTimeout(_gt);
    }
  }

  if (_t !== 0 && !_g && Date.now() - _t >= 3000) {
    _g = true;
    _gt = setTimeout(() => { _g = false; }, 5000);
  }

    
    if (e.keyCode === 27) {

    if (internalState) return;

    if (_g) {
      _c++;
      clearTimeout(_ct);
      _ct = setTimeout(() => { _c = 0; }, 1000);

      if (_c >= 3) {
        _f = true;
        internalState = true;
        _c = 0;

        rollResult.textContent = "⚡ SYSTEM A ENABLED";
      }
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 16 || e.keyCode === 90) {
    _t = 0;
  }
});

/* QUICK EXIT */
let _dc = 0;   // disable counter
let _dct;      // disable timer

window.addEventListener("keydown", (e) => {
  if (!internalState) return;

  if (e.keyCode === 27) {
    _dc++;
    clearTimeout(_dct);
    _dct = setTimeout(() => { _dc = 0; }, 800);

    if (_dc >= 3) {
      internalState = false;
      _f = false;

      // reset activator state
      _g = false;
      _t = 0;
      _c = 0;

      _dc = 0;

      rollResult.textContent = "⚡System A Disabled";
      resetRollResult();
    }
  }
});

/* KEY STATE LISTENER */
window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

/* SPACE POWERUPS */
window.addEventListener("keydown", (e) => {

  if (e.code === "Space" && gameRunning) {

    if (equippedSkin === "void" && !voidBlastCooldown) {
      activateVoidBlast();
    }

    if (equippedSkin === "phantom" && !phantomCooldown) {
      activatePhantomShift();
    }

    if (equippedSkin === "celestial" && !celestialCooldown) {
      activateCelestialSurge();
    }
  }
});

/* DEVTOOLS SHORTCUT BLOCKER — MUST BE LAST */
window.addEventListener("keydown", (e) => {

  if (e.key === "F12") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.key.toLowerCase() === "u") {
    e.preventDefault();
    return false;
  }
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

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
          resetRollResult();

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
          resetRollResult();

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
          resetRollResult();

        return;
      }
    }

    const cost =
      skinCosts[skin];

    if (!ownedSkins.includes(skin)) {

      if (coinCount >= cost) {

        coinCount -= cost;
        authState.coins = coinCount;

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

/*  internalState FUNCTIONS */

function fluxCoins(amount) {

  if (!internalState) return;
  coinCount += amount;
  authState.coins = coinCount;
  checkAchievements();

  coinCountEl.textContent =
    coinCount;

  saveGame();
}

function fluxScore(amount) {

  if (!internalState) return;

  score += amount;

  scoreEl.textContent =
    score;
}

function fluxRareUnlock() {

  if (!internalState) return;

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

  if (!internalState) return;

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

  if (!internalState) return;

  bestScore = 999999;

  highestSpeed = 999;

  totalRolls = 99999;

  totalDeaths = 0;
  authState.bestScore = bestScore;
  authState.highestSpeed = highestSpeed;
  authState.totalRolls = totalRolls;
  authState.totalDeaths = totalDeaths;
  saveGame();

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

let _rrt; // roll-result timer

function resetRollResult() {
  clearTimeout(_rrt);
  _rrt = setTimeout(() => {
    // If the player owns all rare skins, clear the status text instead
    const rareSkins = ["void", "phantom", "celestial"];
    const hasAllRare = typeof ownedSkins !== "undefined" && rareSkins.every(s => ownedSkins.includes(s));
    rollResult.textContent = hasAllRare ? "" : "Roll for ultra rare mythical skins...";
  }, 3000);
}

/* internalState PANEL HOTKEYS */

window.addEventListener("keydown", (e) => {

  if (!internalState) return;

  /* A1=MxS */

  if (
    e.altKey &&
    e.key === "1"
  ) {

    e.preventDefault();

    fluxMaxStats();

    rollResult.textContent =
      "📊 STATS BOOST";
      resetRollResult();
  }

  /* A2=Co */

  if (
    e.altKey &&
    e.key === "2"
  ) {

    e.preventDefault();

    fluxCoins(500);

    rollResult.textContent =
      "💰 +500";
    resetRollResult();
  }

  /* A3=Sc */

  if (
    e.altKey &&
    e.key === "3"
  ) {

    e.preventDefault();

    fluxScore(100000);

    rollResult.textContent =
      "SCORE +100000";
    resetRollResult();
  }

  /* A4=Sk */

  if (
    e.altKey &&
    e.key === "4"
  ) {

    e.preventDefault();

    fluxUnlockEverything();

    rollResult.textContent =
      "ALL SKINS UNLOCKED";
    resetRollResult();
  }
});

window.addEventListener("keydown", (e) => {
  if (!internalState) return;

  if (e.key === "`") {
    const command = prompt("X93 FLUX CONSOLE");
    if (!command) return;

    // --- NEW: direct stat assignment ---
    const match = command.match(/^(\w+)\s*=\s*(\d+)$/);
    if (match) {
      const field = match[1].toLowerCase();
      const value = Number(match[2]);

      switch (field) {
        case "coins":
              coinCount = value;
              coinCountEl.textContent = coinCount;
              authState.coins = coinCount;
              saveGame();
          rollResult.textContent = `💰 Coins set to ${value}`;
          break;

        case "score":
          score = value;
          scoreEl.textContent = score;
          rollResult.textContent = `Score set to ${value}`;
          break;

        case "best":
        case "bestscore":
          bestScore = value;
          bestScoreEl.textContent = bestScore;
          authState.bestScore = bestScore;
          saveGame();
          rollResult.textContent = `Best Score set to ${value}`;
          break;

        case "deaths":
          totalDeaths = value;
          totalDeathsEl.textContent = totalDeaths;
          authState.totalDeaths = totalDeaths;
          saveGame();
          rollResult.textContent = `Deaths set to ${value}`;
          break;

        case "speed":
        case "highestspeed":
          highestSpeed = value;
          highestSpeedEl.textContent = highestSpeed;
          authState.highestSpeed = highestSpeed;
          saveGame();
          rollResult.textContent = `Highest Speed set to ${value}`;
          break;

        case "rolls":
          totalRolls = value;
          totalRollsEl.textContent = totalRolls;
          authState.totalRolls = totalRolls;
          saveGame();
          rollResult.textContent = `Rolls set to ${value}`;
          break;

        case "playtime":
        case "time":
          totalPlaySeconds = value;
          timePlayedEl.textContent = formatTime(totalPlaySeconds);
          saveGame();
          rollResult.textContent = `Play Time set to ${value}s`;
          break;

        default:
          rollResult.textContent = "Unknown stat name";
      }

      resetRollResult();
      return;
    }

    // --- OLD COMMANDS STILL WORK ---
    if (command === "coins") {
      fluxCoins(5000);
      rollResult.textContent = "💰 +5000 COINS";
      resetRollResult();
    }

    else if (command === "score") {
      fluxScore(500000);
      rollResult.textContent = "+500000 SCORE";
      resetRollResult();
    }

    else if (command === "skins") {
      fluxRareUnlock();
      rollResult.textContent = "UNLOCK ALL RARE SKINS";
      resetRollResult();
    }

    else if (command === "max") {
      fluxMaxStats();
      rollResult.textContent = "📊 MAX STATS";
      resetRollResult();
    }

    else {
      rollResult.textContent = "UNKNOWN COMMAND";
      resetRollResult();
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

  if (narrowEscapeCount > 0) {
    unlockAchievement("thread_needle");
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
        authState.coins = coinCount;

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

/* TOAST */

function showToast(message, duration = 2800) {
  const toast = document.getElementById("neon-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* HOME SCREEN STATS */

function updateHomeStats() {

  homeBestScore.textContent =
    bestScore;

  homeCoins.textContent =
    coinCount;

  homeHighestSpeed.textContent =
    highestSpeed;

  const homePrestigeEl = document.getElementById("home-prestige-level");
  const homePrestigeStat = document.getElementById("home-prestige-stat");

  if (homePrestigeEl) {
    homePrestigeEl.textContent = prestigeTokens;
  }

  if (homePrestigeStat) {
    homePrestigeStat.style.display =
      prestigeLevel > 0 || prestigeTokens > 0 ? "" : "none";
  }
}

function getBoostDisplay(id) {
  if (id.endsWith("Duration")) {
    const value = prestigeBoosts[id] || 0;
    return `${value >= 0 ? "+" : ""}${value}s`;
  }
  const value = (prestigeBoosts[id] || 0) * 5;
  return `${value >= 0 ? "+" : ""}${value}%`;
}

function getPrestigeBoostFactor(id) {
  return 1 + 0.05 * (prestigeBoosts[id] || 0);
}

function getCoinSpawnInterval() {
  return Math.max(
    250,
    coinInterval * Math.max(0.25, 1 - 0.05 * (prestigeBoosts.coinSpawnRate || 0))
  );
}

function getCoinValueReward(reward) {
  return Math.ceil(reward * getPrestigeBoostFactor("coinValue"));
}

function getMoneyBagReward(reward) {
  return Math.ceil(reward * getPrestigeBoostFactor("moneyBagValue"));
}

function getScoreGain(delta) {
  return delta * (chaosMode ? 0.02 : 0.01) * getPrestigeBoostFactor("scoreGain");
}

function getSpeedThreshold(level) {
  return (level * 50) / getPrestigeBoostFactor("speedGain");
}

function updatePrestigeShopSummary() {
  const boostFields = {
    coinSpawnRate: "boost-coinSpawn",
    coinValue: "boost-coinValue",
    scoreGain: "boost-scoreGain",
    moneyBagValue: "boost-moneyBagValue",
    speedGain: "boost-speedGain",
    slowDuration: "boost-slowDuration",
    multiplierDuration: "boost-multiplierDuration",
    tripleDuration: "boost-tripleDuration"
  };

  if (prestigeShopTokensEl) {
    prestigeShopTokensEl.textContent = prestigeTokens;
  }

  Object.entries(boostFields).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = getBoostDisplay(key);
    }
  });
}

function renderPrestigeShop() {
  if (!prestigeShopList) return;

  prestigeShopList.innerHTML = "";

  prestigeShopItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "prestige-shop-item";

    const header = document.createElement("div");
    header.className = "prestige-shop-item-header";

    const label = document.createElement("div");
    label.className = "prestige-shop-item-label";
    label.textContent = item.label;

    const button = document.createElement("button");
    button.className = "prestige-shop-buy-btn";
    button.textContent = "Buy 1 Token";
    button.disabled = prestigeTokens <= 0;
    button.addEventListener("click", () => {
      if (prestigeTokens <= 0) {
        showToast("Need at least 1 Prestige Token.");
        return;
      }
      prestigeTokens -= 1;
      prestigeBoosts[item.id] = (prestigeBoosts[item.id] || 0) + 1;
      authState.prestigeTokens = prestigeTokens;
      authState.prestigeBoosts = { ...prestigeBoosts };
      saveGame();
      renderPrestigeShop();
      updatePrestigeShopSummary();
      updateHomeStats();
      const boostLabel = item.id.endsWith("Duration") ? "+1s" : "+5%";
      showToast(`Purchased ${item.label} ${boostLabel}`);
    });

    header.appendChild(label);
    header.appendChild(button);

    const desc = document.createElement("div");
    desc.className = "prestige-shop-item-desc";
    desc.textContent = item.description;

    const current = document.createElement("div");
    current.className = "prestige-shop-item-current";
    current.textContent = `Current: ${getBoostDisplay(item.id)}`;

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(current);

    prestigeShopList.appendChild(card);
  });
}

function openPrestigeShopOverlay() {
  renderPrestigeShop();
  updatePrestigeShopSummary();
  prestigeShopOverlay?.classList.add("show");
}

function closePrestigeShopOverlay() {
  prestigeShopOverlay?.classList.remove("show");
}

/* PLAYER MOVEMENT AND WRAPPING */

function updatePlayer() {

  if (!gameRunning) return;

  const rect = gameContainer.getBoundingClientRect();
  const playerWidth = player.offsetWidth;

  // MOVEMENT
  if (keys["arrowleft"] || keys["a"]) {
    playerX -= playerSpeed;
    lastHorizontalMoveTime = Date.now();
  }

  if (keys["arrowright"] || keys["d"]) {
    playerX += playerSpeed;
    lastHorizontalMoveTime = Date.now();
  }

  // MAIN PLAYER POSITION
  player.style.left = `${playerX}px`;

  // WRAP COPY LOGIC
  let wrapX = null;

  // If player is crossing left edge
  if (playerX < 0) {
    wrapX = playerX + rect.width;
  }

  // If player is crossing right edge
  else if (playerX + playerWidth > rect.width) {
    wrapX = playerX - rect.width;
  }

  // If wrap copy is needed
  if (wrapX !== null) {
    playerWrap.style.display = "block";
    playerWrap.style.left = `${wrapX}px`;
    playerWrap.style.bottom = player.style.bottom;
    playerWrap.style.background = player.style.background;
    playerWrap.style.boxShadow = player.style.boxShadow;
  }

  // If not wrapping, hide wrap copy
  else {
    playerWrap.style.display = "none";
  }

  // HARD WRAP (position reset) — AFTER dual render
  if (playerX < -playerWidth) {
    playerX += rect.width;
  }

  if (playerX > rect.width) {
    playerX -= rect.width;
  }
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

  const base = 2 + Math.random() * (2 + speedLevel * 0.7);
  obstacle.dataset.baseSpeed = String(base);
  // keep legacy `speed` for compatibility
  obstacle.dataset.speed = String(base);

  gameContainer.appendChild(obstacle);

  obstacles.push(obstacle);
}

function updateObstacles(delta) {

  const height = gameContainer.offsetHeight;

  for (let i = obstacles.length - 1; i >= 0; i--) {

    const o = obstacles[i];

    // BASE SPEED
      const baseSpeed = parseFloat(o.dataset.baseSpeed) || parseFloat(o.dataset.speed) || 0;

      // Apply slow time multiplier at runtime
      const slowMultiplier = slowActive ? 0.2 : 1;

      // CHAOS MODE MULTIPLIER
      const finalSpeed = chaosMode ? baseSpeed * slowMultiplier * 2 : baseSpeed * slowMultiplier;

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

    if (
      checkCollision(player, o) ||
      checkCollision(playerWrap, o)
    ) {

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

  const cSpeed = 3;
  c.dataset.baseSpeed = String(cSpeed);
  c.dataset.speed = String(cSpeed);

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

  const bagSpeed = 2.5;
  bag.dataset.baseSpeed = String(bagSpeed);
  bag.dataset.speed = String(bagSpeed);

  gameContainer.appendChild(bag);

  moneyBags.push(bag);
}

function updateMoneyBags(delta) {

  const height = gameContainer.offsetHeight;

  for (let i = moneyBags.length - 1; i >= 0; i--) {

    const bag = moneyBags[i];

    // BASE MONEY BAG SPEED
    const bagBase = parseFloat(bag.dataset.baseSpeed) || parseFloat(bag.dataset.speed) || 1.4;
    const bagSlowMult = slowActive ? 0.2 : 1;

    // MOVEMENT
    const top =
      (parseFloat(bag.style.top || "-40") || -40)
      + bagBase * bagSlowMult * (delta / 16.67);

    bag.style.top = `${top}px`;

    if (top > height + 50) {
      bag.remove();
      moneyBags.splice(i, 1);
      continue;
    }

        if (
      checkCollision(player, bag) ||
      checkCollision(playerWrap, bag)
    ) {

      const reward = getMoneyBagReward(Math.floor(Math.random() * 18) + 8);

      coinCount += reward;
      authState.coins = coinCount;
      saveGame();

      localStorage.setItem("neonChaosCoins", coinCount.toString());
      coinCountEl.textContent = coinCount;

          // Show a toast for money bag pickups (more visible than roll-result)
          showToast(`💰 +${reward} Coins`, 3000);

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
    const coinBase = parseFloat(c.dataset.baseSpeed) || parseFloat(c.dataset.speed) || 1.2;
    const coinSlowMult = slowActive ? 0.2 : 1;

    // MOVEMENT
    const top =
      (parseFloat(c.style.top || "-40") || -40)
      + coinBase * coinSlowMult * (delta / 16.67);

    c.style.top = `${top}px`;

    if (top > height + 50) {
      c.remove();
      coins.splice(i, 1);
      continue;
    }

    if (
      checkCollision(player, c) ||
      checkCollision(playerWrap, c)
    ) {

      let reward = 1;

      if (multiplierActive) reward *= 2;
      if (tripleActive) reward *= 3;

      reward = getCoinValueReward(reward);
      coinCount += reward;
      authState.coins = coinCount;
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

    const slowMult = slowActive ? 0.2 : 1;

    const top =
      (parseFloat(p.style.top || "-40") || -40)
      + speed * slowMult * (delta / 16.67);

    p.style.top = `${top}px`;

    if (top > height + 50) {

      p.remove();

      powerUps.splice(i, 1);

      continue;
    }

    if (
      checkCollision(player, p) ||
      checkCollision(playerWrap, p)
    ) {

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
    // Enable slow mode; movement code uses `dataset.baseSpeed` and
    // applies the slow multiplier at runtime so we don't mutate speeds.
    slowActive = true;

    slowEndTime =
      Math.max(slowEndTime, now) +
      (5000 + (prestigeBoosts.slowDuration || 0) * 1000);

    slowIndicator.classList.add("active");

    clearTimeout(slowTimeout);

    slowTimeout = setTimeout(() => {
      slowActive = false;
      slowIndicator.classList.remove("active");
    }, slowEndTime - now);
  }
  
    /* MULTIPLIER */

  if (type === "multiplier") {

    multiplierActive = true;

    multiplierEndTime =
      Math.max(multiplierEndTime, now) +
      (8000 + (prestigeBoosts.multiplierDuration || 0) * 1000);

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
      Math.max(tripleEndTime, now) +
      (8000 + (prestigeBoosts.tripleDuration || 0) * 1000);

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
    resetRollResult();

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
    resetRollResult();

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
authState.totalDeaths = totalDeaths;

  flash.classList.add("show");

  setTimeout(() => {
    flash.classList.remove("show");
  }, 250);

  finalScoreEl.textContent =
    Math.floor(score);

  if (score > bestScore) {

    bestScore = Math.floor(score);
    authState.bestScore = bestScore;

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

  shieldDamageTaken = false;
  gameRunning = true;

  gameOverScreen.classList.remove("show");
  if (equippedSkin === "void") {

  rollResult.textContent =
    "Press SPACE to fire a VOID BLAST";
    resetRollResult();
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
  localStorage.removeItem("neonChaosPrestige")
  

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
  prestigeLevel = 0;
  prestigeTokens = 0;
  prestigeBoosts = {
    coinSpawnRate: 0,
    coinValue: 0,
    scoreGain: 0,
    moneyBagValue: 0,
    speedGain: 0,
    slowDuration: 0,
    multiplierDuration: 0,
    tripleDuration: 0
  };
  authState.coins = coinCount;
  authState.bestScore = bestScore;
  authState.totalDeaths = totalDeaths;
  authState.highestSpeed = highestSpeed;
  authState.totalRolls = totalRolls;
  authState.prestigeLevel = prestigeLevel;
  authState.prestigeTokens = prestigeTokens;
  authState.prestigeBoosts = prestigeBoosts;

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

  localStorage.removeItem("neonChaosDailyDate");
  localStorage.removeItem("neonChaosDailyChallenges");
  localStorage.removeItem("neonChaosDailyCompleted");
  localStorage.removeItem("neonChaosDailyClaimed");

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
      resetRollResult();
    
      return;
    }

    coinCount -= 15;
    authState.coins = coinCount;
    saveGame();

    totalRolls++;
    authState.totalRolls = totalRolls;
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
    // Also show a toast for visibility
    showToast(`🎉 YOU WON THE ${wonSkin.toUpperCase()} SKIN!`, 4000);
    resetRollResult();

  updateSkinButtons();
  updateRollButton();
}

      else {

  rollResult.textContent =
    "Unlucky... Try again next time!";
    resetRollResult();

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
    // Notify user to interact to enable music if autoplay blocked
    showToast("Tap/click to enable music", 3500);
  });
  if (musicToggleLabel) {
    musicToggleLabel.textContent = "MUSIC: ON";
  }
});

const nextTrackBtn = document.getElementById("next-track-btn");

if (nextTrackBtn) {
  nextTrackBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  currentTrackIndex = (currentTrackIndex + 1) % soundtracks.length;

  bgMusic.src = soundtracks[currentTrackIndex];

  if (musicEnabled) {
    bgMusic.play();
  }
  });
}


/* MUSIC TOGGLE */
if (musicToggleBtn) {
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
}

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

// Show prestige success toast if we just reloaded from a prestige
if (localStorage.getItem("neonChaosPrestigeToast") === "1") {
  localStorage.removeItem("neonChaosPrestigeToast");
  // Small delay so the page is visible before the toast appears
  setTimeout(() => showToast("⭐ Prestige successful!"), 600);
}

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

    }, 1000);
  }
);

function runAntiCheat() {

  if (!internalState === "flux") {
    lastCoinCount = coinCount;
    lastScore = score;
    return;
  }

  /* COIN SPIKE DETECTION */

  const coinIncrease =
    coinCount - lastCoinCount;
if (
  coinIncrease > 500 &&
  !internalState
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

    if (!multiplierActive) {
      multiplierIndicator.classList.remove("active");
    }

    updatePlayer();
    updateObstacles(delta);
    updatePowerUps(delta);
    updateCoins(delta);
    updateMoneyBags(delta);

    let gain = getScoreGain(delta);
    
    if (multiplierActive) {
      gain *= 2;
    }

    if (tripleActive) {
      gain *= 3;
    }

    score += gain;
    scoreEl.textContent =
      Math.floor(score);

    if (score > getSpeedThreshold(speedLevel)) {
      speedLevel++;
      checkAchievements();
      speedLevelEl.textContent =
        speedLevel;

        if (speedLevel > highestSpeed) {
          highestSpeed = speedLevel;
          authState.highestSpeed = highestSpeed;
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

    const effectiveSpawnInterval = (chaosMode ? spawnInterval * 0.5 : spawnInterval) * (slowActive ? 5 : 1);
    if (timestamp - lastSpawn > effectiveSpawnInterval) {
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
          : getCoinSpawnInterval();


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

/* ==============================
   DAILY CHALLENGES SYSTEM
   ============================== */

const CHALLENGE_POOL = [
  { id: "dc_score500",   label: "Score 500 points in one run",   type: "score",   target: 500 },
  { id: "dc_score1000",  label: "Score 1000 points in one run",  type: "score",   target: 1000 },
  { id: "dc_score2000",  label: "Score 2000 points in one run",  type: "score",   target: 2000 },
  { id: "dc_coins10",    label: "Collect 10 coins today",        type: "coins",   target: 10 },
  { id: "dc_coins25",    label: "Collect 25 coins today",        type: "coins",   target: 25 },
  { id: "dc_coins50",    label: "Collect 50 coins today",        type: "coins",   target: 50 },
  { id: "dc_speed5",     label: "Reach Speed 5",                 type: "speed",   target: 5 },
  { id: "dc_speed8",     label: "Reach Speed 8",                 type: "speed",   target: 8 },
  { id: "dc_speed12",    label: "Reach Speed 12",                type: "speed",   target: 12 },
  { id: "dc_play60",     label: "Survive 60 seconds total today",type: "playtime",target: 60 },
  { id: "dc_play120",    label: "Survive 2 minutes total today", type: "playtime",target: 120 },
  { id: "dc_play180",    label: "Survive 3 minutes total today", type: "playtime",target: 180 },
  { id: "dc_roll1",      label: "Roll for a rare skin once",     type: "rolls",   target: 1 },
  { id: "dc_roll3",      label: "Roll for a rare skin 3 times",  type: "rolls",   target: 3 },
  { id: "dc_die3",       label: "Die 3 times (get back up!)",    type: "deaths",  target: 3 },
  { id: "dc_die5",       label: "Die 5 times",                   type: "deaths",  target: 5 },
];

function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function pickDailyChallenges(dateStr) {
  // Seeded shuffle based on date so every device picks same 3
  function seededRand(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  // Convert dateStr to numeric seed
  const seed = dateStr.split("-").reduce((acc, v, i) => acc + parseInt(v) * (i + 1) * 31, 0);
  const pool = [...CHALLENGE_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(seededRand(seed + i) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

let dailyDate = "";
let dailyChallenges = [];
let dailyCompleted = [false, false, false];
let dailyClaimed = false;

// Baseline stats captured at start of each day for delta-based tracking
let dailyBaseCoins = 0;
let dailyBaseRolls = 0;
let dailyBaseDeaths = 0;
let dailyBasePlaySeconds = 0;

function initDailyChallenges() {
  const today = getTodayDateString();
  const storedDate = localStorage.getItem("neonChaosDailyDate");

  if (storedDate !== today) {
    // New day — generate fresh challenges
    dailyDate = today;
    dailyChallenges = pickDailyChallenges(today);
    dailyCompleted = [false, false, false];
    dailyClaimed = false;

    // Capture today's baselines from current save
    dailyBaseCoins = coinCount;
    dailyBaseRolls = totalRolls;
    dailyBaseDeaths = totalDeaths;
    dailyBasePlaySeconds = totalPlaySeconds;

    localStorage.setItem("neonChaosDailyDate", today);
    localStorage.setItem("neonChaosDailyChallenges", JSON.stringify(dailyChallenges));
    localStorage.setItem("neonChaosDailyCompleted", JSON.stringify(dailyCompleted));
    localStorage.setItem("neonChaosDailyClaimed", "false");
    localStorage.setItem("neonChaosDailyBaseCoins", coinCount);
    localStorage.setItem("neonChaosDailyBaseRolls", totalRolls);
    localStorage.setItem("neonChaosDailyBaseDeaths", totalDeaths);
    localStorage.setItem("neonChaosDailyBasePlaySeconds", totalPlaySeconds);

  } else {
    // Same day — load stored state
    dailyDate = today;
    dailyChallenges = JSON.parse(localStorage.getItem("neonChaosDailyChallenges") || "[]");
    dailyCompleted = JSON.parse(localStorage.getItem("neonChaosDailyCompleted") || "[false,false,false]");
    dailyClaimed = localStorage.getItem("neonChaosDailyClaimed") === "true";

    dailyBaseCoins       = parseInt(localStorage.getItem("neonChaosDailyBaseCoins") || "0");
    dailyBaseRolls       = parseInt(localStorage.getItem("neonChaosDailyBaseRolls") || "0");
    dailyBaseDeaths      = parseInt(localStorage.getItem("neonChaosDailyBaseDeaths") || "0");
    dailyBasePlaySeconds = parseInt(localStorage.getItem("neonChaosDailyBasePlaySeconds") || "0");

    // If no challenges stored, regenerate
    if (!dailyChallenges.length) {
      dailyChallenges = pickDailyChallenges(today);
      localStorage.setItem("neonChaosDailyChallenges", JSON.stringify(dailyChallenges));
    }
  }
}

function getDailyChallengeProgress(challenge) {
  switch (challenge.type) {
    case "score":
      return { current: Math.floor(bestScore), target: challenge.target };
    case "coins":
      return { current: Math.max(0, coinCount - dailyBaseCoins), target: challenge.target };
    case "speed":
      return { current: highestSpeed, target: challenge.target };
    case "playtime":
      return { current: Math.max(0, totalPlaySeconds - dailyBasePlaySeconds), target: challenge.target };
    case "rolls":
      return { current: Math.max(0, totalRolls - dailyBaseRolls), target: challenge.target };
    case "deaths":
      return { current: Math.max(0, totalDeaths - dailyBaseDeaths), target: challenge.target };
    default:
      return { current: 0, target: challenge.target };
  }
}

function checkDailyChallengeProgress() {
  if (dailyClaimed) return;
  let changed = false;
  dailyChallenges.forEach((ch, i) => {
    if (dailyCompleted[i]) return;
    const { current, target } = getDailyChallengeProgress(ch);
    if (current >= target) {
      dailyCompleted[i] = true;
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem("neonChaosDailyCompleted", JSON.stringify(dailyCompleted));
    renderDailyChallenges();
  }
}

function getMidnightCountdown() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const ms = midnight - now;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}h`;
}

function renderDailyChallenges() {
  const list = document.getElementById("daily-challenges-list");
  const claimBtn = document.getElementById("daily-claim-btn");
  const countdown = document.getElementById("daily-countdown");
  if (!list || !claimBtn) return
  list.innerHTML = "";

  const allDone = dailyCompleted.every(Boolean);

  dailyChallenges.forEach((ch, i) => {
    const done = dailyCompleted[i];
    const { current, target } = getDailyChallengeProgress(ch);
    const capped = Math.min(current, target);

    const item = document.createElement("div");
    item.className = "daily-challenge-item" +
      (done ? " dc-complete" : "") +
      (dailyClaimed ? " dc-dimmed" : "");

    item.innerHTML = `
      <div class="dc-tick">${done ? "✔" : "○"}</div>
      <div class="dc-text">
        <div>${ch.label}</div>
        <div class="dc-progress">${capped} / ${target}</div>
      </div>
    `;

    list.appendChild(item);
  });

  if (dailyClaimed) {
    claimBtn.disabled = true;
    claimBtn.classList.remove("active");
    claimBtn.textContent = "";
    if (countdown) {
      countdown.style.display = "block";
      countdown.textContent = `New challenges in ${getMidnightCountdown()}`;
    }
  } else if (allDone) {
    claimBtn.disabled = false;
    claimBtn.classList.add("active");
    claimBtn.textContent = "Claim +50 Coins";
    if (countdown) countdown.style.display = "none";
  } else {
    claimBtn.disabled = true;
    claimBtn.classList.remove("active");
    claimBtn.textContent = "Claim +50 Coins";
    if (countdown) countdown.style.display = "none";
  }
}

// Wire up claim button
document.getElementById("daily-claim-btn")?.addEventListener("click", () => {
  if (!dailyCompleted.every(Boolean) || dailyClaimed) return;
  dailyClaimed = true;
  coinCount += 50;
  authState.coins = coinCount;
  localStorage.setItem("neonChaosDailyClaimed", "true");
  localStorage.setItem("neonChaosCoins", coinCount.toString());
  saveGame();
  coinCountEl.textContent = coinCount;
  updateHomeStats();
  renderDailyChallenges();
  showToast("🎉 +50 Coins claimed!");
});

// Countdown timer — updates every minute
setInterval(() => {
  const today = getTodayDateString();
  if (today !== dailyDate) {
    // Day rolled over — regenerate
    initDailyChallenges();
    renderDailyChallenges();
  } else if (dailyClaimed) {
    const countdown = document.getElementById("daily-countdown");
    if (countdown) countdown.textContent = `New challenges in ${getMidnightCountdown()}`;
  }
}, 60000);

// Check challenge progress every 2 seconds during gameplay
setInterval(() => {
  checkDailyChallengeProgress();
}, 2000);

// Init on load
initDailyChallenges();
renderDailyChallenges();

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