/* ── NAV SCROLL ── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── MENU MOBILE ── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── TÍTULO HERO — PALAVRAS APARECEM UMA A UMA ── */
(function () {
  const words = document.querySelectorAll('.hero-word');
  const dot = document.getElementById('heroDot');
  if (!words.length) return;

  let delay = 400;
  words.forEach((word) => {
    setTimeout(() => {
      word.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      word.style.opacity = '1';
      word.style.transform = 'translateY(0)';
    }, delay);
    delay += 220;
  });

  // Ponto final aparece por último
  if (dot) {
    setTimeout(() => {
      dot.style.transition = 'opacity 0.5s ease';
      dot.style.opacity = '1';
    }, delay + 100);
  }
})();

/* ── ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER) ── */
(function () {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  elements.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ── SMOOTH SCROLL ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav')?.offsetHeight || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });
    });
  });
})();

/* ── PARTÍCULAS NO HERO ── */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;opacity:0.25;';
  hero.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const COLOR = '168,85,247';
  let W, H, pts = [];
  function resize() { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; }
  function mkPt() { return { x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, r:Math.random()*1.4+.4, o:Math.random()*.35+.1, od:(Math.random()-.5)*.004 }; }
  function frame() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.o+=p.od;
      if(p.o<.05||p.o>.5) p.od*=-1;
      if(p.x<0) p.x=W; if(p.x>W) p.x=0; if(p.y<0) p.y=H; if(p.y>H) p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${COLOR},${p.o})`; ctx.fill();
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(${COLOR},${(1-d/100)*.1})`; ctx.lineWidth=.5; ctx.stroke(); }
    }
    requestAnimationFrame(frame);
  }
  resize(); pts=Array.from({length:50},mkPt);
  window.addEventListener('resize',resize,{passive:true});
  frame();
})();

/* ── TYPEWRITER NO HERO TAG ── */
(function () {
  const tag = document.getElementById('heroTag');
  if (!tag) return;
  const words = ['Desenvolvedor Web','Full Stack','Integração com IA','Soluções Digitais'];
  let wi=0,ci=0,del=false,paused=false;
  function type() {
    if(paused) return;
    const w=words[wi];
    tag.textContent=del?w.substring(0,--ci):w.substring(0,++ci);
    if(!del&&ci===w.length){paused=true;setTimeout(()=>{paused=false;del=true;setTimeout(type,40)},2200);return}
    if(del&&ci===0){del=false;wi=(wi+1)%words.length}
    setTimeout(type,del?38:78);
  }
  setTimeout(type,1800);
})();

/* ── NAV LINK ATIVO ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if(!sections.length||!links.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        links.forEach(link => {
          link.style.color = link.getAttribute('href')==='#'+entry.target.id ? 'var(--text)' : '';
        });
      }
    });
  },{threshold:0.4});
  sections.forEach(s=>observer.observe(s));
})();

/* ── CONTADOR ANIMADO ── */
(function () {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();