const menuButton = document.querySelector('.mobile-menu-btn');
const menu = document.getElementById('navLinks');
const mobile = window.matchMedia('(max-width: 768px)');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...menu.querySelectorAll('a')];
let clickLockUntil = 0;

function setMenuOpen(open) {
    menu.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
}

function activateSection(id) {
    for (const link of navLinks) {
        const active = link.hash === '#' + id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    }
}

function updateActiveSection() {
    if (performance.now() < clickLockUntil) return;
    let current = '';
    for (const section of sections) {
        if (window.scrollY + 130 >= section.offsetTop) current = section.id;
    }
    if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id;
    }
    activateSection(current);
}

menuButton.addEventListener('click', () => {
    setMenuOpen(!menu.classList.contains('active'));
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('active')) {
        setMenuOpen(false);
        menuButton.focus();
    }
});

mobile.addEventListener('change', event => {
    if (!event.matches) {
        const buttonHadFocus = document.activeElement === menuButton;
        setMenuOpen(false);
        if (buttonHadFocus) navLinks[0].focus();
    } else if (menu.contains(document.activeElement)) {
        menuButton.focus();
    }
});

for (const link of navLinks) {
    link.addEventListener('click', () => {
        activateSection(link.hash.slice(1));
        clickLockUntil = performance.now() + 800;
        if (menu.classList.contains('active')) {
            setMenuOpen(false);
            menuButton.focus();
        }
    });
}

window.addEventListener('scroll', updateActiveSection, {passive: true});
window.addEventListener('load', updateActiveSection, {once: true});
