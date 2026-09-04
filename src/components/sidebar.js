import { store } from '../store/state.js';

export function renderSidebar(currentRoute) {
  const metrics = store.getMetrics();
  const lowStockCount = metrics.lowStockCount + metrics.outOfStockCount;

  const navItems = [
    {
      group: "NAVIGASI UTAMA",
      items: [
        { route: "dashboard", label: "Dashboard", icon: "dashboard" }
      ]
    },
    {
      group: "MASTER DATA",
      items: [
        { route: "data-barang", label: "Data Barang", icon: "inventory_2" },
        { route: "kategori", label: "Kategori", icon: "folder_open" },
        { route: "supplier", label: "Supplier", icon: "local_shipping" }
      ]
    },
    {
      group: "TRANSAKSI",
      items: [
        { route: "stok-masuk", label: "Stok Masuk", icon: "input" },
        { route: "stok-keluar", label: "Stok Keluar", icon: "outbox" },
        { route: "riwayat", label: "Riwayat Transaksi", icon: "history" }
      ]
    },
    {
      group: "MONITORING",
      items: [
        { 
          route: "stok-menipis", 
          label: "Stok Menipis", 
          icon: "warning", 
          badge: lowStockCount > 0 ? lowStockCount : null 
        }
      ]
    },
    {
      group: "MANAJEMEN (ADMIN)",
      items: [
        { route: "manajemen-user", label: "Manajemen User", icon: "group" }
      ]
    },
    {
      group: "LAPORAN",
      items: [
        { route: "laporan", label: "Laporan Inventaris", icon: "assessment" }
      ]
    }
  ];

  return `
    <aside class="app-sidebar" id="appSidebar">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="sidebar-logo-icon">
          <span class="material-symbols-outlined text-[22px]">inventory_2</span>
        </div>
        <div class="sidebar-brand-title">
          <span class="sidebar-brand-name">StockFlow</span>
          <span class="sidebar-brand-subtitle">Sistem Manajemen Inventaris</span>
        </div>
        <button class="btn-icon" id="sidebarCollapseBtn" title="Ciutkan Sidebar" style="margin-left: auto; color: #94a3b8;">
          <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
      </div>

      <!-- Navigation Tree -->
      <nav class="sidebar-nav">
        ${navItems.map(group => `
          <div class="nav-group">
            <div class="nav-group-title">${group.group}</div>
            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
              ${group.items.map(item => {
                const isActive = currentRoute === item.route;
                return `
                  <a href="#${item.route}" class="nav-item ${isActive ? 'active' : ''}" data-route="${item.route}">
                    <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                    <span class="nav-label">${item.label}</span>
                    ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </nav>

      <!-- Sidebar Bottom Footer -->
      <div class="sidebar-footer">
        <a href="#pengaturan" class="nav-item ${currentRoute === 'pengaturan' ? 'active' : ''}" data-route="pengaturan">
          <span class="material-symbols-outlined text-[20px]">settings</span>
          <span class="nav-label">Pengaturan</span>
        </a>
        <div style="margin-top: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); display: flex; items-center; justify-content: space-between; font-size: 0.6875rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; color: #94a3b8;">
            <span class="live-sync-dot" style="width: 6px; height: 6px;"></span>
            <span>WMS Node 004</span>
          </div>
          <span style="color: var(--tertiary-light); font-weight: 600;">Aktif</span>
        </div>
      </div>
    </aside>
  `;
}

export function attachSidebarEvents() {
  const collapseBtn = document.getElementById('sidebarCollapseBtn');
  const sidebar = document.getElementById('appSidebar');
  
  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = collapseBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = sidebar.classList.contains('collapsed') ? 'chevron_right' : 'chevron_left';
      }
    });
  }
}
