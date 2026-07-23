document.addEventListener('DOMContentLoaded', () => {

  // ---- Generic timeline renderer (used by Academic, Industry, Community, Athletic)
  function renderTimeline(containerId, data) {
    const cont = document.getElementById(containerId);
    if (!cont || !Array.isArray(data)) return;
    cont.innerHTML = data.map(x => `
      <div class="timeline-item">
        <h3>${x.link
          ? `<a href="${x.link}" target="_blank" rel="noopener noreferrer">${x.role}</a>`
          : x.role
        }</h3>
        <div class="timeline-company">${x.company}</div>
        <div class="timeline-date">${x.date}</div>
        ${(x.bullets && x.bullets.length) ? `<ul>${x.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('');
  }

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

  // ---- Academic Experience
  renderTimeline('academic-list', window.academicExperienceData);

  // ---- Conferences
  const confCont = document.getElementById('conference-list');
  if (confCont && Array.isArray(window.conferenceData)) {
    confCont.innerHTML = window.conferenceData.map(c => `
      <div class="timeline-item">
        <h3>${c.event}</h3>
        <div class="timeline-company">${c.role}</div>
        <div class="timeline-date">${c.date}</div>
        ${c.desc ? `<ul><li>${c.desc}</li></ul>` : ''}
      </div>
    `).join('');
  }

  // ---- Industry Experience
  renderTimeline('industry-list', window.industryExperienceData);

  // ---- Gender Diversity
  renderTimeline('gender-diversity-list', window.genderDiversityData);

  // ---- Indigenous Initiatives
  renderTimeline('indigenous-list', window.indigenousData);

  // ---- Athletic Achievements and Scholarships
  renderTimeline('athletic-list', window.athleticData);

  // ---- Education
  const eduCont = document.getElementById('education-block');
  if (eduCont && Array.isArray(window.educationData)) {
    eduCont.innerHTML = window.educationData.map(edu => `
      <div class="education-card">
        <h3>${edu.school}</h3>
        <div class="education-degree">${edu.degree}</div>
        <div class="education-date">${edu.date}</div>
        <p class="education-details">${edu.details}</p>
      </div>
    `).join('');
  }

});
