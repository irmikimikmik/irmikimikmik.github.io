document.addEventListener('DOMContentLoaded', () => {
  // ---- Sticky Notes (only if sections exists)
  try {
    const nav = document.querySelector('.sticky-notes');
    const sections = window.sections; // may be undefined, that's ok
    if (nav && Array.isArray(sections)) {
      const frag = document.createDocumentFragment();
      sections.forEach(({ id, color, label }) => {
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.className = `sticky ${color}`;
        a.textContent = label;
        frag.appendChild(a);
      });
      nav.appendChild(frag);
    }
  } catch (e) {
    console.error('Nav render error:', e);
  }

  // ---- Projects
  try {
    const cont = document.getElementById('project-list');
    const data = window.projectData;
    if (cont && Array.isArray(data)) {
      cont.innerHTML = data.map(p => `
        <div>
          <h3>${p.link ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">${p.title}</a>` : p.title}</h3>
          <p><em>${p.stack}</em> | ${p.date}</p>
          <p>${p.desc}</p>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('Projects render error:', e);
  }

  // ---- Experience
  try {
    const cont = document.getElementById('experience-list');
    const data = window.experienceData;
    if (cont && Array.isArray(data)) {
      cont.innerHTML = data.map(x => `
        <div>
          <h3>${x.role}</h3>
          <p><strong>${x.company}</strong> | ${x.date}</p>
          <ul>${(x.bullets||[]).map(b=>`<li>${b}</li>`).join('')}</ul>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('Experience render error:', e);
  }

  // ---- Education
  try {
    const cont = document.getElementById('education-block');
    const d = window.educationData;
    if (cont && d) {
      cont.innerHTML = `
        <h3>${d.school}</h3>
        <p class="degree">${d.degree}</p>
        <p><em>${d.date}</em></p>
        <p>${d.details}</p>
      `;
    }
  } catch (e) {
    console.error('Education render error:', e);
  }
});
