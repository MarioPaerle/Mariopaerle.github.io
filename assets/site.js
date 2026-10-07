const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');

function updateThemeButton() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  themeButton.textContent = next === 'light' ? 'Light' : 'Dark';
  themeButton.setAttribute('aria-label', `Switch to ${next} theme`);
}

themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('appearance', root.dataset.theme); } catch (_) {}
  updateThemeButton();
});

updateThemeButton();

const chordCanvas = document.querySelector('.chord-animation');
if (chordCanvas) {
  const ctx = chordCanvas.getContext('2d');
  const figure = chordCanvas.closest('figure');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let lastFrame = 0;
  let time = 0;
  let animationFrame;

  function drawChord() {
    const scale = Math.min(devicePixelRatio || 1, 2);
    if (chordCanvas.width !== 680 * scale) {
      chordCanvas.width = 680 * scale;
      chordCanvas.height = 620 * scale;
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, 680, 620);
    ctx.strokeStyle = root.dataset.theme === 'light' ? '#000000' : '#eee9df';
    ctx.lineWidth = .9;
    const phase = .45 + .55 * Math.sin(time * .22);
    for (let trail = -2; trail <= 2; trail++) {
      const offset = trail * .012;
      ctx.globalAlpha = trail === 0 ? .9 : .12;
      ctx.beginPath();
      for (let j = 0; j <= 1400; j++) {
        const t = j * 2 * Math.PI / 1400;
        const x = 340 + 225 * (Math.sin(8*t+offset) + .55*Math.sin(12*t+offset)) / 1.55;
        const y = 310 + 238 * (Math.sin(10*t+phase+offset) + .55*Math.sin(15*t+phase+offset)) / 1.55;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function animate(now) {
    if (visible && !document.hidden && !reducedMotion.matches && now - lastFrame >= 40) {
      time += lastFrame ? Math.min((now - lastFrame) / 1000, .1) : 0;
      lastFrame = now;
      drawChord();
    }
    animationFrame = requestAnimationFrame(animate);
  }

  if (ctx) {
    chordCanvas.hidden = false;
    figure.classList.add('is-animated');
    drawChord();
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrame = 0;
    }).observe(figure);
    new MutationObserver(drawChord).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    reducedMotion.addEventListener('change', drawChord);
    animationFrame = requestAnimationFrame(animate);
    window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame));
  }
}
