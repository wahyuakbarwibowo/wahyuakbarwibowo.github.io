document.getElementById('year').textContent = new Date().getFullYear();

function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = isDark ? '☀️' : '🌙';
    document.getElementById('theme-toggle').innerHTML = icon;
    document.getElementById('theme-toggle-mobile').innerHTML = icon;
}

window.addEventListener('DOMContentLoaded', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const useDark = saved === 'dark' || (!saved && prefersDark);
    if (useDark) {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-toggle').innerHTML = '☀️';
        document.getElementById('theme-toggle-mobile').innerHTML = '☀️';
    } else {
        document.getElementById('theme-toggle').innerHTML = '🌙';
        document.getElementById('theme-toggle-mobile').innerHTML = '🌙';
    }
});

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
