import { store } from '../store/state.js';
import { showToast } from '../components/toast.js';

export function renderLoginView() {
  return `
    <div class="auth-wrapper">
      <div class="card" style="width: 100%; max-width: 900px; display: flex; flex-direction: column; overflow: hidden; border: none; box-shadow: var(--shadow-xl);">
        <div style="display: flex; flex-direction: row; min-height: 520px; flex-wrap: wrap;">
          
          <!-- Sisi Kiri: Branding Panel Dark Navy Enterprise -->
          <div style="flex: 1; min-width: 300px; background-color: var(--inverse-surface); color: var(--inverse-on-surface); padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
            <!-- Ambient glows -->
            <div style="position: absolute; -top: 4rem; -left: 4rem; width: 14rem; height: 14rem; border-radius: 50%; background: rgba(37,99,235,0.15); filter: blur(32px); pointer-events: none;"></div>
            <div style="position: absolute; bottom: 0; right: 0; width: 12rem; height: 12rem; border-radius: 50%; background: rgba(0,125,85,0.15); filter: blur(28px); pointer-events: none;"></div>

            <div style="position: relative; z-index: 10;">
              <!-- Logo & Title -->
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem;">
                <div style="width: 2.75rem; height: 2.75rem; border-radius: var(--radius-lg); background: var(--primary-container); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                  <span class="material-symbols-outlined text-[24px]">inventory_2</span>
                </div>
                <div>
                  <span style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: #ffffff; letter-spacing: -0.01em; display: block;">StockFlow</span>
                  <span style="font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--secondary-fixed-dim);">Sistem Manajemen Inventaris</span>
                </div>
              </div>

              <!-- Quote -->
              <p style="font-size: 0.9375rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem;">
                “Kelola pergerakan barang, pantau stok real-time, dan optimalkan logistik perusahaan dengan akurat.”
              </p>

              <!-- Features -->
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span style="font-size: 0.8125rem; color: #e2e8f0;">Pemantauan stok real-time multi-gudang</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span style="font-size: 0.8125rem; color: #e2e8f0;">Validasi otomatis stok masuk &amp; keluar</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                    <span class="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span style="font-size: 0.8125rem; color: #e2e8f0;">Notifikasi cerdas stok menipis</span>
                </div>
              </div>
            </div>

            <!-- Node Status -->
            <div style="position: relative; z-index: 10; margin-top: 2rem; padding: 0.625rem 0.875rem; background: rgba(255,255,255,0.06); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; color: #94a3b8;">
                <span class="live-sync-dot"></span>
                <span>WMS Node 004 - Jakarta</span>
              </div>
              <span style="color: var(--tertiary-light); font-weight: 700;">Aktif</span>
            </div>
          </div>

          <!-- Sisi Kanan: Form Autentikasi -->
          <div style="flex: 1.2; min-width: 320px; background: #ffffff; padding: 2.5rem; display: flex; flex-direction: column; justify-content: center;">
            <div style="margin-bottom: 1.5rem;">
              <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--on-surface);">Selamat Datang Kembali</h2>
              <p style="color: var(--on-surface-variant); font-size: 0.875rem; margin-top: 0.25rem;">Masuk untuk mengelola inventaris perusahaan.</p>
            </div>

            <!-- Role Selector Tabs -->
            <div style="display: flex; background: var(--surface-container-low); padding: 0.25rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
              <button 
                type="button" 
                id="tabAdmin" 
                class="btn" 
                style="flex: 1; border-radius: var(--radius-md); font-size: 0.8125rem; font-weight: 600; background: #ffffff; color: var(--primary-container); box-shadow: var(--shadow-sm);"
              >
                Admin Logistik
              </button>
              <button 
                type="button" 
                id="tabStaff" 
                class="btn" 
                style="flex: 1; border-radius: var(--radius-md); font-size: 0.8125rem; font-weight: 600; color: var(--on-surface-variant);"
              >
                Staff Gudang
              </button>
            </div>

            <!-- Alert Error Banner -->
            <div id="loginErrorAlert" style="display: none; padding: 0.75rem 1rem; background: var(--error-bg); border: 1px solid var(--error-border); border-radius: var(--radius-lg); margin-bottom: 1rem; align-items: center; gap: 0.5rem; color: var(--error-dark); font-size: 0.8125rem;">
              <span class="material-symbols-outlined text-[18px]">error</span>
              <span id="loginErrorMessage">Kata sandi salah!</span>
            </div>

            <form id="loginForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <input type="hidden" id="loginRole" value="Admin Logistik" />

              <div class="form-group">
                <label class="form-label" for="loginEmail">Email Perusahaan</label>
                <div class="search-wrapper">
                  <span class="material-symbols-outlined search-icon text-[18px]">mail</span>
                  <input 
                    type="email" 
                    id="loginEmail" 
                    class="input-control" 
                    value="" 
                    placeholder="nama@email.com"
                    autocomplete="username"
                    required 
                  />
                </div>
              </div>

              <div class="form-group">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <label class="form-label" for="loginPassword">Kata Sandi</label>
                  <a href="javascript:void(0)" style="font-size: 0.75rem; color: var(--outline);">Lupa Password?</a>
                </div>
                <div class="search-wrapper">
                  <span class="material-symbols-outlined search-icon text-[18px]">lock</span>
                  <input 
                    type="password" 
                    id="loginPassword" 
                    class="input-control font-mono-num" 
                    value="" 
                    placeholder="Masukkan kata sandi..."
                    autocomplete="current-password"
                    required 
                  />
                  <button type="button" id="togglePasswordBtn" class="clear-btn visible" style="pointer-events: auto;">
                    <span class="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" id="rememberMe" checked style="accent-color: var(--primary-container); cursor: pointer;" />
                  <label for="rememberMe" style="font-size: 0.8125rem; color: var(--on-surface-variant); cursor: pointer;">Ingat saya</label>
                </div>
                <div style="font-size: 0.75rem; color: var(--tertiary-text); font-weight: 600;">
                  🔒 SSL Terproteksi
                </div>
              </div>

              <button type="submit" class="btn btn-primary" id="btnLoginSubmit" style="padding: 0.75rem; font-size: 0.9375rem; margin-top: 0.5rem; gap: 0.75rem;">
                <span>Masuk ke Sistem</span>
                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            <div style="margin-top: 2rem; text-align: center; font-size: 0.6875rem; color: var(--outline);">
              <span class="material-symbols-outlined text-[14px]" style="vertical-align: -2px;">shield</span>
              <span>Sistem terenkripsi 256-bit SSL untuk akses internal perusahaan.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function attachLoginEvents() {
  const tabAdmin = document.getElementById('tabAdmin');
  const tabStaff = document.getElementById('tabStaff');
  const loginRole = document.getElementById('loginRole');
  const loginEmail = document.getElementById('loginEmail');
  const togglePass = document.getElementById('togglePasswordBtn');
  const passInput = document.getElementById('loginPassword');
  const loginForm = document.getElementById('loginForm');
  const errorAlert = document.getElementById('loginErrorAlert');
  const errorMessage = document.getElementById('loginErrorMessage');

  if (tabAdmin && tabStaff) {
    tabAdmin.addEventListener('click', () => {
      loginRole.value = 'Admin Logistik';
      if (errorAlert) errorAlert.style.display = 'none';

      tabAdmin.style.background = '#ffffff';
      tabAdmin.style.color = 'var(--primary-container)';
      tabAdmin.style.boxShadow = 'var(--shadow-sm)';
      tabStaff.style.background = 'transparent';
      tabStaff.style.color = 'var(--on-surface-variant)';
      tabStaff.style.boxShadow = 'none';
    });

    tabStaff.addEventListener('click', () => {
      loginRole.value = 'Staff Gudang';
      if (errorAlert) errorAlert.style.display = 'none';

      tabStaff.style.background = '#ffffff';
      tabStaff.style.color = 'var(--primary-container)';
      tabStaff.style.boxShadow = 'var(--shadow-sm)';
      tabAdmin.style.background = 'transparent';
      tabAdmin.style.color = 'var(--on-surface-variant)';
      tabAdmin.style.boxShadow = 'none';
    });
  }

  if (togglePass && passInput) {
    togglePass.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      const icon = togglePass.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isPass ? 'visibility_off' : 'visibility';
    });
  }

  if (loginEmail) {
    loginEmail.addEventListener('input', () => {
      if (errorAlert) errorAlert.style.display = 'none';
      loginEmail.classList.remove('input-error');
    });
  }

  if (passInput) {
    passInput.addEventListener('input', () => {
      if (errorAlert) errorAlert.style.display = 'none';
      passInput.classList.remove('input-error');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail ? loginEmail.value.trim() : '';
      const password = passInput ? passInput.value : '';
      const role = loginRole ? loginRole.value : 'Admin Logistik';

      try {
        store.login(email, password, role);
        if (errorAlert) errorAlert.style.display = 'none';
        showToast(`Selamat datang, ${store.currentUser.name}!`, 'success');
        window.location.hash = '#dashboard';
      } catch (err) {
        if (errorAlert && errorMessage) {
          errorMessage.textContent = err.message;
          errorAlert.style.display = 'flex';
        }
        showToast(err.message, 'error');

        // Trigger shake animation for clear feedback
        loginForm.classList.add('shake-anim');
        setTimeout(() => loginForm.classList.remove('shake-anim'), 450);

        // Highlight relevant input
        if (err.message.toLowerCase().includes('email')) {
          if (loginEmail) {
            loginEmail.classList.add('input-error');
            loginEmail.focus();
          }
        } else if (err.message.toLowerCase().includes('sandi') || err.message.toLowerCase().includes('password')) {
          if (passInput) {
            passInput.classList.add('input-error');
            passInput.focus();
          }
        }
      }
    });
  }
}
