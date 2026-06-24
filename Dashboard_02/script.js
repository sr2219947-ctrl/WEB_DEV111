// ── Auth Guard ──────────────────────────────────────────────
if (localStorage.getItem('isLoggedIn') !== 'true') {
  location.href = 'index.html';
}

// ── Logout ──────────────────────────────────────────────────
function logout() {
  localStorage.clear();
  location.href = 'index.html';
}

// ── Drawer (mobile sidebar) ─────────────────────────────────
function openDrawer() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('drawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('drawer').classList.remove('open');
}

function setMobNav(el) {
  document.querySelectorAll('.mni').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
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

// ── Sidebar nav active state ─────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
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
        x: {
          grid: { display: false },
          ticks: { font: { size: 9 }, color: isMob ? '#6B9E8A' : '#8BA49C' }
        },
        y: { display: false }
      }
    }
  });
}

// ── Search ───────────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keyup', function () {
    const val = this.value.toLowerCase();
    document.querySelectorAll('.tc').forEach(card => {
      const title = card.querySelector('.tn').textContent.toLowerCase();
      card.style.display = title.includes(val) ? '' : 'none';
    });
  });
}

// ── Filter ───────────────────────────────────────────────────
const filterBtn = document.getElementById('filterBtn');
if (filterBtn) {
  filterBtn.addEventListener('click', () => {
    const priority = prompt('Filter by priority:\nHigh\nMedium\nLow\nAll');
    if (!priority) return;
    document.querySelectorAll('.tc').forEach(card => {
      const badge = card.querySelector('.pb');
      card.style.display = (
        priority.toLowerCase() === 'all' ||
        badge.textContent.toLowerCase() === priority.toLowerCase()
      ) ? '' : 'none';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   CRUD SYSTEM
══════════════════════════════════════════════════════════ */

let _editTarget = null;   // card element being edited
let _delTarget  = null;   // card element to delete

// ── Priority badge class map ─────────────────────────────
const PRIORITY_CLASS = { High: 'ph', Medium: 'pm', Low: 'pl' };

// ── Column map ───────────────────────────────────────────
const COL_MAP = {
  pending:    '.col-p',
  inprogress: '.col-i',
  completed:  '.col-d'
};

// ── Format date for display ──────────────────────────────
function fmtDate(val) {
  if (!val) return 'TBD';
  const d = new Date(val + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ── Update column counter badges ─────────────────────────
function updateCounters() {
  const cols = [
    { sel: '.col-p', idx: 0 },
    { sel: '.col-i', idx: 1 },
    { sel: '.col-d', idx: 2 }
  ];
  const counters = document.querySelectorAll('.cc');
  cols.forEach(({ sel }, i) => {
    const col = document.querySelector(sel);
    if (!col || !counters[i]) return;
    counters[i].textContent = col.querySelectorAll('.tc').length;
  });
}

// ── Build a topic card element ───────────────────────────
function buildCard(title, priority, dateVal, status) {
  const isDone = status === 'completed';
  const card = document.createElement('div');
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

// ── Open ADD modal ───────────────────────────────────────
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

// ── Open EDIT modal ──────────────────────────────────────
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

// ── Save (Add or Update) ─────────────────────────────────
function saveCrudTopic() {
  const title    = document.getElementById('crudTitle').value.trim();
  const priority = document.getElementById('crudPriority').value;
  const status   = document.getElementById('crudStatus').value;
  const dateVal  = document.getElementById('crudDate').value;

  if (!title) {
    document.getElementById('crudTitle').focus();
    document.getElementById('crudTitle').style.borderColor = '#E24B4A';
    setTimeout(() => document.getElementById('crudTitle').style.borderColor = '', 1200);
    return;
  }

  if (_editTarget) {
    // UPDATE existing card
    const newCard = buildCard(title, priority, dateVal, status);
    const oldCol  = _editTarget.closest('.col');
    const newCol  = document.querySelector(COL_MAP[status]);

    if (oldCol !== newCol) {
      // move to correct column, insert before "Add topic" button
      _editTarget.remove();
      const atb = newCol.querySelector('.atb');
      newCol.insertBefore(newCard, atb);
    } else {
      oldCol.replaceChild(newCard, _editTarget);
    }
  } else {
    // ADD new card
    const col = document.querySelector(COL_MAP[status]);
    const atb = col.querySelector('.atb');
    const card = buildCard(title, priority, dateVal, status);
    col.insertBefore(card, atb);
  }

  updateCounters();
  closeCrudModal();
}

// ── Open DELETE confirm ──────────────────────────────────
function openDeleteModal(card) {
  _delTarget = card;
  showModal('delBackdrop', 'delModal');
}

// ── Confirm delete ───────────────────────────────────────
document.getElementById('delConfirmBtn').addEventListener('click', () => {
  if (_delTarget) {
    _delTarget.remove();
    _delTarget = null;
    updateCounters();
  }
  closeDeleteModal();
});

// ── Modal helpers ────────────────────────────────────────
function showModal(backdropId, modalId) {
  document.getElementById(backdropId).classList.add('show');
  // force reflow for animation
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

// ── ESC key closes modals ────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCrudModal(); closeDeleteModal(); }
});

// ── Wire "Add Topic" buttons ─────────────────────────────
// Top bar "Add Topic" button
const addTopicBtn = document.getElementById('addTopicBtn');
if (addTopicBtn) {
  addTopicBtn.addEventListener('click', openAddModal);
}

// Column-level "+ Add topic" buttons — set status pre-selected
document.querySelectorAll('.atb').forEach(btn => {
  const col = btn.closest('.col');
  btn.addEventListener('click', () => {
    // detect which column
    let status = 'pending';
    if (col.classList.contains('col-i')) status = 'inprogress';
    if (col.classList.contains('col-d')) status = 'completed';
    openAddModal();
    document.getElementById('crudStatus').value = status;
  });
});

// ── Attach edit/delete to pre-existing static cards ─────
document.querySelectorAll('.tc').forEach(card => {
  // Determine status from column
  const col = card.closest('.col');
  if (!col) return;
  let status = 'pending';
  if (col.classList.contains('col-i')) status = 'inprogress';
  if (col.classList.contains('col-d')) status = 'completed';

  // Read priority
  const badge = card.querySelector('.pb');
  const priority = badge ? badge.textContent.trim() : 'Medium';

  // Store data attrs for CRUD
  card.dataset.title    = card.querySelector('.tn').textContent;
  card.dataset.priority = priority;
  card.dataset.status   = status;
  card.dataset.date     = '';

  // Inject action buttons if not already there
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

// ── Initial counter sync ─────────────────────────────────
updateCounters();
