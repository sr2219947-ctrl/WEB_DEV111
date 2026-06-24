// ── Auth Guard ──────────────────────────────────────────────
// Redirect to login if not authenticated
if (localStorage.getItem('isLoggedIn') !== 'true') {
  location.href = 'index.html';
}

// ── Logout 
function logout() {
  localStorage.clear();
  location.href = 'index.html';
}

// ── Drawer (mobile sidebar) 
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
          ticks: {
            font: { size: 9 },
            color: isMob ? '#6B9E8A' : '#8BA49C'
          }
        },
        y: { display: false }
      }
    }
  });
}

// ── Search ───────────────────────────────────────────────────
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    document.querySelectorAll(".tc").forEach(card => {
      const title = card.querySelector(".tn").textContent.toLowerCase();
      card.style.display = title.includes(value) ? "" : "none";
    });
  });
}

// ── Add Topic ────────────────────────────────────────────────
const addTopicBtn = document.getElementById("addTopicBtn");

if (addTopicBtn) {
  addTopicBtn.addEventListener("click", () => {
    const topic = prompt("Enter Topic Name");
    if (!topic) return;

    const card = document.createElement("div");
    card.className = "tc";
    card.innerHTML = `
      <div class="tn">${topic}</div>
      <div class="tm2">
        <span class="pb pl">Low</span>
        <span class="td2">
          <i class="ti ti-calendar"></i> New
        </span>
        <div class="tav">SR</div>
      </div>
    `;
    document.querySelector(".col-p").appendChild(card);
  });
}

// ── Filter ───────────────────────────────────────────────────
const filterBtn = document.getElementById("filterBtn");

if (filterBtn) {
  filterBtn.addEventListener("click", () => {
    const priority = prompt("Enter:\nHigh\nMedium\nLow\nAll");
    if (!priority) return;

    document.querySelectorAll(".tc").forEach(card => {
      const badge = card.querySelector(".pb");
      card.style.display = (
        priority.toLowerCase() === "all" ||
        badge.textContent.toLowerCase() === priority.toLowerCase()
      ) ? "" : "none";
    });
  });
}
