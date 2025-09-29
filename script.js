// ===== intro video freeze-frame =====
const video = document.getElementById('introVideo');
const content = document.getElementById('content');
const intro = document.getElementById('intro');

if (video) {
  video.addEventListener('ended', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      document.body.style.backgroundImage = `url(${canvas.toDataURL('image/jpeg', 0.9)})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    } catch (e) {
      console.warn('Could not capture final frame:', e);
    }
    intro && (intro.style.display = 'none');
    content && content.classList.remove('hidden');
  });
}

// ===== greeter typing/deleting with per-phrase fonts & colors =====
document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('greeterText');
    const greeter = document.getElementById('greeter');
    if (!el || !greeter) return; // greeter not on this page

    // helper
    const grad = (a, b) => `linear-gradient(90deg, ${a}, ${b})`;

    // your palette
    const C1 = "#77BEF0"; // sky
    const C2 = "#A97BE0"; // lavender
    const C3 = "#EA5B6F"; // rose
    const C4 = "#FF894F"; // orange
    const C5 = "#FFCB61"; // sun

    // 5 phrases, ordered for smooth blending
    const phrases = [
    { text: "Hola, soy Irmak.",          cls: "font-serif",   color: grad(C5, C1), caretColor: C1 },  // lavender→sky
    { text: "Hello, world! I'm Irmak.",  cls: "font-display", color: grad(C1, C2), caretColor: C2 }, // sky→sun
    { text: "Merhaba, ben Irmak.",       cls: "font-serif",   color: grad(C2, C3), caretColor: C3 }, // sun→orange
    { text: "Hallo, ich bin Irmak.",     cls: "font-mono",    color: grad(C3, C4), caretColor: C4 }, // orange→rose
    { text: "Bonjour, je suis Irmak.",   cls: "font-display", color: grad(C4, C5), caretColor: C5 } // rose→lavender
    ];

  const typeSpeed = 55;
  const deleteSpeed = 35;
  const pauseAfterType = 1200;
  const pauseAfterDelete = 350;

  let phraseIndex = 0;
  let charIndex = 0;
  let typing = true;
  let currentCls = '';

  function applyFont(cls) {
    if (currentCls) greeter.classList.remove(currentCls);
    greeter.classList.add(cls);
    currentCls = cls;
  }

  const caret = document.querySelector('#greeter .caret');

  function applyColor(c, caretColor) {
    // reset
    el.style.background = '';
    el.style.color = '';
    el.style.removeProperty('-webkit-background-clip');
    el.style.backgroundClip = '';

    // gradient text
    el.style.background = c;
    el.style.color = 'transparent';
    el.style.setProperty('-webkit-background-clip', 'text');
    el.style.backgroundClip = 'text';

    // solid caret to match the phrase
    if (caret) caret.style.color = caretColor || '#fff';
    }

  function tick() {
    const { text, cls, color } = phrases[phraseIndex]; // <-- include color
    applyFont(cls);
    applyColor(color);

    if (typing) {
      charIndex++;
      el.textContent = text.slice(0, charIndex);
      if (charIndex === text.length) {
        setTimeout(() => { typing = false; tick(); }, pauseAfterType);
      } else {
        setTimeout(tick, typeSpeed);
      }
    } else {
      charIndex--;
      el.textContent = text.slice(0, charIndex);
      if (charIndex === 0) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(() => { typing = true; tick(); }, pauseAfterDelete);
      } else {
        setTimeout(tick, deleteSpeed);
      }
    }
  }

  // Don’t force a global gradient class—let phrases control color/gradient
  // greeter.classList.add('gradient'); // <-- remove this line if you had it

  tick();
});
