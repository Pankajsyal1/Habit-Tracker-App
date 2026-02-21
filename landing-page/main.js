// Tailwind Configuration
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { heading: ['Space Grotesk', 'sans-serif'], body: ['Inter', 'sans-serif'] },
      colors: {
        dark: { 900: '#0A0A0F', 800: '#12121A', 700: '#1E1E2E', 600: '#2A2A3C' },
        violet: { 400: '#A78BFA', 500: '#8B5CF6' },
        emerald: { 400: '#34D399', 500: '#10B981' },
      }
    }
  }
}

// Sticky Header on Scroll
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('header-scrolled', window.scrollY > 50);
});

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}
function closeMobile() { 
  if (mobileMenu) mobileMenu.classList.add('hidden'); 
}

// Scroll Reveal Animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// FAQ Accordion
function toggleFaq(btn) {
  const parent = btn.closest('[data-faq]');
  const answer = parent.querySelector('.faq-answer');
  const icon = parent.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');

  // Close all others
  document.querySelectorAll('[data-faq]').forEach(faq => {
    faq.querySelector('.faq-answer').classList.remove('open');
    faq.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
  });

  // Toggle current
  if (!isOpen) {
    answer.classList.add('open');
    icon.style.transform = 'rotate(180deg)';
  }
}

// Smooth active nav highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('text-white');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('text-white');
    }
  });
});
