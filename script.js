(function () {
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Pillars: one open at a time
  var pillars = Array.prototype.slice.call(document.querySelectorAll('.pillar'));
  function openPillar(index) {
    pillars.forEach(function (p, i) {
      var on = i === index;
      p.classList.toggle('active', on);
      p.querySelector('.pillar-btn').setAttribute('aria-expanded', String(on));
    });
  }
  pillars.forEach(function (p, i) {
    var btn = p.querySelector('.pillar-btn');
    btn.addEventListener('click', function () {
      openPillar(i);
      // On narrow screens keep the card you just opened in view.
      if (window.matchMedia('(max-width: 900px)').matches) {
        setTimeout(function () { btn.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
      }
    });
    // Left and right arrows move between pillars.
    btn.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      var next = (i + step + pillars.length) % pillars.length;
      openPillar(next);
      pillars[next].querySelector('.pillar-btn').focus();
    });
  });

  // Hero bars jump to a pillar
  document.getElementById('heroBars').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pillar]');
    if (!btn) return;
    openPillar(Number(btn.getAttribute('data-pillar')));
    document.getElementById('pillars').scrollIntoView({ behavior: 'smooth' });
  });

  // Highlight current section in nav
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a'));
  var map = {};
  navAnchors.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          navAnchors.forEach(function (a) { a.classList.remove('active'); });
          map[entry.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // Theme toggle (kept in memory only)
  var root = document.documentElement;
  document.getElementById('themeToggle').addEventListener('click', function () {
    var current = root.getAttribute('data-theme');
    if (!current) {
      current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });
})();
