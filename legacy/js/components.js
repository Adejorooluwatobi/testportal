const SIDEBAR_HTML = `
    <div class="sb-brand">
      <div class="sb-logo">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.5c1.24 0 2.25 1.01 2.25 2.25S13.24 10 12 10 9.75 8.99 9.75 7.75 10.76 5.5 12 5.5zM12 18c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08C16.71 16.72 14.5 18 12 18z"/></svg>
      </div>
      <div>
        <div class="sb-org">AWEDI</div>
        <div class="sb-org-sub">Admin Portal</div>
      </div>
    </div>
    <div class="sb-scroll">
      <div class="sb-section">
        <div class="sb-sec-label">Overview</div>
        <div class="nav-item" onclick="nav('dashboard')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>Dashboard</div>
        <div class="nav-item" onclick="nav('reports')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>Reports & Analytics</div>
      </div>
      <div class="sb-section">
        <div class="sb-sec-label">Programs</div>
        <div class="nav-item" onclick="nav('programs')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Programs List<span class="nav-badge">8</span></div>
        <div class="nav-item" onclick="nav('create-program')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>Create Program</div>
        <div class="nav-item" onclick="nav('view-program')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View Program</div>
      </div>
      <div class="sb-section">
        <div class="sb-sec-label">Beneficiaries</div>
        <div class="nav-item" onclick="nav('beneficiaries')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Beneficiaries<span class="nav-badge">124</span></div>
        <div class="nav-item" onclick="nav('donations')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Donations</div>
        <div class="nav-item" onclick="nav('volunteers')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>Volunteers</div>
      </div>
      <div class="sb-section">
        <div class="sb-sec-label">Administration</div>
        <div class="nav-item" onclick="nav('profile')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Profile</div>
        <div class="nav-item" onclick="nav('admin-signup')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>Add Admin</div>
        <div class="nav-item" onclick="nav('settings')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Settings</div>
        <div class="nav-item" onclick="signOut()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign Out</div>
      </div>
    </div>
    <div class="sb-footer">
      <div class="sb-user-row">
        <div class="sb-av">SA</div>
        <div><div class="sb-user-name">Sarah Adeyemi</div><div class="sb-user-role">Program Director</div></div>
        <div class="online-pip"></div>
      </div>
    </div>
`;

const HEADER_HTML = `
      <div class="hdr-left">
        <button class="hamburger" onclick="toggleMob()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <span class="page-title" id="page-title">Dashboard</span>
      </div>
      <div class="hdr-search-wrap">
        <svg class="s-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="hdr-search" type="text" placeholder="Search programs, beneficiaries, reports…"/>
      </div>
      <div class="hdr-right">
        <button class="mob-srch-btn" onclick="toggleMobSearch()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
        <button class="theme-btn" onclick="toggleTheme()" title="Toggle dark mode">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <div style="position:relative;" id="notif-wrap">
          <div class="hdr-icon-btn" onclick="toggleNotif()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div class="notif-pip" id="notif-pip"></div>
          </div>
          <div class="notif-panel" id="notif-panel">
            <div class="np-hdr"><span class="np-hdr-title">Notifications</span><span class="np-mark" onclick="markRead()">Mark all read</span></div>
            <div class="np-item"><div class="np-dot-wrap"><div class="np-dot"></div></div><div><div class="np-text">New donation of <strong>&#8358;250,000</strong> received from Lagos State fund.</div><div class="np-time">10 min ago</div></div></div>
            <div class="np-item"><div class="np-dot-wrap"><div class="np-dot"></div></div><div><div class="np-text">Program <strong>"Child Literacy Drive"</strong> milestone reached — 80% complete.</div><div class="np-time">2 hours ago</div></div></div>
            <div class="np-item"><div class="np-dot-wrap"><div class="np-dot"></div></div><div><div class="np-text"><strong>3 new volunteers</strong> submitted registration forms.</div><div class="np-time">Yesterday</div></div></div>
            <div class="np-item"><div class="np-dot-wrap"></div><div><div class="np-text">Monthly impact report for <strong>March 2025</strong> is due for submission.</div><div class="np-time">2 days ago</div></div></div>
            <div style="padding:10px 15px;text-align:center;border-top:1px solid var(--border);"><span style="font-size:12px;color:var(--accent);cursor:pointer;font-weight:600;">View all notifications &#8594;</span></div>
          </div>
        </div>
        <div style="position:relative;" id="prof-wrap">
          <div class="prof-btn" onclick="toggleDD()">
            <div class="prof-av">SA</div>
            <span class="prof-name">Sarah Adeyemi</span>
            <svg class="prof-chev" id="prof-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="dd-menu" id="dd-menu">
            <div class="dd-hdr"><div class="dd-name">Sarah Adeyemi</div><div class="dd-role">Program Director</div></div>
            <div class="dd-item" onclick="nav('profile');closeDD()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Profile</div>
            <div class="dd-item" onclick="nav('settings');closeDD()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Settings</div>
            <div class="dd-divider"></div>
            <div class="dd-item danger" onclick="signOut()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign Out</div>
          </div>
        </div>
      </div>
      <div class="mob-search-bar" id="mob-search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;color:var(--muted);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search programs, beneficiaries…"/>
        <button class="mob-close" onclick="toggleMobSearch()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
`;

const PAGE_TITLES = {
  'dashboard': 'Dashboard',
  'programs': 'Programs',
  'create-program': 'Create Program',
  'view-program': 'View Program',
  'beneficiaries': 'Beneficiaries',
  'donations': 'Donations',
  'volunteers': 'Volunteers',
  'reports': 'Reports & Analytics',
  'profile': 'My Profile',
  'admin-signup': 'Add Admin',
  'settings': 'Settings'
};

function loadComponents() {
  const sidebar = document.getElementById('sidebar');
  const header = document.getElementById('header');

  if (sidebar) {
    sidebar.innerHTML = SIDEBAR_HTML;
    setActiveNavItem();
  }

  if (header) {
    header.innerHTML = HEADER_HTML;
    const filename = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = PAGE_TITLES[filename] || 'Dashboard';
  }

  document.dispatchEvent(new CustomEvent('componentsLoaded'));
}

function setActiveNavItem() {
  const filename = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    const oc = item.getAttribute('onclick') || '';
    if (oc.includes(`'${filename}'`)) item.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', loadComponents);
