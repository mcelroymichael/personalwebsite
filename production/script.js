// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav (kept minimal; converts nav into a dropdown on small screens)
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function setMobileMode() {
  if (window.matchMedia('(max-width: 680px)').matches) {
    menuToggle.style.display = 'block';
    nav.dataset.mobile = 'true';
  } else {
    menuToggle.style.display = 'none';
    nav.dataset.mobile = 'false';
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}
setMobileMode();
window.addEventListener('resize', setMobileMode);

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Basic mobile styles injected when nav is mobile
const style = document.createElement('style');
style.textContent = `
  .nav[data-mobile="true"]{
    position:absolute; right:10px; left:10px; top:56px;
    display:none; flex-direction:column; gap:.2rem;
    background:var(--bg-alt); border:1px solid var(--line); border-radius:12px; padding:.4rem;
  }
  .nav[data-mobile="true"].open{ display:flex; }
`;
document.head.appendChild(style);

