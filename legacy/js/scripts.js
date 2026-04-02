/* ══════════════════════════════════════
   GLOBAL STATE & CONSTANTS
   ══════════════════════════════════════ */
let isDark = localStorage.getItem('theme') === 'dark';
let chartInstances = {};
let chartsInited = false;
let reportChartInited = false;

// Initialize theme on load
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

/* ══════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════ */
function toggleTheme() {
  isDark = !isDark;
  const html = document.documentElement;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  const lbl = document.getElementById('theme-label');
  if(lbl) lbl.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  
  toast(isDark ? 'info' : 'info', isDark ? 'Dark Mode On 🌙' : 'Light Mode On ☀️',
    isDark ? 'Switched to dark mode.' : 'Switched to light mode.', isDark ? '🌙' : '☀️');
  
  updateChartTheme();
}

/* ══════════════════════════════════════
   TOAST SYSTEM
   ══════════════════════════════════════ */
const TOAST_ICONS = { success:'✅', error:'❌', info:'ℹ️', warn:'⚠️' };
const TOAST_COLORS = {
  success:'#16a34a', error:'#c0392b', info:'#1a6b8a', warn:'#d68910'
};

function toast(type='info', title='', msg='', icon='') {
  const c = document.getElementById('toast-container');
  if(!c) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.position = 'relative';
  t.style.overflow = 'hidden';
  t.innerHTML = `
    <div class="toast-icon ${type}" style="background:${TOAST_COLORS[type]}18;">${icon || TOAST_ICONS[type]}</div>
    <div class="toast-body"><div class="toast-title" style="color:${TOAST_COLORS[type]}">${title}</div>${msg?`<div class="toast-msg">${msg}</div>`:''}</div>
    <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
    <div class="toast-bar" style="background:${TOAST_COLORS[type]};"></div>
  `;
  c.appendChild(t);
  setTimeout(() => removeToast(t), 4200);
}

function removeToast(el) {
  if(!el || !el.parentElement) return;
  el.classList.add('removing');
  setTimeout(() => el.remove(), 280);
}

/* ══════════════════════════════════════
   SIGN IN / OUT
   ══════════════════════════════════════ */
function doSignIn() {
  const btn = document.getElementById('signin-btn');
  if(!btn) return;
  btn.textContent = 'Signing in…';
  btn.style.opacity = '.75';
  btn.disabled = true;
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 900);
}

function signOut() {
  window.location.href = 'index.html';
}

/* ══════════════════════════════════════
   GREETING
   ══════════════════════════════════════ */
function setGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('dash-greeting');
  if(el) el.textContent = `${greet}, Sarah 🌿`;
}

/* ══════════════════════════════════════
   ANIMATED COUNTERS
   ══════════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isFloat = !Number.isInteger(target);
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + increment, target);
      el.textContent = prefix + (isFloat ? start.toFixed(1) : Math.floor(start).toLocaleString()) + suffix;
      if(start >= target) clearInterval(timer);
    }, step);
  });
}

/* ══════════════════════════════════════
   NAVIGATION (MPA)
   ══════════════════════════════════════ */
function nav(page) {
    window.location.href = page + '.html';
}

/* ══════════════════════════════════════
   MOBILE SIDEBAR
   ══════════════════════════════════════ */
const isMob = () => window.innerWidth <= 900;
function toggleMob(){
  const sb=document.getElementById('sidebar'),ov=document.getElementById('sb-overlay');
  if(!sb || !ov) return;
  sb.classList.contains('mob-open')?closeMob():(sb.classList.add('mob-open'),ov.classList.add('on'));
}
function closeMob(){
  const sb=document.getElementById('sidebar'),ov=document.getElementById('sb-overlay');
  if(sb) sb.classList.remove('mob-open');
  if(ov) ov.classList.remove('on');
}

/* ══════════════════════════════════════
   DROPDOWNS
   ══════════════════════════════════════ */
function toggleDD(){
  const d=document.getElementById('dd-menu'),c=document.getElementById('prof-chev');
  if(!d || !c) return;
  const o = d.classList.toggle('open');
  c.style.transform=o?'rotate(180deg)':'';
  if(o) closeNotif();
}
function closeDD(){
  const d=document.getElementById('dd-menu'),c=document.getElementById('prof-chev');
  if(d) d.classList.remove('open');
  if(c) c.style.transform='';
}
function toggleNotif(){ 
    const p=document.getElementById('notif-panel');
    if(!p) return;
    const o=p.classList.toggle('open'); 
    if(o) closeDD(); 
}
function closeNotif(){ 
    const p=document.getElementById('notif-panel');
    if(p) p.classList.remove('open'); 
}
function markRead(){
  document.querySelectorAll('.np-dot').forEach(d=>d.remove());
  const pip = document.getElementById('notif-pip');
  if(pip) pip.style.display='none';
  toast('info','All Clear','All notifications marked as read.','✓');
}

document.addEventListener('click',e=>{
  if(!document.getElementById('prof-wrap')?.contains(e.target)) closeDD();
  if(!document.getElementById('notif-wrap')?.contains(e.target)) closeNotif();
});

/* Mobile search */
function toggleMobSearch(){const b=document.getElementById('mob-search-bar'); if(b) { b.classList.toggle('open'); if(b.classList.contains('open'))b.querySelector('input').focus(); }}

/* Responsive */
function fixGrids(){
  const w = window.innerWidth;
  const vg=document.getElementById('view-program-grid');
  if(vg) vg.style.gridTemplateColumns=w<=768?'1fr':'2fr 1fr';
  const sg=document.getElementById('settings-grid');
  if(sg) sg.style.gridTemplateColumns=w<=768?'1fr':'1fr 1fr';
  const ds=document.getElementById('don-stat-grid');
  if(ds) ds.style.gridTemplateColumns=w<=640?'1fr':'repeat(3,1fr)';
  const ps=document.getElementById('prof-stat-row');
  if(ps) ps.style.gridTemplateColumns=w<=640?'1fr':'repeat(3,1fr)';
}
window.addEventListener('resize',()=>{if(!isMob()) closeMob(); fixGrids();});

/* ══════════════════════════════════════
   CHARTS HELPERS
   ══════════════════════════════════════ */
function getChartColors(){
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  return {
    gridColor: dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)',
    tickColor: dark ? '#6aaa7a' : '#6b8f6b',
    green: dark ? '#52b788' : '#2d6a4f',
    green2: dark ? '#74c69d' : '#40916c',
    green3: dark ? '#95d5b2' : '#52b788',
    gold: dark ? '#e6c66a' : '#c9a84c',
    info: dark ? '#3ab4d8' : '#1a6b8a',
    purple: '#7c3aed',
  };
}

function updateChartTheme(){
  const co = getChartColors();
  if(chartInstances.funds){
    chartInstances.funds.data.datasets[0].borderColor = co.green;
    chartInstances.funds.options.scales.x.ticks.color = co.tickColor;
    chartInstances.funds.options.scales.y.ticks.color = co.tickColor;
    chartInstances.funds.options.scales.y.grid.color = co.gridColor;
    chartInstances.funds.update();
  }
  if(chartInstances.donut){
    chartInstances.donut.data.datasets[0].backgroundColor = [co.green,co.green2,co.gold,co.info,co.purple];
    chartInstances.donut.options.plugins.legend.labels.color = co.tickColor;
    chartInstances.donut.update();
  }
  if(chartInstances.report){
    chartInstances.report.data.datasets[0].borderColor = co.green;
    chartInstances.report.data.datasets[1].backgroundColor = co.green3+'88';
    chartInstances.report.data.datasets[1].borderColor = co.green2;
    chartInstances.report.options.plugins.legend.labels.color = co.tickColor;
    chartInstances.report.options.scales.x.ticks.color = co.tickColor;
    chartInstances.report.options.scales.y.ticks.color = co.tickColor;
    chartInstances.report.options.scales.y.grid.color = co.gridColor;
    chartInstances.report.update();
  }
}

/* ══════════════════════════════════════
   CHART INITIALIZATIONS
   ══════════════════════════════════════ */
function initCharts() {
  if (chartsInited) return;
  const fundsEl = document.getElementById('fundsChart');
  const donutEl = document.getElementById('donutChart');
  if (!fundsEl || !donutEl) return;

  chartsInited = true;
  const co = getChartColors();

  // Bar chart
  const fc = fundsEl.getContext('2d');
  chartInstances.funds = new Chart(fc, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Funds Raised (₦M)',
        data: [1.2, 0.9, 1.8, 1.4, 1.6, 2.1, 1.3, 1.7, 2.0, 1.5, 1.9, 1.0],
        backgroundColor: ctx => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          g.addColorStop(0, co.green3); g.addColorStop(1, 'rgba(82,183,136,.1)');
          return g;
        },
        borderColor: co.green, borderWidth: 2, borderRadius: 7, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '₦' + c.parsed.y + 'M' }, backgroundColor: 'rgba(0,0,0,.8)', titleColor: '#fff', bodyColor: '#ccc', cornerRadius: 8 } },
      scales: {
        x: { grid: { display: false }, ticks: { color: co.tickColor, font: { size: 11 } } },
        y: { grid: { color: co.gridColor }, ticks: { color: co.tickColor, font: { size: 11 }, callback: v => '₦' + v + 'M' }, border: { display: false } }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  });

  // Donut chart
  const dc = donutEl.getContext('2d');
  chartInstances.donut = new Chart(dc, {
    type: 'doughnut',
    data: {
      labels: ['Literacy Drive', 'Clean Water', 'Rural Health', 'Women Emp.', 'Youth Skills'],
      datasets: [{ data: [482, 318, 721, 203, 156], backgroundColor: [co.green, co.green2, co.gold, co.info, co.purple], borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { position: 'bottom', labels: { color: co.tickColor, font: { size: 11 }, boxWidth: 10, padding: 10 } } },
      animation: { animateRotate: true, duration: 900, easing: 'easeOutBack' }
    }
  });
}

function initReportChart() {
  const reportEl = document.getElementById('reportChart');
  if (!reportEl) return;
  
  const co = getChartColors();
  const ctx = reportEl.getContext('2d');
  chartInstances.report = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Child Literacy', 'Clean Water', 'Rural Health', 'Women Emp.', 'Youth Skills', 'Food Security', 'Housing', 'Legal Aid'],
      datasets: [
        { label: 'Target Beneficiaries', data: [600, 400, 800, 300, 200, 350, 180, 120], backgroundColor: 'rgba(45,106,79,.14)', borderColor: co.green, borderWidth: 1.5, borderRadius: 5 },
        { label: 'Actual Enrolled', data: [482, 318, 721, 203, 156, 290, 145, 88], backgroundColor: co.green3 + '88', borderColor: co.green2, borderWidth: 1.5, borderRadius: 5 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { color: co.tickColor, font: { size: 11 } } }, tooltip: { backgroundColor: 'rgba(0,0,0,.8)', cornerRadius: 8 } },
      scales: {
        x: { grid: { display: false }, ticks: { color: co.tickColor, font: { size: 10 } } },
        y: { grid: { color: co.gridColor }, ticks: { color: co.tickColor, font: { size: 11 } }, border: { display: false } }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  });
}
