// =====================
// NAVBAR SCROLL
// =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// =====================
// HAMBURGER MENU
// =====================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// =====================
// PARTICLE CANVAS
// =====================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.size = Math.random() * 1.5 + 0.3;
  this.speedX = (Math.random() - 0.5) * 0.3;
  this.speedY = (Math.random() - 0.5) * 0.3;
  this.opacity = Math.random() * 0.6 + 0.1;
  this.color = Math.random() > 0.7 ? '#d4a843' : '#8b7eb8';
}

Particle.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;
  if (this.x < 0) this.x = canvas.width;
  if (this.x > canvas.width) this.x = 0;
  if (this.y < 0) this.y = canvas.height;
  if (this.y > canvas.height) this.y = 0;
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.globalAlpha = this.opacity;
  ctx.fill();
  ctx.globalAlpha = 1;
};

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

// Draw radial gradient glow behind particles
function drawGlow() {
  const grd = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.4, 0,
    canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.6
  );
  grd.addColorStop(0, 'rgba(100,60,180,0.12)');
  grd.addColorStop(0.5, 'rgba(212,168,67,0.04)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGlow();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animate);
}
animate();

// =====================
// REVEAL ON SCROLL
// =====================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * (entry.target.dataset.delay || 0));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el, i) => {
  el.dataset.delay = i % 4;
  observer.observe(el);
});

// =====================
// HOVER TO PLAY + CLICK LIGHTBOX
// =====================
const modal = document.getElementById('reelModal');
const modalIframe = document.getElementById('modalIframe');
const modalClose = document.getElementById('modalClose');

function openModal(reelUrl) {
  modalIframe.src = reelUrl;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalIframe.src = ''; }, 350);
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('.portfolio-item').forEach(item => {
  const overlay = item.querySelector('.reel-overlay');
  const reelUrl = item.getAttribute('data-reel');

  // CLICK → open fullscreen modal (overlay catches click on top of the iframe)
  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(reelUrl);
  });
});

// =====================
// ACTIVE NAV HIGHLIGHT
// =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));
