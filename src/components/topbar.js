import { store } from '../store/state.js';
import { showToast } from './toast.js';

export function renderTopbar(currentRoute) {
  const user = store.currentUser;
  const metrics = store.getMetrics();
  const alertCount = metrics.lowStockCount + metrics.outOfStockCount;

  // Generate breadcrumb
  let breadcrumbTitle = 'Dashboard Utama';
  if (currentRoute === 'data-barang') breadcrumbTitle = 'Data Barang';
  if (currentRoute === 'stok-masuk') breadcrumbTitle = 'Pencatatan Stok Masuk';
  if (currentRoute === 'stok-keluar') breadcrumbTitle = 'Pencatatan Stok Keluar';
  if (currentRoute === 'stok-menipis') breadcrumbTitle = 'Monitoring Stok Menipis';
  if (currentRoute === 'riwayat') breadcrumbTitle = 'Riwayat Transaksi';
  if (currentRoute === 'kategori') breadcrumbTitle = 'Master Kategori';
  if (currentRoute === 'supplier') breadcrumbTitle = 'Master Supplier';
  if (currentRoute === 'manajemen-user') breadcrumbTitle = 'Manajemen Pengguna';
  if (currentRoute === 'laporan') breadcrumbTitle = 'Laporan Inventaris';
  if (currentRoute === 'pengaturan') breadcrumbTitle = 'Pengaturan Sistem';

  return `
    <header class="app-topbar">
      <!-- Left side: Mobile Toggle & Breadcrumbs & Global Search -->
      <div class="topbar-left">
        <!-- Mobile menu toggle -->
        <button class="btn-icon" id="mobileMenuToggle" style="display: none;" title="Menu Navigasi">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--on-surface-variant); font-size: 0.8125rem; font-weight: 500;">
          <span class="material-symbols-outlined text-[18px]">home</span>
          <span>/</span>
          <span style="color: var(--on-surface); font-weight: 600;">${breadcrumbTitle}</span>
        </div>

        <!-- Global Search Input -->
        <div class="search-wrapper" style="max-width: 320px; display: flex;">
          <span class="material-symbols-outlined search-icon text-[18px]">search</span>
          <input 
            type="text" 
            id="globalSearchInput" 
            class="input-control" 
            placeholder="Cari data barang, SKU, transaksi..." 
            style="background: var(--surface-container-low); border-radius: var(--radius-full); font-size: 0.8125rem; height: 2.25rem;"
          />
        </div>
      </div>

      <!-- Right side: Sync status, Role pills, Notifications, User profile -->
      <div class="topbar-right">
        <!-- Live Sync Pill -->
        <div class="live-sync-pill" title="Terhubung secara real-time dengan barcode scanner & database gudang">
          <span class="live-sync-dot"></span>
          <span>Data Tersinkronisasi</span>
        </div>

        <!-- Role Switcher Toggle -->
        <div style="display: flex; background: var(--surface-container); border-radius: var(--radius-full); padding: 0.15rem; gap: 0.15rem;">
          <button 
            type="button" 
            class="role-switch-btn ${user.role.includes('Admin') ? 'active-role' : ''}" 
            data-role="Admin Logistik"
            style="padding: 0.25rem 0.65rem; border-radius: var(--radius-full); font-size: 0.6875rem; font-weight: 600; ${user.role.includes('Admin') ? 'background: #ffffff; color: var(--primary-container); box-shadow: 0 1px 2px rgba(0,0,0,0.1);' : 'color: var(--on-surface-variant);'}"
          >
            Admin
          </button>
          <button 
            type="button" 
            class="role-switch-btn ${user.role.includes('Staff') ? 'active-role' : ''}" 
            data-role="Staff Gudang"
            style="padding: 0.25rem 0.65rem; border-radius: var(--radius-full); font-size: 0.6875rem; font-weight: 600; ${user.role.includes('Staff') ? 'background: #ffffff; color: var(--primary-container); box-shadow: 0 1px 2px rgba(0,0,0,0.1);' : 'color: var(--on-surface-variant);'}"
          >
            Staff
          </button>
        </div>

        <!-- Notifications Bell -->
        <div style="position: relative;">
          <button class="btn-icon" id="topbarNotifBtn" title="Notifikasi Stok & Logistik" style="position: relative;">
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            ${alertCount > 0 ? `
              <span style="position: absolute; top: 0.25rem; right: 0.25rem; width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--error-light); border: 2px solid #ffffff;"></span>
            ` : ''}
          </button>
          <!-- Notification Dropdown -->
          <div id="notifDropdown" class="card" style="position: absolute; right: 0; top: 120%; width: 320px; z-index: 50; display: none; padding: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.8125rem;">Notifikasi Sistem (${alertCount})</span>
              <span class="badge badge-danger">${metrics.outOfStockCount} Habis</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 240px; overflow-y: auto;">
              ${metrics.outOfStockCount > 0 ? `
                <div style="padding: 0.5rem; border-radius: var(--radius-md); background: var(--error-bg); display: flex; gap: 0.5rem; align-items: start;">
                  <span class="material-symbols-outlined text-[18px]" style="color: var(--error-dark);">error</span>
                  <div>
                    <div style="font-weight: 600; font-size: 0.75rem; color: var(--error-dark);">Stok Habis Darurat</div>
                    <div style="font-size: 0.6875rem; color: var(--on-surface);">${metrics.outOfStockCount} SKU persediaan telah kosong. Segera buat PO pengadaan.</div>
                  </div>
                </div>
              ` : ''}
              ${metrics.lowStockCount > 0 ? `
                <div style="padding: 0.5rem; border-radius: var(--radius-md); background: var(--warning-bg); display: flex; gap: 0.5rem; align-items: start;">
                  <span class="material-symbols-outlined text-[18px]" style="color: var(--warning-dark);">warning</span>
                  <div>
                    <div style="font-weight: 600; font-size: 0.75rem; color: var(--warning-dark);">Peringatan Stok Menipis</div>
                    <div style="font-size: 0.6875rem; color: var(--on-surface);">${metrics.lowStockCount} barang mendekati batas stok minimum di rak.</div>
                  </div>
                </div>
              ` : ''}
              <div style="padding: 0.5rem; border-radius: var(--radius-md); background: var(--surface-container-low); display: flex; gap: 0.5rem; align-items: start;">
                <span class="material-symbols-outlined text-[18px]" style="color: var(--primary-container);">sync</span>
                <div>
                  <div style="font-weight: 600; font-size: 0.75rem;">Sinkronisasi Otomatis Sukses</div>
                  <div style="font-size: 0.6875rem; color: var(--on-surface-variant);">Basis data gudang tersinkron dengan cloud server.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div style="position: relative;">
          <button id="userProfileBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.35rem 0.65rem; border-radius: var(--radius-lg); background: var(--surface-container-low); transition: background var(--transition-fast);">
            <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--primary-container); color: #ffffff; font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; justify-content: center;">
              ${user.avatar || 'AF'}
            </div>
            <div style="display: flex; flex-direction: column; text-align: left;">
              <span style="font-weight: 600; font-size: 0.8125rem; color: var(--on-surface); line-height: 1.2;">${user.name}</span>
              <span style="font-size: 0.6875rem; color: var(--on-surface-variant);">${user.role}</span>
            </div>
            <span class="material-symbols-outlined text-[16px] text-outline">expand_more</span>
          </button>
          <!-- User Dropdown Menu -->
          <div id="userDropdown" class="card" style="position: absolute; right: 0; top: 120%; width: 200px; z-index: 50; display: none; padding: 0.5rem;">
            <div style="padding: 0.5rem; border-bottom: 1px solid var(--border-subtle); margin-bottom: 0.25rem;">
              <div style="font-weight: 600; font-size: 0.75rem;">${user.email}</div>
              <div style="font-size: 0.6875rem; color: var(--on-surface-variant);">${user.node}</div>
            </div>
            <a href="#pengaturan" class="nav-item" style="padding: 0.4rem 0.6rem; color: var(--on-surface); border-radius: var(--radius-md);">
              <span class="material-symbols-outlined text-[18px]">manage_accounts</span>
              <span>Profil Pengguna</span>
            </a>
            <button id="btnLogout" style="width: 100%; display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.6rem; color: var(--error-dark); border-radius: var(--radius-md); font-weight: 600; font-size: 0.8125rem; text-align: left; margin-top: 0.25rem;">
              <span class="material-symbols-outlined text-[18px]">logout</span>
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function attachTopbarEvents() {
  // Notification toggle
  const notifBtn = document.getElementById('topbarNotifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.style.display = notifDropdown.style.display === 'block' ? 'none' : 'block';
    });
  }

  // Profile dropdown toggle
  const profileBtn = document.getElementById('userProfileBtn');
  const userDropdown = document.getElementById('userDropdown');
  if (profileBtn && userDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    if (notifDropdown) notifDropdown.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'none';
  });

  // Role switcher buttons
  document.querySelectorAll('.role-switch-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newRole = btn.getAttribute('data-role');
      store.switchRole(newRole);
      showToast(`Beralih ke peran: ${newRole}`, 'info');
      // Re-render
      window.dispatchEvent(new CustomEvent('rerender-app'));
    });
  });

  // Logout button
  const logoutBtn = document.getElementById('btnLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      showToast('Sesi telah diakhiri. Silakan masuk kembali.', 'info');
      window.location.hash = '#login';
    });
  }

  // Global search
  const globalSearch = document.getElementById('globalSearchInput');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = globalSearch.value.trim();
        window.location.hash = `#data-barang?q=${encodeURIComponent(query)}`;
      }
    });
  }
}
