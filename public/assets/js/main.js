document.getElementById('year').textContent = new Date().getFullYear();

// Theme is applied before paint by the inline script in <head>;
// icons swap via Tailwind dark: classes, so only persistence lives here.
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    drawSun();
}

// Mobile menu
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('hidden');
    menuButton.setAttribute('aria-expanded', String(!isOpen));
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
    });
});

// Copy email
const copyBtn = document.getElementById('copy-email');
const copyText = document.getElementById('copy-email-text');
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        copyText.textContent = 'Tersalin';
        setTimeout(() => { copyText.textContent = 'Salin alamat'; }, 2000);
    } catch {
        window.location.href = mailtoHref();
    }
});

// CV modal
const cvModal = document.getElementById('cv-modal');
const cvFrame = document.getElementById('cv-frame');
const CV_URL = './assets/pdf/cv.pdf?v=2026-02';

function openCvModal() {
    // Load the PDF only on first open so it never blocks initial page load
    if (!cvFrame.src) cvFrame.src = CV_URL + '#view=FitH';
    cvModal.classList.remove('hidden');
    cvModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeCvModal() {
    cvModal.classList.add('hidden');
    cvModal.classList.remove('flex');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cvModal.classList.contains('hidden')) {
        closeCvModal();
    }
});

// Extra projects toggle
function toggleProjects() {
    const extra = document.querySelectorAll('#project-list [data-extra]');
    const btn = document.getElementById('btn-load-more');
    const isHidden = !extra[0].classList.contains('hidden');
    extra.forEach(li => li.classList.toggle('hidden', isHidden));
    btn.setAttribute('aria-expanded', String(!isHidden));
    document.getElementById('btn-text').textContent = isHidden ? 'Tampilkan 3 proyek lainnya' : 'Sembunyikan proyek lainnya';
}

// Terminal contact box: tabs swap the shown command and what COPY copies
const termVerb = document.getElementById('term-verb');
const termArg = document.getElementById('term-arg');
const termCopy = document.getElementById('term-copy');
document.querySelectorAll('.term-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.term-tab').forEach(t => {
            t.classList.toggle('is-active', t === tab);
            t.setAttribute('aria-selected', String(t === tab));
        });
        termVerb.textContent = tab.dataset.verb + ' ';
        termArg.textContent = tab.dataset.arg;
        termCopy.dataset.copy = tab.dataset.copy;
    });
});
termCopy.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(termCopy.dataset.copy);
        termCopy.textContent = 'Copied';
        setTimeout(() => { termCopy.textContent = 'Copy'; }, 2000);
    } catch {
        window.location.href = mailtoHref();
    }
});

// Hero backdrop: a dithered rising sun with a corona that slowly turns, breathes and twinkles.
// Drawn at CSS-pixel size into ImageData (each 3px cell = 2x2 dot + 1px gap) and scaled with
// image-rendering: pixelated. Per-cell geometry is cached on resize, so a frame is just a loop.
// Runs at ~24fps, only while the hero is on screen; prefers-reduced-motion gets one still frame.
const sun = document.getElementById('sun');
const sunCtx = sun.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const CELL = 3;
// Pack a color as little-endian RGBA for a Uint32Array view over ImageData
const rgba = (r, g, b, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
const DISK = [rgba(255, 244, 200), rgba(255, 209, 102), rgba(255, 154, 46), rgba(255, 138, 42), rgba(242, 106, 27)];
let sunImg, sunBuf, cells, sunStart = performance.now(), sunFrame, sunVisible = true, sunLast = 0;

function setupSun() {
    const w = sun.clientWidth, h = sun.clientHeight;
    sun.width = w; sun.height = h;
    sunImg = sunCtx.createImageData(w, h);
    sunBuf = new Uint32Array(sunImg.data.buffer);
    // Narrow screens: smaller sun tucked into the corner so it stays behind, not over, the text
    const narrow = w < 768;
    const R = narrow ? w * 0.8 : Math.max(w, h) * 0.75;
    const cx = w + R * (narrow ? 0.45 : 0.3), cy = h + R * (narrow ? 0.6 : 0.45);
    const list = [];
    for (let y = 0; y + 1 < h; y += CELL) {
        for (let x = 0; x + 1 < w; x += CELL) {
            const d = Math.hypot(x - cx, y - cy) - R;
            const glow = d < 0 ? 0 : Math.exp(-d / (R * 0.035));
            const rays = d < 0 ? 0 : Math.exp(-d / (R * 0.2)) * 0.5;
            if (d >= 0 && 0.8 * glow + rays < 0.004) continue; // never visible, skip for good
            list.push(y * w + x, d, Math.atan2(y - cy, x - cx), d < 0 ? Math.min(1, -d / (R * 0.3)) : glow, rays,
                Math.random(), 0.03 + Math.random() * 0.12); // seed + twinkle speed per cell
        }
    }
    cells = Float32Array.from(list);
}

function drawSun(now = performance.now()) {
    const t = reduceMotion.matches ? 0 : (now - sunStart) / 1000;
    const dark = document.documentElement.classList.contains('dark');
    const [gr, gg, gb] = dark ? [255, 198, 92] : [226, 96, 18];
    const w = sun.width, buf = sunBuf;
    const turn = t * 0.015, breath = 1 + 0.12 * Math.sin(t * 0.7);
    buf.fill(0);
    for (let k = 0; k < cells.length; k += 7) {
        const i = cells[k], d = cells[k + 1];
        let r = cells[k + 5] + t * cells[k + 6]; r -= Math.floor(r);
        let c;
        if (d < 0) {
            // Disk: bright yellow limb fading into deep orange core
            const s = cells[k + 3];
            if (r > 0.97) continue;
            if (d > -12) c = DISK[r < 0.6 ? 0 : 1];
            else if (r < 0.9 - s * 0.6) c = DISK[r < 0.45 - s * 0.3 ? 1 : 2];
            else c = DISK[r < 0.7 ? 3 : 4];
        } else {
            // Corona: breathing glow plus slowly turning, pulsing radial rays
            const a = cells[k + 2];
            const cs = Math.cos((a + turn) * 36);
            let ray = 0;
            if (cs > 0) { const c2 = cs * cs, c4 = c2 * c2, c8 = c4 * c4; ray = c8 * c2 * cells[k + 4] * (0.85 + 0.15 * Math.sin(t * 1.3 + a * 7)); }
            const p = 0.7 * cells[k + 3] * breath + ray;
            if (r >= p) continue;
            c = rgba(gr, gg, gb, Math.min(255, (0.25 + p) * 255) | 0);
        }
        buf[i] = buf[i + 1] = buf[i + w] = buf[i + w + 1] = c;
    }
    sunCtx.putImageData(sunImg, 0, 0);
}

let sunGap = 41; // ~24fps is plenty for a slow drift
function sunLoop(now) {
    sunFrame = requestAnimationFrame(sunLoop);
    if (now - sunLast < sunGap) return;
    sunLast = now;
    drawSun(now);
    // Budget: drawing may take at most ~1/8 of the time, so big screens or slow CPUs drop fps instead of hogging the CPU
    sunGap = Math.max(41, (performance.now() - now) * 8);
}
function syncSun() {
    cancelAnimationFrame(sunFrame);
    if (sunVisible && !reduceMotion.matches) sunFrame = requestAnimationFrame(sunLoop);
    else drawSun();
}

setupSun();
syncSun();
reduceMotion.addEventListener('change', syncSun);
new IntersectionObserver(([e]) => { sunVisible = e.isIntersecting; syncSun(); }).observe(sun);
let sunTimer;
// Mobile browsers fire resize when the URL bar slides; the canvas size stays the same then, so skip.
window.addEventListener('resize', () => {
    clearTimeout(sunTimer);
    sunTimer = setTimeout(() => {
        if (sun.width !== sun.clientWidth || sun.height !== sun.clientHeight) { setupSun(); drawSun(); }
    }, 200);
});
