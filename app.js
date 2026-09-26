(() => {
  'use strict';
  const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const STORAGE_KEY = 'pixel-pomo-state-v1';
  const $ = (selector) => document.querySelector(selector);
  const modes = { focus: 'FOCUS', short: 'SHORT BREAK', long: 'LONG BREAK' };
  const defaultState = () => ({ mode: 'focus', remaining: DURATIONS.focus, running: false, deadline: null, cycle: 0, total: 0, history: {} });
  let state = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && DURATIONS[saved.mode] && Number.isFinite(saved.remaining)) {
      state = { ...state, ...saved, history: saved.history && typeof saved.history === 'object' ? saved.history : {} };
      state.remaining = Math.max(0, Math.min(DURATIONS[state.mode], state.remaining));
      state.cycle = Math.max(0, Math.min(3, Number(state.cycle) || 0));
      state.total = Math.max(0, Number(state.total) || 0);
    }
  } catch (_) { /* Browsers with storage disabled still get a working timer. */ }
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} };
  const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const nextDate = (date, offset) => { const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()); d.setDate(d.getDate() + offset); return d; };
  const isBreak = () => state.mode !== 'focus';
  const scene = $('#pixel-girl');
  const art = scene.getContext('2d');
  art.imageSmoothingEnabled = false;
  const pixel = 4;
  const palette = {
    outline: '#111828', hair: '#28334e', hairLight: '#425271', skin: '#f1aa88', shade: '#cf7d70', blush: '#f87d9d', eye: '#182137', shirt: '#72d7ca', shirtShadow: '#349d9c', skirt: '#e475a0', desk: '#755e7e', deskTop: '#b091af', legs: '#495976', page: '#e7e6d9', pageShade: '#bbbdd1', lamp: '#e3cc7d', glow: '#f2df9f', cup: '#da7797'
  };
  function rect(x, y, w, h, color) { art.fillStyle = color; art.fillRect(x * pixel, y * pixel, w * pixel, h * pixel); }
  function outlined(x, y, w, h, fill) { rect(x - 1, y - 1, w + 2, h + 2, palette.outline); rect(x, y, w, h, fill); }
  let blinkFrame = 0;
  let pointerSpark = false;
  scene.addEventListener('pointerenter', () => { pointerSpark = true; drawGirl(); });
  scene.addEventListener('pointerleave', () => { pointerSpark = false; drawGirl(); });
  function drawGirl() {
    art.clearRect(0, 0, scene.width, scene.height);
    const p = palette;
    const relaxing = isBreak();
    // Ambient pixel window and tiny stars.
    rect(52, 6, 23, 24, p.outline); rect(54, 8, 19, 20, relaxing ? '#394967' : '#263b59');
    rect(63, 8, 2, 20, p.outline); rect(54, 17, 19, 2, p.outline);
    rect(57, 11, 2, 2, p.glow); rect(59, 13, 1, 1, p.glow);
    rect(70, 13, 1, 1, p.glow); rect(56, 23, 1, 1, p.glow);
    if (relaxing) { rect(68, 10, 2, 2, p.glow); rect(67, 12, 2, 1, p.glow); }
    // Desk lamp, glow, book and mug.
    outlined(11, 14, 2, 29, p.deskTop); rect(8, 13, 9, 3, p.lamp); rect(10, 10, 5, 3, p.lamp); rect(7, 16, 10, 2, p.glow);
    outlined(7, 42, 65, 4, p.deskTop); rect(9, 46, 61, 2, p.desk); rect(11, 48, 4, 16, p.desk); rect(65, 48, 4, 16, p.desk);
    outlined(17, 37, 14, 3, p.pageShade); rect(18, 37, 12, 2, p.page); rect(23, 36, 1, 3, p.desk);
    outlined(58, 35, 6, 7, p.cup); rect(60, 35, 2, 2, p.page); rect(65, 37, 2, 3, p.cup);
    // Chair and legs.
    outlined(33, 40, 19, 18, p.desk); rect(34, 43, 17, 14, p.hairLight);
    rect(40, 56, 4, 8, p.legs); rect(50, 56, 4, 8, p.legs); rect(37, 63, 9, 2, p.outline); rect(49, 63, 9, 2, p.outline);
    if (relaxing) {
      // Upright posture, raised stretching arms.
      outlined(36, 33, 16, 17, p.shirt); rect(36, 47, 17, 7, p.skirt); rect(37, 45, 15, 2, p.shirtShadow);
      outlined(28, 17, 5, 18, p.shirt); rect(28, 15, 5, 5, p.skin); rect(27, 14, 6, 2, p.skin);
      outlined(54, 17, 5, 18, p.shirt); rect(54, 15, 5, 5, p.skin); rect(54, 14, 6, 2, p.skin);
      outlined(38, 17, 13, 16, p.hair); rect(40, 23, 10, 9, p.skin); rect(41, 29, 2, 1, p.blush); rect(47, 29, 2, 1, p.blush);
      rect(38, 18, 15, 6, p.hair); rect(37, 21, 3, 13, p.hair); rect(51, 22, 3, 13, p.hair);
      rect(42, 25, 2, 1, p.eye); rect(47, 25, 2, 1, p.eye); rect(44, 29, 3, 1, p.shade);
      rect(39, 18, 3, 2, p.hairLight); rect(48, 18, 3, 2, p.hairLight);
    } else {
      // Leaning over the book, pencil in hand.
      outlined(38, 34, 17, 14, p.shirt); rect(39, 44, 17, 9, p.skirt); rect(37, 41, 4, 7, p.shirtShadow);
      outlined(31, 35, 12, 4, p.shirt); rect(28, 36, 7, 3, p.skin); rect(25, 37, 4, 2, p.skin);
      outlined(51, 36, 9, 4, p.shirt); rect(57, 38, 8, 3, p.skin); rect(29, 35, 1, 5, p.lamp);
      outlined(34, 19, 17, 17, p.hair); rect(36, 26, 14, 9, p.skin); rect(33, 22, 19, 7, p.hair); rect(32, 27, 4, 12, p.hair); rect(49, 27, 4, 11, p.hair);
      rect(37, 23, 4, 2, p.hairLight); rect(44, 22, 5, 2, p.hairLight);
      if (blinkFrame % 8 !== 0) { rect(40, 30, 2, 1, p.eye); rect(46, 30, 2, 1, p.eye); }
      else { rect(40, 31, 2, 1, p.eye); rect(46, 31, 2, 1, p.eye); }
      rect(49, 32, 2, 1, p.blush);
    }
    if (pointerSpark) { rect(21, 22, 2, 2, p.glow); rect(23, 20, 2, 2, p.glow); rect(25, 22, 2, 2, p.glow); rect(23, 24, 2, 2, p.glow); }
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches) setInterval(() => { blinkFrame++; drawGirl(); }, 950);
  drawGirl();
  function refreshStats() {
    const today = localDate();
    $('#today-count').textContent = state.history[today] || 0;
    $('#total-count').textContent = state.total;
    let streak = 0;
    let day = new Date();
    if (!state.history[today]) day = nextDate(day, -1);
    while (state.history[localDate(day)] > 0) { streak++; day = nextDate(day, -1); }
    $('#streak-count').textContent = streak;
    const grid = $('#contribution-grid');
    grid.replaceChildren();
    const start = nextDate(new Date(), -91);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const todayTime = new Date().setHours(0, 0, 0, 0);
    for (let n = 0; n < 98; n++) {
      const date = nextDate(start, n);
      const count = state.history[localDate(date)] || 0;
      const cell = document.createElement('div');
      cell.className = `contribution-cell level-${Math.min(count, 4)}${date.getTime() === todayTime ? ' is-today' : ''}`;
      cell.title = `${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}: ${count} focus session${count === 1 ? '' : 's'}`;
      grid.appendChild(cell);
    }
    grid.setAttribute('aria-label', `${state.total} total focus sessions. Daily history for the last 14 weeks.`);
  }
  function render() {
    const mins = Math.floor(state.remaining / 60);
    const secs = state.remaining % 60;
    $('#timer-display').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    $('#timer-display').setAttribute('aria-label', `${mins} minutes ${secs} seconds remaining`);
    document.title = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} · ${modes[state.mode]} — PIXEL POMO`;
    document.body.dataset.mode = state.mode;
    $('.timer-progress').setAttribute('aria-valuenow', Math.round((1 - state.remaining / DURATIONS[state.mode]) * 100));
    $('#timer-progress-fill').style.width = `${(1 - state.remaining / DURATIONS[state.mode]) * 100}%`;
    $('[data-select-mode="focus"]').classList.toggle('active', state.mode === 'focus');
    document.querySelectorAll('[data-select-mode]').forEach(button => {
      const active = button.dataset.selectMode === state.mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#start-label').textContent = state.running ? 'PAUSE TIMER' : isBreak() ? 'START BREAK' : 'START FOCUS';
    $('#start-icon').textContent = state.running ? 'Ⅱ' : '▶';
    $('#start-pause').setAttribute('aria-label', state.running ? 'Pause timer' : `Start ${modes[state.mode].toLowerCase()} timer`);
    $('#header-status').textContent = state.running ? (isBreak() ? 'TAKING A BREATHER' : 'FOCUS IN PROGRESS') : 'READY TO FOCUS';
    $('#mode-message').textContent = state.running ? (isBreak() ? 'Rest is part of the process.' : 'You’re doing great. Keep going.') : (isBreak() ? 'Take a breath. You earned it.' : 'A fresh start is one click away.');
    $('#session-progress').textContent = `SESSION ${state.cycle + 1} / 4`;
    $('#scene-status-text').textContent = isBreak() ? 'RECHARGING' : 'IN THE ZONE';
    $('#scene-caption-text').innerHTML = isBreak() ? 'A LITTLE REST LOOKS GOOD ON YOU <span aria-hidden="true">♥</span>' : 'SHE\'S ROOTING FOR YOU <span aria-hidden="true">♥</span>';
    scene.setAttribute('aria-label', isBreak() ? 'Pixel-art girl stretching beside her desk' : 'Pixel-art girl studying at her desk');
    drawGirl();
  }
  function switchMode(mode) { state.mode = mode; state.remaining = DURATIONS[mode]; state.running = false; state.deadline = null; save(); render(); }
  function finishSession() {
    const completedMode = state.mode;
    state.running = false;
    state.deadline = null;
    if (completedMode === 'focus') {
      state.total++;
      const today = localDate();
      state.history[today] = (state.history[today] || 0) + 1;
      const fourth = state.cycle === 3;
      state.cycle = (state.cycle + 1) % 4;
      state.mode = fourth ? 'long' : 'short';
      refreshStats();
    } else state.mode = 'focus';
    state.remaining = DURATIONS[state.mode];
    save(); render();
    if ('Notification' in window && Notification.permission === 'granted') new Notification(completedMode === 'focus' ? 'Focus complete! Time for a break.' : 'Break complete! Ready to focus?');
  }
  function tick() {
    if (!state.running || !state.deadline) return;
    const left = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
    if (left <= 0) finishSession();
    else if (left !== state.remaining) { state.remaining = left; render(); }
  }
  if (state.running && state.deadline) tick();
  else { state.running = false; state.deadline = null; }
  function toggleTimer() {
    tick();
    if (state.running) { state.running = false; state.deadline = null; }
    else { if (state.remaining <= 0) state.remaining = DURATIONS[state.mode]; state.running = true; state.deadline = Date.now() + state.remaining * 1000; }
    save(); render();
  }
  $('#start-pause').addEventListener('click', toggleTimer);
  $('#reset').addEventListener('click', () => switchMode(state.mode));
  $('#skip').addEventListener('click', () => switchMode(state.mode === 'focus' ? (state.cycle === 3 ? 'long' : 'short') : 'focus'));
  document.querySelectorAll('[data-select-mode]').forEach(button => button.addEventListener('click', () => switchMode(button.dataset.selectMode)));
  document.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(document.activeElement.tagName)) return;
    if (event.code === 'Space') { event.preventDefault(); toggleTimer(); }
    if (event.key.toLowerCase() === 'r') switchMode(state.mode);
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { tick(); refreshStats(); } });
  $('#current-date').textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  refreshStats(); render(); save(); setInterval(tick, 250);
  // Break the heading into individually arriving pixel-letter tiles.
  if (!reducedMotion.matches) {
    document.querySelectorAll('.scatter-heading > span').forEach((line, lineIndex) => {
      const children = [...line.childNodes];
      line.replaceChildren();
      let character = 0;
      for (const node of children) {
        if (node.nodeType === Node.TEXT_NODE || node.nodeName === 'EM') {
          const target = node.nodeName === 'EM' ? document.createElement('em') : line;
          if (target !== line) line.appendChild(target);
          for (const letter of node.textContent) {
            if (letter === ' ') { target.appendChild(document.createTextNode('\u00a0')); continue; }
            const span = document.createElement('span');
            span.className = 'char'; span.textContent = letter;
            span.style.setProperty('--i', String(character++ + lineIndex * 12));
            span.style.setProperty('--dx', `${((character * 7) % 9 - 4) * 9}px`);
            span.style.setProperty('--dy', `${((character * 11) % 7 - 3) * 12}px`);
            target.appendChild(span);
          }
        } else line.appendChild(node);
      }
    });
  }
  // Lightweight local Squares Terminal-style animation, with activity-aware cadence.
  const background = $('#terminal-grid');
  const bg = background.getContext('2d');
  let squares = [], columns = 0, rows = 0, frame = 0, lastFrame = 0;
  function resizeGrid() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    background.width = Math.round(window.innerWidth * dpr); background.height = Math.round(window.innerHeight * dpr);
    bg.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Math.ceil(window.innerWidth / 36); rows = Math.ceil(window.innerHeight / 36);
    squares = Array.from({ length: columns * rows }, () => Math.random() < .12 ? Math.random() * .18 : 0);
  }
  function animateGrid(time) {
    if (time - lastFrame > (state.running ? 110 : 270)) {
      lastFrame = time; frame++;
      bg.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
        const index = y * columns + x;
        if (Math.random() < (state.running ? .016 : .005)) squares[index] = .1 + Math.random() * .23;
        squares[index] *= .94;
        bg.fillStyle = `rgba(93, 209, 211, ${.017 + squares[index]})`;
        bg.fillRect(x * 36 + 4, y * 36 + 4, 23, 23);
      }
    }
    if (!reducedMotion.matches) requestAnimationFrame(animateGrid);
  }
  resizeGrid(); window.addEventListener('resize', resizeGrid);
  if (reducedMotion.matches) animateGrid(0); else requestAnimationFrame(animateGrid);
})();
