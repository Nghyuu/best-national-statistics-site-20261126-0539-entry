// views.js — page renderers for DataNusa.
// Each page is built from data.js figures and charts.js drawings, so every
// number on screen comes from the labelled data arrays, not from markup.

import {
  HEADLINE, POPULATION_SERIES, PROVINCES, POPULATION_FACTS,
  GDP_SERIES, GDP_SHARES, ECONOMY_FACTS,
  UNEMPLOYMENT_SERIES, SECTOR_SHARES, EMPLOYMENT_FACTS,
  LIFE_SERIES, HEALTH_BY_PROVINCE, HEALTH_FACTS,
  LITERACY_SERIES, ENROLMENT, EDUCATION_FACTS, META,
} from './data.js';
import { barChart, lineChart, donutChart, hbarList } from './charts.js';

function h(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function sourceNote() {
  return h('p', 'source-note', `Source: ${META.source}. Figures are rounded; see each figure's year label.`);
}

function factGrid(facts) {
  const grid = h('div', 'fact-grid');
  for (const f of facts) {
    const card = h('div', 'fact-card');
    card.append(h('span', 'fact-label', f.label));
    card.append(h('span', 'fact-value', f.value));
    card.append(h('span', 'fact-note', f.note));
    grid.appendChild(card);
  }
  return grid;
}

function section(title, intro) {
  const wrap = h('section', 'panel');
  wrap.append(h('h2', null, title));
  if (intro) wrap.append(h('p', 'panel-intro', intro));
  return wrap;
}

function kpiCards(items) {
  const grid = h('div', 'kpi-grid');
  for (const it of items) {
    const a = document.createElement('a');
    a.className = 'kpi-card';
    a.href = `#/${it.page}`;
    a.append(h('span', 'kpi-label', it.label));
    a.append(h('span', 'kpi-value', it.value));
    a.append(h('span', 'kpi-note', it.note));
    grid.appendChild(a);
  }
  return grid;
}

// --- Overview ----------------------------------------------------------------

export function viewOverview() {
  const root = document.createDocumentFragment();
  const hero = h('section', 'hero');
  hero.append(h('p', 'eyebrow', 'National statistics · Indonesia'));
  hero.append(h('h1', null, 'Indonesia in numbers'));
  hero.append(h('p', 'hero-intro', 'Population, economy, jobs, health and education — the headline figures for the world\u2019s fourth most populous country, drawn from official statistics and updated for 2024.'));
  root.appendChild(hero);
  root.appendChild(kpiCards(HEADLINE));

  const growth = section('Growth, steady at five percent', 'Real GDP growth stayed near 5% through 2023 and 2024 after the pandemic dip of 2020.');
  growth.appendChild(lineChart(
    GDP_SERIES.map((d) => ({ label: String(d.year), value: d.growth })),
    { label: 'Real GDP growth, percent per year', valueFmt: (v) => `${v.toFixed(1)}%`, ymin: -3, color: '#0e6b6b' },
  ));
  root.appendChild(growth);

  const pop = section('Where people live', 'Java holds more than half of all Indonesians. West Java alone is home to about 50 million people.');
  pop.appendChild(hbarList(
    PROVINCES.slice(0, 8).map((p) => ({ label: p.name, value: p.pop })),
    { valueFmt: (v) => `${v.toFixed(1)}m` },
  ));
  pop.appendChild(h('p', 'panel-link', 'See the full province table on the Population page.'));
  root.appendChild(pop);

  const tiles = h('div', 'tile-grid');
  const pages = [
    ['Population', '283.5 million people in 2024, growing about 1% a year.', 'population'],
    ['Economy', 'A US$1.40 trillion economy growing at 5.0% a year.', 'economy'],
    ['Employment', 'Unemployment fell to 4.9% in August 2024.', 'employment'],
    ['Health', 'Life expectancy reached 74.1 years in 2024.', 'health'],
    ['Education', 'Adult literacy is 96.0%; schooling averages 9 years.', 'education'],
  ];
  for (const [title, text, page] of pages) {
    const a = document.createElement('a');
    a.className = 'tile';
    a.href = `#/${page}`;
    a.append(h('h3', null, title));
    a.append(h('p', null, text));
    a.append(h('span', 'tile-arrow', 'Explore →'));
    tiles.appendChild(a);
  }
  root.appendChild(tiles);
  root.appendChild(sourceNote());
  return root;
}

// --- Population ---------------------------------------------------------------

export function viewPopulation() {
  const root = document.createDocumentFragment();
  const head = h('section', 'page-head');
  head.append(h('p', 'eyebrow', 'People'));
  head.append(h('h1', null, 'Population'));
  head.append(h('p', 'page-intro', '283.5 million people in 2024 — the fourth largest population in the world, spread across more than 17,000 islands.'));
  root.appendChild(head);
  root.appendChild(factGrid(POPULATION_FACTS));

  const trend = section('Population, 2019–2024', 'Growth has slowed to about 1% a year as fertility falls.');
  trend.appendChild(lineChart(
    POPULATION_SERIES.map((d) => ({ label: String(d.year), value: d.value })),
    { label: 'Population, millions', valueFmt: (v) => `${v.toFixed(1)}m`, axisFmt: (v) => `${Math.round(v)}m`, color: '#2f6fb2' },
  ));
  root.appendChild(trend);

  const prov = section('Provinces by population', 'Use the filter to compare regions. Figures are 2024 estimates, in millions.');
  const filter = h('div', 'filter-row');
  const regions = ['All regions', ...new Set(PROVINCES.map((p) => p.region))];
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Filter provinces by region');
  for (const r of regions) {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = r;
    select.appendChild(opt);
  }
  const count = h('span', 'filter-count', '');
  filter.append(h('label', 'filter-label', 'Region: '), select, count);
  prov.appendChild(filter);
  const listWrap = h('div', 'chart-slot');
  prov.appendChild(listWrap);
  const tableWrap = h('div', 'table-wrap');
  prov.appendChild(tableWrap);

  function renderProvinces(region) {
    const rows = PROVINCES.filter((p) => region === 'All regions' || p.region === region)
      .sort((a, b) => b.pop - a.pop);
    count.textContent = `${rows.length} province${rows.length === 1 ? '' : 's'} shown`;
    listWrap.replaceChildren(hbarList(rows.map((p) => ({ label: p.name, value: p.pop })), { valueFmt: (v) => `${v.toFixed(1)}m` }));
    const table = document.createElement('table');
    table.className = 'data-table';
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    for (const col of ['Province', 'Region', 'Population (millions)']) tr.appendChild(h('th', null, col));
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    for (const p of rows) {
      const row = document.createElement('tr');
      row.append(h('td', null, p.name), h('td', null, p.region), h('td', 'num', p.pop.toFixed(1)));
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableWrap.replaceChildren(table);
  }
  select.addEventListener('change', () => renderProvinces(select.value));
  renderProvinces('All regions');
  root.appendChild(prov);
  root.appendChild(sourceNote());
  return root;
}

// --- Economy ------------------------------------------------------------------

export function viewEconomy() {
  const root = document.createDocumentFragment();
  const head = h('section', 'page-head');
  head.append(h('p', 'eyebrow', 'Money'));
  head.append(h('h1', null, 'Economy'));
  head.append(h('p', 'page-intro', 'A US$1.40 trillion economy in 2024, growing 5.0% a year, with inflation down to 1.6%.'));
  root.appendChild(head);
  root.appendChild(factGrid(ECONOMY_FACTS));

  const gdp = section('GDP and growth, 2019–2024', 'GDP in US$ billions at current prices; growth is real, year on year. Pick a year to see its detail.');
  const yearRow = h('div', 'filter-row');
  const yearLabel = h('label', 'filter-label', 'Year: ');
  const yearSelect = document.createElement('select');
  yearSelect.setAttribute('aria-label', 'Choose a year');
  for (const d of GDP_SERIES) {
    const opt = document.createElement('option');
    opt.value = String(d.year);
    opt.textContent = String(d.year);
    yearSelect.appendChild(opt);
  }
  yearSelect.value = '2024';
  const yearDetail = h('span', 'year-detail', '');
  yearRow.append(yearLabel, yearSelect, yearDetail);
  gdp.appendChild(yearRow);
  gdp.appendChild(barChart(
    GDP_SERIES.map((d) => ({ label: String(d.year), value: d.gdp })),
    { label: 'GDP, US$ billions', valueFmt: (v) => `$${Math.round(v)}bn`, axisFmt: (v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}tn` : `$${Math.round(v)}bn`, color: '#e07a2f' },
  ));
  function renderYear() {
    const d = GDP_SERIES.find((row) => String(row.year) === yearSelect.value);
    yearDetail.textContent = `${d.year}: GDP US$${d.gdp.toLocaleString('en-US')}bn · growth ${d.growth.toFixed(1)}% · inflation ${d.inflation.toFixed(1)}%`;
  }
  yearSelect.addEventListener('change', renderYear);
  renderYear();
  root.appendChild(gdp);

  const growth = section('Growth by year', 'The 2020 contraction was the pandemic year; growth has held near 5% since 2022.');
  growth.appendChild(lineChart(
    GDP_SERIES.map((d) => ({ label: String(d.year), value: d.growth })),
    { label: 'Real GDP growth, percent', valueFmt: (v) => `${v.toFixed(1)}%`, ymin: -3, color: '#0e6b6b' },
  ));
  root.appendChild(growth);

  const spend = section('What GDP is spent on', 'Household consumption is more than half of the economy; investment is the next largest share.');
  spend.appendChild(donutChart(
    GDP_SHARES.map((s) => ({ label: s.sector, value: s.share })),
    { label: 'GDP by expenditure, percent', center: '100%', centerCaption: 'of GDP' },
  ));
  root.appendChild(spend);
  root.appendChild(sourceNote());
  return root;
}

// --- Employment ---------------------------------------------------------------

export function viewEmployment() {
  const root = document.createDocumentFragment();
  const head = h('section', 'page-head');
  head.append(h('p', 'eyebrow', 'Work'));
  head.append(h('h1', null, 'Employment'));
  head.append(h('p', 'page-intro', 'A labour force of 152.1 million people; unemployment fell to 4.9% in August 2024, its lowest in years.'));
  root.appendChild(head);
  root.appendChild(factGrid(EMPLOYMENT_FACTS));

  const tabs = h('div', 'tabs');
  const tabUnemp = document.createElement('button');
  tabUnemp.className = 'tab active';
  tabUnemp.textContent = 'Unemployment trend';
  const tabSector = document.createElement('button');
  tabSector.className = 'tab';
  tabSector.textContent = 'Where people work';
  tabs.append(tabUnemp, tabSector);
  root.appendChild(tabs);
  const panel = h('div', 'tab-panel');
  root.appendChild(panel);

  function showUnemployment() {
    tabUnemp.classList.add('active');
    tabSector.classList.remove('active');
    const wrap = section('Unemployment, 2019–2024', 'Open unemployment rate, percent of the labour force. The 2020 spike was the pandemic; the rate has fallen every year since.');
    wrap.appendChild(lineChart(
      UNEMPLOYMENT_SERIES.map((d) => ({ label: String(d.year), value: d.rate })),
      { label: 'Unemployment rate, percent', valueFmt: (v) => `${v.toFixed(1)}%`, ymin: 0, color: '#7a5fb0' },
    ));
    panel.replaceChildren(wrap);
  }
  function showSectors() {
    tabSector.classList.add('active');
    tabUnemp.classList.remove('active');
    const wrap = section('Employment by sector', 'Services employ almost half of all workers; agriculture still employs more than a quarter.');
    wrap.appendChild(barChart(
      SECTOR_SHARES.map((s) => ({ label: s.sector.split(' ')[0], value: s.share })),
      { label: 'Share of employment, percent', valueFmt: (v) => `${v.toFixed(1)}%`, color: '#2f6fb2' },
    ));
    const list = h('ul', 'share-list');
    for (const s of SECTOR_SHARES) list.appendChild(h('li', null, `${s.sector}: ${s.share.toFixed(1)}% of workers (Aug 2024)`));
    wrap.appendChild(list);
    panel.replaceChildren(wrap);
  }
  tabUnemp.addEventListener('click', showUnemployment);
  tabSector.addEventListener('click', showSectors);
  showUnemployment();
  root.appendChild(sourceNote());
  return root;
}

// --- Health -------------------------------------------------------------------

export function viewHealth() {
  const root = document.createDocumentFragment();
  const head = h('section', 'page-head');
  head.append(h('p', 'eyebrow', 'Wellbeing'));
  head.append(h('h1', null, 'Health'));
  head.append(h('p', 'page-intro', 'Indonesians live longer than ever: life expectancy reached 74.1 years in 2024, up from 71.7 in 2019.'));
  root.appendChild(head);
  root.appendChild(factGrid(HEALTH_FACTS));

  const life = section('Life expectancy, 2019–2024', 'Years at birth, national average. The rise since 2021 follows the pandemic years.');
  life.appendChild(lineChart(
    LIFE_SERIES.map((d) => ({ label: String(d.year), value: d.value })),
    { label: 'Life expectancy, years', valueFmt: (v) => `${v.toFixed(1)} yrs`, ymin: 70, color: '#0e6b6b' },
  ));
  root.appendChild(life);

  const prov = section('Life expectancy by province', 'The gap between the longest- and shortest-lived provinces is about ten years. Toggle the sort to see the lowest first.');
  const sortRow = h('div', 'filter-row');
  const sortBtn = document.createElement('button');
  sortBtn.className = 'btn';
  sortBtn.textContent = 'Sort: highest first';
  sortRow.appendChild(sortBtn);
  prov.appendChild(sortRow);
  const listWrap = h('div', 'chart-slot');
  prov.appendChild(listWrap);
  let ascending = false;
  function renderHealth() {
    const rows = [...HEALTH_BY_PROVINCE].sort((a, b) => ascending ? a.value - b.value : b.value - a.value);
    sortBtn.textContent = ascending ? 'Sort: lowest first' : 'Sort: highest first';
    listWrap.replaceChildren(hbarList(rows.map((p) => ({ label: p.name, value: p.value })), { valueFmt: (v) => `${v.toFixed(1)} yrs` }));
  }
  sortBtn.addEventListener('click', () => { ascending = !ascending; renderHealth(); });
  renderHealth();
  root.appendChild(prov);
  root.appendChild(sourceNote());
  return root;
}

// --- Education ----------------------------------------------------------------

export function viewEducation() {
  const root = document.createDocumentFragment();
  const head = h('section', 'page-head');
  head.append(h('p', 'eyebrow', 'Learning'));
  head.append(h('h1', null, 'Education'));
  head.append(h('p', 'page-intro', 'Adult literacy is 96.0% and nearly every child is in primary school; the challenge is keeping teenagers and young adults in education.'));
  root.appendChild(head);
  root.appendChild(factGrid(EDUCATION_FACTS));

  const lit = section('Adult literacy, 2019–2024', 'Share of people aged 15 and over who can read and write, percent.');
  lit.appendChild(lineChart(
    LITERACY_SERIES.map((d) => ({ label: String(d.year), value: d.value })),
    { label: 'Adult literacy, percent', valueFmt: (v) => `${v.toFixed(1)}%`, ymin: 94, color: '#e07a2f' },
  ));
  root.appendChild(lit);

  const enr = section('School participation by age', 'Net enrolment rate, percent of each age group in school, 2024. Primary enrolment is near universal; tertiary enrolment is under a third.');
  enr.appendChild(barChart(
    ENROLMENT.map((e) => ({ label: e.group.split(' ')[1] || e.group, value: e.rate })),
    { label: 'Enrolment rate, percent', valueFmt: (v) => `${v.toFixed(1)}%`, color: '#2f6fb2' },
  ));
  const list = h('ul', 'share-list');
  for (const e of ENROLMENT) list.appendChild(h('li', null, `${e.group}: ${e.rate.toFixed(1)}% enrolled (2024)`));
  enr.appendChild(list);
  root.appendChild(enr);
  root.appendChild(sourceNote());
  return root;
}
