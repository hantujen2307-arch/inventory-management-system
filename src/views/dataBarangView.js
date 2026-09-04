import { store } from '../store/state.js';
import { openAddItemModal, openEditItemModal, openItemDetailModal } from '../components/modals.js';
import { showToast } from '../components/toast.js';

export function renderDataBarangView(searchQuery = '') {
  const items = store.getItems();
  const suppliers = store.suppliers;
  const categories = store.categories;
  const metrics = store.getMetrics();

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      
      <!-- Top Title & Module Header -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.2rem 0.5rem; background: var(--surface-container); border-radius: var(--radius-sm); font-size: 0.6875rem; font-weight: 700; color: var(--primary); margin-bottom: 0.35rem;">
            <span>MODUL MASTER</span>
            <span>•</span>
            <span class="font-mono-num">Katalog ID: SF-INV-2025</span>
          </div>
          <h1 class="display-sm" style="color: var(--on-surface);">Data Barang</h1>
          <p style="color: var(--on-surface-variant); font-size: 0.875rem;">Kelola seluruh data barang dan stok inventaris gudang secara presisi.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button class="btn btn-secondary" id="btnImportData" title="Impor Data Barang dari CSV / JSON">
            <span class="material-symbols-outlined text-[18px] text-tertiary">upload</span>
            <span>Import Data</span>
          </button>
          <button class="btn btn-secondary" id="btnExportExcel" title="Ekspor Katalog ke Spreadsheet CSV">
            <span class="material-symbols-outlined text-[18px] text-tertiary">download</span>
            <span>Export Excel</span>
          </button>
          <button class="btn btn-primary" id="btnTambahBarang">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>Tambah Barang Baru</span>
          </button>
        </div>
      </div>

      <!-- Filter, Search & Density Controls Card -->
      <div class="card" style="padding: 1rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) 44px; gap: 0.75rem; align-items: center;">
          <!-- Search Bar -->
          <div class="search-wrapper" style="grid-column: span 2;">
            <span class="material-symbols-outlined search-icon text-[18px]">search</span>
            <input 
              type="text" 
              id="filterSearchInput" 
              class="input-control" 
              placeholder="Cari nama barang atau SKU..." 
              value="${searchQuery}" 
            />
            <button type="button" id="clearFilterSearchBtn" class="clear-btn ${searchQuery ? 'visible' : ''}">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <!-- Kategori Filter -->
          <div style="position: relative;">
            <select id="filterCategory" class="select-control cursor-pointer" style="padding-right: 2rem;">
              <option value="">Semua Kategori</option>
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <span class="material-symbols-outlined" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--outline); font-size: 18px;">unfold_more</span>
          </div>

          <!-- Supplier Filter -->
          <div style="position: relative;">
            <select id="filterSupplier" class="select-control cursor-pointer" style="padding-right: 2rem;">
              <option value="">Semua Supplier</option>
              ${suppliers.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
            <span class="material-symbols-outlined" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--outline); font-size: 18px;">unfold_more</span>
          </div>

          <!-- Status Filter -->
          <div style="position: relative;">
            <select id="filterStatus" class="select-control cursor-pointer" style="padding-right: 2rem;">
              <option value="">Semua Status</option>
              <option value="safe">🟢 Aman</option>
              <option value="low">🟡 Stok Menipis</option>
              <option value="out">🔴 Habis</option>
            </select>
            <span class="material-symbols-outlined" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--outline); font-size: 18px;">unfold_more</span>
          </div>

          <!-- Reset Filter Button -->
          <button class="btn btn-secondary btn-icon" id="btnResetFilters" title="Reset Semua Filter">
            <span class="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>
        </div>
      </div>

      <!-- High-Density Data Table Card -->
      <div class="table-wrapper">
        <div class="table-responsive">
          <table class="data-table" id="itemsTable">
            <thead>
              <tr>
                <th style="width: 48px; text-align: center;">No</th>
                <th style="width: 54px; text-align: center;">Gambar</th>
                <th>Nama Barang</th>
                <th style="width: 140px;">SKU</th>
                <th style="width: 150px;">Kategori</th>
                <th>Supplier</th>
                <th style="text-align: right; width: 90px;">Stok</th>
                <th style="width: 80px;">Satuan</th>
                <th style="width: 140px;">Status</th>
                <th style="text-align: center; width: 120px;">Aksi</th>
              </tr>
            </thead>
            <tbody id="itemsTableBody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>

        <!-- Table Footer / Pagination -->
        <div style="padding: 0.75rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--border-subtle); background: var(--surface-container-lowest);">
          <div style="font-size: 0.8125rem; color: var(--on-surface-variant);" id="paginationInfo">
            Menampilkan 1-10 dari 156 total barang
          </div>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" id="btnPrevPage">
              <span class="material-symbols-outlined text-[16px]">chevron_left</span>
              <span>Sebelumnya</span>
            </button>
            <div style="display: flex; gap: 0.25rem;">
              <button class="btn btn-primary" style="width: 2rem; height: 2rem; padding: 0; font-size: 0.75rem; font-family: var(--font-mono);">1</button>
              <button class="btn btn-secondary" style="width: 2rem; height: 2rem; padding: 0; font-size: 0.75rem; font-family: var(--font-mono);">2</button>
              <button class="btn btn-secondary" style="width: 2rem; height: 2rem; padding: 0; font-size: 0.75rem; font-family: var(--font-mono);">3</button>
              <span style="display: flex; align-items: center; justify-content: center; width: 1.5rem; color: var(--outline);">...</span>
              <button class="btn btn-secondary" style="width: 2rem; height: 2rem; padding: 0; font-size: 0.75rem; font-family: var(--font-mono);">16</button>
            </div>
            <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" id="btnNextPage">
              <span>Selanjutnya</span>
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats Summary Bar (Bento Strip) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
        <!-- Stat 1: Total Aman -->
        <div class="card" style="padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.75rem; height: 2.75rem; border-radius: var(--radius-lg); background: var(--tertiary-bg); color: var(--tertiary-text); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <span style="font-size: 0.6875rem; font-weight: 600; color: var(--on-surface-variant); text-transform: uppercase;">Total Stok Aman</span>
              <div class="font-mono-num" style="font-size: 1.35rem; font-weight: 700; color: var(--on-surface);">
                142 <span style="font-size: 0.75rem; color: var(--outline); font-weight: normal;">Barang</span>
              </div>
            </div>
          </div>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--tertiary-text); background: var(--tertiary-bg); padding: 0.25rem 0.5rem; border-radius: var(--radius-md);">91.0%</span>
        </div>

        <!-- Stat 2: Menipis -->
        <div class="card" style="padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.75rem; height: 2.75rem; border-radius: var(--radius-lg); background: var(--warning-bg); color: var(--warning-dark); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined text-[24px]">production_quantity_limits</span>
            </div>
            <div>
              <span style="font-size: 0.6875rem; font-weight: 600; color: var(--on-surface-variant); text-transform: uppercase;">Perlu Restok Segera</span>
              <div class="font-mono-num" style="font-size: 1.35rem; font-weight: 700; color: var(--on-surface);">
                8 <span style="font-size: 0.75rem; color: var(--outline); font-weight: normal;">SKU</span>
              </div>
            </div>
          </div>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--warning-dark); background: var(--warning-bg); padding: 0.25rem 0.5rem; border-radius: var(--radius-md);">5.1%</span>
        </div>

        <!-- Stat 3: Habis (Kritis) -->
        <div class="card" style="padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-color: var(--error-border);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.75rem; height: 2.75rem; border-radius: var(--radius-lg); background: var(--error-container); color: var(--error-dark); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <span style="font-size: 0.6875rem; font-weight: 700; color: var(--error-dark); text-transform: uppercase;">Stok Habis (Darurat)</span>
              <div class="font-mono-num" style="font-size: 1.35rem; font-weight: 700; color: var(--error-dark);">
                6 <span style="font-size: 0.75rem; color: var(--error-light); font-weight: normal;">Barang Kosong</span>
              </div>
            </div>
          </div>
          <a href="#stok-masuk" class="btn btn-danger" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
            Buat PO
          </a>
        </div>
      </div>

    </div>
  `;
}

export function attachDataBarangEvents() {
  const tableBody = document.getElementById('itemsTableBody');
  const searchInput = document.getElementById('filterSearchInput');
  const clearSearchBtn = document.getElementById('clearFilterSearchBtn');
  const catSelect = document.getElementById('filterCategory');
  const supSelect = document.getElementById('filterSupplier');
  const statusSelect = document.getElementById('filterStatus');
  const resetBtn = document.getElementById('btnResetFilters');
  const btnAdd = document.getElementById('btnTambahBarang');
  const btnExport = document.getElementById('btnExportExcel');
  const btnImport = document.getElementById('btnImportData');
  const paginationInfo = document.getElementById('paginationInfo');

  function renderTableRows() {
    if (!tableBody) return;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCat = catSelect ? catSelect.value : '';
    const selectedSup = supSelect ? supSelect.value : '';
    const selectedStatus = statusSelect ? statusSelect.value : '';

    let items = store.getItems();

    // Filter
    if (query) {
      items = items.filter(i => 
        i.name.toLowerCase().includes(query) || 
        i.sku.toLowerCase().includes(query) ||
        i.variant.toLowerCase().includes(query)
      );
    }
    if (selectedCat) {
      items = items.filter(i => i.category === selectedCat);
    }
    if (selectedSup) {
      items = items.filter(i => i.supplier === selectedSup);
    }
    if (selectedStatus) {
      if (selectedStatus === 'safe') {
        items = items.filter(i => i.stock > i.minStock);
      } else if (selectedStatus === 'low') {
        items = items.filter(i => i.stock > 0 && i.stock <= i.minStock);
      } else if (selectedStatus === 'out') {
        items = items.filter(i => i.stock === 0);
      }
    }

    if (paginationInfo) {
      paginationInfo.textContent = `Menampilkan 1-${items.length} dari ${store.getItems().length} total barang`;
    }

    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 3rem 1rem; color: var(--outline);">
            <span class="material-symbols-outlined text-[36px]" style="display: block; margin-bottom: 0.5rem;">inventory_2</span>
            <div style="font-size: 0.9375rem; font-weight: 600; color: var(--on-surface);">Tidak ada barang yang sesuai filter</div>
            <div style="font-size: 0.8125rem; margin-top: 0.25rem;">Coba atur ulang kata kunci pencarian atau bersihkan filter.</div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items.map((item, idx) => {
      let statusBadge = `<span class="badge badge-safe"><span class="badge-dot"></span> Aman</span>`;
      let rowBg = '';
      if (item.stock === 0) {
        statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span> Habis</span>`;
        rowBg = 'background: rgba(239, 68, 68, 0.04);';
      } else if (item.stock <= item.minStock) {
        statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span> Stok Menipis</span>`;
      }

      return `
        <tr style="${rowBg}">
          <td class="font-mono-num" style="text-align: center; color: var(--outline); font-size: 0.8125rem;">${String(idx + 1).padStart(2, '0')}</td>
          <td style="text-align: center;">
            <div style="width: 2.5rem; height: 2.5rem; border-radius: var(--radius-lg); background: var(--surface-container); display: flex; align-items: center; justify-content: center; margin: 0 auto; color: var(--on-secondary-container);">
              <span class="material-symbols-outlined text-[20px]">${item.icon || 'inventory_2'}</span>
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column;">
              <span class="item-name-clickable" data-id="${item.id}" style="font-weight: 600; color: var(--on-surface); cursor: pointer; transition: color var(--transition-fast);">
                ${item.name}
              </span>
              <span style="font-size: 0.6875rem; color: ${item.stock === 0 ? 'var(--error-dark)' : 'var(--outline)'}; font-weight: ${item.stock === 0 ? '600' : 'normal'};">
                ${item.variant}
              </span>
            </div>
          </td>
          <td>
            <span class="font-mono-num" style="padding: 0.15rem 0.45rem; background: var(--surface-container); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; color: var(--on-secondary-container);">
              ${item.sku}
            </span>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--primary-container);"></span>
              <span>${item.category}</span>
            </div>
          </td>
          <td style="color: var(--on-surface-variant); font-size: 0.8125rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${item.supplier}
          </td>
          <td class="font-mono-num" style="text-align: right; font-weight: 700; font-size: 1rem; color: ${item.stock === 0 ? 'var(--error-dark)' : 'var(--on-surface)'};">
            ${item.stock}
          </td>
          <td style="color: var(--on-surface-variant); font-size: 0.8125rem;">
            ${item.unit}
          </td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
              <button class="btn-icon btn-item-detail" data-id="${item.id}" title="Lihat Detail">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
              <button class="btn-icon btn-item-edit" data-id="${item.id}" title="Edit Barang">
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button class="btn-icon btn-item-delete" data-id="${item.id}" title="Hapus Barang" style="color: var(--error-light);">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row item events
    document.querySelectorAll('.item-name-clickable, .btn-item-detail').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        openItemDetailModal(id);
      });
    });

    document.querySelectorAll('.btn-item-edit').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        openEditItemModal(id, () => {
          renderTableRows();
        });
      });
    });

    document.querySelectorAll('.btn-item-delete').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        const item = store.getItemById(id);
        if (confirm(`Apakah Anda yakin ingin menghapus '${item.name}' (${item.sku})?`)) {
          store.deleteItem(id);
          showToast(`Barang '${item.name}' telah dihapus.`, 'info');
          renderTableRows();
        }
      });
    });
  }

  // Bind filter inputs
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('visible', searchInput.value.length > 0);
      }
      renderTableRows();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.classList.remove('visible');
      renderTableRows();
      searchInput.focus();
    });
  }

  if (catSelect) catSelect.addEventListener('change', renderTableRows);
  if (supSelect) supSelect.addEventListener('change', renderTableRows);
  if (statusSelect) statusSelect.addEventListener('change', renderTableRows);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.classList.remove('visible');
      if (catSelect) catSelect.value = '';
      if (supSelect) supSelect.value = '';
      if (statusSelect) statusSelect.value = '';
      renderTableRows();
      showToast('Semua filter berhasil direset.', 'info');
    });
  }

  // Add Item Modal Trigger
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      openAddItemModal(() => {
        renderTableRows();
      });
    });
  }

  // Export Excel / CSV
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const items = store.getItems();
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "No,SKU,Nama Barang,Varian,Kategori,Supplier,Stok,Satuan,Lokasi\n";
      items.forEach((item, index) => {
        csvContent += `${index + 1},"${item.sku}","${item.name}","${item.variant}","${item.category}","${item.supplier}",${item.stock},"${item.unit}","${item.location}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `StockFlow_Katalog_Barang_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Katalog berhasil diekspor ke format CSV Spreadsheet!', 'success');
    });
  }

  // Import Data Mock
  if (btnImport) {
    btnImport.addEventListener('click', () => {
      showToast('Fitur Impor: Silakan pilih file template CSV/Excel untuk sinkronisasi massal.', 'info');
    });
  }

  // Initial table render
  renderTableRows();
}
