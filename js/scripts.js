/*
 * Site scripts — dark portfolio theme (vanilla JS, no dependencies).
 */
window.addEventListener('DOMContentLoaded', () => {
    const siteNav = document.querySelector('.site-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Mobile nav toggle
    if (siteNav && navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // Close the menu when a menu link is clicked (useful for same-page anchors)
    if (siteNav && navMenu) {
        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('nav-open');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Nav scrolled state
    if (siteNav) {
        const updateNavScrolled = () => {
            if (window.scrollY > 8) {
                siteNav.classList.add('nav-scrolled');
            } else {
                siteNav.classList.remove('nav-scrolled');
            }
        };
        window.addEventListener('scroll', updateNavScrolled, { passive: true });
        updateNavScrolled();
    }

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            revealEls.forEach((el) => el.classList.add('reveal--visible'));
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            revealEls.forEach((el) => observer.observe(el));
        }
    }
});
