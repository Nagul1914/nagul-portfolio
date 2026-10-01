'use strict';

const PAGES = ['home', 'about', 'skills', 'da-projects', 'ba-projects', 'ib-projects', 'contact'];
const PAGE_TITLES = {home:'Financial Analysis & Data Science',about:'Experience',skills:'Expertise','da-projects':'Data Analysis Projects','ba-projects':'Business Analysis Projects','ib-projects':'Investment Banking Projects',contact:'Contact'};
const menuButton = document.getElementById('menu-button');
const nav = document.getElementById('primary-nav');
const themeButton = document.getElementById('appearance-button');

function closeNavigation() {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
  document.querySelector('.work-menu').open = false;
}

function renderRoute(focusContent = false) {
  const requested = location.hash.slice(1) || 'home';
  if (requested === 'main-content') { document.getElementById('main-content').focus(); return; }
  const page = PAGES.includes(requested) ? requested : 'home';
  document.querySelectorAll('.page').forEach(element => {
    const active = element.id === 'page-' + page;
    element.classList.toggle('active', active);
    element.setAttribute('aria-hidden', String(!active));
  });
  document.querySelectorAll('.page.active .proj-expand.open').forEach(panel => {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
  document.querySelectorAll('.primary-nav a').forEach(link => {
    if (link.hash === '#' + page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('.work-menu').classList.toggle('is-current', page.endsWith('-projects'));
  document.title = 'Nagul S | ' + PAGE_TITLES[page];
  closeNavigation();
  document.querySelectorAll('.page.active .reveal').forEach(element => element.classList.add('visible'));
  if (focusContent) document.getElementById('main-content').focus({preventScroll:true});
  window.scrollTo({top:0,left:0,behavior:'instant'});
}

// Kept available for the preserved project content and existing hash URLs.
function navigate(page) {
  const next = PAGES.includes(page) ? page : 'home';
  if (location.hash === '#' + next) renderRoute(true);
  else location.hash = next;
}

function toggleExpand(id, button) {
  const panel = document.getElementById(id);
  const open = !panel.classList.contains('open');
  panel.classList.toggle('open', open);
  panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
  panel.setAttribute('aria-hidden', String(!open));
  button.textContent = open ? '↑ Collapse' : '↓ Details';
  button.setAttribute('aria-expanded', String(open));
}

document.querySelectorAll('.proj-expand').forEach(panel => {
  panel.setAttribute('aria-hidden','true');
  const button = document.querySelector('button[onclick*="' + panel.id + '"]');
  if (button) { button.setAttribute('aria-controls',panel.id); button.setAttribute('aria-expanded','false'); }
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = theme === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance';
  themeButton.setAttribute('aria-label',label);
  themeButton.title = label;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#111b1d' : '#f9faf9';
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('nagul-portfolio-theme') || 'light'; } catch (_) { /* Storage may be disabled. */ }
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('nagul-portfolio-theme',theme); } catch (_) { /* Theme still works for this visit. */ }
});
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
});
document.addEventListener('keydown',event => { if(event.key === 'Escape') closeNavigation(); });
document.addEventListener('click',event => {
  if (!event.target.closest('.work-menu')) document.querySelector('.work-menu').open = false;
  const anchor = event.target.closest('a[href^="#"]');
  if (anchor && anchor.hash === location.hash && anchor.hash !== '#main-content') {event.preventDefault();renderRoute(true);}
});
window.addEventListener('hashchange', () => renderRoute(true));
window.addEventListener('resize', () => {
  document.querySelectorAll('.page.active .proj-expand.open').forEach(panel => { panel.style.maxHeight = panel.scrollHeight + 'px'; });
  if (window.innerWidth > 640) closeNavigation();
});
renderRoute();
