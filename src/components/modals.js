import { store } from '../store/state.js';
import { showToast } from './toast.js';

export function openAddItemModal(onSuccess) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const suppliers = store.suppliers;
  const categories = store.categories;

  modalRoot.innerHTML = `
    <div class="modal-overlay open" id="addItemModalOverlay">
      <div class="modal-card">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 2rem; height: 2rem; border-radius: var(--radius-md); background: var(--primary-fixed); color: var(--primary); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined text-[18px]">add_box</span>
            </div>
            <div>
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--on-surface);">Tambah Barang Baru</h3>
              <p style="font-size: 0.75rem; color: var(--on-surface-variant);">Tambahkan SKU baru ke dalam basis data inventaris</p>
            </div>
          </div>
          <button class="btn-icon" id="closeAddItemModal"><span class="material-symbols-outlined">close</span></button>
        </div>
        <form id="addItemForm">
          <div class="modal-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Kode SKU <span class="required">*</span></label>
                <input type="text" name="sku" class="input-control" placeholder="Cth: SKU-EL-105" required />
              </div>
              <div class="form-group">
                <label class="form-label">Kategori <span class="required">*</span></label>
                <select name="category" class="select-control" required>
                  ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Nama Barang <span class="required">*</span></label>
              <input type="text" name="name" class="input-control" placeholder="Cth: Keyboard Logitech Mechanical" required />
            </div>

            <div class="form-group">
              <label class="form-label">Varian / Deskripsi Singkat</label>
              <input type="text" name="variant" class="input-control" placeholder="Cth: RGB Backlight • Switch Merah" />
            </div>

            <div class="form-group">
              <label class="form-label">Pemasok / Supplier <span class="required">*</span></label>
              <select name="supplier" class="select-control" required>
                ${suppliers.map(sup => `<option value="${sup}">${sup}</option>`).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">Stok Awal <span class="required">*</span></label>
                <input type="number" name="stock" class="input-control font-mono-num" value="10" min="0" required />
              </div>
              <div class="form-group">
                <label class="form-label">Satuan <span class="required">*</span></label>
                <input type="text" name="unit" class="input-control" value="Unit" placeholder="Unit / Pcs / Box" required />
              </div>
              <div class="form-group">
                <label class="form-label">Min. Stok</label>
                <input type="number" name="minStock" class="input-control font-mono-num" value="10" min="1" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Lokasi Rak Gudang</label>
              <input type="text" name="location" class="input-control" placeholder="Cth: Gudang Sentral A (Rak B-07)" value="Gudang Sentral A (Rak B-07)" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancelAddItemModal">Batal</button>
            <button type="submit" class="btn btn-primary">
              <span class="material-symbols-outlined text-[16px]">save</span>
              <span>Simpan Barang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const overlay = document.getElementById('addItemModalOverlay');
  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => { modalRoot.innerHTML = ''; }, 200);
  };

  document.getElementById('closeAddItemModal').onclick = close;
  document.getElementById('cancelAddItemModal').onclick = close;

  const form = document.getElementById('addItemForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const itemData = Object.fromEntries(formData.entries());
    
    // Choose icon based on category
    let icon = 'inventory_2';
    if (itemData.category === 'Elektronik') icon = 'devices';
    if (itemData.category === 'ATK') icon = 'description';
    if (itemData.category === 'Peralatan Kantor') icon = 'chair';
    if (itemData.category === 'Sparepart') icon = 'memory';

    itemData.icon = icon;
    const created = store.addItem(itemData);
    showToast(`Barang '${created.name}' berhasil ditambahkan!`, 'success');
    close();
    if (onSuccess) onSuccess();
  };
}

export function openEditItemModal(itemId, onSuccess) {
  const item = store.getItemById(itemId);
  if (!item) return;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const suppliers = store.suppliers;
  const categories = store.categories;

  modalRoot.innerHTML = `
    <div class="modal-overlay open" id="editItemModalOverlay">
      <div class="modal-card">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 2rem; height: 2rem; border-radius: var(--radius-md); background: var(--secondary-container); color: var(--on-secondary-fixed-variant); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <div>
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--on-surface);">Edit Data Barang</h3>
              <p style="font-size: 0.75rem; color: var(--on-surface-variant);">${item.sku} • ${item.name}</p>
            </div>
          </div>
          <button class="btn-icon" id="closeEditItemModal"><span class="material-symbols-outlined">close</span></button>
        </div>
        <form id="editItemForm">
          <div class="modal-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Kode SKU</label>
                <input type="text" name="sku" class="input-control font-mono-num" value="${item.sku}" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Kategori</label>
                <select name="category" class="select-control">
                  ${categories.map(cat => `<option value="${cat}" ${cat === item.category ? 'selected' : ''}>${cat}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Nama Barang <span class="required">*</span></label>
              <input type="text" name="name" class="input-control" value="${item.name}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Varian / Spesifikasi</label>
              <input type="text" name="variant" class="input-control" value="${item.variant || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Pemasok / Supplier</label>
              <select name="supplier" class="select-control">
                ${suppliers.map(sup => `<option value="${sup}" ${sup === item.supplier ? 'selected' : ''}>${sup}</option>`).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">Stok Fisik</label>
                <input type="number" name="stock" class="input-control font-mono-num" value="${item.stock}" min="0" required />
              </div>
              <div class="form-group">
                <label class="form-label">Satuan</label>
                <input type="text" name="unit" class="input-control" value="${item.unit}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Min. Stok</label>
                <input type="number" name="minStock" class="input-control font-mono-num" value="${item.minStock}" min="1" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Lokasi Rak Gudang</label>
              <input type="text" name="location" class="input-control" value="${item.location || ''}" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancelEditItemModal">Batal</button>
            <button type="submit" class="btn btn-primary">
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const overlay = document.getElementById('editItemModalOverlay');
  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => { modalRoot.innerHTML = ''; }, 200);
  };

  document.getElementById('closeEditItemModal').onclick = close;
  document.getElementById('cancelEditItemModal').onclick = close;

  const form = document.getElementById('editItemForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const updatedData = Object.fromEntries(formData.entries());
    updatedData.stock = parseInt(updatedData.stock, 10);
    updatedData.minStock = parseInt(updatedData.minStock, 10);

    store.updateItem(itemId, updatedData);
    showToast(`Perubahan data barang '${item.name}' tersimpan!`, 'success');
    close();
    if (onSuccess) onSuccess();
  };
}

export function openItemDetailModal(itemId) {
  const item = store.getItemById(itemId);
  if (!item) return;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  let statusBadge = `<span class="badge badge-safe"><span class="badge-dot"></span> Aman</span>`;
  if (item.stock === 0) {
    statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span> Habis (Darurat)</span>`;
  } else if (item.stock <= item.minStock) {
    statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span> Stok Menipis</span>`;
  }

  modalRoot.innerHTML = `
    <div class="modal-overlay open" id="detailModalOverlay">
      <div class="modal-card">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-lg); background: var(--surface-container); display: flex; align-items: center; justify-content: center; color: var(--primary-container);">
              <span class="material-symbols-outlined">${item.icon || 'inventory_2'}</span>
            </div>
            <div>
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--on-surface);">${item.name}</h3>
              <span class="font-mono-num" style="font-size: 0.75rem; color: var(--primary-container); font-weight: 600;">${item.sku}</span>
            </div>
          </div>
          <button class="btn-icon" id="closeDetailModal"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="modal-body" style="gap: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--surface-container-low); border-radius: var(--radius-lg);">
            <div>
              <div style="font-size: 0.6875rem; color: var(--on-surface-variant); text-transform: uppercase;">Status Inventaris</div>
              <div style="margin-top: 0.25rem;">${statusBadge}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.6875rem; color: var(--on-surface-variant); text-transform: uppercase;">Stok Fisik Tersedia</div>
              <div class="font-mono-num" style="font-size: 1.5rem; font-weight: 700; color: var(--on-surface);">${item.stock} <span style="font-size: 0.8125rem; font-weight: normal; color: var(--on-surface-variant);">${item.unit}</span></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.8125rem;">
            <div>
              <div style="color: var(--on-surface-variant); font-size: 0.75rem;">Kategori</div>
              <div style="font-weight: 600; color: var(--on-surface); margin-top: 0.15rem;">${item.category}</div>
            </div>
            <div>
              <div style="color: var(--on-surface-variant); font-size: 0.75rem;">Ambang Batas Minimum</div>
              <div style="font-weight: 600; color: var(--on-surface); margin-top: 0.15rem;">${item.minStock} ${item.unit}</div>
            </div>
            <div>
              <div style="color: var(--on-surface-variant); font-size: 0.75rem;">Mitra Pemasok</div>
              <div style="font-weight: 600; color: var(--on-surface); margin-top: 0.15rem;">${item.supplier}</div>
            </div>
            <div>
              <div style="color: var(--on-surface-variant); font-size: 0.75rem;">Lokasi Penempatan</div>
              <div style="font-weight: 600; color: var(--on-surface); margin-top: 0.15rem;">${item.location}</div>
            </div>
          </div>

          <div>
            <div style="color: var(--on-surface-variant); font-size: 0.75rem;">Spesifikasi Produk</div>
            <div style="font-weight: 500; color: var(--on-surface); margin-top: 0.15rem; padding: 0.5rem; background: var(--surface-container-low); border-radius: var(--radius-md); font-size: 0.8125rem;">
              ${item.variant}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="dismissDetailModal">Tutup</button>
          <a href="#stok-masuk?itemId=${item.id}" class="btn btn-success" id="detailQuickStockIn">
            <span class="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Tambah Stok</span>
          </a>
        </div>
      </div>
    </div>
  `;

  const overlay = document.getElementById('detailModalOverlay');
  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => { modalRoot.innerHTML = ''; }, 200);
  };

  document.getElementById('closeDetailModal').onclick = close;
  document.getElementById('dismissDetailModal').onclick = close;
}
