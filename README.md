# DataNusa — Indonesia in numbers

[![Bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Nghyuu/best-national-statistics-site-20261126-0539-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Nghyuu/best-national-statistics-site-20261126-0539-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A working national statistics site for **Indonesia**, built as plain static files under `app/` — no build step, no external libraries, no network requests. Open `app/index.html` in any browser and it works offline.

## What it covers

Six hash-routed pages, each reached from the top navigation:

- **Overview** — headline indicators (population, GDP, growth, inflation, unemployment, life expectancy) plus GDP growth and province population charts.
- **Population** — population trend 2019–2024, province ranking with a working region filter and a full data table.
- **Economy** — GDP and growth charts, a year selector that shows the selected year's detail, and a donut of what GDP is spent on.
- **Employment** — working tabs: unemployment trend and employment by sector.
- **Health** — life expectancy trend and a province ranking with a working sort toggle.
- **Education** — adult literacy trend and school participation by age group.

Every figure is a rounded official figure from BPS — Statistics Indonesia, labelled with its year. Charts are drawn at render time from the data arrays in `app/data.js` using the vanilla SVG builders in `app/charts.js`.

## Structure

- `app/index.html` — the single page shell
- `app/app.js` — the hash router
- `app/views.js` — one renderer per page
- `app/data.js` — all figures, labelled with years and source
- `app/charts.js` — SVG bar, line, donut and horizontal-bar builders
- `app/style.css` — the whole design, including the phone layout
- `main.ts` — hands the site in: copies `app/` and `screenshots/` to the output dir and writes `dossier.json`
- `vendor/makefun-frontend.ts` — make.fun's dossier library, unchanged

## Run it locally

```sh
node serve.ts
```

Then open http://localhost:8080 (serve.ts is a development convenience, not part of the entry).
