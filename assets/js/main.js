document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// Rotating quotes in the footer
const QUOTES = [
    ['Bicara itu murah. Tunjukkan kodenya.', 'Linus Torvalds, pencipta Linux'],
    ['Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain.', 'Nabi Muhammad ﷺ (HR. Ahmad & Thabrani)'],
    ['Satu-satunya cara melakukan pekerjaan hebat adalah mencintai apa yang kamu kerjakan.', 'Steve Jobs, pendiri Apple'],
    ['Sesungguhnya Allah mencintai seseorang yang apabila bekerja, ia menyempurnakan pekerjaannya.', 'Nabi Muhammad ﷺ (HR. Thabrani)'],
    ['Jika kamu tidak malu dengan versi pertama produkmu, berarti kamu meluncurkannya terlambat.', 'Reid Hoffman, pendiri LinkedIn'],
    ['Tidaklah seseorang memakan makanan yang lebih baik daripada hasil kerja tangannya sendiri.', 'Nabi Muhammad ﷺ (HR. Bukhari)'],
    ['Pelanggan yang paling tidak puas adalah sumber pembelajaran terbesarmu.', 'Bill Gates, pendiri Microsoft'],
    ['Barangsiapa menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga.', 'Nabi Muhammad ﷺ (HR. Muslim)'],
    ['Buat berjalan, buat benar, lalu buat cepat.', 'Kent Beck, pencipta Extreme Programming'],
    ['Sesungguhnya setiap amal tergantung pada niatnya.', 'Nabi Muhammad ﷺ (HR. Bukhari & Muslim)'],
    ['Tanpa cinta, kecerdasan itu berbahaya; tanpa kecerdasan, cinta itu tidak cukup.', 'B.J. Habibie, Presiden ke-3 RI'],
    ['Kesederhanaan adalah prasyarat keandalan.', 'Edsger W. Dijkstra, ilmuwan komputer'],
];
const quoteEl = document.getElementById('quote');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
let quoteIdx = 0;
setInterval(() => {
    quoteIdx = (quoteIdx + 1) % QUOTES.length;
    const swap = () => {
        quoteText.textContent = `“${QUOTES[quoteIdx][0]}”`;
        quoteAuthor.textContent = `— ${QUOTES[quoteIdx][1]}`;
        quoteEl.classList.remove('opacity-0');
    };
    if (reduceMotion) return swap();
    quoteEl.classList.add('opacity-0');
    setTimeout(swap, 500);
}, 8000);
