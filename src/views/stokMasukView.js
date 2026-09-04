import { store } from '../store/state.js';
import { showToast } from '../components/toast.js';

export function renderStokMasukView(selectedItemId = null) {
  const items = store.getItems();
  const suppliers = store.suppliers;
  const user = store.currentUser;
  const recentIn = store.getTransactions().filter(t => t.type === 'MASUK').slice(0, 3);

  // Default active item
  let activeItem = items.find(i => i.id === selectedItemId) || items[2] || items[0];

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const autoRefNo = `IN-${todayStr.replace(/-/g, '').slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- Sub-header & Quick Meta Badges -->
      <div style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--on-surface-variant); margin-bottom: 0.25rem;">
            <a href="#dashboard">Dashboard</a>
            <span>/</span>
            <a href="#riwayat">Transaksi</a>
            <span>/</span>
            <span style="color: var(--primary-container); font-weight: 600;">Stok Masuk</span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.75rem;">
            <h1 class="display-sm" style="color: var(--on-surface);">Pencatatan Stok Masuk</h1>
            <span class="badge badge-safe">
              <span class="badge-dot"></span> Mode Aktif
            </span>
          </div>
          <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Catat barang yang masuk ke dalam inventaris gudang secara akurat dan real-time.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="card" style="padding: 0.5rem 0.875rem; display: flex; align-items: center; gap: 0.625rem;">
            <span class="material-symbols-outlined text-[20px] text-outline">warehouse</span>
            <div>
              <div style="font-size: 0.625rem; color: var(--outline); text-transform: uppercase;">Lokasi Masuk</div>
              <div style="font-size: 0.8125rem; font-weight: 600; color: var(--on-surface);">Gudang Sentral A</div>
            </div>
          </div>
          <div class="card" style="padding: 0.5rem 0.875rem; display: flex; align-items: center; gap: 0.625rem;">
            <span class="material-symbols-outlined text-[20px] text-primary">verified_user</span>
            <div>
              <div style="font-size: 0.625rem; color: var(--outline); text-transform: uppercase;">Operator</div>
              <div style="font-size: 0.8125rem; font-weight: 600; color: var(--on-surface);">${user.name}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main 2-Column Workstation Grid -->
      <div class="workstation-grid">
        
        <!-- LEFT COLUMN: Formulir Penerimaan Barang (7 Cols) -->
        <div class="workstation-card">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-lg); background: var(--primary-fixed); color: var(--primary); display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined text-[20px]">input</span>
              </div>
              <div>
                <h2 class="headline-md" style="color: var(--on-surface);">Formulir Penerimaan Barang</h2>
                <p style="font-size: 0.75rem; color: var(--outline);">Pastikan kelengkapan fisik dan dokumen vendor sebelum menyimpan.</p>
              </div>
            </div>
            <span class="font-mono-num" style="font-size: 0.75rem; color: var(--outline); padding: 0.25rem 0.5rem; background: var(--surface-container-low); border-radius: var(--radius-md);">
              Form ID: FRM-IN-09
            </span>
          </div>

          <form id="stokMasukForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Row 1: Tanggal & Ref PO -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Tanggal Transaksi <span class="required">*</span></label>
                <input type="date" id="tglMasuk" class="input-control" value="${todayStr}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Nomor Referensi / PO <span class="required">*</span></label>
                <div style="position: relative;">
                  <input type="text" id="noRefMasuk" class="input-control font-mono-num" value="${autoRefNo}" readonly />
                  <span class="material-symbols-outlined" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--primary-container); font-size: 18px;">lock</span>
                </div>
              </div>
            </div>

            <!-- Row 2: Select Item -->
            <div class="form-group">
              <label class="form-label">Pilih Barang Masuk <span class="required">*</span></label>
              <select id="selectBarangMasuk" class="select-control" style="font-size: 0.875rem; font-weight: 500;">
                ${items.map(item => `
                  <option value="${item.id}" ${item.id === activeItem.id ? 'selected' : ''}>
                    ${item.name} (${item.sku}) — Stok: ${item.stock} ${item.unit}
                  </option>
                `).join('')}
              </select>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--surface-container-low); border-radius: var(--radius-md); font-size: 0.75rem; margin-top: 0.35rem;">
                <span style="color: var(--on-surface-variant);">
                  Stok Saat Ini: <strong id="liveCurrentStock" class="font-mono-num" style="color: var(--primary);">${activeItem.stock}</strong> ${activeItem.unit}
                </span>
                <span style="color: var(--outline);" id="liveCurrentLocation">
                  📍 Lokasi: ${activeItem.location}
                </span>
              </div>
            </div>

            <!-- Row 3: Stepper Jumlah Masuk -->
            <div class="form-group">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <label class="form-label">Jumlah Barang Masuk <span class="required">*</span></label>
                <span style="font-size: 0.75rem; color: var(--outline);" id="satuanLabel">Satuan: ${activeItem.unit}</span>
              </div>
              
              <div class="stepper-input-wrapper">
                <button type="button" class="stepper-btn decrease" id="btnKurangMasuk">-</button>
                <input type="number" id="inputJumlahMasuk" class="input-control stepper-input" min="1" value="20" />
                <button type="button" class="stepper-btn increase" id="btnTambahMasuk">+</button>
              </div>

              <!-- Presets -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.35rem;">
                <span style="font-size: 0.75rem; color: var(--outline);">Pintasan penambahan unit:</span>
                <div style="display: flex; gap: 0.35rem;">
                  <button type="button" class="btn btn-secondary preset-btn" data-add="10" style="padding: 0.2rem 0.5rem; font-size: 0.6875rem; font-family: var(--font-mono);">+10</button>
                  <button type="button" class="btn btn-secondary preset-btn" data-add="20" style="padding: 0.2rem 0.5rem; font-size: 0.6875rem; font-family: var(--font-mono);">+20</button>
                  <button type="button" class="btn btn-secondary preset-btn" data-add="50" style="padding: 0.2rem 0.5rem; font-size: 0.6875rem; font-family: var(--font-mono);">+50</button>
                </div>
              </div>
            </div>

            <!-- Row 4: Supplier & Surat Jalan -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Pemasok / Supplier <span class="required">*</span></label>
                <select id="supplierMasuk" class="select-control">
                  ${suppliers.map(sup => `
                    <option value="${sup}" ${sup === activeItem.supplier ? 'selected' : ''}>${sup}</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Nomor Surat Jalan / Faktur</label>
                <input type="text" id="suratJalanMasuk" class="input-control" value="SJ-MK-2025/089" placeholder="Cth: SJ-MK-2025/089" />
              </div>
            </div>

            <!-- Row 5: Catatan -->
            <div class="form-group">
              <label class="form-label">Catatan / Keterangan Masuk</label>
              <textarea id="catatanMasuk" class="textarea-control" rows="2" placeholder="Tambahkan catatan kondisi barang atau nomor batch pengadaan...">Pengadaan rutin triwulan II</textarea>
            </div>

            <!-- Form Actions -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
              <button type="button" class="btn btn-secondary" id="btnResetMasuk">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSubmitMasuk" style="padding: 0.625rem 1.5rem;">
                <span class="material-symbols-outlined text-[18px]">save</span>
                <span>Simpan Transaksi Masuk</span>
              </button>
            </div>
          </form>
        </div>

        <!-- RIGHT COLUMN: Kalkulasi Otomatis & Ringkasan (5 Cols) -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <div class="workstation-card">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
              <div style="font-size: 0.6875rem; font-weight: 700; color: var(--outline); text-transform: uppercase; letter-spacing: 0.05em;">
                KALKULASI OTOMATIS
              </div>
              <div class="live-sync-pill" style="padding: 0.2rem 0.5rem; font-size: 0.6875rem;">
                <span class="live-sync-dot"></span>
                <span>Sinkronisasi Langsung</span>
              </div>
            </div>

            <div>
              <h3 class="headline-md" style="color: var(--on-surface);">Ringkasan Transaksi Masuk</h3>
            </div>

            <!-- Active Item Card -->
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--surface-container-low); border-radius: var(--radius-lg);">
              <div style="width: 2.5rem; height: 2.5rem; border-radius: var(--radius-md); background: #ffffff; color: var(--primary-container); display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined text-[22px]" id="previewIcon">${activeItem.icon || 'inventory_2'}</span>
              </div>
              <div>
                <span style="font-size: 0.6875rem; color: var(--outline); text-transform: uppercase;">BARANG DIPILIH</span>
                <div style="font-weight: 700; font-size: 0.9375rem; color: var(--on-surface);" id="previewNama">${activeItem.name}</div>
                <div class="font-mono-num" style="font-size: 0.75rem; color: var(--primary-container); font-weight: 600;" id="previewSku">${activeItem.sku}</div>
              </div>
            </div>

            <!-- Calculation Grid -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-bottom: 1px dashed var(--border-subtle);">
                <span style="display: flex; align-items: center; gap: 0.35rem; color: var(--on-surface-variant); font-size: 0.8125rem;">
                  <span class="material-symbols-outlined text-[16px]">inventory_2</span>
                  <span>Stok Sebelum</span>
                </span>
                <span class="font-mono-num" style="font-weight: 600; font-size: 0.9375rem;">
                  <span id="calcStokAwal">${activeItem.stock}</span> <span style="font-size: 0.75rem; font-weight: normal; color: var(--outline);">${activeItem.unit}</span>
                </span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-bottom: 1px dashed var(--border-subtle); color: var(--tertiary-text);">
                <span style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8125rem;">
                  <span class="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Barang Masuk</span>
                </span>
                <span class="font-mono-num" style="font-weight: 700; font-size: 1rem;">
                  +<span id="calcJumlahMasuk">20</span> <span style="font-size: 0.75rem; font-weight: normal;">${activeItem.unit}</span>
                </span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--surface-container-low); border-radius: var(--radius-lg); margin-top: 0.25rem;">
                <div>
                  <div style="font-size: 0.6875rem; color: var(--outline); text-transform: uppercase;">Stok Setelah Transaksi</div>
                  <div style="font-size: 0.75rem; color: var(--on-surface-variant);">Perhitungan otomatis sistem</div>
                </div>
                <div class="font-mono-num" style="font-size: 1.75rem; font-weight: 700; color: var(--primary-container);">
                  <span id="calcStokAkhir">${activeItem.stock + 20}</span> <span style="font-size: 0.8125rem; color: var(--on-surface-variant); font-weight: 500;">${activeItem.unit}</span>
                </div>
              </div>

              <!-- Status Pasca Transaksi -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.875rem; background: var(--tertiary-bg); border-radius: var(--radius-md); font-size: 0.75rem;">
                <span style="color: var(--tertiary-text); font-weight: 600;">Status Pasca Transaksi:</span>
                <span class="badge badge-safe"><span class="badge-dot"></span> Stok Aman (Batas Min: ${activeItem.minStock})</span>
              </div>
            </div>

            <!-- Quick Action Confirmation -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; padding: 0.75rem; background: var(--surface-container-lowest); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);">
              <div style="font-size: 0.75rem; color: var(--on-surface); font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
                <span class="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Konfirmasi Simpan Transaksi?</span>
              </div>
              <p style="font-size: 0.6875rem; color: var(--outline);">Pastikan fisik barang telah dicek oleh staf gudang dan jumlah tercatat sesuai dengan surat jalan.</p>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                <button type="button" class="btn btn-primary" id="btnQuickConfirm" style="flex: 1; padding: 0.4rem 0.75rem; font-size: 0.75rem;">
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Verifikasi &amp; Simpan</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Riwayat 3 Transaksi Masuk Terakhir -->
          <div class="card" style="padding: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="font-size: 0.8125rem; font-weight: 700; color: var(--on-surface);">Riwayat Transaksi Masuk Terakhir</span>
              <a href="#riwayat" style="font-size: 0.75rem;">Lihat Semua</a>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.625rem;">
              ${recentIn.map(tx => `
                <div style="padding: 0.625rem 0.75rem; background: var(--surface-container-low); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div class="font-mono-num" style="font-size: 0.6875rem; color: var(--outline); font-weight: 600;">${tx.refNo} • ${tx.time}</div>
                    <div style="font-weight: 600; font-size: 0.8125rem; color: var(--on-surface); margin-top: 0.15rem;">${tx.itemName}</div>
                    <div style="font-size: 0.6875rem; color: var(--on-surface-variant);">${tx.supplier}</div>
                  </div>
                  <span class="badge badge-safe font-mono-num" style="font-size: 0.8125rem; padding: 0.25rem 0.5rem;">
                    +${tx.qty} ${tx.unit}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

export function attachStokMasukEvents() {
  const itemSelect = document.getElementById('selectBarangMasuk');
  const inputJumlah = document.getElementById('inputJumlahMasuk');
  const btnTambah = document.getElementById('btnTambahMasuk');
  const btnKurang = document.getElementById('btnKurangMasuk');
  const calcAwal = document.getElementById('calcStokAwal');
  const calcMasuk = document.getElementById('calcJumlahMasuk');
  const calcAkhir = document.getElementById('calcStokAkhir');
  const previewNama = document.getElementById('previewNama');
  const previewSku = document.getElementById('previewSku');
  const previewIcon = document.getElementById('previewIcon');
  const liveStock = document.getElementById('liveCurrentStock');
  const liveLocation = document.getElementById('liveCurrentLocation');
  const satuanLabel = document.getElementById('satuanLabel');
  const form = document.getElementById('stokMasukForm');
  const btnQuickConfirm = document.getElementById('btnQuickConfirm');
  const presetButtons = document.querySelectorAll('.preset-btn');

  function updatePreviewAndCalculations() {
    const selectedId = itemSelect ? itemSelect.value : null;
    const item = store.getItemById(selectedId);
    if (!item) return;

    let qty = parseInt(inputJumlah.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;

    // Update live panel
    if (liveStock) liveStock.textContent = item.stock;
    if (liveLocation) liveLocation.textContent = `📍 Lokasi: ${item.location}`;
    if (satuanLabel) satuanLabel.textContent = `Satuan: ${item.unit}`;
    if (previewNama) previewNama.textContent = item.name;
    if (previewSku) previewSku.textContent = item.sku;
    if (previewIcon) previewIcon.textContent = item.icon || 'inventory_2';

    if (calcAwal) calcAwal.textContent = item.stock;
    if (calcMasuk) calcMasuk.textContent = qty;
    if (calcAkhir) calcAkhir.textContent = item.stock + qty;
  }

  if (itemSelect) {
    itemSelect.addEventListener('change', updatePreviewAndCalculations);
  }

  if (inputJumlah) {
    inputJumlah.addEventListener('input', updatePreviewAndCalculations);
  }

  if (btnTambah) {
    btnTambah.addEventListener('click', () => {
      let current = parseInt(inputJumlah.value, 10) || 0;
      inputJumlah.value = current + 1;
      updatePreviewAndCalculations();
    });
  }

  if (btnKurang) {
    btnKurang.addEventListener('click', () => {
      let current = parseInt(inputJumlah.value, 10) || 1;
      if (current > 1) {
        inputJumlah.value = current - 1;
        updatePreviewAndCalculations();
      }
    });
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const addVal = parseInt(btn.getAttribute('data-add'), 10);
      let current = parseInt(inputJumlah.value, 10) || 0;
      inputJumlah.value = current + addVal;
      updatePreviewAndCalculations();
    });
  });

  function processSubmission() {
    const itemId = itemSelect.value;
    const qty = parseInt(inputJumlah.value, 10);
    const refNo = document.getElementById('noRefMasuk').value;
    const supplier = document.getElementById('supplierMasuk').value;
    const suratJalan = document.getElementById('suratJalanMasuk').value;
    const notes = document.getElementById('catatanMasuk').value;

    try {
      const tx = store.addStock({ itemId, qty, refNo, supplier, suratJalan, notes });
      showToast(`Penerimaan barang +${qty} berhasil dicatat dalam buku gudang!`, 'success');
      // Navigate to dashboard or re-render view
      setTimeout(() => {
        window.location.hash = '#dashboard';
      }, 700);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      processSubmission();
    });
  }

  if (btnQuickConfirm) {
    btnQuickConfirm.addEventListener('click', () => {
      processSubmission();
    });
  }

  // Initial calculation
  updatePreviewAndCalculations();
}
