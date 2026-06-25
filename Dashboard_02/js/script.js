

// ── Auth Guard ───────────────────────────────────────────────
if (localStorage.getItem('isLoggedIn') !== 'true') {
  location.href = '../index.html';
}

// ── Logout ───────────────────────────────────────────────────
function logout() {
  localStorage.clear();
  location.href = '../index.html';
}

// ── Drawer (mobile sidebar) ──────────────────────────────────
function openDrawer() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('drawer').classList.add('open');
}
function closeDrawer() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('drawer').classList.remove('open');
}

// ── Toast close buttons ──────────────────────────────────────
document.querySelectorAll('.tcl').forEach(b => {
  b.addEventListener('click', function () {
    const t = this.closest('.toast');
    t.style.opacity = '0';
    t.style.transform = 'translateX(12px)';
    setTimeout(() => t.remove(), 280);
  });
});

// ── Chart ────────────────────────────────────────────────────
const ctx = document.getElementById('mc');
if (ctx) {
  const isMob = window.innerWidth <= 900;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [{
        data: [40, 55, 50, 70, 65, 80, 75],
        borderColor: isMob ? '#3DD9A4' : '#4A9B7F',
        backgroundColor: isMob ? 'rgba(61,217,164,.08)' : 'rgba(74,155,127,.08)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: isMob ? '#3DD9A4' : '#4A9B7F',
        tension: .4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 }, color: isMob ? '#6B9E8A' : '#8BA49C' } },
        y: { display: false }
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   PRIORITY / STATUS HELPERS
══════════════════════════════════════════════════════════ */
const PRIORITY_CLASS = { High: 'ph', Medium: 'pm', Low: 'pl' };
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };
const COL_MAP = { pending: '.col-p', inprogress: '.col-i', completed: '.col-d' };

function fmtDate(val) {
  if (!val) return 'TBD';
  const d = new Date(val + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ══════════════════════════════════════════════════════════
   LOCAL STORAGE — CARD PERSISTENCE
══════════════════════════════════════════════════════════ */
const LS_KEY = 'studyflow_cards';

function saveCards() {
  const cards = [];
  document.querySelectorAll('.tc').forEach(card => {
    cards.push({
      title:    card.dataset.title    || card.querySelector('.tn').textContent,
      priority: card.dataset.priority || 'Medium',
      status:   card.dataset.status   || 'pending',
      date:     card.dataset.date     || ''
    });
  });
  localStorage.setItem(LS_KEY, JSON.stringify(cards));
}

function loadCards() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    const cards = JSON.parse(raw);
    // Remove all existing static cards first
    document.querySelectorAll('.tc').forEach(c => c.remove());
    cards.forEach(({ title, priority, status, date }) => {
      const col = document.querySelector(COL_MAP[status] || COL_MAP.pending);
      if (!col) return;
      const card = buildCard(title, priority, date, status);
      const atb  = col.querySelector('.atb');
      col.insertBefore(card, atb);
    });
  } catch (e) { /* ignore bad data */ }
}

/* ══════════════════════════════════════════════════════════
   BUILD CARD
══════════════════════════════════════════════════════════ */
function buildCard(title, priority, dateVal, status) {
  const isDone = status === 'completed';
  const card   = document.createElement('div');
  card.className = 'tc' + (isDone ? ' is-done' : '');
  card.dataset.title    = title;
  card.dataset.priority = priority;
  card.dataset.date     = dateVal;
  card.dataset.status   = status;

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
      <div class="tav">SR</div>
    </div>`;
  return card;
}

/* ══════════════════════════════════════════════════════════
   COUNTER
══════════════════════════════════════════════════════════ */
function updateCounters() {
  const counters = document.querySelectorAll('.cc');
  const cols = ['.col-p', '.col-i', '.col-d'];
  cols.forEach((sel, i) => {
    const col = document.querySelector(sel);
    if (col && counters[i]) counters[i].textContent = col.querySelectorAll('.tc').length;
  });
}

/* ══════════════════════════════════════════════════════════
   FILTER DROPDOWN (replaces prompt-based filter)
══════════════════════════════════════════════════════════ */

// Active filter/sort state
let _filterPriority = 'All';
let _filterStatus   = 'All';
let _sortMode       = 'none'; // 'name-asc' | 'name-desc' | 'priority' | 'none'

// Build the dropdown panel once and append to body
function buildFilterPanel() {
  const existing = document.getElementById('filterPanel');
  if (existing) return; // already built

  const panel = document.createElement('div');
  panel.id = 'filterPanel';
  panel.style.cssText = `
    display:none; position:fixed; z-index:9999;
    background:var(--card,#fff); border:1px solid rgba(0,0,0,.08);
    border-radius:12px; padding:14px 16px; min-width:200px;
    box-shadow:0 8px 32px rgba(0,0,0,.13); font-family:inherit;
  `;
  panel.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--tmut,#8BA49C);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Priority</div>
    <div class="fp-group" id="fpPriority">
      ${['All','High','Medium','Low'].map(p =>
        `<button class="fp-btn${p==='All'?' active':''}" data-priority="${p}">${p}</button>`
      ).join('')}
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--tmut,#8BA49C);text-transform:uppercase;letter-spacing:.06em;margin:10px 0 8px">Status</div>
    <div class="fp-group" id="fpStatus">
      ${['All','Pending','In Progress','Completed'].map(s =>
        `<button class="fp-btn${s==='All'?' active':''}" data-status="${s}">${s}</button>`
      ).join('')}
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--tmut,#8BA49C);text-transform:uppercase;letter-spacing:.06em;margin:10px 0 8px">Sort</div>
    <div class="fp-group" id="fpSort">
      <button class="fp-btn active" data-sort="none">Default</button>
      <button class="fp-btn" data-sort="name-asc">A → Z</button>
      <button class="fp-btn" data-sort="name-desc">Z → A</button>
      <button class="fp-btn" data-sort="priority">Priority</button>
    </div>
    <button id="fpClear" style="margin-top:12px;width:100%;padding:6px;border-radius:7px;border:1px solid rgba(0,0,0,.1);background:transparent;cursor:pointer;font-size:12px;color:var(--tmut,#8BA49C)">Clear filters</button>
  `;
  document.body.appendChild(panel);

  // Inject minimal styles for the filter panel buttons
  const style = document.createElement('style');
  style.textContent = `
    .fp-group { display:flex; flex-wrap:wrap; gap:5px; }
    .fp-btn {
      padding:4px 10px; border-radius:6px; border:1px solid rgba(0,0,0,.1);
      background:transparent; cursor:pointer; font-size:12px;
      color:var(--tmut,#8BA49C); transition:all .15s;
    }
    .fp-btn.active, .fp-btn:hover {
      background:var(--sage,#4A9B7F); color:#fff; border-color:transparent;
    }
    .no-tasks-msg {
      text-align:center; padding:24px 12px; color:var(--tmut,#8BA49C);
      font-size:13px; font-style:italic; display:none;
    }
    .no-tasks-msg i { display:block; font-size:22px; margin-bottom:6px; opacity:.5; }
  `;
  document.head.appendChild(style);

  // Priority buttons
  panel.querySelectorAll('#fpPriority .fp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('#fpPriority .fp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _filterPriority = btn.dataset.priority;
      applyFilters();
    });
  });

  // Status buttons
  panel.querySelectorAll('#fpStatus .fp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('#fpStatus .fp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _filterStatus = btn.dataset.status;
      applyFilters();
    });
  });

  // Sort buttons
  panel.querySelectorAll('#fpSort .fp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('#fpSort .fp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _sortMode = btn.dataset.sort;
      applyFilters();
    });
  });

  // Clear
  panel.querySelector('#fpClear').addEventListener('click', () => {
    _filterPriority = 'All';
    _filterStatus   = 'All';
    _sortMode       = 'none';
    panel.querySelectorAll('.fp-btn').forEach(b => b.classList.remove('active'));
    panel.querySelector('[data-priority="All"]').classList.add('active');
    panel.querySelector('[data-status="All"]').classList.add('active');
    panel.querySelector('[data-sort="none"]').classList.add('active');
    applyFilters();
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target.id !== 'filterBtn') {
      panel.style.display = 'none';
    }
  });
}

function toggleFilterPanel() {
  buildFilterPanel();
  const panel = document.getElementById('filterPanel');
  const btn   = document.getElementById('filterBtn');
  if (!btn) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    const rect = btn.getBoundingClientRect();
    panel.style.top  = (rect.bottom + 6 + window.scrollY) + 'px';
    panel.style.left = Math.max(8, rect.right - 200 + window.scrollX) + 'px';
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

/* ══════════════════════════════════════════════════════════
   APPLY FILTERS + SORT + SEARCH
══════════════════════════════════════════════════════════ */
function applyFilters() {
  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

  // Status → column class map
  const statusColMap = {
    'Pending':     'col-p',
    'In Progress': 'col-i',
    'Completed':   'col-d'
  };

  ['.col-p', '.col-i', '.col-d'].forEach(colSel => {
    const col = document.querySelector(colSel);
    if (!col) return;

    // Determine if this column is hidden by status filter
    let colHidden = false;
    if (_filterStatus !== 'All') {
      const requiredCls = statusColMap[_filterStatus];
      colHidden = !col.classList.contains(requiredCls);
    }

    let cards = Array.from(col.querySelectorAll('.tc'));

    // Sort before showing
    if (_sortMode === 'name-asc') {
      cards.sort((a, b) => (a.dataset.title || '').localeCompare(b.dataset.title || ''));
    } else if (_sortMode === 'name-desc') {
      cards.sort((a, b) => (b.dataset.title || '').localeCompare(a.dataset.title || ''));
    } else if (_sortMode === 'priority') {
      cards.sort((a, b) => (PRIORITY_ORDER[a.dataset.priority] || 2) - (PRIORITY_ORDER[b.dataset.priority] || 2));
    }

    // Re-insert in sorted order (before .atb)
    const atb = col.querySelector('.atb');
    cards.forEach(card => col.insertBefore(card, atb));

    // Show / hide individual cards
    let visibleCount = 0;
    cards.forEach(card => {
      const title    = (card.dataset.title || card.querySelector('.tn')?.textContent || '').toLowerCase();
      const priority = (card.dataset.priority || '').toLowerCase();

      const matchSearch   = !searchVal || title.includes(searchVal);
      const matchPriority = _filterPriority === 'All' || priority === _filterPriority.toLowerCase();

      const show = !colHidden && matchSearch && matchPriority;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // "No tasks found" message per column
    let msg = col.querySelector('.no-tasks-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'no-tasks-msg';
      msg.innerHTML = '<i class="ti ti-mood-empty"></i>No tasks found';
      col.insertBefore(msg, atb);
    }
    msg.style.display = (visibleCount === 0 && !colHidden) ? 'block' : 'none';

    // Hide/show entire column header + atb when status filter excludes it
    if (colHidden) {
      col.style.display = 'none';
    } else {
      col.style.display = '';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR / MOBILE NAV FILTERING
══════════════════════════════════════════════════════════ */

// Map nav labels → status filter value
const NAV_FILTER_MAP = {
  'dashboard':  null,        // show all
  'my subjects': null,       // show all
  'completed':  'Completed',
  'pending':    'Pending',
  'schedule':   null,        // show all (future: could highlight by date)
  'settings':   null,
  // mobile
  'home':       null,
  'subjects':   null,
  'done':       'Completed'
};

function activateSideNav(label, navItem, allItems) {
  allItems.forEach(i => i.classList.remove('active'));
  navItem.classList.add('active');

  const key = label.toLowerCase().trim();
  const statusFilter = NAV_FILTER_MAP.hasOwnProperty(key) ? NAV_FILTER_MAP[key] : null;

  if (statusFilter !== null) {
    _filterStatus = statusFilter;
    // Update the filter panel UI if it exists
    const panel = document.getElementById('filterPanel');
    if (panel) {
      panel.querySelectorAll('#fpStatus .fp-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.status === statusFilter);
      });
    }
    applyFilters();
  } else {
    // Reset status filter to show all
    _filterStatus = 'All';
    const panel = document.getElementById('filterPanel');
    if (panel) {
      panel.querySelectorAll('#fpStatus .fp-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.status === 'All');
      });
    }
    applyFilters();
  }
}

// Wire sidebar nav items
document.querySelectorAll('.sidebar .nav-item').forEach(item => {
  item.addEventListener('click', function () {
    const label = this.textContent.trim();
    activateSideNav(label, this, document.querySelectorAll('.sidebar .nav-item'));
    // Also sync drawer nav
    document.querySelectorAll('.mob-drawer .nav-item').forEach(d => {
      d.classList.toggle('active', d.textContent.trim().toLowerCase() === label.toLowerCase());
    });
  });
});

// Wire mobile drawer nav items
document.querySelectorAll('.mob-drawer .nav-item').forEach(item => {
  item.addEventListener('click', function () {
    if (this.classList.contains('logout-item')) return;
    const label = this.textContent.trim();
    activateSideNav(label, this, document.querySelectorAll('.mob-drawer .nav-item'));
    // Also sync sidebar
    document.querySelectorAll('.sidebar .nav-item').forEach(s => {
      s.classList.toggle('active', s.textContent.trim().toLowerCase() === label.toLowerCase());
    });
    closeDrawer();
  });
});

// Wire bottom mobile nav (.mni)
function setMobNav(el) {
  document.querySelectorAll('.mni').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const label = el.querySelector('span')?.textContent?.toLowerCase()?.trim() || '';
  const statusFilter = NAV_FILTER_MAP.hasOwnProperty(label) ? NAV_FILTER_MAP[label] : null;
  _filterStatus = statusFilter !== null ? statusFilter : 'All';
  applyFilters();
}

/* ══════════════════════════════════════════════════════════
   SEARCH
══════════════════════════════════════════════════════════ */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', applyFilters);
}

/* ══════════════════════════════════════════════════════════
   FILTER BUTTON → dropdown
══════════════════════════════════════════════════════════ */
const filterBtn = document.getElementById('filterBtn');
if (filterBtn) {
  filterBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleFilterPanel();
  });
}

/* ══════════════════════════════════════════════════════════
   CRUD SYSTEM
══════════════════════════════════════════════════════════ */
let _editTarget = null;
let _delTarget  = null;

function openAddModal() {
  _editTarget = null;
  document.getElementById('crudModalTitle').textContent = 'Add Topic';
  document.getElementById('crudTitle').value    = '';
  document.getElementById('crudPriority').value = 'Medium';
  document.getElementById('crudStatus').value   = 'pending';
  document.getElementById('crudDate').value     = '';
  document.getElementById('crudSaveBtn').innerHTML = '<i class="ti ti-check"></i> Save Topic';
  showModal('crudBackdrop', 'crudModal');
}

function openEditModal(card) {
  _editTarget = card;
  document.getElementById('crudModalTitle').textContent = 'Edit Topic';
  document.getElementById('crudTitle').value    = card.dataset.title    || card.querySelector('.tn').textContent;
  document.getElementById('crudPriority').value = card.dataset.priority || 'Medium';
  document.getElementById('crudStatus').value   = card.dataset.status   || 'pending';
  document.getElementById('crudDate').value     = card.dataset.date     || '';
  document.getElementById('crudSaveBtn').innerHTML = '<i class="ti ti-check"></i> Update Topic';
  showModal('crudBackdrop', 'crudModal');
}

function saveCrudTopic() {
  const title    = document.getElementById('crudTitle').value.trim();
  const priority = document.getElementById('crudPriority').value;
  const status   = document.getElementById('crudStatus').value;
  const dateVal  = document.getElementById('crudDate').value;

  if (!title) {
    const inp = document.getElementById('crudTitle');
    inp.focus();
    inp.style.borderColor = '#E24B4A';
    setTimeout(() => inp.style.borderColor = '', 1200);
    return;
  }

  if (_editTarget) {
    const newCard = buildCard(title, priority, dateVal, status);
    const oldCol  = _editTarget.closest('.col');
    const newCol  = document.querySelector(COL_MAP[status]);
    if (oldCol !== newCol) {
      _editTarget.remove();
      newCol.insertBefore(newCard, newCol.querySelector('.atb'));
    } else {
      oldCol.replaceChild(newCard, _editTarget);
    }
  } else {
    const col  = document.querySelector(COL_MAP[status]);
    const atb  = col.querySelector('.atb');
    col.insertBefore(buildCard(title, priority, dateVal, status), atb);
  }

  updateCounters();
  applyFilters();
  saveCards();
  closeCrudModal();
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
  setTimeout(() => { m.style.display = ''; }, 200);
}
function closeDeleteModal() {
  document.getElementById('delBackdrop').classList.remove('show');
  const m = document.getElementById('delModal');
  m.classList.remove('show');
  setTimeout(() => { m.style.display = ''; }, 200);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCrudModal(); closeDeleteModal(); }
});

// ── Add Topic buttons ────────────────────────────────────────
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
   INIT — attach data attrs to static cards + load from LS
══════════════════════════════════════════════════════════ */
function initStaticCards() {
  document.querySelectorAll('.tc').forEach(card => {
    if (card.dataset.title) return; // already initialised
    const col = card.closest('.col');
    if (!col) return;
    let status = 'pending';
    if (col.classList.contains('col-i')) status = 'inprogress';
    if (col.classList.contains('col-d')) status = 'completed';

    const badge    = card.querySelector('.pb');
    const priority = badge ? badge.textContent.trim() : 'Medium';

    card.dataset.title    = card.querySelector('.tn').textContent;
    card.dataset.priority = priority;
    card.dataset.status   = status;
    card.dataset.date     = '';

    if (!card.querySelector('.tc-actions')) {
      const actions = document.createElement('div');
      actions.className = 'tc-actions';
      actions.innerHTML = `
        <button class="tca-btn tca-edit" title="Edit" onclick="openEditModal(this.closest('.tc'))">
          <i class="ti ti-pencil"></i>
        </button>
        <button class="tca-btn tca-del" title="Delete" onclick="openDeleteModal(this.closest('.tc'))">
          <i class="ti ti-trash"></i>
        </button>`;
      card.prepend(actions);
    }
  });
}

// If localStorage has saved cards, load them (replaces static cards).
// Otherwise init the static HTML cards.
if (localStorage.getItem(LS_KEY)) {
  loadCards();
} else {
  initStaticCards();
  saveCards(); // seed localStorage with initial static cards
}

updateCounters();
applyFilters();
