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
