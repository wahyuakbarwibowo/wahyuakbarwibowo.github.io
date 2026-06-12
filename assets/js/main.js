document.getElementById('year').textContent = new Date().getFullYear();

// Theme is applied before paint by the inline script in <head>;
// icons swap via Tailwind dark: classes, so only persistence lives here.
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('py-4', 'shadow-xl');
        nav.classList.remove('py-6');
    } else {
        nav.classList.remove('py-4', 'shadow-xl');
    }
});

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

function toggleProjects() {
    const extra = document.getElementById('extra-projects');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const isHidden = extra.classList.toggle('hidden');
    btnText.textContent = isHidden ? 'Lihat Semua Proyek' : 'Sembunyikan Proyek';
    btnIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
}
