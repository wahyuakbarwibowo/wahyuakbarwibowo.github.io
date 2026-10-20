document.getElementById('year').textContent = new Date().getFullYear();

// Theme is applied before paint by the inline script in <head>;
// icons swap via Tailwind dark: classes, so only persistence lives here.
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
    const extra = document.getElementById('extra-projects');
    const btn = document.getElementById('btn-load-more');
    const isHidden = extra.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isHidden));
    document.getElementById('btn-text').textContent = isHidden ? 'Tampilkan 3 proyek lainnya' : 'Sembunyikan proyek lainnya';
}
