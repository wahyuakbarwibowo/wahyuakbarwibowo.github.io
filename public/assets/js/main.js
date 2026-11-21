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

// Hero backdrop: a dithered rising sun with a glowing corona, drawn once.
// ponytail: static render, redraws on resize/theme change; animate it if it ever needs to move.
const sun = document.getElementById('sun');
function drawSun() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = sun.clientWidth, h = sun.clientHeight;
    sun.width = w * dpr; sun.height = h * dpr;
    const ctx = sun.getContext('2d');
    ctx.scale(dpr, dpr);
    const dark = document.documentElement.classList.contains('dark');
    const glow = dark ? '255,198,92' : '226,96,18';
    const cell = 3;
    // Narrow screens: smaller sun tucked into the corner so it stays behind, not over, the text
    const narrow = w < 768;
    const R = narrow ? w * 0.8 : Math.max(w, h) * 0.75;
    const cx = w + R * (narrow ? 0.45 : 0.3), cy = h + R * (narrow ? 0.6 : 0.45);
    for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
            const d = Math.hypot(x - cx, y - cy) - R;
            const r = Math.random();
            if (d < 0) {
                // Disk: bright yellow limb fading into deep orange core
                const t = Math.min(1, -d / (R * 0.3));
                if (r > 0.97) continue;
                if (d > -12) ctx.fillStyle = r < 0.6 ? '#fff4c8' : '#ffd166';
                else if (r < 0.9 - t * 0.6) ctx.fillStyle = r < 0.45 - t * 0.3 ? '#ffd166' : '#ff9a2e';
                else ctx.fillStyle = r < 0.7 ? '#ff8a2a' : '#f26a1b';
            } else {
                // Corona: soft glow plus radial rays
                const ang = Math.atan2(y - cy, x - cx);
                const ray = Math.pow(Math.max(0, Math.cos(ang * 36)), 10) * Math.exp(-d / (R * 0.2)) * 0.5;
                const p = 0.7 * Math.exp(-d / (R * 0.035)) + ray;
                if (r >= p) continue;
                ctx.fillStyle = `rgba(${glow},${Math.min(1, 0.25 + p)})`;
            }
            ctx.fillRect(x, y, cell - 1, cell - 1);
        }
    }
}
drawSun();
let sunTimer;
window.addEventListener('resize', () => { clearTimeout(sunTimer); sunTimer = setTimeout(drawSun, 200); });
