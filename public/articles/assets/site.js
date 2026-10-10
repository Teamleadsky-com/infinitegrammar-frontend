/* InfiniteGrammar articles demo: charts, pipeline-version chips and the exercise widget.
   Charts are plain HTML built from a JSON spec in data-spec. Every chart has
   direct labels, a hover/focus readout and a data table for screen readers, so
   no value depends on colour or on hovering. All labels are inserted with
   textContent. A chart label with "ver" gets a version chip (see _build.py). */
(function () {
  'use strict';

  // ---------- formatting ----------
  const nf = new Intl.NumberFormat('en-US');
  function fmt(v, f) {
    if (v === null || v === undefined || Number.isNaN(v)) return '–';
    switch (f) {
      case 'pct': return Math.round(v * 100) + '%';
      case 'pct1': return (Math.round(v * 1000) / 10) + '%';
      case 'usd2': return '$' + v.toFixed(2);
      case 'usd3': return '$' + v.toFixed(3);
      case 'usd': return '$' + nf.format(Math.round(v));
      case 'int': return nf.format(Math.round(v));
      case 'dec2': return v.toFixed(2);
      default: return String(v);
    }
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  // ---------- tooltip ----------
  const tip = el('div', 'viz-tip');
  tip.setAttribute('role', 'status');
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(tip));
  function showTip(target, value, label, x, y) {
    tip.replaceChildren(el('b', null, value), el('span', null, label));
    tip.style.display = 'block';
    let left, top;
    if (x === undefined) {
      const r = target.getBoundingClientRect();
      left = r.left + Math.min(r.width, 240) / 2; top = r.top - 8;
    } else { left = x + 14; top = y - 12; }
    const w = tip.offsetWidth, h = tip.offsetHeight;
    left = Math.min(Math.max(8, left), window.innerWidth - w - 8);
    top = top - h < 8 ? top + 34 : top - h;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function hideTip() { tip.style.display = 'none'; tip.classList.remove('wide'); }
  function wireTip(node, value, label) {
    node.tabIndex = 0;
    node.setAttribute('aria-label', label + ': ' + value);
    node.addEventListener('pointermove', e => showTip(node, value, label, e.clientX, e.clientY));
    node.addEventListener('pointerleave', hideTip);
    node.addEventListener('focus', () => showTip(node, value, label));
    node.addEventListener('blur', hideTip);
  }

  // ---------- pipeline-version chips ----------
  // The build puts the version definitions on the page as JSON next to the "Pipeline versions" box.
  let VERS = null;
  function versions() {
    if (VERS === null) {
      const src = document.getElementById('ig-versions');
      try { VERS = src ? JSON.parse(src.textContent) : {}; } catch (e) { VERS = {}; }
    }
    return VERS;
  }
  function wireChip(chip) {
    const id = chip.getAttribute('data-ver');
    const v = versions()[id];
    if (!v) return;
    const name = v.name.replace(/^\+\s*/, '');
    const head = id + ' · ' + v.when;
    const body = name.charAt(0).toUpperCase() + name.slice(1) + '. ' + v.short;
    const show = () => { tip.classList.add('wide'); showTip(chip, head, body); };
    chip.addEventListener('pointerenter', show);
    chip.addEventListener('pointerleave', hideTip);
    chip.addEventListener('focus', show);
    chip.addEventListener('blur', hideTip);
    chip.addEventListener('click', () => {
      const box = document.getElementById('pipeline-versions');
      if (box) box.open = true;
      hideTip();
    });
  }
  function verChip(id) {
    const a = el('a', 'ver', id);
    a.href = '#pipeline-versions';
    a.setAttribute('data-ver', id);
    const v = versions()[id];
    if (v) a.setAttribute('aria-label', 'Pipeline version ' + id + ': ' + v.name.replace(/^\+\s*/, ''));
    wireChip(a);
    return a;
  }
  // a chart label: optional version chip, the label text, optional note underneath
  function labelNode(tag, cls, d) {
    const n = el(tag, cls);
    if (d.ver) n.appendChild(verChip(d.ver));
    n.appendChild(document.createTextNode(d.label));
    if (d.note) n.appendChild(el('small', null, d.note));
    return n;
  }
  function plainLabel(d) { return (d.ver ? d.ver + ' ' : '') + d.label; }

  // ---------- table view (screen readers only: the chart already shows every number) ----------
  function tableView(head, rows, caption) {
    const wrap = el('div', 'sr-only');
    const t = el('table');
    if (caption) t.appendChild(el('caption', null, caption));
    const thead = el('thead'), tr = el('tr');
    head.forEach(h => tr.appendChild(el('th', null, h)));
    thead.appendChild(tr); t.appendChild(thead);
    const tb = el('tbody');
    rows.forEach(r => {
      const row = el('tr');
      r.forEach(c => row.appendChild(el('td', null, c)));
      tb.appendChild(row);
    });
    t.appendChild(tb); wrap.appendChild(t);
    return wrap;
  }

  function header(root, spec) {
    if (spec.title) root.appendChild(el('p', 'viz-title', spec.title));
    if (spec.sub) root.appendChild(el('p', 'viz-sub', spec.sub));
  }
  function footer(root, spec, head, rows) {
    if (spec.note) root.appendChild(el('p', 'viz-note', spec.note));
    root.appendChild(tableView(head, rows, spec.title));
  }

  // ---------- horizontal bars (one series) ----------
  function bars(root, spec) {
    header(root, spec);
    const max = spec.max || Math.max(...spec.data.map(d => d.value)) * 1.08;
    const anyEmph = spec.data.some(d => d.emph);
    const rows = el('div', 'rows');
    spec.data.forEach(d => {
      const row = el('div', 'row');
      const lab = labelNode('div', 'lab', d);
      const line = el('div', 'barline');
      const hit = el('div', 'hit');
      const bar = el('div', 'bar' + (anyEmph && !d.emph ? ' muted' : ''));
      bar.style.width = Math.max(0.4, d.value / max * 100) + '%';
      const shown = d.display || fmt(d.value, spec.format);
      hit.appendChild(bar);
      hit.appendChild(el('span', 'val', shown));
      wireTip(hit, shown, plainLabel(d) + (d.note ? ' (' + d.note + ')' : ''));
      line.appendChild(hit);
      row.appendChild(lab); row.appendChild(line);
      rows.appendChild(row);
    });
    root.appendChild(rows);
    footer(root, spec, [spec.labelHead || 'Item', spec.valueHead || 'Value'],
      spec.data.map(d => [plainLabel(d) + (d.note ? ' (' + d.note + ')' : ''), d.display || fmt(d.value, spec.format)]));
  }

  // ---------- grouped horizontal bars (2–3 series) ----------
  function grouped(root, spec) {
    header(root, spec);
    const legend = el('div', 'legend');
    spec.series.forEach(s => {
      const item = el('span');
      const sw = el('i'); sw.style.background = 'var(--series-' + s.slot + ')';
      item.appendChild(sw); item.appendChild(document.createTextNode(s.name));
      legend.appendChild(item);
    });
    root.appendChild(legend);
    const vals = spec.data.flatMap(d => spec.series.map(s => d.values[s.key] || 0));
    const max = spec.max || Math.max(...vals) * 1.1;
    const rows = el('div', 'rows');
    spec.data.forEach(d => {
      const row = el('div', 'row');
      const lab = labelNode('div', 'lab', d);
      const grp = el('div', 'group');
      spec.series.forEach(s => {
        const v = d.values[s.key];
        const line = el('div', 'barline');
        const hit = el('div', 'hit');
        const bar = el('div', 'bar' + (s.slot === 2 ? ' s2' : s.slot === 3 ? ' s3' : ''));
        bar.style.width = Math.max(0.4, (v || 0) / max * 100) + '%';
        const shown = fmt(v, spec.format);
        hit.appendChild(bar); hit.appendChild(el('span', 'val', shown + (spec.inlineSeries ? ' ' + s.name : '')));
        wireTip(hit, shown, s.name + ' · ' + plainLabel(d));
        line.appendChild(hit); grp.appendChild(line);
      });
      row.appendChild(lab); row.appendChild(grp);
      rows.appendChild(row);
    });
    root.appendChild(rows);
    footer(root, spec, [spec.labelHead || 'Item'].concat(spec.series.map(s => s.name)),
      spec.data.map(d => [plainLabel(d) + (d.note ? ' (' + d.note + ')' : '')].concat(spec.series.map(s => fmt(d.values[s.key], spec.format)))));
  }

  // ---------- vertical columns (one series, ordered categories) ----------
  function columns(root, spec) {
    header(root, spec);
    const max = spec.max || Math.max(...spec.data.map(d => d.value)) * 1.12;
    const anyEmph = spec.data.some(d => d.emph);
    const cols = el('div', 'cols');
    const labs = el('div', 'collabs');
    spec.data.forEach(d => {
      const c = el('div', 'col');
      const shown = d.display || fmt(d.value, spec.format);
      c.appendChild(el('div', 'cap', shown));
      const b = el('div', 'colbar' + (anyEmph && !d.emph ? ' muted' : ''));
      b.style.height = Math.max(0.6, d.value / max * 100) + '%';
      c.appendChild(b);
      wireTip(c, shown, plainLabel(d) + (d.note ? ' (' + d.note + ')' : ''));
      cols.appendChild(c);
      labs.appendChild(labelNode('div', null, d));
    });
    root.appendChild(cols); root.appendChild(labs);
    footer(root, spec, [spec.labelHead || 'Item', spec.valueHead || 'Value'],
      spec.data.map(d => [plainLabel(d) + (d.note ? ' (' + d.note + ')' : ''), d.display || fmt(d.value, spec.format)]));
  }

  // ---------- one stacked bar (part to whole, <= 3 segments) ----------
  function stack(root, spec) {
    header(root, spec);
    const total = spec.data.reduce((a, d) => a + d.value, 0);
    const bar = el('div', 'stack');
    spec.data.forEach(d => {
      const s = el('div', 'seg');
      s.style.width = (d.value / total * 100) + '%';
      s.style.background = 'var(--series-' + d.slot + ')';
      const pct = Math.round(d.value / total * 100) + '%';
      if (d.value / total > 0.12) s.textContent = pct;          // only when it fits
      wireTip(s, fmt(d.value, spec.format) + ' · ' + pct, d.label);
      bar.appendChild(s);
    });
    root.appendChild(bar);
    const lg = el('div', 'stack-legend');
    spec.data.forEach(d => {
      const row = el('div');
      const left = el('span');
      const sw = el('i'); sw.style.background = 'var(--series-' + d.slot + ')';
      left.appendChild(sw); left.appendChild(document.createTextNode(d.label));
      row.appendChild(left); row.appendChild(el('b', null, fmt(d.value, spec.format)));
      lg.appendChild(row);
    });
    root.appendChild(lg);
    footer(root, spec, ['Part', 'Value', 'Share'],
      spec.data.map(d => [d.label, fmt(d.value, spec.format), Math.round(d.value / total * 100) + '%'])
        .concat([['Total', fmt(total, spec.format), '100%']]));
  }

  // ---------- funnel (one series, drop annotations) ----------
  function funnel(root, spec) {
    header(root, spec);
    const max = spec.data[0].value;
    const rows = el('div', 'rows');
    spec.data.forEach((d, i) => {
      if (d.drop) rows.appendChild(el('div', 'drop', d.drop));
      const row = el('div', 'row');
      const lab = el('div', 'lab', d.label);
      if (d.note) lab.appendChild(el('small', null, d.note));
      const line = el('div', 'barline');
      const hit = el('div', 'hit');
      const bar = el('div', 'bar' + (i === spec.data.length - 1 ? '' : (spec.dimSteps ? ' muted' : '')));
      bar.style.width = Math.max(0.4, d.value / max * 100) + '%';
      const shown = fmt(d.value, spec.format) + (i ? ' (' + Math.round(d.value / max * 100) + '%)' : '');
      hit.appendChild(bar); hit.appendChild(el('span', 'val', shown));
      wireTip(hit, shown, d.label);
      line.appendChild(hit); row.appendChild(lab); row.appendChild(line);
      rows.appendChild(row);
    });
    root.appendChild(rows);
    footer(root, spec, ['Step', 'Remaining', 'Dropped here'],
      spec.data.map((d, i) => [d.label, fmt(d.value, spec.format), i ? fmt(spec.data[i - 1].value - d.value, spec.format) : '–']));
  }

  const RENDER = { bars, grouped, columns, stack, funnel };

  function renderAll() {
    document.querySelectorAll('.viz[data-spec]').forEach(root => {
      let spec;
      try { spec = JSON.parse(root.getAttribute('data-spec')); } catch (e) { root.textContent = 'Chart data error'; return; }
      const fn = RENDER[spec.type];
      if (!fn) return;
      root.replaceChildren();
      root.setAttribute('role', 'figure');
      if (spec.title) root.setAttribute('aria-label', spec.title);
      fn(root, spec);
    });
  }

  // ---------- exercise widget (a real accepted exercise) ----------
  function exercises() {
    document.querySelectorAll('.exercise[data-ex]').forEach(box => {
      let ex;
      try { ex = JSON.parse(box.getAttribute('data-ex')); } catch (e) { return; }
      box.replaceChildren();
      const meta = el('div', 'meta');
      meta.appendChild(el('span', 'tag', ex.level));
      meta.appendChild(el('span', 'tag', ex.section));
      box.appendChild(meta);
      const text = el('div', 'text');
      const selects = [];
      const parts = ex.text.split(/(\[\d+\])/);
      parts.forEach(p => {
        const m = p.match(/^\[(\d+)\]$/);
        if (!m) { text.appendChild(document.createTextNode(p)); return; }
        const g = ex.gaps[Number(m[1]) - 1];
        const s = el('select');
        s.setAttribute('aria-label', 'Gap ' + m[1]);
        s.appendChild(el('option', null, '…'));
        g.options.forEach(o => { const op = el('option', null, o); op.value = o; s.appendChild(op); });
        selects.push([s, g]);
        text.appendChild(s);
      });
      box.appendChild(text);
      const actions = el('div', 'actions');
      const check = el('button', null, 'Check answers');
      const reset = el('button', 'ghost', 'Reset');
      const score = el('span', 'score');
      actions.append(check, reset, score);
      box.appendChild(actions);
      const expl = el('div', 'expl');
      ex.gaps.forEach((g, i) => {
        const row = el('div');
        row.appendChild(el('b', null, '[' + (i + 1) + '] ' + g.answer + ' '));
        row.appendChild(document.createTextNode(g.explanation));
        expl.appendChild(row);
      });
      box.appendChild(expl);
      check.addEventListener('click', () => {
        let ok = 0;
        selects.forEach(([s, g]) => {
          const right = s.value === g.answer;
          s.classList.toggle('ok', right); s.classList.toggle('no', !right);
          if (right) ok++;
        });
        score.textContent = ok + ' / ' + selects.length + ' correct';
        expl.classList.add('show');
      });
      reset.addEventListener('click', () => {
        selects.forEach(([s]) => { s.selectedIndex = 0; s.classList.remove('ok', 'no'); });
        score.textContent = ''; expl.classList.remove('show');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a.ver[data-ver]').forEach(wireChip);   // chips in the text
    renderAll(); exercises();
  });
  window.addEventListener('scroll', hideTip, { passive: true });
})();
