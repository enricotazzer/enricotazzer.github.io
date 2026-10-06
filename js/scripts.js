/* BrainNotBraining: site behaviour.
 * Theme toggle, reading progress, back-to-top, the article table of contents,
 * and the tag filter on /posts/. Every part checks for its elements first, so
 * the one file runs on every page.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ── Theme toggle ───────────────────────────────────────────
  // The inline script in _includes/head.html applies the saved (or OS)
  // theme before first paint; this keeps the button in sync and saves changes.
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var syncToggle = function () {
      toggle.setAttribute('aria-pressed', root.classList.contains('dark-mode') ? 'true' : 'false');
    };
    syncToggle();
    toggle.addEventListener('click', function () {
      var dark = !root.classList.contains('dark-mode');
      root.classList.toggle('dark-mode', dark);
      syncToggle();
      try {
        localStorage.setItem('darkMode', dark ? 'on' : 'off');
      } catch (e) {
        // Storage can be blocked (private mode); the toggle still works for this page.
      }
    });
  }

  // ── Reading progress (posts only) ──────────────────────────
  var progress = document.getElementById('reading-progress');
  if (progress) {
    var updateProgress = function () {
      var max = root.scrollHeight - root.clientHeight;
      progress.style.width = (max > 0 ? (root.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // ── Back to top ────────────────────────────────────────────
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    var updateBackToTop = function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  }

  // ── Table of contents (articles with 3+ sections) ──────────
  var body = document.querySelector('.post-body');
  var toc = document.getElementById('toc');
  if (body && toc) {
    var heads = Array.prototype.filter.call(body.children, function (el) {
      return el.tagName === 'H2' && el.id;
    });
    if (heads.length >= 3) {
      body.classList.add('has-toc');
      var list = toc.querySelector('.toc__list');
      var links = heads.map(function (head, i) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        var num = document.createElement('span');
        var label = document.createElement('span');
        link.href = '#' + head.id;
        num.className = 'toc__num';
        num.textContent = (i < 9 ? '0' : '') + (i + 1);
        label.textContent = head.textContent;
        link.appendChild(num);
        link.appendChild(label);
        item.appendChild(link);
        list.appendChild(item);
        return link;
      });
      toc.hidden = false;

      // The current section is the last heading above the top third of the viewport.
      var current = -1;
      var ticking = false;
      var markCurrent = function () {
        ticking = false;
        var line = window.innerHeight / 3;
        var index = 0;
        heads.forEach(function (head, i) {
          if (head.getBoundingClientRect().top < line) index = i;
        });
        if (index === current) return;
        current = index;
        links.forEach(function (link, i) {
          if (i === index) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      };
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(markCurrent);
        }
      }, { passive: true });
      markCurrent();
    }
  }

  // ── Tag filter (/posts/) ───────────────────────────────────
  var filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    var entries = document.querySelectorAll('.entry[data-tags]');
    var groups = document.querySelectorAll('.year-group');
    var status = document.getElementById('filter-status');
    var plural = function (n) {
      return n === 1 ? '1 articolo' : n + ' articoli';
    };

    var applyFilter = function (filter) {
      var shown = 0;
      var label = 'Tutti';
      entries.forEach(function (entry) {
        var tags = entry.dataset.tags ? entry.dataset.tags.split(',') : [];
        var match = filter === 'all' || tags.indexOf(filter) !== -1;
        entry.classList.toggle('is-hidden', !match);
        if (match) shown += 1;
      });
      groups.forEach(function (group) {
        var visible = group.querySelectorAll('.entry:not(.is-hidden)').length;
        group.hidden = visible === 0;
        var count = group.querySelector('.year-group__count');
        if (count) count.textContent = plural(visible);
      });
      filterButtons.forEach(function (button) {
        var on = button.dataset.filter === filter;
        button.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) label = button.dataset.label;
      });
      if (status) {
        status.textContent = filter === 'all' ? plural(shown) : plural(shown) + ' con argomento ' + label;
      }
    };

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.dataset.filter;
        applyFilter(filter);
        // Keep the filter in the URL so it can be shared; replaceState fires no hashchange.
        history.replaceState(null, '', filter === 'all' ? location.pathname : '#' + filter);
      });
    });

    // Tag links elsewhere point to /posts/#<tag>.
    var filterFromHash = function () {
      var hash = decodeURIComponent(location.hash.slice(1)).toLowerCase();
      var known = Array.prototype.some.call(filterButtons, function (button) {
        return button.dataset.filter === hash;
      });
      if (hash && known) applyFilter(hash);
    };
    filterFromHash();
    window.addEventListener('hashchange', filterFromHash);
  }
})();
