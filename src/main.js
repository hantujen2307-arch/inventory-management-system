import { store } from './store/state.js';
import { renderSidebar, attachSidebarEvents } from './components/sidebar.js';
import { renderTopbar, attachTopbarEvents } from './components/topbar.js';
import { renderLoginView, attachLoginEvents } from './views/loginView.js';
import { renderDashboardView, attachDashboardEvents } from './views/dashboardView.js';
import { renderDataBarangView, attachDataBarangEvents } from './views/dataBarangView.js';
import { renderStokMasukView, attachStokMasukEvents } from './views/stokMasukView.js';
import { renderStokKeluarView, attachStokKeluarEvents } from './views/stokKeluarView.js';
import { 
  renderRiwayatView, 
  renderStokMenipisView, 
  renderKategoriView, 
  renderSupplierView, 
  renderUserManagementView, 
  renderSettingsView 
} from './views/otherViews.js';

function parseHash() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  const [routePath, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString || '');
  return {
    route: routePath || 'dashboard',
    params
  };
}

function router() {
  const app = document.getElementById('app');
  if (!app) return;

  const { route, params } = parseHash();
  const user = store.currentUser;

  // Check auth
  if (!user.isLoggedIn) {
    app.className = 'app-shell auth-only';
    app.innerHTML = renderLoginView();
    attachLoginEvents();
    return;
  }

  if (route === 'login') {
    app.className = 'app-shell auth-only';
    app.innerHTML = renderLoginView();
    attachLoginEvents();
    return;
  }

  // Normal App Shell
  app.className = 'app-shell';

  let viewHtml = '';
  if (route === 'dashboard') {
    viewHtml = renderDashboardView();
  } else if (route === 'data-barang') {
    const q = params.get('q') || '';
    viewHtml = renderDataBarangView(q);
  } else if (route === 'stok-masuk') {
    const itemId = params.get('itemId');
    viewHtml = renderStokMasukView(itemId);
  } else if (route === 'stok-keluar') {
    const itemId = params.get('itemId');
    viewHtml = renderStokKeluarView(itemId);
  } else if (route === 'riwayat') {
    viewHtml = renderRiwayatView();
  } else if (route === 'stok-menipis') {
    viewHtml = renderStokMenipisView();
  } else if (route === 'kategori') {
    viewHtml = renderKategoriView();
  } else if (route === 'supplier') {
    viewHtml = renderSupplierView();
  } else if (route === 'manajemen-user') {
    viewHtml = renderUserManagementView();
  } else if (route === 'laporan') {
    viewHtml = renderRiwayatView(); // Laporan displays transaction & movement audits
  } else if (route === 'pengaturan') {
    viewHtml = renderSettingsView();
  } else {
    viewHtml = renderDashboardView();
  }

  app.innerHTML = `
    ${renderSidebar(route)}
    <div class="app-main">
      ${renderTopbar(route)}
      <main class="canvas-content" id="canvasContent">
        ${viewHtml}
      </main>
    </div>
  `;

  // Attach interactive events
  attachSidebarEvents();
  attachTopbarEvents();

  if (route === 'dashboard') attachDashboardEvents();
  if (route === 'data-barang') attachDataBarangEvents();
  if (route === 'stok-masuk') attachStokMasukEvents();
  if (route === 'stok-keluar') attachStokKeluarEvents();

  // Scroll to top
  window.scrollTo(0, 0);
}

// Listen to hash changes & custom app rerender events
window.addEventListener('hashchange', router);
window.addEventListener('rerender-app', router);

// Store subscription: re-render if data changes and user is logged in
store.subscribe(() => {
  const { route } = parseHash();
  if (route !== 'login') {
    router();
  }
});

// Initial boot
function initApp() {
  if (!window.location.hash) {
    window.location.hash = '#dashboard';
  }
  router();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
