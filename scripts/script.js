/* =============================================
   LUEGO PEREIRA — script.js v3
   ============================================= */

/* ============================================
   AUDIO
   ============================================ */
var SOUND_ON = true;
var _audioCtx = null;
function getCtx() { if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return _audioCtx; }
function playTone(f, d, v, t) {
    if (!SOUND_ON) return;
    try { var ctx = getCtx(), o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = t || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(v || .03, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + d); o.start(); o.stop(ctx.currentTime + d); } catch (e) { }
}
function sndHover() { playTone(620, .06, .02); }
function sndClick() { playTone(400, .12, .04, 'triangle'); }
function sndToggle() { playTone(860, .08, .025); }
function sndNav() { playTone(520, .14, .035); }

var soundBtn = document.getElementById('sound-toggle');
if (soundBtn) { soundBtn.addEventListener('click', function () { SOUND_ON = !SOUND_ON; soundBtn.setAttribute('data-on', SOUND_ON ? '1' : '0'); if (SOUND_ON) playTone(660, .1, .04); }); }

/* ============================================
   THEME TOGGLE
   ============================================ */
var html = document.documentElement;
var themeBtn = document.getElementById('theme-toggle');
function setTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (themeBtn) themeBtn.setAttribute('data-dark', dark ? '1' : '0');
    localStorage.setItem('lp-theme', dark ? 'dark' : 'light');
}
setTheme(localStorage.getItem('lp-theme') === 'dark');
if (themeBtn) { themeBtn.addEventListener('click', function () { setTheme(html.getAttribute('data-theme') !== 'dark'); sndToggle(); }); }

/* ============================================
   LANGUAGE TOGGLE
   ============================================ */
var currentLang = localStorage.getItem('lp-lang') || 'fr';
var langBtn = document.getElementById('lang-toggle');
function applyLang(lang) {
    currentLang = lang;
    html.setAttribute('data-lang', lang);
    if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    localStorage.setItem('lp-lang', lang);
    document.querySelectorAll('[data-fr]').forEach(function (el) {
        var val = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
        if (!val) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
        else el.innerHTML = val;
    });
    sndToggle();
}
applyLang(currentLang);
if (langBtn) { langBtn.addEventListener('click', function () { applyLang(currentLang === 'fr' ? 'en' : 'fr'); }); }

/* ============================================
   LOADER
   ============================================ */
(function () {
    var loader = document.getElementById('loader');
    if (!loader) return;
    var fill = loader.querySelector('.loader-bar-fill');
    var pct = loader.querySelector('.loader-pct');
    var n = 0;
    var iv = setInterval(function () {
        n += Math.random() * 13 + 4; if (n >= 100) n = 100;
        if (fill) fill.style.width = n + '%';
        if (pct) pct.textContent = Math.floor(n) + '%';
        playTone(300 + n * 3.5, .035, .01);
        if (n >= 100) { clearInterval(iv); setTimeout(function () { loader.classList.add('hidden'); initHeroAnim(); }, 380); }
    }, 75);
})();

document.querySelectorAll('a,button,.footer-pill,.nav-pill,.menu-float-link').forEach(function (el) {
    el.addEventListener('mouseenter', sndHover);
    el.addEventListener('click', sndClick);
});

/* ============================================
   MENU FLOTTANT — toggle + backdrop
   ============================================ */
var menuOverlay = document.getElementById('menu-overlay');

/* Créer le backdrop dynamiquement */
var backdrop = document.createElement('div');
backdrop.id = 'menu-overlay-backdrop';
document.body.appendChild(backdrop);

function openMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = '';
    sndNav();
    /* Marquer la page active */
    var path = window.location.pathname.split('/').pop() || 'index.html';
    menuOverlay.querySelectorAll('.menu-float-link').forEach(function (link) {
        var href = link.getAttribute('href') || '';
        link.classList.toggle('active', href === path || href.replace('.html', '') === (path.replace('.html', '')));
    });
}
function closeMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.remove('open');
    backdrop.classList.remove('active');
    sndClick();
}

document.querySelectorAll('.js-menu-open').forEach(function (btn) {
    btn.addEventListener('click', function () {
        if (menuOverlay.classList.contains('open')) closeMenu();
        else openMenu();
    });
});
backdrop.addEventListener('click', closeMenu);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

/* ============================================
   PAGE TRANSITION
   ============================================ */
var trans = document.getElementById('page-transition');
document.querySelectorAll('a[data-page]').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        closeMenu();
        sndNav();
        if (trans) trans.classList.add('entering');
        setTimeout(function () { window.location.href = href; }, 460);
    });
});
window.addEventListener('load', function () {
    if (trans) { trans.classList.add('leaving'); setTimeout(function () { trans.classList.remove('entering', 'leaving'); }, 520); }
});

/* ============================================
   HERO ANIMATION
   ============================================ */
function initHeroAnim() {
    document.querySelectorAll('.hero-word-inner').forEach(function (el, i) {
        setTimeout(function () { el.classList.add('visible'); }, i * 90);
    });
    setTimeout(function () {
        var sub = document.querySelector('.hero-subtitle');
        var scr = document.querySelector('.hero-scroll');
        if (sub) sub.classList.add('visible');
        if (scr) scr.classList.add('visible');
    }, 360);
}
if (!document.getElementById('loader')) initHeroAnim();

/* ============================================
   HERO PARALLAX
   ============================================ */
document.addEventListener('mousemove', function (e) {
    document.querySelectorAll('.hero-word-inner.visible').forEach(function (w, i) {
        var dx = (e.clientX / window.innerWidth - .5) * 10;
        var dy = (e.clientY / window.innerHeight - .5) * 4;
        var dir = i % 2 === 0 ? 1 : -.5;
        w.style.transform = 'translateY(0) translateX(' + (dx * dir) + 'px) translateY(' + (dy * dir * .5) + 'px)';
    });
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i * .05, .3) + 's';
    revObs.observe(el);
});

/* ============================================
   STACK SECTION SCALE
   ============================================ */
(function () {
    var stacks = document.querySelectorAll('.stack-section');
    if (!stacks.length) return;
    window.addEventListener('scroll', function () {
        stacks.forEach(function (sec) {
            var rect = sec.getBoundingClientRect();
            var p = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * .4)));
            sec.style.transform = 'scale(' + (1 - p * .03) + ')';
            sec.style.transformOrigin = 'top center';
        });
    }, { passive: true });
})();

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var t0 = performance.now();
    (function step(now) {
        var p = Math.min((now - t0) / 1300, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    })(t0);
}
document.querySelectorAll('[data-target]').forEach(function (el) {
    new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) animCounter(e.target); });
    }, { threshold: .5 }).observe(el);
});

/* ============================================
   FILTER BUTTONS
   ============================================ */
document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        document.querySelectorAll('.work-card[data-cat],.work-list-item[data-cat]').forEach(function (card) {
            card.style.display = (f === 'all' || card.getAttribute('data-cat') === f) ? '' : 'none';
        });
        sndClick();
    });
});

/* ============================================
   VIEW TOGGLE (work page)
   ============================================ */
var btnGrid = document.getElementById('btn-grid');
var btnList = document.getElementById('btn-list');
var gridV = document.getElementById('grid-view');
var listV = document.getElementById('list-view');
if (btnGrid && btnList) {
    btnGrid.addEventListener('click', function () { btnGrid.classList.add('active'); btnList.classList.remove('active'); gridV.classList.add('active'); listV.classList.remove('active'); sndClick(); });
    btnList.addEventListener('click', function () { btnList.classList.add('active'); btnGrid.classList.remove('active'); listV.classList.add('active'); gridV.classList.remove('active'); sndClick(); });
}

/* ============================================
   NEXT PROJECT — jauge LENTE synchronisée au scroll
   La jauge démarre à 10% dès que la section entre dans le viewport
   et monte progressivement jusqu'à 100% au fur et à mesure du scroll
   ============================================ */
(function () {
    var section = document.getElementById('next-project-section');
    if (!section) return;
    var gauge = document.getElementById('next-pct');
    var nextHref = section.getAttribute('data-next-href');
    var triggered = false;
    var displayed = 0; /* valeur affichée animée */
    var target = 0;    /* valeur cible calculée */
    var rafId = null;

    /* Animation fluide de la jauge */
    function animGauge() {
        if (Math.abs(displayed - target) < .5) {
            displayed = target;
        } else {
            displayed += (target - displayed) * .06; /* lent = .06 */
        }
        var pct = Math.max(0, Math.min(100, Math.round(displayed)));
        if (gauge) gauge.textContent = pct + '%';

        if (pct >= 100 && !triggered && nextHref) {
            triggered = true;
            var trans = document.getElementById('page-transition');
            if (trans) trans.classList.add('entering');
            setTimeout(function () { window.location.href = nextHref; }, 520);
        }
        rafId = requestAnimationFrame(animGauge);
    }
    animGauge();

    window.addEventListener('scroll', function () {
        var rect = section.getBoundingClientRect();
        var wh = window.innerHeight;
        var sectionH = section.offsetHeight;

        /* Section pas encore visible */
        if (rect.top > wh) { target = 0; return; }

        /* Calcul : combien de la section a-t-on scrollé ?
           On donne un départ à 8% dès que la section apparaît */
        var scrolled = wh - rect.top;
        var rawPct = (scrolled / sectionH) * 100;
        target = Math.max(0, Math.min(100, rawPct + 8));
    }, { passive: true });
})();

/* ============================================
   TITLE SCRAMBLE
   ============================================ */
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
document.querySelectorAll('.scramble').forEach(function (el) {
    var orig = el.textContent;
    var iv;
    el.addEventListener('mouseenter', function () {
        var iter = 0; clearInterval(iv);
        iv = setInterval(function () {
            el.textContent = orig.split('').map(function (c, idx) {
                return idx < iter ? orig[idx] : (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]);
            }).join('');
            if (iter >= orig.length) clearInterval(iv);
            iter += .5;
        }, 28);
    });
    el.addEventListener('mouseleave', function () { clearInterval(iv); el.textContent = orig; });
});

/* ============================================
   CLOCKS
   ============================================ */
function updateClocks() {
    var now = new Date();
    function fmt(tz) { return new Intl.DateTimeFormat('fr', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(now); }
    var m = document.getElementById('clock-matane');
    var p = document.getElementById('clock-paris');
    var ml = document.getElementById('clock-malte');
    if (m) m.textContent = fmt('America/Toronto');
    if (p) p.textContent = fmt('Europe/Paris');
    if (ml) ml.textContent = fmt('Europe/Malta');
}
updateClocks();
setInterval(updateClocks, 15000);