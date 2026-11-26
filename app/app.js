// app.js — DataNusa router.
// Hash routes map to the page renderers in views.js. The nav highlights the
// active page, and the page title follows the route.

import { viewOverview, viewPopulation, viewEconomy, viewEmployment, viewHealth, viewEducation } from './views.js';

const ROUTES = {
  '': { title: 'Indonesia in numbers — DataNusa', render: viewOverview },
  population: { title: 'Population — DataNusa', render: viewPopulation },
  economy: { title: 'Economy — DataNusa', render: viewEconomy },
  employment: { title: 'Employment — DataNusa', render: viewEmployment },
  health: { title: 'Health — DataNusa', render: viewHealth },
  education: { title: 'Education — DataNusa', render: viewEducation },
};

const view = document.getElementById('view');
const navLinks = [...document.querySelectorAll('.nav-link')];

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
  return ROUTES[hash] ? hash : '';
}

function render() {
  const route = currentRoute();
  const page = ROUTES[route];
  document.title = page.title;
  view.replaceChildren(page.render());
  for (const link of navLinks) {
    const target = link.getAttribute('href').replace(/^#\/?/, '').replace(/\/$/, '');
    link.classList.toggle('active', target === route);
    if (target === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
