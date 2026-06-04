// ===== Nav scroll effect =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ===== Greeter: typing / deleting with per-phrase fonts & gradient colors =====
document.addEventListener('DOMContentLoaded', () => {
  const el     = document.getElementById('greeterText');
  const greeter = document.getElementById('greeter');
  if (!el || !greeter) return;

  const grad = (a, b) => `linear-gradient(90deg, ${a}, ${b})`;

  // Palette matched to dark theme accent colors
  const C1 = "#818cf8"; // indigo
  const C2 = "#a78bfa"; // violet
  const C3 = "#34d399"; // emerald
  const C4 = "#60a5fa"; // blue
  const C5 = "#f472b6"; // pink

  const phrases = [
    { text: "Hola, soy Irmak.",          cls: "font-serif",   color: grad(C5, C1), caretColor: C1 },
    { text: "Hello, world! I'm Irmak.",  cls: "font-display", color: grad(C1, C2), caretColor: C2 },
    { text: "Merhaba, ben Irmak.",       cls: "font-serif",   color: grad(C2, C3), caretColor: C3 },
    { text: "Hallo, ich bin Irmak.",     cls: "font-mono",    color: grad(C3, C4), caretColor: C4 },
    { text: "Bonjour, je suis Irmak.",   cls: "font-display", color: grad(C4, C5), caretColor: C5 }
  ];

  const typeSpeed       = 55;
  const deleteSpeed     = 35;
  const pauseAfterType  = 1200;
  const pauseAfterDelete = 350;

  let phraseIndex = 0, charIndex = 0, typing = true, currentCls = '';
  const caret = document.querySelector('#greeter .caret');

  function applyFont(cls) {
    if (currentCls) greeter.classList.remove(currentCls);
    greeter.classList.add(cls);
    currentCls = cls;
  }

  function applyColor(c, caretColor) {
    el.style.background = c;
    el.style.color = 'transparent';
    el.style.setProperty('-webkit-background-clip', 'text');
    el.style.backgroundClip = 'text';
    if (caret) caret.style.color = caretColor || '#fff';
  }

  function tick() {
    const { text, cls, color, caretColor } = phrases[phraseIndex];
    applyFont(cls);
    applyColor(color, caretColor);

    if (typing) {
      el.textContent = text.slice(0, ++charIndex);
      if (charIndex === text.length) {
        setTimeout(() => { typing = false; tick(); }, pauseAfterType);
      } else {
        setTimeout(tick, typeSpeed);
      }
    } else {
      el.textContent = text.slice(0, --charIndex);
      if (charIndex === 0) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(() => { typing = true; tick(); }, pauseAfterDelete);
      } else {
        setTimeout(tick, deleteSpeed);
      }
    }
  }

  tick();

  // ===== Active nav link highlighting via IntersectionObserver =====
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-35% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
});
