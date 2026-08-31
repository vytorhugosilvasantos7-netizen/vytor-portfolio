// =========================================================
// Circuit-grid background animation
// =========================================================
(function initCircuitBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GRID = 64;
  let width, height, cols, rows;
  let pulses = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cols = Math.ceil(width / GRID);
    rows = Math.ceil(height / GRID);
  }
  window.addEventListener('resize', resize);
  resize();

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.028)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      const px = x * GRID + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
    }
    for (let y = 0; y <= rows; y++) {
      const py = y * GRID + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
    }
    ctx.stroke();
  }

  function spawnPulse() {
    const horizontal = Math.random() > 0.5;
    const forward = Math.random() > 0.5;
    const line = horizontal
      ? Math.round(Math.random() * rows) * GRID
      : Math.round(Math.random() * cols) * GRID;
    const length = (2 + Math.floor(Math.random() * 4)) * GRID;

    pulses.push({
      horizontal,
      forward,
      line,
      length,
      pos: forward ? -length : (horizontal ? width + length : height + length),
      speed: 2.2 + Math.random() * 2.4,
      trail: 90 + Math.random() * 60,
      alpha: 0.55 + Math.random() * 0.35,
    });
  }

  function drawPulse(p) {
    const dir = p.forward ? 1 : -1;
    const headX = p.horizontal ? p.pos : p.line;
    const headY = p.horizontal ? p.line : p.pos;
    const tailX = p.horizontal ? p.pos - dir * p.trail : p.line;
    const tailY = p.horizontal ? p.line : p.pos - dir * p.trail;

    const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
    gradient.addColorStop(0, 'rgba(255,176,0,0)');
    gradient.addColorStop(1, `rgba(255,176,0,${p.alpha})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.stroke();

    // bright head dot
    ctx.fillStyle = `rgba(255,205,90,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(headX, headY, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();

    pulses.forEach((p) => {
      p.pos += p.forward ? p.speed : -p.speed;
      drawPulse(p);
    });

    pulses = pulses.filter((p) => {
      const limit = p.horizontal ? width : height;
      return p.forward ? p.pos - p.trail < limit + 40 : p.pos + p.trail > -40;
    });

    requestAnimationFrame(step);
  }

  if (reduceMotion) {
    drawGrid();
  } else {
    step();
    setInterval(() => {
      if (pulses.length < 7) spawnPulse();
    }, 900);
    spawnPulse();
  }
})();

// =========================================================
// Scroll progress bar + vertical trace line (signature element)
// =========================================================
const progressBar = document.getElementById('progressBar');
const traceFill = document.getElementById('traceFill');
const traceNode = document.getElementById('traceNode');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  if (traceFill && traceNode) {
    traceFill.style.height = pct + '%';
    traceNode.style.top = pct + '%';
  }
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// =========================================================
// Cursor-follow ambient glow (desktop only)
// =========================================================
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(min-width: 861px)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });
}

// =========================================================
// Header active-link tracking
// =========================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

function updateActiveLink() {
  let current = '';
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      current = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// =========================================================
// Mobile menu toggle
// =========================================================
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// =========================================================
// Scroll reveal (IntersectionObserver)
// =========================================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// =========================================================
// Terminal boot / typing sequence
// =========================================================
const terminalBody = document.getElementById('terminalBody');

const bootLines = [
  { text: '$ whoami', type: 'prompt-line', delay: 0 },
  { text: 'vytor-santos', type: 'plain', delay: 400 },
  { text: '$ cat perfil.json', type: 'prompt-line', delay: 700 },
];

const jsonLines = [
  '<span class="purple">const</span> <span class="blue">developer</span> = <span class="yellow">{</span>',
  '  <span class="red">name</span>: <span class="green">\'Vytor Santos\'</span>,',
  '  <span class="red">role</span>: <span class="green">\'Estudante de Ciência da Computação\'</span>,',
  '  <span class="red">focus</span>: <span class="green">\'Backend, Python & Banco de Dados\'</span>',
  '<span class="yellow">}</span>;',
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeLine(el, html, speed = 18) {
  return new Promise((resolve) => {
    if (prefersReducedMotion) {
      el.innerHTML = html;
      resolve();
      return;
    }
    // strip tags to know plain length, but type char-by-char including tags safely via textContent chunks
    const container = document.createElement('span');
    container.innerHTML = html;
    const full = container.innerHTML;
    let i = 0;
    const step = () => {
      el.innerHTML = full.slice(0, i);
      i += 3;
      if (i <= full.length) {
        requestAnimationFrame(() => setTimeout(step, speed));
      } else {
        el.innerHTML = full;
        resolve();
      }
    };
    step();
  });
}

async function runBootSequence() {
  terminalBody.innerHTML = '';

  const line1 = document.createElement('p');
  line1.className = 'code-line';
  terminalBody.appendChild(line1);
  await typeLine(line1, '<span class="prompt">$</span> whoami', 14);
  await wait(250);

  const line2 = document.createElement('p');
  line2.className = 'code-line';
  line2.style.color = 'var(--text-dim)';
  terminalBody.appendChild(line2);
  await typeLine(line2, 'vytor-santos — backend & dados', 14);
  await wait(400);

  const line3 = document.createElement('p');
  line3.className = 'code-line';
  terminalBody.appendChild(line3);
  await typeLine(line3, '<span class="prompt">$</span> cat perfil.json', 14);
  await wait(300);

  for (const jsonLine of jsonLines) {
    const p = document.createElement('p');
    p.className = 'code-line indent';
    terminalBody.appendChild(p);
    await typeLine(p, jsonLine, 6);
    await wait(60);
  }

  await wait(300);
  const finalLine = document.createElement('p');
  finalLine.className = 'code-prompt';
  finalLine.innerHTML = '&gt; System initialized successfully...<span class="cursor"></span>';
  terminalBody.appendChild(finalLine);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

runBootSequence();

// =========================================================
// Currículo download (placeholder — troque pelo link real do PDF)
// =========================================================
function baixarCurriculo() {
  const link = document.createElement('a');
  link.href = 'curriculo-vytor-santos.pdf';
  link.download = 'curriculo-vytor-santos.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}