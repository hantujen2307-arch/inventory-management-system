import { initialItems, initialTransactions, initialSuppliers, initialCategories, initialActivities } from './initialData.js';

class StateStore {
  constructor() {
    this.listeners = [];
    this.storageKeyItems = 'stockflow_items_v1';
    this.storageKeyTx = 'stockflow_transactions_v1';
    this.storageKeyUser = 'stockflow_user_v1';

    // Load or initialize items
    const savedItems = localStorage.getItem(this.storageKeyItems);
    this.items = savedItems ? JSON.parse(savedItems) : [...initialItems];

    // Load or initialize transactions
    const savedTx = localStorage.getItem(this.storageKeyTx);
    this.transactions = savedTx ? JSON.parse(savedTx) : [...initialTransactions];

    // Load or initialize user session (default: false for security)
    this.storageKeyUser = 'stockflow_user_v2';
    const savedUser = localStorage.getItem(this.storageKeyUser);
    this.currentUser = savedUser ? JSON.parse(savedUser) : {
      isLoggedIn: false,
      name: "",
      role: "",
      email: "",
      avatar: "",
      node: ""
    };

    // Registered user credentials for security
    this.storageKeyAccounts = 'stockflow_accounts_v3';
    const savedAccounts = localStorage.getItem(this.storageKeyAccounts);
    this.accounts = savedAccounts ? JSON.parse(savedAccounts) : [
      {
        email: "alpino2307@gmail.com",
        alternateEmail: "alpino@stockflow.id",
        password: "223344",
        role: "Admin Logistik",
        name: "Alpino",
        avatar: "AL",
        node: "WMS Node 004 - Jakarta Sentral"
      }
    ];

    // Verify current user validity on startup
    if (this.currentUser && this.currentUser.isLoggedIn) {
      const isValid = this.accounts.some(acc => 
        acc.email.toLowerCase() === (this.currentUser.email || '').toLowerCase() ||
        (acc.alternateEmail && acc.alternateEmail.toLowerCase() === (this.currentUser.email || '').toLowerCase())
      );
      if (!isValid) {
        this.currentUser = {
          isLoggedIn: false,
          name: "",
          role: "",
          email: "",
          avatar: "",
          node: ""
        };
        localStorage.removeItem(this.storageKeyUser);
      }
    }

    this.suppliers = [...initialSuppliers];
    this.categories = [...initialCategories];
    this.activities = [...initialActivities];
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this));
  }

  persist() {
    localStorage.setItem(this.storageKeyItems, JSON.stringify(this.items));
    localStorage.setItem(this.storageKeyTx, JSON.stringify(this.transactions));
    localStorage.setItem(this.storageKeyUser, JSON.stringify(this.currentUser));
    localStorage.setItem(this.storageKeyAccounts, JSON.stringify(this.accounts));
    this.notify();
  }

  // Auth methods with strict email & password verification
  login(email, password, role = "Admin Logistik") {
    if (!email || !email.trim()) {
      throw new Error("Silakan masukkan email perusahaan Anda.");
    }
    if (!password || !password.trim()) {
      throw new Error("Silakan masukkan kata sandi Anda.");
    }

    const trimmedEmail = email.toLowerCase().trim();
    const matched = this.accounts.find(acc => 
      acc.email.toLowerCase() === trimmedEmail || 
      (acc.alternateEmail && acc.alternateEmail.toLowerCase() === trimmedEmail)
    );

    // Strict validation: Reject if email is not registered
    if (!matched) {
      throw new Error("Email tidak terdaftar dalam sistem! Akses ditolak.");
    }

    // Strict validation: Reject if password does not match
    if (matched.password !== password) {
      throw new Error("Kata sandi salah! Silakan periksa kembali kata sandi Anda.");
    }

    this.currentUser = {
      isLoggedIn: true,
      name: matched.name,
      role: role || matched.role,
      email: matched.email,
      avatar: matched.avatar,
      node: matched.node
    };
    this.addActivity(`${matched.name} (${this.currentUser.role}) berhasil masuk ke sistem`);
    this.persist();
    return this.currentUser;
  }

  logout() {
    const prevName = this.currentUser.name;
    this.currentUser = {
      isLoggedIn: false,
      name: "",
      role: "",
      email: "",
      avatar: "",
      node: ""
    };
    if (prevName) {
      this.addActivity(`${prevName} keluar dari sesi`);
    }
    this.persist();
  }

  changePassword(currentEmail, oldPassword, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Kata sandi baru minimal harus 6 karakter!");
    }
    const acc = this.accounts.find(a => a.email.toLowerCase() === currentEmail.toLowerCase());
    if (!acc) throw new Error("Akun tidak ditemukan!");
    if (acc.password !== oldPassword) throw new Error("Kata sandi lama salah!");

    acc.password = newPassword;
    this.persist();
    return true;
  }

  switchRole(role) {
    this.currentUser.role = role;
    this.persist();
  }

  // Items CRUD
  getItems() {
    return this.items;
  }

  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  getItemBySku(sku) {
    return this.items.find(item => item.sku.toLowerCase() === sku.toLowerCase());
  }

  addItem(itemData) {
    const newItem = {
      id: `item-${Date.now()}`,
      sku: itemData.sku || `SKU-${itemData.category.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: itemData.name,
      variant: itemData.variant || "Standar Spesifikasi",
      category: itemData.category || "Elektronik",
      supplier: itemData.supplier || this.suppliers[0],
      stock: parseInt(itemData.stock, 10) || 0,
      unit: itemData.unit || "Unit",
      minStock: parseInt(itemData.minStock, 10) || 10,
      location: itemData.location || "Gudang Sentral A",
      icon: itemData.icon || "inventory_2"
    };
    this.items.unshift(newItem);
    this.addActivity(`Barang baru '${newItem.name}' ditambahkan oleh ${this.currentUser.name}`);
    this.persist();
    return newItem;
  }

  updateItem(id, updateData) {
    const index = this.items.findIndex(i => i.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updateData };
      this.addActivity(`Data barang '${this.items[index].name}' diperbarui`);
      this.persist();
      return this.items[index];
    }
    return null;
  }

  deleteItem(id) {
    const item = this.getItemById(id);
    if (item) {
      this.items = this.items.filter(i => i.id !== id);
      this.addActivity(`Barang '${item.name}' dihapus dari katalog`);
      this.persist();
      return true;
    }
    return false;
  }

  // Stock Transactions
  addStock({ itemId, qty, refNo, supplier, suratJalan, notes }) {
    const item = this.getItemById(itemId);
    if (!item) throw new Error("Barang tidak ditemukan!");
    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity <= 0) throw new Error("Kuantitas tidak valid!");

    item.stock += quantity;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const dateStr = now.toISOString().split('T')[0];

    const newTx = {
      id: `tx-${Date.now()}`,
      refNo: refNo || `IN-${dateStr.replace(/-/g, '').slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`,
      time: timeStr,
      date: dateStr,
      type: "MASUK",
      itemId: item.id,
      itemName: item.name,
      qty: quantity,
      unit: item.unit,
      operator: this.currentUser.name || "Ahmad Fauzi",
      supplier: supplier || item.supplier,
      suratJalan: suratJalan || "-",
      notes: notes || "Penerimaan stok gudang"
    };

    this.transactions.unshift(newTx);
    this.addActivity(`Penerimaan +${quantity} ${item.unit} ${item.name} berhasil`);
    this.persist();
    return newTx;
  }

  removeStock({ itemId, qty, refNo, department, receiver, notes }) {
    const item = this.getItemById(itemId);
    if (!item) throw new Error("Barang tidak ditemukan!");
    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity <= 0) throw new Error("Kuantitas tidak valid!");
    
    // Safety check: Cannot withdraw more than available physical stock
    if (quantity > item.stock) {
      throw new Error(`Stok tidak mencukupi! Stok fisik saat ini: ${item.stock} ${item.unit}`);
    }

    item.stock -= quantity;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const dateStr = now.toISOString().split('T')[0];

    const newTx = {
      id: `tx-${Date.now()}`,
      refNo: refNo || `OUT-${dateStr.replace(/-/g, '').slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`,
      time: timeStr,
      date: dateStr,
      type: "KELUAR",
      itemId: item.id,
      itemName: item.name,
      qty: quantity,
      unit: item.unit,
      operator: this.currentUser.name || "Ahmad Fauzi",
      department: department || "Operasional",
      receiver: receiver || "Staf",
      notes: notes || "Pengeluaran stok logistik"
    };

    this.transactions.unshift(newTx);
    this.addActivity(`Pengeluaran -${quantity} ${item.unit} ${item.name} diverifikasi`);
    this.persist();
    return newTx;
  }

  // Transactions list
  getTransactions(limit = null) {
    if (limit) return this.transactions.slice(0, limit);
    return this.transactions;
  }

  getRecentTransactions(limit = 5) {
    return this.transactions.slice(0, limit);
  }

  // Activities
  addActivity(text) {
    this.activities.unshift({
      text,
      time: "Baru saja",
      icon: "sync"
    });
    if (this.activities.length > 20) this.activities.pop();
  }

  getActivities() {
    return this.activities;
  }

  // KPI Metrics Calculation
  getMetrics() {
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let safeCount = 0;
    let totalStockSum = 0;

    this.items.forEach(item => {
      totalStockSum += item.stock;
      if (item.stock === 0) {
        outOfStockCount++;
      } else if (item.stock <= item.minStock) {
        lowStockCount++;
      } else {
        safeCount++;
      }
    });

    return {
      totalItems: this.items.length,
      totalStock: totalStockSum,
      lowStockCount,
      outOfStockCount,
      safeCount,
      totalSuppliers: this.suppliers.length,
      safePercentage: this.items.length ? ((safeCount / this.items.length) * 100).toFixed(1) : "0",
      lowPercentage: this.items.length ? ((lowStockCount / this.items.length) * 100).toFixed(1) : "0"
    };
  }
}

export const store = new StateStore();
