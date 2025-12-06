// script.js
// Dark mode + Sky-blue photo borders + Lightning glow
// (Only modifies classes / inline styles; does not change your CSS file)

// --- Elements ---
const themeToggle = document.getElementById('theme-toggle');
const lightingToggle = document.getElementById('lighting-toggle');
const photoCards = () => Array.from(document.querySelectorAll('.photo-card'));
const root = document.documentElement;
const body = document.body;

// Sky-blue colors (adjust if you prefer other sky shades)
const SKY_START = '#87CEFA'; // light sky blue
const SKY_END   = '#00BFFF'; // deep sky blue

// --- Helper: apply sky-blue border to all .photo-card elements ---
function applySkyBlueBorders() {
  const borderSize = getComputedStyle(root).getPropertyValue('--border-size') || '6px';
  photoCards().forEach(card => {
    // preserve the inner white padding-box used in your CSS and replace the border gradient
    card.style.background = `linear-gradient(var(--white), var(--white)) padding-box, linear-gradient(120deg, ${SKY_START}, ${SKY_END}) border-box`;
    card.style.border = `${borderSize.trim()} solid transparent`;
  });
}

// --- Inject custom keyframes for sky-blue glow (only once) ---
function ensureSkyGlowKeyframes() {
  if (document.getElementById('glow-sky-style')) return;
  const style = document.createElement('style');
  style.id = 'glow-sky-style';
  style.textContent = `
    @keyframes glowPulseSky {
      0%   { box-shadow: 0 0 8px rgba(135,206,250,0.18), 0 0 0 rgba(135,206,250,0); }
      50%  { box-shadow: 0 0 18px rgba(135,206,250,0.32), 0 0 12px rgba(135,206,250,0.12); }
      100% { box-shadow: 0 0 8px rgba(135,206,250,0.18), 0 0 0 rgba(135,206,250,0); }
    }
  `;
  document.head.appendChild(style);
}

// --- Enable lightning glow on photo-cards ---
function enableSkyGlow() {
  ensureSkyGlowKeyframes();
  photoCards().forEach(card => {
    // use the injected keyframes for a visible sky-blue glow
    card.style.animation = 'glowPulseSky 2.2s ease-in-out infinite';
    // a slightly stronger shadow while glow is on
    card.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
  });
  // also add a helper class to body for any CSS that expects .glow-on
  body.classList.add('glow-on');
  // update button text
  lightingToggle.textContent = '⚡ Lighting On';
}

// --- Disable lightning glow ---
function disableSkyGlow() {
  photoCards().forEach(card => {
    card.style.animation = ''; // remove inline animation
    card.style.boxShadow = ''; // revert inline shadow (CSS hover still works)
  });
  body.classList.remove('glow-on');
  lightingToggle.textContent = '⚡ Lighting Off';
}

// --- Toggle functions bound to buttons ---
function toggleTheme() {
  const isDark = root.classList.toggle('dark');
  // update button label to reflect new state
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  // re-apply borders so they keep the same sky-blue look after theme change
  applySkyBlueBorders();
}

function toggleLighting() {
  const isOn = body.classList.toggle('glow-on');
  if (isOn) enableSkyGlow();
  else disableSkyGlow();
}

// --- Initialize on first load ---
function init() {
  // apply the sky-blue picture borders immediately
  applySkyBlueBorders();

  // ensure glow style is present (but do not automatically enable animation)
  ensureSkyGlowKeyframes();
  disableSkyGlow(); // ensure default is off, matching your original "⚡ Lighting Off" text

  // attach events
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (lightingToggle) lightingToggle.addEventListener('click', toggleLighting);

  // small nicety: respect previously set preference in localStorage (optional)
  try {
    const savedTheme = localStorage.getItem('site-theme'); // 'dark' or 'light'
    const savedLighting = localStorage.getItem('site-lighting'); // 'on' or 'off'
    if (savedTheme === 'dark') { root.classList.add('dark'); themeToggle.textContent = '☀️ Light Mode'; }
    if (savedLighting === 'on') { enableSkyGlow(); } else { disableSkyGlow(); }
  } catch (e) {
    // localStorage unavailable => ignore
  }

  // store preferences when toggles are used
  themeToggle && themeToggle.addEventListener('click', () => {
    try { localStorage.setItem('site-theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch(e){}
  });
  lightingToggle && lightingToggle.addEventListener('click', () => {
    try { localStorage.setItem('site-lighting', body.classList.contains('glow-on') ? 'on' : 'off'); } catch(e){}
  });
}

// run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
