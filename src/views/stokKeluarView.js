import { store } from '../store/state.js';
import { showToast } from '../components/toast.js';

export function renderStokKeluarView(selectedItemId = null) {
  const items = store.getItems();
  const recentOut = store.getTransactions().filter(t => t.type === 'KELUAR').slice(0, 3);

  // Default active item: find Logitech MX Keys (or low stock item)
  let activeItem = items.find(i => i.id === selectedItemId) || items.find(i => i.stock < 10) || items[1] || items[0];

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const autoRefNo = `OUT-${todayStr.replace(/-/g, '').slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- Sub-header & Quick Meta Badge -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--on-surface-variant); margin-bottom: 0.25rem;">
            <a href="#dashboard">Dashboard</a>
            <span>/</span>
            <a href="#riwayat">Transaksi</a>
            <span>/</span>
            <span style="color: var(--primary-container); font-weight: 600;">Stok Keluar</span>
          </div>
          <h1 class="display-sm" style="color: var(--on-surface);">Pencatatan Stok Keluar</h1>
          <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Catat barang yang dikeluarkan dari inventaris untuk distribusi atau operasional dengan verifikasi kuota ketat.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="card" style="padding: 0.5rem 0.875rem; display: flex; align-items: center; gap: 0.625rem;">
            <div class="live-sync-dot"></div>
            <div>
              <div style="font-size: 0.625rem; color: var(--outline); text-transform: uppercase;">Status Validasi</div>
              <div style="font-size: 0.8125rem; font-weight: 600; color: var(--tertiary-text);">Real-time Safety Check Aktif</div>
            </div>
          </div>
          <button class="btn btn-secondary" id="btnPanduanSOP" style="padding: 0.5rem 0.875rem;">
            <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Panduan SOP Mutasi</span>
          </button>
        </div>
      </div>

      <!-- Main Workstation 2-Column Split Grid -->
      <div class="workstation-grid">
        
        <!-- KOLOM KIRI: FORM PENGELUARAN STOK (7 Cols) -->
        <div class="workstation-card">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-lg); background: var(--surface-container-high); color: var(--primary); display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined text-[22px]">outbox</span>
              </div>
              <div>
                <h2 class="headline-md" style="color: var(--on-surface);">Form Pengeluaran Stok</h2>
                <p style="font-size: 0.75rem; color: var(--outline);">Lengkapi parameter alokasi barang untuk audit logistik</p>
              </div>
            </div>
            <span class="font-mono-num" style="font-size: 0.75rem; color: var(--on-surface-variant); padding: 0.25rem 0.6rem; background: var(--surface-container); border-radius: var(--radius-full); font-weight: 600;">
              REF #202505-OUT
            </span>
          </div>

          <form id="stokKeluarForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Grid 2 Kolom: No Pengeluaran & Tanggal -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Nomor Pengeluaran</label>
                <div style="position: relative;">
                  <span class="material-symbols-outlined text-[18px] text-outline" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);">tag</span>
                  <input type="text" id="noRefKeluar" class="input-control font-mono-num" style="padding-left: 2.25rem;" value="${autoRefNo}" readonly />
                </div>
                <span style="font-size: 0.6875rem; color: var(--outline);">Dibuat otomatis oleh urutan sistem</span>
              </div>

              <div class="form-group">
                <label class="form-label">Tanggal Transaksi <span class="required">*</span></label>
                <div style="position: relative;">
                  <span class="material-symbols-outlined text-[18px] text-outline" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);">calendar_today</span>
                  <input type="date" id="tglKeluar" class="input-control" style="padding-left: 2.25rem;" value="${todayStr}" required />
                </div>
              </div>
            </div>

            <!-- Pilih Barang dari Katalog -->
            <div class="form-group">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <label class="form-label">Pilih Barang dari Katalog <span class="required">*</span></label>
                <a href="javascript:void(0)" id="scanBarcodeBtn" style="font-size: 0.75rem; display: flex; align-items: center; gap: 0.25rem;">
                  <span class="material-symbols-outlined text-[14px]">barcode_scanner</span>
                  <span>Pindai Barcode / RFID</span>
                </a>
              </div>
              <div style="position: relative;">
                <span class="material-symbols-outlined text-[20px] text-outline" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); pointer-events: none;">search</span>
                <select id="selectBarangKeluar" class="select-control cursor-pointer" style="padding-left: 2.25rem; font-weight: 500;">
                  ${items.map(item => `
                    <option value="${item.id}" ${item.id === activeItem.id ? 'selected' : ''}>
                      ${item.name} (${item.sku}) — Stok: ${item.stock} ${item.unit}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Live Physical Stock Preview Card -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--surface-container-low); border-radius: var(--radius-lg); margin-top: 0.35rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div style="width: 2rem; height: 2rem; border-radius: var(--radius-md); background: #ffffff; color: var(--primary); display: flex; align-items: center; justify-content: center;">
                    <span class="material-symbols-outlined text-[18px]">inventory</span>
                  </div>
                  <div>
                    <div style="font-size: 0.6875rem; color: var(--outline); text-transform: uppercase;">Stok Fisik Tersedia Saat Ini</div>
                    <div class="font-mono-num" style="font-weight: 700; font-size: 1.15rem; color: var(--on-surface);">
                      <span id="labelStokTersedia">${activeItem.stock}</span> <span style="font-size: 0.75rem; font-weight: normal; color: var(--outline);">${activeItem.unit}</span>
                    </div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.6875rem; color: var(--outline); text-transform: uppercase;">Ambang Batas Minimum</div>
                  <div class="font-mono-num" style="font-weight: 600; font-size: 0.9375rem; color: var(--warning-dark);" id="labelMinStok">
                    ${activeItem.minStock} ${activeItem.unit}
                  </div>
                </div>
              </div>
            </div>

            <!-- Jumlah Barang Keluar & Tombol Uji Preset -->
            <div class="form-group">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <label class="form-label">Jumlah Barang Keluar <span class="required">*</span></label>
                <span style="font-size: 0.75rem; color: var(--outline);">Satuan: Pcs / Unit</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <input 
                  type="number" 
                  id="inputJumlahKeluar" 
                  class="input-control font-mono-num" 
                  style="font-size: 1.25rem; font-weight: 700; max-width: 130px; text-align: center; color: var(--on-surface);" 
                  value="10" 
                  min="1" 
                />
                
                <!-- Quick Testing Preset Buttons from Stitch -->
                <button type="button" class="btn btn-secondary preset-test-btn" data-qty="2" style="background: var(--surface-container-low); color: var(--tertiary-text); font-weight: 600; font-size: 0.75rem; padding: 0.5rem 0.85rem;">
                  2 (Uji Valid)
                </button>
                <button type="button" class="btn btn-secondary preset-test-btn" data-qty="10" style="background: var(--error-container); color: var(--error-dark); font-weight: 600; font-size: 0.75rem; padding: 0.5rem 0.85rem;">
                  10 (Uji Error)
                </button>
              </div>
            </div>

            <!-- Departemen & Penanggung Jawab -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Departemen / Tujuan <span class="required">*</span></label>
                <select id="selectDepartemen" class="select-control cursor-pointer">
                  <option value="Divisi IT & Pengembangan">Divisi IT &amp; Pengembangan</option>
                  <option value="Divisi Operasional Gudang">Divisi Operasional Gudang</option>
                  <option value="Divisi Pemasaran & Desain">Divisi Pemasaran &amp; Desain</option>
                  <option value="Divisi Keuangan & HR">Divisi Keuangan &amp; HR</option>
                  <option value="Kebutuhan Eksternal / Vendor">Kebutuhan Eksternal / Vendor</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Penanggung Jawab / Penerima <span class="required">*</span></label>
                <div style="position: relative;">
                  <span class="material-symbols-outlined text-[18px] text-outline" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);">badge</span>
                  <input type="text" id="inputPenerima" class="input-control" style="padding-left: 2.25rem;" value="Bambang Sujatmiko (NIK IT-09)" required />
                </div>
              </div>
            </div>

            <!-- Catatan / Alasan -->
            <div class="form-group">
              <label class="form-label">Catatan / Alasan Pengeluaran</label>
              <textarea id="catatanKeluar" class="textarea-control" rows="2" placeholder="Sertakan nomor memo / tiket penugasan jika ada...">Kebutuhan workstation staf baru</textarea>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
              <button type="button" class="btn btn-secondary" id="btnResetKeluar">Reset Formulir</button>
              <button type="submit" class="btn btn-primary" id="btnSubmitKeluar" style="padding: 0.625rem 1.5rem;">
                <span class="material-symbols-outlined text-[18px]">send</span>
                <span>Simpan Transaksi Keluar</span>
              </button>
            </div>
          </form>
        </div>

        <!-- KOLOM KANAN: REAL-TIME SAFETY CHECK & VERIFIKASI SALDO FISIK (5 Cols) -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <div class="workstation-card" id="safetyCard">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.35rem; font-weight: 700; color: var(--on-surface);">
                <span class="material-symbols-outlined text-[20px] text-primary">analytics</span>
                <span>Verifikasi Saldo Fisik</span>
              </div>
              <span class="font-mono-num" style="font-size: 0.75rem; color: var(--primary-container); background: var(--surface-container); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-weight: 600;" id="safetySkuBadge">
                ${activeItem.sku}
              </span>
            </div>

            <!-- SCENARIO 1: ERROR DEFISET KETAT (When qty > stock) -->
            <div id="errorScenarioCard" style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem; background: var(--error-bg); border: 1px solid var(--error-border); border-radius: var(--radius-lg);">
              <div style="display: flex; gap: 0.75rem; align-items: start;">
                <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--error-light); color: #ffffff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-symbols-outlined text-[18px]">error</span>
                </div>
                <div>
                  <h4 style="font-weight: 700; font-size: 0.875rem; color: var(--error-dark); margin-bottom: 0.25rem;">
                    Peringatan Validasi: Stok Tidak Mencukupi!
                  </h4>
                  <p style="font-size: 0.75rem; color: var(--on-surface); line-height: 1.5;">
                    Jumlah yang ingin dikeluarkan (<strong id="errReqQty">10 Unit</strong>) melebihi stok yang tersedia (<strong id="errAvailQty">${activeItem.stock} Unit</strong>). Transaksi diblokir demi konsistensi data buku gudang.
                  </p>
                </div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid rgba(239, 68, 68, 0.2); font-size: 0.8125rem;">
                <span style="color: var(--error-dark); font-weight: 600;">Defisit Kebutuhan:</span>
                <span class="font-mono-num" style="font-size: 1.125rem; font-weight: 700; color: var(--error-dark);" id="deficitCount">-6 Unit</span>
              </div>
            </div>

            <!-- SCENARIO 2: NORMAL VALID (When qty <= stock) -->
            <div id="normalScenarioCard" style="display: none; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-bottom: 1px dashed var(--border-subtle); font-size: 0.8125rem;">
                <span style="color: var(--on-surface-variant);">Stok Sebelum:</span>
                <span class="font-mono-num" style="font-weight: 600;"><span id="normStokSebelum">${activeItem.stock}</span> Unit</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-bottom: 1px dashed var(--border-subtle); font-size: 0.8125rem; color: var(--error-dark);">
                <span>Pengurangan Stok:</span>
                <span class="font-mono-num" style="font-weight: 700;"><span id="normStokKurang">-2</span> Unit</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--surface-container-low); border-radius: var(--radius-lg);">
                <span style="font-size: 0.8125rem; font-weight: 600;">Sisa Stok Pasca Alokasi:</span>
                <span class="font-mono-num" style="font-size: 1.5rem; font-weight: 700; color: var(--primary);" id="normStokSisa">2 Unit</span>
              </div>
              <div id="normAlertLowStock" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--warning-bg); border-radius: var(--radius-md); font-size: 0.75rem; color: var(--warning-dark);">
                <span class="material-symbols-outlined text-[16px]">warning</span>
                <span>Perhatian: Sisa stok akan berada di bawah ambang batas minimum.</span>
              </div>
            </div>

            <!-- Visual Capacity Progress Bar -->
            <div style="margin-top: 0.5rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.6875rem; color: var(--outline); margin-bottom: 0.35rem;">
                <span>Rasio Alokasi Gudang</span>
                <span id="capacityRatioText" style="font-weight: 700;">Defisit</span>
              </div>
              <div style="width: 100%; height: 0.5rem; border-radius: var(--radius-full); background: var(--surface-container); overflow: hidden;">
                <div id="capacityBar" style="width: 100%; height: 100%; background: var(--error-light); transition: all var(--transition-normal);"></div>
              </div>
            </div>
          </div>

          <!-- Log Pengeluaran Terkini -->
          <div class="card" style="padding: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="font-size: 0.8125rem; font-weight: 700; color: var(--on-surface);">Log Pengeluaran Terkini</span>
              <a href="#riwayat" style="font-size: 0.75rem;">Lihat Semua</a>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.625rem;">
              ${recentOut.map(tx => `
                <div style="padding: 0.625rem 0.75rem; background: var(--surface-container-low); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.8125rem; color: var(--on-surface);">${tx.itemName}</div>
                    <div style="font-size: 0.6875rem; color: var(--on-surface-variant);">${tx.department || 'Operasional'} • ${tx.time}</div>
                  </div>
                  <span class="badge badge-danger font-mono-num" style="font-size: 0.8125rem; padding: 0.25rem 0.5rem;">
                    -${tx.qty} ${tx.unit}
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

export function attachStokKeluarEvents() {
  const itemSelect = document.getElementById('selectBarangKeluar');
  const inputQty = document.getElementById('inputJumlahKeluar');
  const presetButtons = document.querySelectorAll('.preset-test-btn');
  const form = document.getElementById('stokKeluarForm');
  const submitBtn = document.getElementById('btnSubmitKeluar');
  const resetBtn = document.getElementById('btnResetKeluar');

  const labelTersedia = document.getElementById('labelStokTersedia');
  const labelMin = document.getElementById('labelMinStok');
  const skuBadge = document.getElementById('safetySkuBadge');

  const errorCard = document.getElementById('errorScenarioCard');
  const normalCard = document.getElementById('normalScenarioCard');
  const errReqQty = document.getElementById('errReqQty');
  const errAvailQty = document.getElementById('errAvailQty');
  const deficitCount = document.getElementById('deficitCount');

  const normStokSebelum = document.getElementById('normStokSebelum');
  const normStokKurang = document.getElementById('normStokKurang');
  const normStokSisa = document.getElementById('normStokSisa');
  const normAlertLow = document.getElementById('normAlertLowStock');

  const capacityBar = document.getElementById('capacityBar');
  const capacityRatioText = document.getElementById('capacityRatioText');

  function evaluateValidation() {
    const selectedId = itemSelect ? itemSelect.value : null;
    const item = store.getItemById(selectedId);
    if (!item) return;

    const available = item.stock;
    const minStock = item.minStock;
    let reqQty = parseInt(inputQty.value, 10);
    if (isNaN(reqQty) || reqQty < 1) reqQty = 1;

    // Update labels
    if (labelTersedia) labelTersedia.textContent = available;
    if (labelMin) labelMin.textContent = `${minStock} ${item.unit}`;
    if (skuBadge) skuBadge.textContent = item.sku;

    if (reqQty > available) {
      // Scenario 1: Defisit / Error
      if (errorCard) errorCard.style.display = 'flex';
      if (normalCard) normalCard.style.display = 'none';
      if (errReqQty) errReqQty.textContent = `${reqQty} ${item.unit}`;
      if (errAvailQty) errAvailQty.textContent = `${available} ${item.unit}`;
      const deficit = reqQty - available;
      if (deficitCount) deficitCount.textContent = `-${deficit} ${item.unit}`;

      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      }

      // Bar red
      if (capacityBar) {
        capacityBar.style.width = '100%';
        capacityBar.style.backgroundColor = 'var(--error-light)';
      }
      if (capacityRatioText) capacityRatioText.textContent = `Defisit ${deficit} ${item.unit}`;
    } else {
      // Scenario 2: Valid
      if (errorCard) errorCard.style.display = 'none';
      if (normalCard) normalCard.style.display = 'flex';

      const sisa = available - reqQty;
      if (normStokSebelum) normStokSebelum.textContent = available;
      if (normStokKurang) normStokKurang.textContent = `-${reqQty}`;
      if (normStokSisa) normStokSisa.textContent = `${sisa} ${item.unit}`;

      if (normAlertLow) {
        normAlertLow.style.display = sisa <= minStock ? 'flex' : 'none';
      }

      // Enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }

      // Bar percentage
      const percent = available > 0 ? Math.round((sisa / available) * 100) : 0;
      if (capacityBar) {
        capacityBar.style.width = `${percent}%`;
        capacityBar.style.backgroundColor = sisa <= minStock ? 'var(--warning)' : 'var(--tertiary-light)';
      }
      if (capacityRatioText) capacityRatioText.textContent = `${percent}% Sisa di Rak`;
    }
  }

  if (itemSelect) {
    itemSelect.addEventListener('change', evaluateValidation);
  }

  if (inputQty) {
    inputQty.addEventListener('input', evaluateValidation);
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-qty');
      if (inputQty) {
        inputQty.value = q;
        evaluateValidation();
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (inputQty) inputQty.value = 2;
      evaluateValidation();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const itemId = itemSelect.value;
      const qty = parseInt(inputQty.value, 10);
      const refNo = document.getElementById('noRefKeluar').value;
      const department = document.getElementById('selectDepartemen').value;
      const receiver = document.getElementById('inputPenerima').value;
      const notes = document.getElementById('catatanKeluar').value;

      try {
        store.removeStock({ itemId, qty, refNo, department, receiver, notes });
        showToast(`Pengeluaran -${qty} unit berhasil dicatat dan stok telah dikurangi!`, 'success');
        setTimeout(() => {
          window.location.hash = '#dashboard';
        }, 700);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Initial validation check
  evaluateValidation();
}
