// charts.js — small SVG chart builders for DataNusa.
// Every chart is drawn from a data array at render time: bars, lines and
// donut segments are computed here, never baked into a picture.

const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs, text) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, String(v));
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function niceMax(values) {
  const max = Math.max(...values, 1);
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / step) * step;
}

/** Vertical bar chart. rows: [{label, value}], opts: {unit, color, height, valueFmt, axisFmt} */
export function barChart(rows, opts = {}) {
  const W = 720;
  const H = opts.height || 300;
  const padL = 58;
  const padB = 34;
  const padT = 14;
  const max = niceMax(rows.map((r) => r.value));
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart-svg', role: 'img', 'aria-label': opts.label || 'Bar chart' });
  const innerW = W - padL - 12;
  const innerH = H - padT - padB;
  const bw = Math.min(64, (innerW / rows.length) * 0.62);
  const gap = innerW / rows.length;
  const axisFmt = opts.axisFmt || opts.valueFmt || ((v) => String(Math.round(v)));
  for (let g = 0; g <= 4; g++) {
    const y = padT + (innerH * g) / 4;
    const v = max * (1 - g / 4);
    svg.appendChild(el('line', { x1: padL, y1: y, x2: W - 12, y2: y, class: 'grid' }));
    svg.appendChild(el('text', { x: padL - 8, y: y + 4, class: 'axis-label', 'text-anchor': 'end' }, axisFmt(v)));
  }
  rows.forEach((r, i) => {
    const h = (r.value / max) * innerH;
    const x = padL + i * gap + (gap - bw) / 2;
    const y = padT + innerH - h;
    svg.appendChild(el('rect', { x, y, width: bw, height: h, rx: 3, class: 'bar', fill: opts.color || '#0e6b6b' }));
    svg.appendChild(el('text', { x: x + bw / 2, y: y - 6, class: 'bar-value', 'text-anchor': 'middle' }, opts.valueFmt ? opts.valueFmt(r.value) : String(r.value)));
    svg.appendChild(el('text', { x: x + bw / 2, y: H - 12, class: 'axis-label', 'text-anchor': 'middle' }, r.label));
  });
  return svg;
}

/** Line chart. rows: [{label, value}], opts: {unit, color, height, valueFmt, axisFmt, ymin} */
export function lineChart(rows, opts = {}) {
  const W = 720;
  const H = opts.height || 300;
  const padL = 58;
  const padB = 34;
  const padT = 16;
  const values = rows.map((r) => r.value);
  const lo = opts.ymin !== undefined ? opts.ymin : Math.min(...values) * 0.92;
  const hi = Math.max(...values) * 1.02;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart-svg', role: 'img', 'aria-label': opts.label || 'Line chart' });
  const innerW = W - padL - 12;
  const innerH = H - padT - padB;
  const x = (i) => padL + (i * innerW) / (rows.length - 1);
  const y = (v) => padT + innerH - ((v - lo) / (hi - lo)) * innerH;
  const axisFmt = opts.axisFmt || opts.valueFmt || ((v) => v.toFixed(1));
  for (let g = 0; g <= 4; g++) {
    const gy = padT + (innerH * g) / 4;
    const v = hi - ((hi - lo) * g) / 4;
    svg.appendChild(el('line', { x1: padL, y1: gy, x2: W - 12, y2: gy, class: 'grid' }));
    svg.appendChild(el('text', { x: padL - 8, y: gy + 4, class: 'axis-label', 'text-anchor': 'end' }, axisFmt(v)));
  }
  const points = rows.map((r, i) => `${x(i).toFixed(1)},${y(r.value).toFixed(1)}`).join(' ');
  svg.appendChild(el('polyline', { points, class: 'line', fill: 'none', stroke: opts.color || '#0e6b6b', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  const area = `${padL},${padT + innerH} ${points} ${x(rows.length - 1)},${padT + innerH}`;
  svg.appendChild(el('polygon', { points: area, class: 'area', fill: opts.color || '#0e6b6b' }));
  rows.forEach((r, i) => {
    svg.appendChild(el('circle', { cx: x(i), cy: y(r.value), r: 5, class: 'dot', fill: opts.color || '#0e6b6b' }));
    // First and last value labels anchor inward so they never run off the chart.
    const anchor = i === 0 ? 'start' : i === rows.length - 1 ? 'end' : 'middle';
    svg.appendChild(el('text', { x: x(i), y: y(r.value) - 10, class: 'bar-value', 'text-anchor': anchor }, opts.valueFmt ? opts.valueFmt(r.value) : String(r.value)));
    svg.appendChild(el('text', { x: x(i), y: H - 12, class: 'axis-label', 'text-anchor': 'middle' }, r.label));
  });
  return svg;
}

/** Donut chart with a legend. rows: [{label, value}] where value is a share in percent. */
export function donutChart(rows, opts = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'donut-wrap';
  const size = 220;
  const r = 82;
  const cx = size / 2;
  const cy = size / 2;
  const svg = el('svg', { viewBox: `0 0 ${size} ${size}`, class: 'donut-svg', role: 'img', 'aria-label': opts.label || 'Share chart' });
  const colors = opts.colors || ['#0e6b6b', '#e07a2f', '#2f6fb2', '#7a5fb0', '#b2a12f'];
  let acc = 0;
  const total = rows.reduce((s, row) => s + row.value, 0);
  rows.forEach((row, i) => {
    const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += row.value;
    const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    svg.appendChild(el('path', {
      d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`,
      fill: 'none', stroke: colors[i % colors.length], 'stroke-width': 34,
    }));
  });
  svg.appendChild(el('text', { x: cx, y: cy - 4, class: 'donut-total', 'text-anchor': 'middle' }, opts.center || '100%'));
  svg.appendChild(el('text', { x: cx, y: cy + 18, class: 'donut-caption', 'text-anchor': 'middle' }, opts.centerCaption || 'of GDP'));
  wrap.appendChild(svg);
  const legend = document.createElement('ul');
  legend.className = 'donut-legend';
  rows.forEach((row, i) => {
    const li = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.background = colors[i % colors.length];
    li.appendChild(swatch);
    li.appendChild(document.createTextNode(`${row.label} — ${row.value.toFixed(1)}%`));
    legend.appendChild(li);
  });
  wrap.appendChild(legend);
  return wrap;
}

/** Horizontal bar list, good for ranked provinces. rows: [{label, value}] */
export function hbarList(rows, opts = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'hbar-list';
  const max = Math.max(...rows.map((r) => r.value), 1);
  rows.forEach((r) => {
    const row = document.createElement('div');
    row.className = 'hbar-row';
    const lab = document.createElement('span');
    lab.className = 'hbar-label';
    lab.textContent = r.label;
    const track = document.createElement('div');
    track.className = 'hbar-track';
    const fill = document.createElement('div');
    fill.className = 'hbar-fill';
    fill.style.width = `${(r.value / max) * 100}%`;
    track.appendChild(fill);
    const val = document.createElement('span');
    val.className = 'hbar-value';
    val.textContent = opts.valueFmt ? opts.valueFmt(r.value) : String(r.value);
    row.append(lab, track, val);
    wrap.appendChild(row);
  });
  return wrap;
}
