/*!
* Start Bootstrap - Clean Blog v6.0.9 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll behaviour ──────────────────────────────────────────────
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;

    window.addEventListener('scroll', function () {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove('is-visible');
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });

    // ── Reading progress bar ─────────────────────────────────────────────────
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
            const docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ── Scroll-reveal (Intersection Observer) ────────────────────────────────
    // Auto-tag elements that should animate in
    document.querySelectorAll('.post-preview').forEach(el => el.classList.add('reveal'));

    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    // ── Dark mode toggle ─────────────────────────────────────────────────────
    const toggle = document.getElementById('dark-mode-toggle');
    const html   = document.documentElement;

    const applyDark = (on) => {
        if (on) {
            html.classList.add('dark-mode');
            if (toggle) toggle.textContent = '☀ Light';
        } else {
            html.classList.remove('dark-mode');
            if (toggle) toggle.textContent = '◑ Dark';
        }
    };

    // Restore saved preference (also respect OS preference on first visit)
    const saved = localStorage.getItem('darkMode');
    if (saved === 'on') {
        applyDark(true);
    } else if (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyDark(true);
    } else {
        applyDark(false);
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            const isDark = html.classList.contains('dark-mode');
            applyDark(!isDark);
            localStorage.setItem('darkMode', !isDark ? 'on' : 'off');
        });
    }

    // ── Smooth page-exit transition ───────────────────────────────────────────
    // Intercept all same-origin internal links and fade out before navigating
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (
            !href ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('javascript:') ||
            link.hasAttribute('target') ||        // opens in new tab
            link.origin !== location.origin        // external link
        ) return;

        link.addEventListener('click', e => {
            e.preventDefault();
            const dest = link.href;
            document.body.classList.add('page-leaving');
            setTimeout(() => { location.href = dest; }, 185);
        });
    });

    // ── Back to top ───────────────────────────────────────────────────────────
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Tag filtering (posts.html) ────────────────────────────────────────────
    const tagFilterBtns = document.querySelectorAll('.tag-filter-btn');
    if (tagFilterBtns.length > 0) {
        const filterPosts = (filter) => {
            document.querySelectorAll('.post-item[data-tags]').forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const tags = item.dataset.tags.split(',').map(t => t.trim());
                    item.classList.toggle('hidden', !tags.includes(filter));
                }
            });
            // Hide HRs adjacent to hidden items
            document.querySelectorAll('hr.my-4').forEach(hr => {
                const prev = hr.previousElementSibling;
                const next = hr.nextElementSibling;
                const prevHidden = prev && prev.classList.contains('post-item') && prev.classList.contains('hidden');
                const nextHidden = next && next.classList.contains('post-item') && next.classList.contains('hidden');
                hr.style.display = (prevHidden || nextHidden) ? 'none' : '';
            });
        };

        tagFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tagFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterPosts(btn.dataset.filter);
            });
        });

        // Auto-activate filter from URL hash (e.g. /posts.html#ai)
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash) {
            const target = document.querySelector(`.tag-filter-btn[data-filter="${hash}"]`);
            if (target) target.click();
        }
    }

});
