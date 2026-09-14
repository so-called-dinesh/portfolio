/* ==========================================================================
   Dinesh Bodhapalle — Portfolio interactions
   Scroll reveals, nav state, mobile menu, stat counters.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav background on scroll + progress bar ---------- */
  var nav = document.getElementById('siteNav');
  var progressBar = document.getElementById('progressBar');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('is-open', !open);
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = entry.target.getAttribute('data-delay');
        if (delay) entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Active nav link highlighting ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.site-nav__links .nav-link'));

  if ('IntersectionObserver' in window && navAnchors.length) {
    var setActive = function (id) {
      navAnchors.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    };

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.stat__num[data-count]'));

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = (target * eased).toFixed(decimals);
      el.textContent = decimals ? value : Math.round(target * eased);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      el.textContent = parseFloat(el.getAttribute('data-count')).toFixed(
        parseInt(el.getAttribute('data-decimals') || '0', 10)
      ) + (el.getAttribute('data-suffix') || '');
    });
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Signature draw-in ---------- */
  var signature = document.querySelector('.signature');
  if (signature && 'IntersectionObserver' in window && !prefersReduced) {
    var sigObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          sigObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sigObserver.observe(signature);
  } else if (signature) {
    signature.classList.add('in-view');
  }

  /* ---------- Custom trailing cursor (pointer devices only) ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !prefersReduced) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var focusables = 'a, button, .skill-chips span, .cert, .leadership__item, .project__panel';
    if (dot && ring) {
      document.documentElement.classList.add('js-cursor');
      var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      var rx = cx, ry = cy;

      window.addEventListener('mousemove', function (e) {
        cx = e.clientX;
        cy = e.clientY;
        ring.classList.toggle('is-hover', !!(e.target.closest && e.target.closest(focusables)));
      }, { passive: true });

      (function follow() {
        dot.style.transform = 'translate(' + (cx - 3) + 'px,' + (cy - 3) + 'px)';
        rx += (cx - rx) * 0.16;
        ry += (cy - ry) * 0.16;
        var shrink = ring.classList.contains('is-hover') ? -24 : -17;
        ring.style.transform = 'translate(' + (rx + shrink) + 'px,' + (ry + shrink) + 'px)';
        window.requestAnimationFrame(follow);
      })();
    }
  }

  /* ---------- Card hover spotlight ---------- */
  if (finePointer && !prefersReduced) {
    var spotTargets = Array.prototype.slice.call(
      document.querySelectorAll('.project__panel, .leadership__item, .cert')
    );
    function spotlight(e) {
      var rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      e.currentTarget.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }
    spotTargets.forEach(function (el) {
      el.addEventListener('mousemove', spotlight, { passive: true });
    });
  }

  /* ---------- Copy email + toast ---------- */
  var copyBtn = document.getElementById('copyEmail');
  var toast = document.getElementById('toast');
  if (copyBtn && toast) {
    copyBtn.addEventListener('click', function () {
      var email = (document.getElementById('emailLink') || { href: '' }).href.replace('mailto:', '');
      function showToast() {
        toast.textContent = 'Copied — my inbox awaits.';
        toast.classList.add('is-visible');
        setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
      }
      function legacyCopy() {
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
        showToast();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showToast).catch(legacyCopy);
      } else {
        legacyCopy();
      }
    });
  }

  /* ---------- Live clock (Pune · IST) ---------- */
  var clock = document.getElementById('localTime');
  if (clock) {
    function tickClock() {
      clock.textContent = 'IST \u00b7 ' +
        new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    tickClock();
    setInterval(tickClock, 30000);
  }
})();