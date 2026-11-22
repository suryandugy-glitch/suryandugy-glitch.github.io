/* Page animations: intro loader, hero text reveal, typed roles, scroll reveals,
   heading scramble, counters, marquee, cursor, card glare, scroll progress. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var done = false;

  /* ---- loader ---- */
  var loader = $('#loader'), ldn = $('#ldn'), ldbar = $('#ldbar');
  function reveal() {
    if (done) return; done = true;
    document.body.classList.add('go');
    if (loader) { loader.classList.add('out'); setTimeout(function () { loader.remove(); }, 1100); }
    startReveals();
  }
  if (RM || !loader) { if (loader) loader.remove(); done = false; reveal(); }
  else {
    var t0 = performance.now(), dur = 1300;
    (function tick() {
      var p = Math.min(1, (performance.now() - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      ldn.textContent = Math.round(e * 100); ldbar.style.transform = 'scaleX(' + e + ')';
      if (p < 1) requestAnimationFrame(tick); else setTimeout(reveal, 150);
    })();
    setTimeout(reveal, 4000);
  }

  /* ---- hero name: split into letters ---- */
  var h1 = $('h1');
  if (h1 && !RM) {
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    var idx = 0;
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (word) {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'wd';
            word.split('').forEach(function (ch) {
              var s = document.createElement('span'); s.className = 'ch'; s.setAttribute('aria-hidden', 'true');
              s.style.setProperty('--i', idx++); s.textContent = ch; w.appendChild(s);
            });
            frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) split(c);
      });
    })(h1);
  }

  /* ---- typed roles ---- */
  var roleEl = $('#role');
  if (roleEl && !RM) {
    var roles = ['Agri-tech engineer', 'Open-source contributor', 'Hackathon winner', 'Full stack developer', 'Author of Tantric Trail', 'Guitarist'];
    var ri = 0, ci = roles[0].length, del = false;
    (function type() {
      var w = roles[ri];
      if (!del) { ci++; if (ci > w.length) { del = true; return setTimeout(type, 1500); } }
      else { ci--; if (ci < 0) { del = false; ri = (ri + 1) % roles.length; ci = 0; } }
      roleEl.textContent = w.slice(0, Math.max(0, ci));
      setTimeout(type, del ? 28 : 65);
    })();
  }

  /* ---- scroll progress + nav highlight ---- */
  var prog = $('#prog');
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) {
    var links = {}; $$('nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { $$('nav a').forEach(function (a) { a.classList.remove('active'); }); var a = links[e.target.id]; if (a) a.classList.add('active'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('main section').forEach(function (s) { nio.observe(s); });
  }

  /* ---- scramble ---- */
  var GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}#';
  function scramble(el) {
    if (RM) return;
    var txt = el.getAttribute('data-t') || el.textContent; el.setAttribute('data-t', txt);
    var t0 = performance.now(), dur = 700;
    (function step() {
      var p = Math.min(1, (performance.now() - t0) / dur), n = Math.floor(p * txt.length), out = '';
      for (var i = 0; i < txt.length; i++) out += (i < n || txt[i] === ' ') ? txt[i] : GL[Math.random() * GL.length | 0];
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
    })();
  }

  /* ---- counters ---- */
  function count(el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = +el.getAttribute('data-dec') || 0;
    if (RM) { el.textContent = end.toFixed(dec); return; }
    var t0 = performance.now(), dur = 1400;
    (function step() {
      var p = Math.min(1, (performance.now() - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec); if (p < 1) requestAnimationFrame(step);
    })();
  }

  /* ---- scroll reveals ---- */
  var SEL = 'section h2, section .sub, .about > *, .grid > *, .hob > *, .skl > div, #sphere, .filters, .links, .copy, .stats > div, .chips, .marq';
  function startReveals() {
    var els = $$(SEL);
    if (RM || !('IntersectionObserver' in window)) { $$('[data-count]').forEach(count); return; }
    els.forEach(function (el) {
      if (el.closest('#certGrid')) return;
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(sib, 6));
      el.classList.add('rv');
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io.unobserve(el); el.classList.add('in');
        if (el.tagName === 'H2') scramble(el);
        $$('[data-count]', el).forEach(count); if (el.hasAttribute('data-count')) count(el);
        setTimeout(function () { el.classList.remove('rv', 'in'); }, 1500 + (+el.style.getPropertyValue('--d') || 0) * 90);
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { if (el.classList.contains('rv')) io.observe(el); });
    $$('.stats b[data-count]').forEach(function (b) { b.textContent = '0'; });
    setTimeout(function () { $$('.rv').forEach(function (e) { e.classList.add('in'); }); }, 7000);
  }

  /* ---- marquee ---- */
  var A = ['Python', 'TypeScript', 'React', 'Node.js', 'Electron', 'C++', 'Git', 'Generative AI', 'AI Agents', 'Claude', 'Gemini', 'Data Analytics', 'IAM', 'IoT', 'Drones', 'Genetics'];
  var B = ['Open Source', 'MLH 1st Prize', 'Hacktoberfest Winner', 'CodeVoyage Winner', 'Astrix Browser', 'Agent-Reach', 'Tantric Trail', 'Kalyani', 'JIS College of Engineering', 'Full Stack'];
  var colors = ['#efc765', '#5fd6c6', '#ff7a6b', '#a58bff', '#5db8ff', '#ff74b8'];
  $$('.mrow').forEach(function (row, r) {
    var items = r ? B : A, html = '';
    for (var k = 0; k < 2; k++) items.forEach(function (t, i) {
      html += '<span style="--c:' + colors[(i + r * 2) % 6] + '">' + t + '</span><i></i>';
    });
    row.innerHTML = '<div class="mtrack">' + html + html + '</div>';
  });

  /* ---- cursor, glare ---- */
  var cur = $('#cur'), curd = $('#curd');
  if (matchMedia('(pointer: fine)').matches && !RM && cur) {
    document.body.classList.add('hasCur');
    var x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('pointermove', function (e) { x = e.clientX; y = e.clientY; curd.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }, { passive: true });
    (function loop() { cx += (x - cx) * .16; cy += (y - cy) * .16; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('pointerover', function (e) { cur.classList.toggle('big', !!e.target.closest('a,button,.tilt,.cert,.orb,.flip,.chip')); });
    document.addEventListener('pointerdown', function () { cur.classList.add('press'); });
    document.addEventListener('pointerup', function () { cur.classList.remove('press'); });
  }
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.tilt,.cert,.panel');
    if (!c) return; var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  }, { passive: true });
})();
