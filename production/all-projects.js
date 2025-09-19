(function(){
  const grid = document.getElementById('grid');
  const tagbar = document.getElementById('tagbar');
  const db = window.PROJECTS || {};

  const rows = Object.entries(db).map(([id, p]) => ({
    id,
    title: p.title || 'Untitled',
    subtitle: p.subtitle || '',
    summary: p.summary || '',
    tags: (p.tags || []).map(String),
  }));

  const allTags = [...new Set(rows.flatMap(r => r.tags))].sort((a,b)=>a.localeCompare(b));
  let activeTags = new Set();

  function cardHTML(r){
    const tagsHTML = r.tags.map(t=>`<li>${t}</li>`).join('');
    return `
      <a class="card" href="project.html?id=${encodeURIComponent(r.id)}" tabindex="0">
        <h3>${r.title}</h3>
        <p>${r.summary || r.subtitle}</p>
        <ul class="tags">${tagsHTML}</ul>
      </a>
    `;
  }

  function render(){
    const filtered = rows.filter(r=>{
      return !activeTags.size || [...activeTags].every(t => r.tags.includes(t));
    });

    grid.innerHTML = filtered.map(cardHTML).join('');
    document.getElementById('empty').style.display = filtered.length ? 'none' : '';
  }

  function renderTagbar(){
    tagbar.innerHTML = allTags.map(t => `
      <button class="chip" type="button" data-tag="${t}" aria-pressed="false">${t}</button>
    `).join('');

    tagbar.addEventListener('click', (e)=>{
      const b = e.target.closest('[data-tag]');
      if(!b) return;
      const tag = b.getAttribute('data-tag');
      const pressed = b.getAttribute('aria-pressed') === 'true';
      b.setAttribute('aria-pressed', String(!pressed));
      if(pressed) activeTags.delete(tag); else activeTags.add(tag);
      render();
    });
  }

  renderTagbar();
  render();
})();
