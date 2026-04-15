// === State ===
let totalScore = 0;
let gameState = "guess";
let r, g, b;

const SLIDER_COLORS = ["#ff8a80", "#57f09a", "#82b1ff"];
const VALUE_IDS = ["r-value", "g-value", "b-value"];

// === Target Color ===
function newTargetColor() {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    const target = document.getElementById("targetSwatch");
    target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    target.style.boxShadow = `0 8px 36px rgba(${r}, ${g}, ${b}, 0.45)`;
}

// === Slider Update ===
function updateSlider(slider, index) {
    const value = parseInt(slider.value);
    const pct = (value / 255) * 100;
    const col = SLIDER_COLORS[index];
    slider.style.background =
        `linear-gradient(to right, ${col} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    document.getElementById(VALUE_IDS[index]).textContent = value;
    updateGuessPreview();
}

function updateGuessPreview() {
    const rv = parseInt(document.getElementById("r-value").textContent);
    const gv = parseInt(document.getElementById("g-value").textContent);
    const bv = parseInt(document.getElementById("b-value").textContent);
    const swatch = document.getElementById("guessSwatch");
    swatch.style.backgroundColor = `rgb(${rv}, ${gv}, ${bv})`;
}

// === Initialize Sliders ===
const sliders = document.querySelectorAll(".slider");
sliders.forEach((slider, index) => {
    updateSlider(slider, index);
    slider.addEventListener("input", () => updateSlider(slider, index));
});

newTargetColor();

// === Guess Logic ===
function guess() {
    const rg = parseInt(document.getElementById("r-value").textContent);
    const gg = parseInt(document.getElementById("g-value").textContent);
    const bg = parseInt(document.getElementById("b-value").textContent);

    const isExact = rg === r && gg === g && bg === b;
    const isClose =
        Math.abs(rg - r) <= 20 &&
        Math.abs(gg - g) <= 20 &&
        Math.abs(bg - b) <= 20;

    const banner = document.getElementById("resultBanner");
    banner.className = "result-banner";
    // Force reflow so the transition re-fires on repeat guesses
    void banner.offsetWidth;

    let score = 0;
    if (isExact) {
        score = 2;
        banner.textContent = `Perfect match! +2  —  rgb(${r}, ${g}, ${b})`;
        banner.classList.add("show", "exact");
        showBonus("+2");
    } else if (isClose) {
        score = 1;
        banner.textContent = `Close! +1  —  rgb(${r}, ${g}, ${b})`;
        banner.classList.add("show", "close");
        showBonus("+1");
    } else {
        score = 0;
        banner.textContent = `Not quite  —  rgb(${r}, ${g}, ${b})`;
        banner.classList.add("show", "miss");
    }

    totalScore += score;
    document.getElementById("scoreValue").textContent = totalScore;

   
    document.getElementById("guessSwatch").style.boxShadow =
        `0 8px 36px rgba(${rg}, ${gg}, ${bg}, 0.45)`;
}

function showBonus(text) {
    const bonus = document.getElementById("scoreBonus");
    bonus.textContent = text;
    bonus.className = "score-bonus";
    void bonus.offsetWidth; 
    bonus.classList.add("pop");
}

// === Reset ===
function resetGame() {
    newTargetColor();

    sliders.forEach((slider, index) => {
        slider.value = 128;
        updateSlider(slider, index);
    });

    const banner = document.getElementById("resultBanner");
    banner.className = "result-banner";
    banner.textContent = "";

    document.getElementById("guessSwatch").style.boxShadow = "";
}

// === Button Handler ===
function handleClick() {
    const btn = document.getElementById("guessButton");
    if (gameState === "guess") {
        guess();
        btn.textContent = "Next Round";
        btn.classList.add("next-state");
        gameState = "next";
    } else {
        resetGame();
        btn.textContent = "Guess";
        btn.classList.remove("next-state");
        gameState = "guess";
    }
}
