import { store } from '../store/state.js';

export function renderDashboardView() {
  const user = store.currentUser;
  const metrics = store.getMetrics();
  const recentTx = store.getRecentTransactions(4);
  const activities = store.getActivities().slice(0, 3);
  const items = store.getItems();
  
  // Find critical items (stock <= minStock or stock == 0)
  const criticalItems = items.filter(item => item.stock <= item.minStock).slice(0, 3);

  return `
    <!-- Greeting & Quick Actions Header -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h1 class="display-sm" style="color: var(--on-surface);">Selamat datang, ${user.name.split(' ')[0]} 👋</h1>
          <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Berikut ringkasan operasional dan pergerakan inventaris hari ini.</p>
        </div>
        <div style="display: flex; items-center; gap: 0.75rem;">
          <a href="#stok-masuk" class="btn btn-success" style="padding: 0.625rem 1.25rem;">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Catat Stok Masuk</span>
          </a>
          <a href="#stok-keluar" class="btn btn-danger" style="padding: 0.625rem 1.25rem;">
            <span class="material-symbols-outlined text-[18px]">remove_circle</span>
            <span>- Catat Stok Keluar</span>
          </a>
        </div>
      </div>

      <!-- 4 Primary KPI Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
        <!-- Card 1: Total Barang -->
        <div class="card kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL BARANG</span>
            <div class="kpi-icon-wrapper" style="background: var(--primary-fixed); color: var(--primary);">
              <span class="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${metrics.totalItems}</span>
            <span class="kpi-unit">Barang</span>
          </div>
          <div class="kpi-footer" style="color: var(--tertiary-text);">
            <span class="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+12 barang baru bulan ini</span>
          </div>
        </div>

        <!-- Card 2: Total Stok Aktif -->
        <div class="card kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL STOK</span>
            <div class="kpi-icon-wrapper" style="background: var(--secondary-container); color: var(--on-secondary-fixed-variant);">
              <span class="material-symbols-outlined text-[20px]">shelves</span>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${metrics.totalStock.toLocaleString('id-ID')}</span>
            <span class="kpi-unit">Unit</span>
          </div>
          <div class="kpi-footer" style="color: var(--primary-container);">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Status total unit aktif</span>
          </div>
        </div>

        <!-- Card 3: Stok Menipis (Alert Focus) -->
        <div class="card kpi-card" style="border-color: var(--error-border); background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: var(--error-dark);">STOK MENIPIS</span>
            <div class="kpi-icon-wrapper" style="background: var(--error-container); color: var(--error-dark);">
              <span class="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" style="color: var(--error-dark);">${metrics.lowStockCount + metrics.outOfStockCount}</span>
            <span class="kpi-unit" style="color: var(--error-dark);">Barang</span>
          </div>
          <div class="kpi-footer" style="background: var(--error-bg); color: var(--error-dark); justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 0.35rem; font-weight: 700;">
              <span class="live-sync-dot" style="background: var(--error-light); width: 6px; height: 6px;"></span>
              Perlu Perhatian Segera
            </span>
          </div>
        </div>

        <!-- Card 4: Total Supplier -->
        <div class="card kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL SUPPLIER</span>
            <div class="kpi-icon-wrapper" style="background: var(--surface-container-high); color: var(--on-surface);">
              <span class="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${metrics.totalSuppliers}</span>
            <span class="kpi-unit">Supplier</span>
          </div>
          <div class="kpi-footer" style="color: var(--on-surface-variant);">
            <span class="material-symbols-outlined text-[16px]">verified</span>
            <span>Mitra aktif terdaftar</span>
          </div>
        </div>
      </div>

      <!-- Main Workstation 2/3 & 1/3 Split -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; align-items: start;">
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;" class="dashboard-grid">
          
          <!-- LEFT COLUMN (2/3) -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem; grid-column: span 8;">
            
            <!-- Chart: Mutasi Stok Masuk & Keluar -->
            <div class="card" style="padding: 1.5rem;">
              <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                  <h2 class="headline-md" style="color: var(--on-surface);">Grafik Stok Masuk &amp; Keluar</h2>
                  <p style="color: var(--on-surface-variant); font-size: 0.8125rem;">Frekuensi mutasi barang berkala</p>
                </div>
                <!-- Period tabs -->
                <div style="display: flex; background: var(--surface-container); padding: 0.2rem; border-radius: var(--radius-lg); gap: 0.25rem;" id="chartPeriodTabs">
                  <button type="button" class="btn period-btn" data-period="1m" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--on-surface-variant);">Bulan Ini</button>
                  <button type="button" class="btn period-btn active-period" data-period="3m" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; background: #ffffff; color: var(--primary-container); font-weight: 700; box-shadow: var(--shadow-sm);">3 Bulan</button>
                  <button type="button" class="btn period-btn" data-period="1y" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--on-surface-variant);">Tahun Ini</button>
                </div>
              </div>

              <!-- Legend -->
              <div style="display: flex; align-items: center; gap: 1.5rem; font-size: 0.75rem; font-weight: 600; margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.35rem;">
                  <span style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #007d55;"></span>
                  <span>Stok Masuk (Unit)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.35rem;">
                  <span style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background: #ba1a1a;"></span>
                  <span>Stok Keluar (Unit)</span>
                </div>
              </div>

              <!-- Interactive Mutation Bar Chart -->
              <div style="height: 220px; width: 100%; position: relative;" id="mutationChartWrapper">
                <svg viewBox="0 0 600 220" style="width: 100%; height: 100%; overflow: visible;">
                  <!-- Horizontal gridlines -->
                  <line x1="30" y1="180" x2="580" y2="180" stroke="#e2e8f0" stroke-width="1" />
                  <line x1="30" y1="120" x2="580" y2="120" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3" />
                  <line x1="30" y1="60" x2="580" y2="60" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3" />

                  <!-- Y-Axis labels -->
                  <text x="20" y="184" font-size="10" fill="#94a3b8" text-anchor="end" font-family="JetBrains Mono">0</text>
                  <text x="20" y="124" font-size="10" fill="#94a3b8" text-anchor="end" font-family="JetBrains Mono">50</text>
                  <text x="20" y="64" font-size="10" fill="#94a3b8" text-anchor="end" font-family="JetBrains Mono">100</text>

                  <!-- Month 1: Jan -->
                  <rect x="70" y="80" width="18" height="100" rx="3" fill="#007d55" class="chart-bar" data-val="Stok Masuk Jan: 58 unit" />
                  <rect x="92" y="115" width="18" height="65" rx="3" fill="#ba1a1a" class="chart-bar" data-val="Stok Keluar Jan: 34 unit" />
                  <text x="90" y="198" font-size="11" fill="#434655" text-anchor="middle" font-weight="600">Jan</text>

                  <!-- Month 2: Feb -->
                  <rect x="160" y="60" width="18" height="120" rx="3" fill="#007d55" class="chart-bar" data-val="Stok Masuk Feb: 72 unit" />
                  <rect x="182" y="105" width="18" height="75" rx="3" fill="#ba1a1a" class="chart-bar" data-val="Stok Keluar Feb: 42 unit" />
                  <text x="180" y="198" font-size="11" fill="#434655" text-anchor="middle" font-weight="600">Feb</text>

                  <!-- Month 3: Mar -->
                  <rect x="250" y="40" width="18" height="140" rx="3" fill="#007d55" class="chart-bar" data-val="Stok Masuk Mar: 90 unit" />
                  <rect x="272" y="85" width="18" height="95" rx="3" fill="#ba1a1a" class="chart-bar" data-val="Stok Keluar Mar: 55 unit" />
                  <text x="270" y="198" font-size="11" fill="#434655" text-anchor="middle" font-weight="600">Mar</text>

                  <!-- Month 4: Apr -->
                  <rect x="340" y="75" width="18" height="105" rx="3" fill="#007d55" class="chart-bar" data-val="Stok Masuk Apr: 64 unit" />
                  <rect x="362" y="125" width="18" height="55" rx="3" fill="#ba1a1a" class="chart-bar" data-val="Stok Keluar Apr: 30 unit" />
                  <text x="360" y="198" font-size="11" fill="#434655" text-anchor="middle" font-weight="600">Apr</text>

                  <!-- Month 5: Mei -->
                  <rect x="430" y="50" width="18" height="130" rx="3" fill="#007d55" class="chart-bar" data-val="Stok Masuk Mei: 82 unit" />
                  <rect x="452" y="95" width="18" height="85" rx="3" fill="#ba1a1a" class="chart-bar" data-val="Stok Keluar Mei: 48 unit" />
                  <text x="450" y="198" font-size="11" fill="#434655" text-anchor="middle" font-weight="600">Mei</text>

                  <!-- Month 6: Jun -->
                  <rect x="520" y="35" width="18" height="145" rx="3" fill="#007d55" class="chart-bar" data-val="Stok Masuk Jun: 95 unit" />
                  <rect x="542" y="110" width="18" height="70" rx="3" fill="#ba1a1a" class="chart-bar" data-val="Stok Keluar Jun: 38 unit" />
                  <text x="540" y="198" font-size="11" fill="var(--primary-container)" font-weight="700">Jun</text>
                </svg>
              </div>
            </div>

            <!-- Transaksi Terbaru Table Card -->
            <div class="table-wrapper">
              <div style="padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle);">
                <div>
                  <h3 class="headline-md" style="color: var(--on-surface);">Transaksi Terbaru</h3>
                  <p style="color: var(--on-surface-variant); font-size: 0.8125rem;">Aktivitas arus keluar-masuk barang terkini</p>
                </div>
                <a href="#riwayat" class="btn btn-ghost" style="color: var(--primary-container); font-size: 0.8125rem; font-weight: 600;">
                  <span>Lihat Semua Transaksi</span>
                  <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>

              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width: 100px;">Waktu</th>
                      <th>Nama Barang</th>
                      <th style="text-align: center; width: 120px;">Jenis Transaksi</th>
                      <th style="text-align: right; width: 110px;">Jumlah</th>
                      <th>Operator</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentTx.map(tx => `
                      <tr>
                        <td class="font-mono-num" style="color: var(--outline); font-size: 0.8125rem;">${tx.time}</td>
                        <td>
                          <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; color: var(--on-surface);">${tx.itemName}</span>
                            <span style="font-size: 0.6875rem; color: var(--outline); font-family: var(--font-mono);">${tx.refNo}</span>
                          </div>
                        </td>
                        <td style="text-align: center;">
                          ${tx.type === 'MASUK' 
                            ? `<span class="badge badge-safe"><span class="badge-dot"></span> MASUK</span>` 
                            : `<span class="badge badge-danger"><span class="badge-dot"></span> KELUAR</span>`}
                        </td>
                        <td class="font-mono-num" style="text-align: right; font-weight: 700; color: ${tx.type === 'MASUK' ? 'var(--tertiary-text)' : 'var(--error-dark)'};">
                          ${tx.type === 'MASUK' ? '+' : '-'}${tx.qty} <span style="font-weight: 400; font-size: 0.75rem; color: var(--on-surface-variant);">${tx.unit}</span>
                        </td>
                        <td>
                          <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: var(--surface-container); color: var(--primary-container); display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700;">
                              ${tx.operator.slice(0, 2).toUpperCase()}
                            </div>
                            <span style="font-size: 0.8125rem;">${tx.operator}</span>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (1/3) -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem; grid-column: span 4;">
            
            <!-- Aktivitas Langsung Feed -->
            <div class="card" style="padding: 1.25rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="live-sync-dot" style="width: 7px; height: 7px;"></span>
                  <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">AKTIVITAS LANGSUNG</span>
                </div>
                <span style="font-size: 0.6875rem; color: var(--tertiary-text); font-weight: 700; background: var(--tertiary-bg); padding: 0.15rem 0.4rem; border-radius: var(--radius-sm);">LIVE</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${activities.map(act => `
                  <div style="display: flex; gap: 0.75rem; align-items: start; padding: 0.75rem; background: var(--surface-container-low); border-radius: var(--radius-lg);">
                    <div style="width: 1.75rem; height: 1.75rem; border-radius: var(--radius-md); background: #ffffff; color: var(--primary-container); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                      <span class="material-symbols-outlined text-[16px]">${act.icon}</span>
                    </div>
                    <div>
                      <div style="font-size: 0.8125rem; font-weight: 500; color: var(--on-surface); line-height: 1.3;">${act.text}</div>
                      <div style="font-size: 0.6875rem; color: var(--outline); margin-top: 0.25rem;">${act.time}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Distribusi Kategori Widget -->
            <div class="card" style="padding: 1.25rem;">
              <div style="margin-bottom: 1rem;">
                <h3 class="headline-md" style="font-size: 0.9375rem; color: var(--on-surface);">Distribusi Kategori</h3>
                <p style="font-size: 0.75rem; color: var(--on-surface-variant);">Komposisi inventaris berdasarkan jenis</p>
              </div>

              <!-- Donut representation -->
              <div style="display: flex; align-items: center; justify-content: center; padding: 0.75rem 0; position: relative;">
                <svg width="120" height="120" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                  <!-- Background circle -->
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" stroke-width="3.5" />
                  <!-- Segments -->
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-dasharray="35 65" stroke-dashoffset="0" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="3.5" stroke-dasharray="28 72" stroke-dashoffset="-35" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" stroke-width="3.5" stroke-dasharray="15 85" stroke-dashoffset="-63" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#93c5fd" stroke-width="3.5" stroke-dasharray="14 86" stroke-dashoffset="-78" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cbd5e1" stroke-width="3.5" stroke-dasharray="8 92" stroke-dashoffset="-92" />
                </svg>
                <div style="position: absolute; text-align: center;">
                  <span class="font-mono-num" style="font-size: 1.25rem; font-weight: 700; color: var(--on-surface); line-height: 1;">5</span>
                  <span style="font-size: 0.625rem; color: var(--outline); display: block; text-transform: uppercase;">Kategori</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; margin-top: 0.5rem;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #2563eb;"></span> Elektronik</span>
                  <span class="font-mono-num" style="font-weight: 600;">35%</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span> Alat Tulis Kantor (ATK)</span>
                  <span class="font-mono-num" style="font-weight: 600;">28%</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #64748b;"></span> Peralatan Kantor</span>
                  <span class="font-mono-num" style="font-weight: 600;">15%</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #93c5fd;"></span> Sparepart</span>
                  <span class="font-mono-num" style="font-weight: 600;">14%</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1;"></span> Lainnya</span>
                  <span class="font-mono-num" style="font-weight: 600;">8%</span>
                </div>
              </div>
            </div>

            <!-- Peringatan Stok Kritis (PO Trigger) -->
            <div class="card" style="padding: 1.25rem; border-color: var(--error-border); background: #ffffff;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.35rem; color: var(--error-dark); font-weight: 700; font-size: 0.8125rem;">
                  <span class="material-symbols-outlined text-[18px]">emergency</span>
                  <span>Peringatan Stok Kritis</span>
                </div>
                <span class="badge badge-danger">${criticalItems.length} Item</span>
              </div>
              <p style="font-size: 0.6875rem; color: var(--on-surface-variant); margin-bottom: 0.875rem;">Segera terbitkan Purchase Order pengadaan ulang.</p>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${criticalItems.map(ci => `
                  <div style="padding: 0.75rem; background: var(--error-bg); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 0.5rem;">
                    <div style="display: flex; align-items: start; justify-content: space-between;">
                      <div>
                        <div style="font-weight: 700; font-size: 0.8125rem; color: var(--on-surface);">${ci.name}</div>
                        <div style="font-size: 0.6875rem; color: var(--outline);">${ci.category}</div>
                      </div>
                      <span class="badge ${ci.stock === 0 ? 'badge-danger' : 'badge-warning'}">
                        ${ci.stock === 0 ? 'Habis' : 'Stok Menipis'}
                      </span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span class="font-mono-num" style="font-size: 0.75rem; font-weight: 700; color: var(--error-dark);">
                        ${ci.stock} / <span style="font-size: 0.6875rem; color: var(--outline); font-weight: normal;">Min ${ci.minStock} ${ci.unit}</span>
                      </span>
                      <a href="#stok-masuk?itemId=${ci.id}" class="btn btn-primary" style="padding: 0.25rem 0.65rem; font-size: 0.6875rem;">
                        + Restock
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  `;
}

export function attachDashboardEvents() {
  // Period filter buttons for chart
  const periodButtons = document.querySelectorAll('.period-btn');
  periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(b => {
        b.classList.remove('active-period');
        b.style.background = 'transparent';
        b.style.color = 'var(--on-surface-variant)';
        b.style.fontWeight = 'normal';
        b.style.boxShadow = 'none';
      });
      btn.classList.add('active-period');
      btn.style.background = '#ffffff';
      btn.style.color = 'var(--primary-container)';
      btn.style.fontWeight = '700';
      btn.style.boxShadow = 'var(--shadow-sm)';
    });
  });
}
