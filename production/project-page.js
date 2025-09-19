(function () {
  // Helper: query string param
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  // Elements
  const el = (id) => document.getElementById(id);
  const titleEl = el('p-title');
  const subEl = el('p-sub');
  const tagsEl = el('p-tags');
  const linksEl = el('p-links');
  const heroEl = el('p-hero');
  const sumEl = el('p-summary');
  const detailsEl = el('p-details');
  const techEl = el('p-tech');
  const galleryWrap = el('p-gallerywrap');
  const galleryEl = el('p-gallery');

  function renderNotFound() {
    titleEl.textContent = "Project Not Found";
    subEl.textContent = "The project you’re looking for doesn’t exist.";
    tagsEl.innerHTML = "";
    linksEl.innerHTML = "";
    heroEl.style.display = "none";
    sumEl.textContent = "Check the link or return to the Work section.";
    detailsEl.innerHTML = "";
    techEl.innerHTML = "";
    galleryWrap.style.display = "none";
  }

  function pill(text) {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = text;
    return span;
  }

  function renderLink(link) {
    const a = document.createElement('a');
    a.href = link.href || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = link.kind === 'code' ? 'btn' : 'btn ghost';
    a.textContent = link.label || 'Link';
    return a;
  }

  function li(text) {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }

  function renderGallery(srcs) {
    galleryEl.innerHTML = '';
    if (!srcs || !srcs.length) {
      galleryWrap.style.display = 'none';
      return;
    }
    galleryWrap.style.display = '';
    srcs.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      galleryEl.appendChild(img);
    });
  }

  function load() {
    const db = window.PROJECTS || {};
    const proj = db[id];
    if (!id || !proj) {
      renderNotFound();
      return;
    }

    // Title & subtitle
    titleEl.textContent = proj.title || 'Untitled Project';
    subEl.textContent = proj.subtitle || '';

    // Tags
    tagsEl.innerHTML = '';
    (proj.tags || []).forEach(t => tagsEl.appendChild(pill(t)));

    // Links
    linksEl.innerHTML = '';
    (proj.links || []).forEach(link => linksEl.appendChild(renderLink(link)));

    // Hero image (optional)
    if (proj.hero) {
      heroEl.src = proj.hero;
      heroEl.style.display = '';
      heroEl.alt = proj.title || '';
    } else {
      heroEl.style.display = 'none';
    }

    // Summary
    sumEl.textContent = proj.summary || '';

    // Details bullets
    detailsEl.innerHTML = '';
    (proj.details || []).forEach(d => detailsEl.appendChild(li(d)));

    // Tech bullets
    techEl.innerHTML = '';
    (proj.tech || []).forEach(t => techEl.appendChild(li(t)));

    // Gallery (optional)
    renderGallery(proj.gallery);
  }

  // Kick things off
  load();
})();
