document.getElementById('year').textContent = new Date().getFullYear();

// Theme is applied before paint by the inline script in <head>;
// icons swap via Tailwind dark: classes, so only persistence lives here.
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) drawPlanet();
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

// Prefill project-request email template on mailto links
const EMAIL = 'wahyuakbar.work@gmail.com';
function mailtoHref(plan) {
    const subject = `Permintaan Proyek: ${plan || '[Jenis Aplikasi]'}`;
    const body = [
        'Halo Wahyu,',
        '',
        'Saya [Nama] dari [Perusahaan/Instansi].',
        '',
        `Jenis aplikasi   : ${plan || '[Landing page / Aplikasi web / Backend API / Maintenance]'}`,
        'Deskripsi singkat: [ceritakan masalah atau tujuan bisnisnya]',
        'Fitur utama      : [contoh: login multi-role, laporan, pembayaran]',
        'Estimasi anggaran: Rp [...]',
        'Target selesai   : [tanggal / bulan]',
        'Referensi        : [link aplikasi serupa, jika ada]',
        '',
        'Kontak yang bisa dihubungi: [WhatsApp / telepon]',
        '',
        'Terima kasih.',
    ].join('\n');
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
document.querySelectorAll('a[data-mailto]').forEach(a => { a.href = mailtoHref(a.dataset.plan); });

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
const termCmd = document.getElementById('term-cmd');
const termCopy = document.getElementById('term-copy');
document.querySelectorAll('.term-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.term-tab').forEach(t => {
            t.classList.toggle('is-active', t === tab);
            t.setAttribute('aria-selected', String(t === tab));
        });
        termCmd.textContent = tab.dataset.cmd;
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

// Hero backdrop: a dithered planet rim with scattered stars, drawn once.
// ponytail: static render, redraws only on resize; animate it if it ever needs to move.
const planet = document.getElementById('planet');
function drawPlanet() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = planet.clientWidth, h = planet.clientHeight;
    planet.width = w * dpr; planet.height = h * dpr;
    const ctx = planet.getContext('2d');
    ctx.scale(dpr, dpr);
    const cell = 3;
    const R = Math.max(w, h) * 0.9;
    const cx = w + R * 0.42, cy = h + R * 0.55;
    for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
            const d = Math.hypot(x - cx, y - cy) - R;
            const r = Math.random();
            if (d < 0) {
                // Inside the planet: blue rim fading into magenta dither
                if (d > -10) ctx.fillStyle = r < 0.85 ? '#7c8cf0' : '#ee4fbf';
                else if (r < 0.75 * Math.exp(d / 260) + 0.15) ctx.fillStyle = r < 0.5 ? '#c43c9e' : '#5e1f52';
                else continue;
            } else if (r < 0.45 * Math.exp(-d / (R * 0.025)) + 0.004) {
                ctx.fillStyle = r < 0.02 ? '#ffffff' : 'rgba(255,255,255,.75)';
            } else continue;
            ctx.fillRect(x, y, cell - 1, cell - 1);
        }
    }
}
drawPlanet(); // hidden in light mode: zero size, nothing drawn
let planetTimer;
window.addEventListener('resize', () => { clearTimeout(planetTimer); planetTimer = setTimeout(drawPlanet, 200); });
