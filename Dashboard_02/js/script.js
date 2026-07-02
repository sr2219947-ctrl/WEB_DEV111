
// ── Auth Guard ───────────────────────────────────────────────────
if (localStorage.getItem('isLoggedIn') !== 'true') {
  location.href = '../index.html';
}

// ── Night Mode ───────────────────────────────────────────────────
(function initNightMode() {
  if (localStorage.getItem('nightMode') === 'true') {
    document.documentElement.classList.add('night');
    const icon = document.getElementById('nightIcon');
    if (icon) icon.className = 'ti ti-sun';
  }
})();

function toggleNightMode() {
  const isNight = document.documentElement.classList.toggle('night');
  localStorage.setItem('nightMode', isNight);
  ['nightIcon', 'mobNightIcon'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = isNight ? 'ti ti-sun' : 'ti ti-moon';
  });
  // redraw chart with new colours
  if (window._sfChart) {
    const c = isNight ? '#3DD9A4' : '#4A9B7F';
    window._sfChart.data.datasets[0].borderColor = c;
    window._sfChart.data.datasets[0].pointBackgroundColor = c;
    window._sfChart.data.datasets[0].backgroundColor = isNight ? 'rgba(61,217,164,.12)' : 'rgba(74,155,127,.12)';
    window._sfChart.update();
  }
  if (window._focusChart) {
    window._focusChart.update();
  }
}

// ── Logout ───────────────────────────────────────────────────────
// IMPORTANT: Only remove the current session keys — NEVER call
// localStorage.clear() here, because that would wipe every other
// user's saved tasks stored under their own namespaced LS key.
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('nightMode');
  location.href = '../index.html';
}

// ── Drawer (mobile) ──────────────────────────────────────────────
function openDrawer() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('drawer').classList.add('open');
}
function closeDrawer() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('drawer').classList.remove('open');
}

// ── Success Toast ────────────────────────────────────────────────
function showSuccessToast(msg) {
  const t = document.getElementById('successToast');
  const m = document.getElementById('successToastMsg');
  if (!t) return;
  if (m) m.textContent = msg || 'Saved!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ── Toast (notification) close buttons ───────────────────────────
document.querySelectorAll('.tcl').forEach(b => {
  b.addEventListener('click', function () {
    const t = this.closest('.toast');
    t.style.opacity = '0';
    t.style.transform = 'translateX(12px)';
    setTimeout(() => t.remove(), 280);
  });
});

/* ══════════════════════════════════════════════════════════
   SECTION PAGE ROUTING
══════════════════════════════════════════════════════════ */
const SECTIONS = ['dashboard', 'subjects', 'schedule', 'completed', 'pending', 'settings'];
const SECTION_TITLES = {
  dashboard: 'StudyFlow',
  subjects: 'My Subjects',
  schedule: 'Schedule',
  completed: 'Completed',
  pending: 'Pending',
  settings: 'Settings'
};

let _currentSection = 'dashboard';

function switchSection(name) {
  if (!SECTIONS.includes(name)) return;
  _currentSection = name;

  // pages
  SECTIONS.forEach(s => {
    const el = document.getElementById('section-' + s);
    if (el) el.classList.toggle('active', s === name);
  });

  // sidebar nav
  document.querySelectorAll('.sidebar .nav-item[data-section]').forEach(item => {
    item.classList.toggle('active', item.dataset.section === name);
  });

  // topbar title
  const title = document.getElementById('topbarTitle');
  if (title) title.textContent = SECTION_TITLES[name] || 'StudyFlow';

  // populate section content
  if (name === 'subjects') renderSubjects();
  if (name === 'schedule') renderSchedule();
  if (name === 'completed') renderCompleted();
  if (name === 'pending') renderPending();
  if (name === 'settings') syncSettingsUI();
}

// Wire sidebar nav items
document.querySelectorAll('.sidebar .nav-item[data-section]').forEach(item => {
  item.addEventListener('click', () => switchSection(item.dataset.section));
});

/* ══════════════════════════════════════════════════════════
   PRIORITY / STATUS HELPERS
══════════════════════════════════════════════════════════ */
const PRIORITY_CLASS = { High: 'ph', Medium: 'pm', Low: 'pl' };
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };
const COL_MAP = { pending: '.col-p', inprogress: '.col-i', completed: '.col-d' };
const STATUS_LABEL = { pending: 'Pending', inprogress: 'In Progress', completed: 'Completed' };

function fmtDate(val) {
  if (!val) return 'TBD';
  const d = new Date(val + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ══════════════════════════════════════════════════════════
   LOCAL STORAGE — USER-ISOLATED
   Each user gets their own namespaced key so their tasks are
   completely separate. No user can ever see another's cards.
   Format: studyflow_cards__<username_slug>
══════════════════════════════════════════════════════════ */
const _currentUsername = (localStorage.getItem('currentUser') || 'guest')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '_');
const LS_KEY = 'studyflow_cards__' + _currentUsername;

function getCardData() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveCards() {
  const cards = [];
  document.querySelectorAll('.tc').forEach(card => {
    cards.push({
      title: card.dataset.title || card.querySelector('.tn')?.textContent || '',
      priority: card.dataset.priority || 'Medium',
      status: card.dataset.status || 'pending',
      date: card.dataset.date || '',
      subject: card.dataset.subject || 'General',
      addedOn: card.dataset.addedOn || new Date().toISOString().split('T')[0],
      completedOn: card.dataset.completedOn || ''
    });
  });
  localStorage.setItem(LS_KEY, JSON.stringify(cards));
  updateDashboard();
}

function loadCards() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    const cards = JSON.parse(raw);
    document.querySelectorAll('.tc').forEach(c => c.remove());
    cards.forEach(({ title, priority, status, date, subject, addedOn, completedOn }) => {
      const col = document.querySelector(COL_MAP[status] || COL_MAP.pending);
      if (!col) return;
      const card = buildCard(title, priority, date, status, addedOn, subject, completedOn);
      const atb = col.querySelector('.atb');
      col.insertBefore(card, atb);
    });
  } catch (e) { /* ignore */ }
}

/* ══════════════════════════════════════════════════════════
   BUILD CARD
══════════════════════════════════════════════════════════ */
function buildCard(title, priority, dateVal, status, addedOn, subject, completedOn) {
  const isDone = status === 'completed';
  const card = document.createElement('div');
  card.className = 'tc' + (isDone ? ' is-done' : '');
  card.dataset.title = title;
  card.dataset.priority = priority;
  card.dataset.date = dateVal;
  card.dataset.status = status;
  card.dataset.subject = subject || 'General';
  card.dataset.addedOn = addedOn || new Date().toISOString().split('T')[0];
  card.dataset.completedOn = completedOn || (isDone ? new Date().toISOString().split('T')[0] : '');

  card.innerHTML = `
    <div class="tc-actions">
      <button class="tca-btn tca-edit" title="Edit" onclick="openEditModal(this.closest('.tc'))">
        <i class="ti ti-pencil"></i>
      </button>
      <button class="tca-btn tca-del" title="Delete" onclick="openDeleteModal(this.closest('.tc'))">
        <i class="ti ti-trash"></i>
      </button>
    </div>
    <div class="tn">${title}</div>
    <div class="tm2">
      <span class="pb ${PRIORITY_CLASS[priority] || 'pm'}">${priority}</span>
      <span class="td2"><i class="ti ti-calendar"></i> ${fmtDate(dateVal)}</span>
      <div class="tav">${getInitials()}</div>
    </div>`;
  return card;
}

function getInitials() {
  const user = localStorage.getItem('currentUser') || 'Student';
  return user.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

/* ══════════════════════════════════════════════════════════
   COUNTERS
══════════════════════════════════════════════════════════ */
function updateCounters() {
  const cols = ['.col-p', '.col-i', '.col-d'];
  document.querySelectorAll('.cc').forEach((cc, i) => {
    const col = document.querySelector(cols[i]);
    if (col && cc) cc.textContent = col.querySelectorAll('.tc').length;
  });
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD STATS & LIVE DATA
══════════════════════════════════════════════════════════ */
function updateDashboard() {
  const cards = getCardData();
  const total = cards.length;
  const completed = cards.filter(c => c.status === 'completed').length;
  const inprog = cards.filter(c => c.status === 'inprogress').length;
  const pending = cards.filter(c => c.status === 'pending').length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const today = new Date().toISOString().split('T')[0];
  const addedToday = cards.filter(c => c.addedOn === today).length;

  // ── 6 Stat cards ─────────────────────────────────────────
  setVal('stat-total', total);
  setVal('stat-completed', completed);
  setVal('stat-inprog', inprog);
  setVal('stat-pending', pending);
  setVal('stat-pct', pct + '%');
  setVal('stat-today', addedToday);

  // Progress bars (proportional to total)
  const pct_comp = total > 0 ? Math.round(completed / total * 100) : 0;
  const pct_inp = total > 0 ? Math.round(inprog / total * 100) : 0;
  const pct_pend = total > 0 ? Math.round(pending / total * 100) : 0;
  setBar('stat-pct-bar', pct);
  setBar('stat-completed-bar', pct_comp);
  setBar('stat-inprog-bar', pct_inp);
  setBar('stat-pending-bar', pct_pend);
  setBar('stat-pct-fill', pct);
  setBar('stat-today-bar', addedToday > 0 ? 100 : 0);

  // ── Today's Progress (right panel) ───────────────────────
  const dv = document.querySelector('.dv');
  if (dv) dv.innerHTML = `${pct}<span style="font-size:11px">%</span>`;
  const ds = document.querySelector('.ds');
  if (ds) ds.textContent = `${completed} of ${total} topics done`;
  const dl = document.querySelector('.dl');
  if (dl) {
    if (pct === 100 && total > 0) dl.textContent = '🎉 All done!';
    else if (pct >= 50) dl.textContent = `Keep going — ${100 - pct}% left!`;
    else if (total === 0) dl.textContent = 'Add your first topic!';
    else dl.textContent = `${pending + inprog} topic${(pending + inprog) !== 1 ? 's' : ''} remaining`;
  }
  updateDonut('.dw svg circle.dring', pct);

  // ── Priority rings ────────────────────────────────────────
  updatePriorityRings(cards);

  // ── Activity + Upcoming ───────────────────────────────────
  updateActivityFeed(cards);
  updateUpcomingSessions(cards);

  // ── Focus Insights ────────────────────────────────────────
  updateFocusInsights(cards, total, completed, inprog, pending, pct);

  // ── Chart ─────────────────────────────────────────────────
  updateChart(cards);
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function setBar(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = pct + '%';
}
function updateDonut(selector, pct) {
  const circle = document.querySelector(selector);
  if (!circle) return;
  const r = parseFloat(circle.getAttribute('r') || 36);
  const circ = 2 * Math.PI * r;
  circle.style.strokeDasharray = circ;
  circle.style.strokeDashoffset = circ - (circ * pct / 100);
}

function updatePriorityRings(cards) {
  ['High', 'Medium', 'Low'].forEach(p => {
    const all = cards.filter(c => c.priority === p).length;
    const done = cards.filter(c => c.priority === p && c.status === 'completed').length;
    const pct = all > 0 ? Math.round(done / all * 100) : 0;
    const idMap = { High: 'priHighRing', Medium: 'priMedRing', Low: 'priLowRing' };
    const pctMap = { High: 'priHighPct', Medium: 'priMedPct', Low: 'priLowPct' };
    const ring = document.getElementById(idMap[p]);
    const pctEl = document.getElementById(pctMap[p]);
    if (ring) {
      const circ = 2 * Math.PI * 26;
      ring.style.strokeDasharray = circ;
      ring.style.strokeDashoffset = circ - (circ * pct / 100);
    }
    if (pctEl) pctEl.textContent = pct + '%';
  });
}

function updateActivityFeed(cards) {
  const feed = document.getElementById('activityFeed');
  if (!feed) return;
  const recent = [...cards].filter(c => c.status === 'completed').slice(-5).reverse();
  if (recent.length === 0) {
    feed.innerHTML = `<li class="ai"><div style="color:var(--tmut);font-size:11.5px;padding:8px 0;line-height:1.5">No completed topics yet.<br>Complete a topic to see activity!</div></li>`;
    return;
  }
  feed.innerHTML = recent.map(c => `
    <li class="ai">
      <div class="aico" style="background:var(--sage-l)"><i class="ti ti-circle-check" style="color:var(--sage)"></i></div>
      <div>
        <div class="at"><strong>${c.title}</strong></div>
        <div class="ati">${c.date ? fmtDate(c.date) : 'Recently'} · <span class="pb ${PRIORITY_CLASS[c.priority] || 'pm'}" style="font-size:9px;padding:1px 5px">${c.priority}</span></div>
      </div>
    </li>`).join('');
}

function updateUpcomingSessions(cards) {
  const list = document.getElementById('upcomingSessions');
  if (!list) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = cards
    .filter(c => c.date && c.status !== 'completed')
    .map(c => ({ ...c, dateObj: new Date(c.date + 'T00:00:00') }))
    .filter(c => c.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 4);
  if (upcoming.length === 0) {
    list.innerHTML = `<li class="ui"><div style="color:var(--tmut);font-size:11px;padding:4px 0;line-height:1.5">No upcoming sessions.<br>Set a due date on your topics!</div></li>`;
    return;
  }
  list.innerHTML = upcoming.map(c => {
    const diff = Math.ceil((c.dateObj - today) / (1000 * 60 * 60 * 24));
    const when = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `In ${diff} days`;
    return `<li class="ui">
      <div class="uico"><i class="ti ti-clock"></i></div>
      <div>
        <div class="ut">${c.title}</div>
        <div class="utime">${when} · ${fmtDate(c.date)}</div>
      </div>
    </li>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   WEEKLY CHART — real-time from user data
   Uses addedOn + completedOn dates; highly visible
══════════════════════════════════════════════════════════ */
function updateChart(cards) {
  const ctx = document.getElementById('mc');
  if (!ctx) return;

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = Array(7).fill(0);

  // Count completed cards that were completed in the past 7 days
  cards.filter(c => c.status === 'completed').forEach(c => {
    // use completedOn first, fall back to addedOn
    const dateStr = c.completedOn || c.addedOn;
    if (!dateStr) return;
    const d = new Date(dateStr + 'T00:00:00');
    const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7) {
      const idx = (today.getDay() - diff + 7) % 7;
      weekData[idx]++;
    }
  });

  // Rotate so today is rightmost
  const todayIdx = today.getDay();
  const rotated = [];
  const rotLabels = [];
  for (let i = 6; i >= 0; i--) {
    const idx = (todayIdx - i + 7) % 7;
    rotated.push(weekData[idx]);
    rotLabels.push(DAY_LABELS[idx]);
  }

  const isNight = document.documentElement.classList.contains('night');
  const barColor = isNight ? '#3DD9A4' : '#4A9B7F';
  const barColorBg = isNight ? 'rgba(61,217,164,.18)' : 'rgba(74,155,127,.18)';
  const gridColor = isNight ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)';
  const tickColor = isNight ? '#6A9080' : '#7A9A92';
  const labelColor = isNight ? '#B8D0C4' : '#3A4E48';

  const maxVal = Math.max(...rotated, 1);

  if (window._sfChart) {
    window._sfChart.data.labels = rotLabels;
    window._sfChart.data.datasets[0].data = rotated;
    window._sfChart.data.datasets[0].borderColor = barColor;
    window._sfChart.data.datasets[0].backgroundColor = barColorBg;
    window._sfChart.data.datasets[0].pointBackgroundColor = rotated.map((v, i) => i === 6 ? barColor : barColor);
    window._sfChart.options.scales.y.max = maxVal + 1;
    window._sfChart.options.scales.x.ticks.color = tickColor;
    window._sfChart.options.scales.y.ticks.color = tickColor;
    window._sfChart.options.scales.x.grid.color = gridColor;
    window._sfChart.options.scales.y.grid.color = gridColor;
    window._sfChart.update();
  } else {
    window._sfChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: rotLabels,
        datasets: [{
          data: rotated,
          backgroundColor: rotated.map((v, i) => i === 6 ? barColor : barColorBg),
          borderColor: barColor,
          borderWidth: 2,
          borderRadius: 7,
          borderSkipped: false,
          hoverBackgroundColor: barColor,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.raw} completed`
            },
            backgroundColor: isNight ? '#152A1F' : '#1A2E26',
            titleColor: '#fff',
            bodyColor: '#B8D0C4',
            padding: 10,
            cornerRadius: 8,
          }
        },
        scales: {
          x: {
            grid: { display: true, color: gridColor },
            ticks: { font: { size: 11, weight: '600' }, color: tickColor }
          },
          y: {
            display: true,
            beginAtZero: true,
            max: maxVal + 1,
            grid: { display: true, color: gridColor },
            ticks: {
              stepSize: 1,
              font: { size: 11, weight: '600' },
              color: tickColor,
              callback: val => Number.isInteger(val) ? val : ''
            }
          }
        }
      }
    });
  }
}

/* ══════════════════════════════════════════════════════════
   FOCUS MODE INSIGHTS
══════════════════════════════════════════════════════════ */
function updateFocusInsights(cards, total, completed, inprog, pending, pct) {
  const panel = document.getElementById('focusInsights');
  if (!panel) return;

  const highPri = cards.filter(c => c.priority === 'High' && c.status !== 'completed');
  const overdue = cards.filter(c => {
    if (!c.date || c.status === 'completed') return false;
    return new Date(c.date + 'T00:00:00') < new Date(new Date().toDateString());
  });

  const today = new Date().toISOString().split('T')[0];
  const doneToday = cards.filter(c => c.status === 'completed' && (c.completedOn === today || c.addedOn === today)).length;

  // Streak calculation (consecutive days with completions)
  const streak = calcStreak(cards);

  panel.innerHTML = `
    <!-- MINI STAT GRID -->
    <div class="fi-grid">
      <div class="fi-card">
        <div class="fi-icon" style="background:var(--sage-l)"><i class="ti ti-books" style="color:var(--sage)"></i></div>
        <div class="fi-val">${total}</div>
        <div class="fi-lbl">Total Topics</div>
      </div>
      <div class="fi-card">
        <div class="fi-icon" style="background:#E8F5EF"><i class="ti ti-circle-check" style="color:#2D7A56"></i></div>
        <div class="fi-val" style="color:#2D7A56">${completed}</div>
        <div class="fi-lbl">Completed</div>
      </div>
      <div class="fi-card">
        <div class="fi-icon" style="background:var(--sky-l)"><i class="ti ti-loader" style="color:var(--sky)"></i></div>
        <div class="fi-val" style="color:var(--sky)">${inprog}</div>
        <div class="fi-lbl">In Progress</div>
      </div>
      <div class="fi-card">
        <div class="fi-icon" style="background:var(--clay-l)"><i class="ti ti-clock-pause" style="color:var(--clay)"></i></div>
        <div class="fi-val" style="color:var(--clay)">${pending}</div>
        <div class="fi-lbl">Pending</div>
      </div>
      <div class="fi-card">
        <div class="fi-icon" style="background:#FFF3E0"><i class="ti ti-flame" style="color:#FF9800"></i></div>
        <div class="fi-val" style="color:#FF9800">${streak}</div>
        <div class="fi-lbl">Day Streak 🔥</div>
      </div>
      <div class="fi-card">
        <div class="fi-icon" style="background:#E8F5EF"><i class="ti ti-sun" style="color:#2D7A56"></i></div>
        <div class="fi-val" style="color:#2D7A56">${doneToday}</div>
        <div class="fi-lbl">Done Today</div>
      </div>
    </div>

    <!-- FOCUS CHART -->
    <div class="focus-chart-wrap">
      <div class="focus-chart-title">📊 Weekly Progress</div>
      <div class="focus-chart-sub">Completions per day this week (from your data)</div>
      <div class="focus-chart-canvas"><canvas id="focusChartCanvas"></canvas></div>
    </div>

    <!-- OVERALL PROGRESS BAR -->
    <div class="fi-progress">
      <div class="fi-prog-label"><span>Overall Progress</span><span>${pct}%</span></div>
      <div class="fi-prog-bar"><div class="fi-prog-fill" style="width:${pct}%"></div></div>
    </div>

    <!-- BREAKDOWN BY PRIORITY -->
    <div class="fi-breakdown">
      ${buildPriorityBreakdown(cards)}
    </div>

    <!-- ALERTS -->
    ${highPri.length > 0 ? `
    <div class="fi-alert">
      <i class="ti ti-flame" style="color:#E27A2D"></i>
      <span><strong>${highPri.length} high-priority</strong> topic${highPri.length !== 1 ? 's' : ''} need${highPri.length === 1 ? 's' : ''} your attention!</span>
    </div>` : `
    <div class="fi-alert" style="background:var(--sage-l);border-color:rgba(74,155,127,.3)">
      <i class="ti ti-star" style="color:var(--sage)"></i>
      <span style="color:var(--tm)">No high-priority topics pending — great work!</span>
    </div>`}
    ${overdue.length > 0 ? `
    <div class="fi-alert" style="background:#FFF0F0;border-color:#FFCCCC;color:#C0392B">
      <i class="ti ti-clock-x" style="color:#E24B4A"></i>
      <span><strong>${overdue.length} topic${overdue.length !== 1 ? 's' : ''}</strong> past due date — review now!</span>
    </div>` : ''}
  `;

  // Draw focus chart
  requestAnimationFrame(() => {
    const focusCtx = document.getElementById('focusChartCanvas');
    if (focusCtx && !window._focusChart) {
      updateFocusChart(cards);
    } else if (focusCtx) {
      updateFocusChart(cards);
    }
  });
}

function buildPriorityBreakdown(cards) {
  return ['High', 'Medium', 'Low'].map(p => {
    const all = cards.filter(c => c.priority === p).length;
    const done = cards.filter(c => c.priority === p && c.status === 'completed').length;
    const pct = all > 0 ? Math.round(done / all * 100) : 0;
    const colors = { High: '#E24B4A', Medium: '#C4875A', Low: '#4A9B7F' };
    return `
      <div class="fi-breakdown-row">
        <div class="fi-br-label">
          <div class="fi-br-dot" style="background:${colors[p]}"></div>
          ${p} Priority
        </div>
        <div class="fi-br-val">${done}/${all} (${pct}%)</div>
      </div>`;
  }).join('');
}

function calcStreak(cards) {
  const completed = cards.filter(c => c.status === 'completed' && (c.completedOn || c.addedOn));
  if (completed.length === 0) return 0;
  const daySet = new Set(completed.map(c => c.completedOn || c.addedOn));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (daySet.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function updateFocusChart(cards) {
  const focusCtx = document.getElementById('focusChartCanvas');
  if (!focusCtx) return;

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = Array(7).fill(0);

  cards.filter(c => c.status === 'completed').forEach(c => {
    const dateStr = c.completedOn || c.addedOn;
    if (!dateStr) return;
    const d = new Date(dateStr + 'T00:00:00');
    const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7) {
      const idx = (today.getDay() - diff + 7) % 7;
      weekData[idx]++;
    }
  });

  const rotated = [];
  const rotLabels = [];
  for (let i = 6; i >= 0; i--) {
    const idx = (today.getDay() - i + 7) % 7;
    rotated.push(weekData[idx]);
    rotLabels.push(DAY_LABELS[idx]);
  }

  const isNight = document.documentElement.classList.contains('night');
  const barColor = isNight ? '#3DD9A4' : '#4A9B7F';
  const gridColor = isNight ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)';
  const tickColor = isNight ? '#6A9080' : '#7A9A92';
  const maxVal = Math.max(...rotated, 1);

  if (window._focusChart) {
    window._focusChart.data.labels = rotLabels;
    window._focusChart.data.datasets[0].data = rotated;
    window._focusChart.update();
    return;
  }

  window._focusChart = new Chart(focusCtx, {
    type: 'line',
    data: {
      labels: rotLabels,
      datasets: [{
        data: rotated,
        borderColor: barColor,
        backgroundColor: isNight ? 'rgba(61,217,164,.15)' : 'rgba(74,155,127,.15)',
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: barColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: .4,
        fill: true,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.raw} completed` },
          backgroundColor: isNight ? '#152A1F' : '#1A2E26',
          padding: 10, cornerRadius: 8,
          titleColor: '#fff', bodyColor: '#B8D0C4'
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 12, weight: '600' } } },
        y: {
          display: true, beginAtZero: true, max: maxVal + 1,
          grid: { color: gridColor },
          ticks: { stepSize: 1, color: tickColor, font: { size: 12, weight: '600' }, callback: v => Number.isInteger(v) ? v : '' }
        }
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD / FOCUS MODE VIEW SWITCH
══════════════════════════════════════════════════════════ */
let _currentView = 'dashboard';

function showView(view) {
  _currentView = view;
  const dashView = document.getElementById('dashboardView');
  const focusView = document.getElementById('focusView');
  const btnDash = document.getElementById('viewBtnDash');
  const btnFocus = document.getElementById('viewBtnFocus');

  if (view === 'dashboard') {
    if (dashView) dashView.style.display = '';
    if (focusView) focusView.style.display = 'none';
    if (btnDash) { btnDash.classList.add('view-btn-active'); btnDash.classList.remove('view-btn-inactive'); }
    if (btnFocus) { btnFocus.classList.add('view-btn-inactive'); btnFocus.classList.remove('view-btn-active'); }
  } else {
    if (dashView) dashView.style.display = 'none';
    if (focusView) focusView.style.display = '';
    if (btnFocus) { btnFocus.classList.add('view-btn-active'); btnFocus.classList.remove('view-btn-inactive'); }
    if (btnDash) { btnDash.classList.add('view-btn-inactive'); btnDash.classList.remove('view-btn-active'); }
    // Destroy focus chart so it redraws with fresh canvas
    if (window._focusChart) { window._focusChart.destroy(); window._focusChart = null; }
    updateDashboard();
  }
}

/* ══════════════════════════════════════════════════════════
   SECTION: MY SUBJECTS
══════════════════════════════════════════════════════════ */
function renderSubjects() {
  const cards = getCardData();
  const grid = document.getElementById('subjectGrid');
  const empty = document.getElementById('subjectsEmpty');
  if (!grid) return;

  if (cards.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  // Group by subject
  const groups = {};
  cards.forEach(c => {
    const s = c.subject || 'General';
    if (!groups[s]) groups[s] = [];
    groups[s].push(c);
  });

  const colors = [
    'linear-gradient(135deg,var(--sage),var(--sage-m))',
    'linear-gradient(135deg,var(--sky),var(--lav))',
    'linear-gradient(135deg,var(--clay),#E27A2D)',
    'linear-gradient(135deg,var(--moss),var(--sage))',
    'linear-gradient(135deg,var(--lav),#9B78B8)',
  ];
  const icons = ['ti-books', 'ti-school', 'ti-brain', 'ti-microscope', 'ti-math', 'ti-code', 'ti-chart-bar', 'ti-palette'];

  let html = '';
  Object.keys(groups).forEach((subject, si) => {
    const ts = groups[subject];
    const done = ts.filter(c => c.status === 'completed').length;
    const pct = ts.length > 0 ? Math.round(done / ts.length * 100) : 0;
    const color = colors[si % colors.length];
    const icon = icons[si % icons.length];
    const topicRows = ts.slice(0, 4).map(c => `
      <div class="subject-topic-row">
        <div class="subject-topic-title">${c.title}</div>
        <div class="subject-topic-status sts-${c.status}">${STATUS_LABEL[c.status] || c.status}</div>
      </div>`).join('');
    const moreMsg = ts.length > 4 ? `<div style="font-size:11px;color:var(--tmut);padding:6px 0;text-align:center">+${ts.length - 4} more topics</div>` : '';
    html += `
      <div class="subject-card" style="animation-delay:${si * 0.06}s">
        <div class="subject-card-header">
          <div class="subject-card-icon" style="background:${color}">
            <i class="ti ${icon}" style="color:#fff;font-size:18px"></i>
          </div>
          <div>
            <div class="subject-card-name">${subject}</div>
            <div class="subject-card-count">${ts.length} topic${ts.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div class="subject-card-topics">${topicRows}${moreMsg}</div>
        <div class="subject-progress">
          <div class="subject-prog-bar"><div class="subject-prog-fill" style="width:${pct}%"></div></div>
          <div class="subject-prog-label"><span>${done} done</span><span>${pct}%</span></div>
        </div>
      </div>`;
  });
  grid.innerHTML = html;
}

/* ══════════════════════════════════════════════════════════
   SECTION: SCHEDULE
══════════════════════════════════════════════════════════ */
function renderSchedule() {
  const cards = getCardData();
  const grid = document.getElementById('scheduleGrid');
  const empty = document.getElementById('scheduleEmpty');
  if (!grid) return;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const withDates = cards
    .filter(c => c.date)
    .map(c => ({ ...c, dateObj: new Date(c.date + 'T00:00:00') }))
    .sort((a, b) => a.dateObj - b.dateObj);

  if (withDates.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  let html = '';
  withDates.forEach((c, i) => {
    const diff = Math.ceil((c.dateObj - today) / (1000 * 60 * 60 * 24));
    let urgencyClass = 'urg-later', urgencyLabel = `In ${diff} days`;
    if (c.status === 'completed') { urgencyClass = 'urg-later'; urgencyLabel = 'Done ✅'; }
    else if (diff < 0) { urgencyClass = 'urg-overdue'; urgencyLabel = `${Math.abs(diff)}d overdue`; }
    else if (diff === 0) { urgencyClass = 'urg-today'; urgencyLabel = 'Today!'; }
    else if (diff === 1) { urgencyClass = 'urg-tomorrow'; urgencyLabel = 'Tomorrow'; }
    else if (diff <= 3) { urgencyClass = 'urg-soon'; }

    const monthStr = c.dateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const dayStr = c.dateObj.getDate();

    html += `
      <div class="schedule-item" style="animation-delay:${i * 0.05}s">
        <div class="schedule-date-badge">
          <div class="sdb-day">${dayStr}</div>
          <div class="sdb-month">${monthStr}</div>
        </div>
        <div class="schedule-item-info">
          <div class="schedule-item-title">${c.title}</div>
          <div class="schedule-item-meta">
            <span class="pb ${PRIORITY_CLASS[c.priority] || 'pm'}">${c.priority}</span>
            <span>${c.subject || 'General'}</span>
          </div>
        </div>
        <span class="schedule-urgency ${urgencyClass}">${urgencyLabel}</span>
      </div>`;
  });
  grid.innerHTML = html;
}

/* ══════════════════════════════════════════════════════════
   SECTION: COMPLETED
══════════════════════════════════════════════════════════ */
function renderCompleted() {
  const cards = getCardData();
  const list = document.getElementById('completedList');
  const empty = document.getElementById('completedEmpty');
  const statsBar = document.getElementById('completedStatsBar');
  if (!list) return;

  const done = cards.filter(c => c.status === 'completed');
  if (done.length === 0) {
    list.innerHTML = '';
    if (statsBar) statsBar.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  // Stats bar
  const highDone = done.filter(c => c.priority === 'High').length;
  const medDone = done.filter(c => c.priority === 'Medium').length;
  const lowDone = done.filter(c => c.priority === 'Low').length;
  if (statsBar) statsBar.innerHTML = `
    <div class="ssb-chip"><i class="ti ti-circle-check" style="color:var(--sage)"></i><div><div class="ssb-val">${done.length}</div><div style="font-size:11px;color:var(--tmut)">Total Done</div></div></div>
    <div class="ssb-chip"><div class="lbl-dot" style="background:#E24B4A;width:10px;height:10px"></div><div><div class="ssb-val" style="color:#E24B4A">${highDone}</div><div style="font-size:11px;color:var(--tmut)">High Priority</div></div></div>
    <div class="ssb-chip"><div class="lbl-dot" style="background:var(--clay);width:10px;height:10px"></div><div><div class="ssb-val" style="color:var(--clay)">${medDone}</div><div style="font-size:11px;color:var(--tmut)">Medium</div></div></div>
    <div class="ssb-chip"><div class="lbl-dot" style="background:var(--sage);width:10px;height:10px"></div><div><div class="ssb-val" style="color:var(--sage)">${lowDone}</div><div style="font-size:11px;color:var(--tmut)">Low</div></div></div>
  `;

  list.innerHTML = done.map((c, i) => `
    <div class="task-row" style="animation-delay:${i * 0.04}s">
      <i class="ti ti-circle-check task-row-check"></i>
      <div class="task-row-info">
        <div class="task-row-title done">${c.title}</div>
        <div class="task-row-meta">
          <span class="pb ${PRIORITY_CLASS[c.priority] || 'pm'}">${c.priority}</span>
          <span>${c.subject || 'General'}</span>
          ${c.date ? `<span><i class="ti ti-calendar" style="font-size:11px"></i> ${fmtDate(c.date)}</span>` : ''}
        </div>
      </div>
      <div class="task-row-right">
        <span style="font-size:10px;color:var(--sage);font-weight:600;background:var(--sage-l);padding:3px 9px;border-radius:20px">✅ Done</span>
      </div>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════════
   SECTION: PENDING
══════════════════════════════════════════════════════════ */
function renderPending() {
  const cards = getCardData();
  const list = document.getElementById('pendingList');
  const empty = document.getElementById('pendingEmpty');
  const statsBar = document.getElementById('pendingStatsBar');
  if (!list) return;

  const pend = cards.filter(c => c.status !== 'completed').sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  if (pend.length === 0) {
    list.innerHTML = '';
    if (statsBar) statsBar.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const overdue = pend.filter(c => c.date && new Date(c.date + 'T00:00:00') < today);
  const inprog = pend.filter(c => c.status === 'inprogress');

  if (statsBar) statsBar.innerHTML = `
    <div class="ssb-chip"><i class="ti ti-hourglass" style="color:var(--clay)"></i><div><div class="ssb-val" style="color:var(--clay)">${pend.length}</div><div style="font-size:11px;color:var(--tmut)">Remaining</div></div></div>
    <div class="ssb-chip"><i class="ti ti-loader" style="color:var(--sky)"></i><div><div class="ssb-val" style="color:var(--sky)">${inprog.length}</div><div style="font-size:11px;color:var(--tmut)">In Progress</div></div></div>
    <div class="ssb-chip"><i class="ti ti-alert-triangle" style="color:#E24B4A"></i><div><div class="ssb-val" style="color:#E24B4A">${overdue.length}</div><div style="font-size:11px;color:var(--tmut)">Overdue</div></div></div>
  `;

  list.innerHTML = pend.map((c, i) => {
    const dueDate = c.date ? new Date(c.date + 'T00:00:00') : null;
    const diff = dueDate ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)) : null;
    const isOverdue = diff !== null && diff < 0;
    const statusIcon = c.status === 'inprogress' ? 'ti-loader' : 'ti-clock-pause';
    const statusColor = c.status === 'inprogress' ? 'var(--sky)' : 'var(--clay)';
    return `
      <div class="task-row" style="animation-delay:${i * 0.04}s;${isOverdue ? 'border-left:3px solid #E24B4A' : ''}">
        <i class="ti ${statusIcon}" style="color:${statusColor};font-size:22px;flex-shrink:0"></i>
        <div class="task-row-info">
          <div class="task-row-title">${c.title}</div>
          <div class="task-row-meta">
            <span class="pb ${PRIORITY_CLASS[c.priority] || 'pm'}">${c.priority}</span>
            <span>${c.subject || 'General'}</span>
            ${c.date ? `<span style="${isOverdue ? 'color:#E24B4A;font-weight:700' : ''}"><i class="ti ti-calendar" style="font-size:11px"></i> ${fmtDate(c.date)}${isOverdue ? ' (overdue)' : ''}</span>` : ''}
          </div>
        </div>
        <div class="task-row-right">
          <button onclick="quickComplete(${i})" style="padding:5px 11px;background:var(--sage-l);color:var(--sage);border:1.5px solid rgba(74,155,127,.3);border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit" title="Mark as done">
            <i class="ti ti-check"></i>
          </button>
        </div>
      </div>`;
  }).join('');
}

// Quick complete from pending view
function quickComplete(pendingIdx) {
  const cards = getCardData();
  const pend = cards.filter(c => c.status !== 'completed');
  if (!pend[pendingIdx]) return;
  const target = pend[pendingIdx];
  // Find and update the actual card in DOM
  const domCards = document.querySelectorAll('.tc');
  domCards.forEach(card => {
    if (card.dataset.title === target.title && card.dataset.priority === target.priority) {
      card.dataset.status = 'completed';
      card.dataset.completedOn = new Date().toISOString().split('T')[0];
      const newCol = document.querySelector('.col-d');
      if (newCol) {
        card.classList.add('is-done');
        newCol.insertBefore(card, newCol.querySelector('.atb'));
      }
    }
  });
  updateCounters();
  applyFilters();
  saveCards();
  showSuccessToast('Topic marked complete! 🎉');
  setTimeout(() => renderPending(), 100);
}

/* ══════════════════════════════════════════════════════════
   SECTION: SETTINGS
══════════════════════════════════════════════════════════ */
function syncSettingsUI() {
  const name = localStorage.getItem('currentUser') || '';
  const inp = document.getElementById('settingsName');
  if (inp) inp.value = name;
}

function saveSettings() {
  const name = document.getElementById('settingsName')?.value.trim();
  if (!name) return;
  localStorage.setItem('currentUser', name);
  const el = document.getElementById('topbarUser');
  if (el) el.textContent = name;
  const av = document.getElementById('avatarEl');
  if (av) av.textContent = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  showSuccessToast('Profile saved!');
}

function confirmClearAll() {
  if (confirm('Are you sure you want to delete ALL topics? This cannot be undone.')) {
    localStorage.removeItem(LS_KEY);
    document.querySelectorAll('.tc').forEach(c => c.remove());
    updateCounters();
    updateDashboard();
    showSuccessToast('All topics cleared.');
  }
}

function exportData() {
  const cards = getCardData();
  const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'studyflow-export.json';
  a.click();
  showSuccessToast('Data exported!');
}

/* ══════════════════════════════════════════════════════════
   FILTER SYSTEM
══════════════════════════════════════════════════════════ */
let _filterPriority = 'All';
let _filterStatus = 'All';
let _sortMode = 'none';

function buildFilterPanel() {
  if (document.getElementById('filterPanel')) return;

  const panel = document.createElement('div');
  panel.id = 'filterPanel';
  panel.style.cssText = `display:none;position:fixed;z-index:9999;background:var(--card);border:1.5px solid var(--bdr);border-radius:13px;padding:16px 18px;min-width:210px;box-shadow:0 10px 36px rgba(0,0,0,.16);font-family:inherit;`;
  panel.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--tmut);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px">Priority</div>
    <div class="fp-group" id="fpPriority">
      ${['All', 'High', 'Medium', 'Low'].map(p => `<button class="fp-btn${p === 'All' ? ' active' : ''}" data-priority="${p}">${p}</button>`).join('')}
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--tmut);text-transform:uppercase;letter-spacing:.07em;margin:12px 0 8px">Status</div>
    <div class="fp-group" id="fpStatus">
      ${['All', 'Pending', 'In Progress', 'Completed'].map(s => `<button class="fp-btn${s === 'All' ? ' active' : ''}" data-status="${s}">${s}</button>`).join('')}
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--tmut);text-transform:uppercase;letter-spacing:.07em;margin:12px 0 8px">Sort</div>
    <div class="fp-group" id="fpSort">
      <button class="fp-btn active" data-sort="none">Default</button>
      <button class="fp-btn" data-sort="name-asc">A → Z</button>
      <button class="fp-btn" data-sort="name-desc">Z → A</button>
      <button class="fp-btn" data-sort="priority">Priority</button>
    </div>
    <button id="fpClear" style="margin-top:14px;width:100%;padding:7px;border-radius:8px;border:1.5px solid var(--bdr);background:transparent;cursor:pointer;font-size:12px;color:var(--tmut);font-family:inherit">Clear filters</button>
  `;
  document.body.appendChild(panel);

  panel.querySelectorAll('#fpPriority .fp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('#fpPriority .fp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _filterPriority = btn.dataset.priority;
      applyFilters();
    });
  });
  panel.querySelectorAll('#fpStatus .fp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('#fpStatus .fp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _filterStatus = btn.dataset.status;
      applyFilters();
    });
  });
  panel.querySelectorAll('#fpSort .fp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('#fpSort .fp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _sortMode = btn.dataset.sort;
      applyFilters();
    });
  });
  panel.querySelector('#fpClear').addEventListener('click', () => {
    _filterPriority = 'All'; _filterStatus = 'All'; _sortMode = 'none';
    panel.querySelectorAll('.fp-btn').forEach(b => b.classList.remove('active'));
    panel.querySelector('[data-priority="All"]').classList.add('active');
    panel.querySelector('[data-status="All"]').classList.add('active');
    panel.querySelector('[data-sort="none"]').classList.add('active');
    applyFilters();
  });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target.id !== 'filterBtn') panel.style.display = 'none';
  });
}

function toggleFilterPanel() {
  buildFilterPanel();
  const panel = document.getElementById('filterPanel');
  const btn = document.getElementById('filterBtn');
  if (!btn) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    const rect = btn.getBoundingClientRect();
    panel.style.top = (rect.bottom + 6 + window.scrollY) + 'px';
    panel.style.left = Math.max(8, rect.right - 210 + window.scrollX) + 'px';
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

function applyFilters() {
  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const statusColMap = { 'Pending': 'col-p', 'In Progress': 'col-i', 'Completed': 'col-d' };

  ['.col-p', '.col-i', '.col-d'].forEach(colSel => {
    const col = document.querySelector(colSel);
    if (!col) return;

    let colHidden = false;
    if (_filterStatus !== 'All') {
      const requiredCls = statusColMap[_filterStatus];
      colHidden = !col.classList.contains(requiredCls);
    }

    let cards = Array.from(col.querySelectorAll('.tc'));
    if (_sortMode === 'name-asc') cards.sort((a, b) => (a.dataset.title || '').localeCompare(b.dataset.title || ''));
    if (_sortMode === 'name-desc') cards.sort((a, b) => (b.dataset.title || '').localeCompare(a.dataset.title || ''));
    if (_sortMode === 'priority') cards.sort((a, b) => (PRIORITY_ORDER[a.dataset.priority] || 2) - (PRIORITY_ORDER[b.dataset.priority] || 2));

    const atb = col.querySelector('.atb');
    cards.forEach(card => col.insertBefore(card, atb));

    let visibleCount = 0;
    cards.forEach(card => {
      const title = (card.dataset.title || card.querySelector('.tn')?.textContent || '').toLowerCase();
      const priority = (card.dataset.priority || '').toLowerCase();
      const matchSearch = !searchVal || title.includes(searchVal);
      const matchPriority = _filterPriority === 'All' || priority === _filterPriority.toLowerCase();
      const show = !colHidden && matchSearch && matchPriority;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    let msg = col.querySelector('.no-tasks-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'no-tasks-msg';
      msg.innerHTML = '<i class="ti ti-mood-empty"></i>No tasks found';
      col.insertBefore(msg, atb);
    }
    msg.style.display = (visibleCount === 0 && !colHidden) ? 'block' : 'none';
    col.style.display = colHidden ? 'none' : '';
  });
}

/* ══════════════════════════════════════════════════════════
   SEARCH
══════════════════════════════════════════════════════════ */
const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.addEventListener('input', applyFilters);

const filterBtn = document.getElementById('filterBtn');
if (filterBtn) filterBtn.addEventListener('click', e => { e.stopPropagation(); toggleFilterPanel(); });

/* ══════════════════════════════════════════════════════════
   CRUD MODAL SYSTEM
══════════════════════════════════════════════════════════ */
let _editTarget = null;
let _delTarget = null;

function openAddModal() {
  _editTarget = null;
  document.getElementById('crudModalTitle').textContent = '✨ Add Topic';
  document.getElementById('crudTitle').value = '';
  document.getElementById('crudPriority').value = 'Medium';
  document.getElementById('crudStatus').value = 'pending';
  document.getElementById('crudDate').value = '';
  const subj = document.getElementById('crudSubject');
  if (subj) subj.value = '';
  document.getElementById('crudSaveBtn').innerHTML = '<i class="ti ti-check"></i> Save Topic';
  showModal('crudBackdrop', 'crudModal');
}

function openEditModal(card) {
  _editTarget = card;
  document.getElementById('crudModalTitle').textContent = '✏️ Edit Topic';
  document.getElementById('crudTitle').value = card.dataset.title || card.querySelector('.tn').textContent;
  document.getElementById('crudPriority').value = card.dataset.priority || 'Medium';
  document.getElementById('crudStatus').value = card.dataset.status || 'pending';
  document.getElementById('crudDate').value = card.dataset.date || '';
  const subj = document.getElementById('crudSubject');
  if (subj) subj.value = card.dataset.subject || '';
  document.getElementById('crudSaveBtn').innerHTML = '<i class="ti ti-check"></i> Update Topic';
  showModal('crudBackdrop', 'crudModal');
}

function saveCrudTopic() {
  const title = document.getElementById('crudTitle').value.trim();
  const priority = document.getElementById('crudPriority').value;
  const status = document.getElementById('crudStatus').value;
  const dateVal = document.getElementById('crudDate').value;
  const subject = (document.getElementById('crudSubject')?.value.trim()) || 'General';

  if (!title) {
    const inp = document.getElementById('crudTitle');
    inp.focus();
    inp.style.borderColor = '#E24B4A';
    inp.style.boxShadow = '0 0 0 3px rgba(226,75,74,.15)';
    setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 1400);
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const doneOn = status === 'completed' ? today : '';

  if (_editTarget) {
    const newCard = buildCard(title, priority, dateVal, status, _editTarget.dataset.addedOn || today, subject, _editTarget.dataset.completedOn || doneOn);
    const oldCol = _editTarget.closest('.col');
    const newCol = document.querySelector(COL_MAP[status]);
    if (oldCol !== newCol) {
      _editTarget.remove();
      newCol.insertBefore(newCard, newCol.querySelector('.atb'));
    } else {
      oldCol.replaceChild(newCard, _editTarget);
    }
  } else {
    const col = document.querySelector(COL_MAP[status]);
    col.insertBefore(buildCard(title, priority, dateVal, status, today, subject, doneOn), col.querySelector('.atb'));
  }

  updateCounters();
  applyFilters();
  saveCards();
  closeCrudModal();
  showSuccessToast(_editTarget ? 'Topic updated!' : 'Topic added! 🎉');
}

function openDeleteModal(card) {
  _delTarget = card;
  showModal('delBackdrop', 'delModal');
}

document.getElementById('delConfirmBtn').addEventListener('click', () => {
  if (_delTarget) {
    _delTarget.remove();
    _delTarget = null;
    updateCounters();
    applyFilters();
    saveCards();
    showSuccessToast('Topic deleted.');
  }
  closeDeleteModal();
});

function showModal(backdropId, modalId) {
  document.getElementById(backdropId).classList.add('show');
  const m = document.getElementById(modalId);
  m.style.display = 'block';
  requestAnimationFrame(() => m.classList.add('show'));
}
function closeCrudModal() {
  document.getElementById('crudBackdrop').classList.remove('show');
  const m = document.getElementById('crudModal');
  m.classList.remove('show');
  setTimeout(() => { m.style.display = ''; }, 220);
}
function closeDeleteModal() {
  document.getElementById('delBackdrop').classList.remove('show');
  const m = document.getElementById('delModal');
  m.classList.remove('show');
  setTimeout(() => { m.style.display = ''; }, 220);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCrudModal(); closeDeleteModal(); }
});

const addTopicBtn = document.getElementById('addTopicBtn');
if (addTopicBtn) addTopicBtn.addEventListener('click', openAddModal);

document.querySelectorAll('.atb').forEach(btn => {
  const col = btn.closest('.col');
  btn.addEventListener('click', () => {
    let status = 'pending';
    if (col.classList.contains('col-i')) status = 'inprogress';
    if (col.classList.contains('col-d')) status = 'completed';
    openAddModal();
    document.getElementById('crudStatus').value = status;
  });
});

/* ══════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
══════════════════════════════════════════════════════════ */
function setMobNav(el) {
  document.querySelectorAll('.mni').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const section = el.dataset.section;
  if (section) switchSection(section);
}

/* ══════════════════════════════════════════════════════════
   STATIC CARD INITIALISATION
══════════════════════════════════════════════════════════ */
function initStaticCards() {
  document.querySelectorAll('.tc').forEach(card => {
    if (card.dataset.title) return;
    const col = card.closest('.col');
    if (!col) return;
    let status = 'pending';
    if (col.classList.contains('col-i')) status = 'inprogress';
    if (col.classList.contains('col-d')) status = 'completed';
    const badge = card.querySelector('.pb');
    const priority = badge ? badge.textContent.trim() : 'Medium';
    card.dataset.title = card.querySelector('.tn').textContent;
    card.dataset.priority = priority;
    card.dataset.status = status;
    card.dataset.date = '';
    card.dataset.subject = 'General';
    card.dataset.addedOn = new Date().toISOString().split('T')[0];
    card.dataset.completedOn = status === 'completed' ? new Date().toISOString().split('T')[0] : '';
    if (!card.querySelector('.tc-actions')) {
      const actions = document.createElement('div');
      actions.className = 'tc-actions';
      actions.innerHTML = `
        <button class="tca-btn tca-edit" title="Edit" onclick="openEditModal(this.closest('.tc'))"><i class="ti ti-pencil"></i></button>
        <button class="tca-btn tca-del" title="Delete" onclick="openDeleteModal(this.closest('.tc'))"><i class="ti ti-trash"></i></button>`;
      card.prepend(actions);
    }
  });
}

/* ══════════════════════════════════════════════════════════
   INIT — user-isolated startup
   • Returning user  → their own tasks load from LS_KEY.
   • Brand-new user  → HTML demo cards are removed so they
     start with a completely empty board. Their LS_KEY is
     then seeded with [] so future loads stay clean too.
══════════════════════════════════════════════════════════ */
if (localStorage.getItem(LS_KEY) !== null) {
  // Returning user — restore exactly their own saved tasks
  loadCards();
} else {
  // New user — wipe the static HTML seed cards entirely
  document.querySelectorAll('.tc').forEach(c => c.remove());
  // Persist the empty state under this user's own key
  localStorage.setItem(LS_KEY, JSON.stringify([]));
}

updateCounters();
applyFilters();
updateDashboard();

// Start on Dashboard
switchSection('dashboard');
