import { store } from '../store/state.js';

export function renderRiwayatView() {
  const transactions = store.getTransactions();

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h1 class="display-sm" style="color: var(--on-surface);">Riwayat Transaksi Mutasi</h1>
          <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Audit log seluruh arus masuk dan keluar barang gudang.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <a href="#stok-masuk" class="btn btn-success">+ Penerimaan Baru</a>
          <a href="#stok-keluar" class="btn btn-danger">- Pengeluaran Baru</a>
        </div>
      </div>

      <div class="table-wrapper">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 140px;">No. Referensi</th>
                <th style="width: 110px;">Waktu &amp; Tanggal</th>
                <th style="width: 110px; text-align: center;">Tipe Mutasi</th>
                <th>Nama Barang</th>
                <th style="text-align: right; width: 110px;">Jumlah</th>
                <th>Operator</th>
                <th>Keterangan / Tujuan</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(tx => `
                <tr>
                  <td class="font-mono-num" style="font-weight: 600; color: var(--primary-container); font-size: 0.8125rem;">
                    ${tx.refNo}
                  </td>
                  <td>
                    <div style="font-size: 0.8125rem; font-weight: 500;">${tx.time}</div>
                    <div style="font-size: 0.6875rem; color: var(--outline);">${tx.date}</div>
                  </td>
                  <td style="text-align: center;">
                    ${tx.type === 'MASUK' 
                      ? `<span class="badge badge-safe"><span class="badge-dot"></span> MASUK</span>` 
                      : `<span class="badge badge-danger"><span class="badge-dot"></span> KELUAR</span>`}
                  </td>
                  <td>
                    <div style="font-weight: 600; color: var(--on-surface); font-size: 0.875rem;">${tx.itemName}</div>
                    <div style="font-size: 0.6875rem; color: var(--outline);">${tx.suratJalan ? 'Surat Jalan: ' + tx.suratJalan : (tx.department || '-')}</div>
                  </td>
                  <td class="font-mono-num" style="text-align: right; font-weight: 700; font-size: 0.9375rem; color: ${tx.type === 'MASUK' ? 'var(--tertiary-text)' : 'var(--error-dark)'};">
                    ${tx.type === 'MASUK' ? '+' : '-'}${tx.qty} <span style="font-size: 0.75rem; font-weight: normal; color: var(--on-surface-variant);">${tx.unit}</span>
                  </td>
                  <td>
                    <div style="font-size: 0.8125rem; font-weight: 500;">${tx.operator}</div>
                  </td>
                  <td style="color: var(--on-surface-variant); font-size: 0.8125rem; max-width: 200px;">
                    ${tx.notes || '-'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function renderStokMenipisView() {
  const items = store.getItems().filter(i => i.stock <= i.minStock);

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="badge badge-danger">MONITORING KRITIS</span>
            <span style="font-size: 0.75rem; color: var(--outline);">Safety Stock Alert</span>
          </div>
          <h1 class="display-sm" style="color: var(--on-surface);">Peringatan Stok Menipis &amp; Habis</h1>
          <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Daftar SKU yang membutuhkan pengadaan ulang segera demi menjaga kelancaran operasional.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem;">
        ${items.map(item => `
          <div class="card" style="padding: 1.25rem; border-color: ${item.stock === 0 ? 'var(--error-border)' : 'var(--warning-border)'}; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-md); background: ${item.stock === 0 ? 'var(--error-container)' : 'var(--warning-bg)'}; color: ${item.stock === 0 ? 'var(--error-dark)' : 'var(--warning-dark)'}; display: flex; align-items: center; justify-content: center;">
                    <span class="material-symbols-outlined text-[20px]">${item.icon || 'warning'}</span>
                  </div>
                  <div>
                    <h3 style="font-weight: 700; font-size: 0.9375rem; color: var(--on-surface);">${item.name}</h3>
                    <span class="font-mono-num" style="font-size: 0.75rem; color: var(--outline);">${item.sku}</span>
                  </div>
                </div>
                <span class="badge ${item.stock === 0 ? 'badge-danger' : 'badge-warning'}">
                  ${item.stock === 0 ? 'Habis (0)' : 'Menipis'}
                </span>
              </div>
              <p style="font-size: 0.75rem; color: var(--on-surface-variant); margin-top: 0.5rem;">${item.variant}</p>
              <div style="font-size: 0.75rem; color: var(--outline); margin-top: 0.25rem;">Pemasok: <strong>${item.supplier}</strong></div>
              <div style="font-size: 0.75rem; color: var(--outline);">Lokasi: ${item.location}</div>
            </div>

            <div style="padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 0.6875rem; color: var(--outline); text-transform: uppercase;">Sisa Stok Fisik</span>
                <div class="font-mono-num" style="font-weight: 700; font-size: 1.125rem; color: ${item.stock === 0 ? 'var(--error-dark)' : 'var(--warning-dark)'};">
                  ${item.stock} / <span style="font-size: 0.75rem; color: var(--outline); font-weight: normal;">Min ${item.minStock} ${item.unit}</span>
                </div>
              </div>
              <a href="#stok-masuk?itemId=${item.id}" class="btn btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.75rem;">
                <span class="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>Buat Pengadaan</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderKategoriView() {
  const categories = store.categories;
  const items = store.getItems();

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <h1 class="display-sm" style="color: var(--on-surface);">Master Kategori</h1>
      <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Klasifikasi grup inventaris logistik perusahaan.</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        ${categories.map(cat => {
          const count = items.filter(i => i.category === cat).length;
          const totalStock = items.filter(i => i.category === cat).reduce((acc, i) => acc + i.stock, 0);
          return `
            <div class="card" style="padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="material-symbols-outlined text-[24px] text-primary">folder</span>
                  <h3 style="font-weight: 700; font-size: 1rem;">${cat}</h3>
                </div>
                <span class="badge badge-neutral">${count} SKU</span>
              </div>
              <div style="padding: 0.75rem; background: var(--surface-container-low); border-radius: var(--radius-md); display: flex; justify-content: space-between; font-size: 0.8125rem;">
                <span style="color: var(--on-surface-variant);">Total Kuantitas Fisik:</span>
                <span class="font-mono-num" style="font-weight: 700; color: var(--primary-container);">${totalStock} Unit</span>
              </div>
              <a href="#data-barang" class="btn btn-secondary" style="font-size: 0.75rem; text-align: center;">
                Lihat Semua Barang Kategori Ini
              </a>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function renderSupplierView() {
  const suppliers = store.suppliers;
  const items = store.getItems();

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <h1 class="display-sm" style="color: var(--on-surface);">Master Mitra Supplier</h1>
      <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Daftar rekanan pemasok resmi yang terhubung dengan StockFlow WMS.</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
        ${suppliers.map((sup, idx) => {
          const supItems = items.filter(i => i.supplier === sup);
          return `
            <div class="card" style="padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
              <div style="display: flex; align-items: start; justify-content: space-between;">
                <div>
                  <div class="font-mono-num" style="font-size: 0.6875rem; color: var(--outline); font-weight: 600;">SUP-00${idx + 1}</div>
                  <h3 style="font-weight: 700; font-size: 1rem; color: var(--on-surface); margin-top: 0.15rem;">${sup}</h3>
                </div>
                <span class="badge badge-safe">Mitra Aktif</span>
              </div>
              <div style="font-size: 0.75rem; color: var(--on-surface-variant);">
                Menyuplai <strong>${supItems.length} SKU</strong> aktif di gudang pusat.
              </div>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                <a href="#stok-masuk" class="btn btn-secondary" style="flex: 1; font-size: 0.75rem;">
                  Buat PO
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function renderUserManagementView() {
  const users = [
    { name: "Ahmad Fauzi", email: "ahmad.fauzi@stockflow.id", role: "Super Admin / Admin Logistik", status: "Aktif", lastActive: "Baru saja", avatar: "AF" },
    { name: "Budi Santoso", email: "budi.santoso@stockflow.id", role: "Staff Gudang", status: "Aktif", lastActive: "15 menit lalu", avatar: "BS" },
    { name: "Dewi Lestari", email: "dewi.lestari@stockflow.id", role: "Manager Logistik", status: "Aktif", lastActive: "2 jam lalu", avatar: "DL" },
    { name: "Rian Pratama", email: "rian.pratama@stockflow.id", role: "Operator Barcode QC", status: "Aktif", lastActive: "Kemarin", avatar: "RP" }
  ];

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <h1 class="display-sm" style="color: var(--on-surface);">Manajemen Pengguna</h1>
      <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Kelola hak akses dan peran operator WMS StockFlow.</p>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>Peran &amp; Hak Akses</th>
              <th>Status Akun</th>
              <th>Aktivitas Terakhir</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--primary-container); color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8125rem;">
                      ${u.avatar}
                    </div>
                    <div>
                      <div style="font-weight: 600; color: var(--on-surface); font-size: 0.875rem;">${u.name}</div>
                      <div style="font-size: 0.75rem; color: var(--outline);">${u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style="font-weight: 600; font-size: 0.8125rem;">${u.role}</span>
                </td>
                <td>
                  <span class="badge badge-safe"><span class="badge-dot"></span> ${u.status}</span>
                </td>
                <td style="color: var(--on-surface-variant); font-size: 0.8125rem;">
                  ${u.lastActive}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderSettingsView() {
  const user = store.currentUser;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 800px;">
      <h1 class="display-sm" style="color: var(--on-surface);">Pengaturan Sistem</h1>
      <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Konfigurasi preferensi WMS, identitas gudang, dan sinkronisasi.</p>

      <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
        <h3 class="headline-md">Identitas Node WMS</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Nama Node Gudang</label>
            <input type="text" class="input-control" value="WMS Node 004 - Jakarta Sentral" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Zona Waktu</label>
            <input type="text" class="input-control" value="Asia/Jakarta (WIB • GMT+7)" readonly />
          </div>
        </div>

        <h3 class="headline-md" style="margin-top: 1rem;">Preferensi Bahasa &amp; Tampilan</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Bahasa Sistem</label>
            <select class="select-control">
              <option selected>Bahasa Indonesia (Baku Enterprise)</option>
              <option>English (US)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Mode Tema</label>
            <select class="select-control">
              <option selected>Mode Terang (Light Corporate)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}
