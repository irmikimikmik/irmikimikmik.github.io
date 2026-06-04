document.addEventListener('DOMContentLoaded', () => {

  // ---- Projects
  const projCont = document.getElementById('project-list');
  if (projCont && Array.isArray(window.projectData)) {
    projCont.innerHTML = window.projectData.map(p => `
      <div class="project-card">
        <h3>${p.link
          ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">${p.title}</a>`
          : p.title
        }</h3>
        <div class="project-stack">${p.stack}</div>
        <div class="project-date">${p.date}</div>
        <p class="project-desc">${p.desc}</p>
      </div>
    `).join('');
  }

  // ---- Experience
  const expCont = document.getElementById('experience-list');
  if (expCont && Array.isArray(window.experienceData)) {
    expCont.innerHTML = window.experienceData.map(x => `
      <div class="timeline-item">
        <h3>${x.link
          ? `<a href="${x.link}" target="_blank" rel="noopener noreferrer">${x.role}</a>`
          : x.role
        }</h3>
        <div class="timeline-company">${x.company}</div>
        <div class="timeline-date">${x.date}</div>
        <ul>${(x.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  // ---- Education
  const eduCont = document.getElementById('education-block');
  const edu = window.educationData;
  if (eduCont && edu) {
    eduCont.innerHTML = `
      <div class="education-card">
        <h3>${edu.school}</h3>
        <div class="education-degree">${edu.degree}</div>
        <div class="education-date">${edu.date}</div>
        <p class="education-details">${edu.details}</p>
      </div>
    `;
  }

});
