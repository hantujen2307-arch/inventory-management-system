export const initialItems = [
  {
    id: "item-1",
    sku: "SKU-EL-001",
    name: "Monitor Dell 24\" UltraSharp",
    variant: "U2422H • IPS Display 1080p",
    category: "Elektronik",
    supplier: "PT Maju Jaya Elektrik",
    stock: 45,
    unit: "Unit",
    minStock: 15,
    location: "Gudang Sentral A (Rak B-01)",
    icon: "monitor"
  },
  {
    id: "item-2",
    sku: "SKU-EL-004",
    name: "Keyboard Logitech MX Keys",
    variant: "Wireless Illuminated Graphite",
    category: "Elektronik",
    supplier: "PT Mitra Komputer",
    stock: 4,
    unit: "Unit",
    minStock: 5,
    location: "Gudang Sentral A (Rak B-02)",
    icon: "keyboard"
  },
  {
    id: "item-3",
    sku: "SKU-EL-009",
    name: "Mouse Logitech M331 Silent",
    variant: "Plus Wireless Hitam 1000 DPI",
    category: "Elektronik",
    supplier: "PT Mitra Komputer",
    stock: 65,
    unit: "Unit",
    minStock: 15,
    location: "Gudang Sentral A (Rak B-03)",
    icon: "mouse"
  },
  {
    id: "item-4",
    sku: "SKU-AT-012",
    name: "Kertas HVS A4 80gr PaperOne",
    variant: "Segera Lakukan Pengadaan Restock",
    category: "ATK",
    supplier: "CV Graha Kertas",
    stock: 0,
    unit: "Box",
    minStock: 20,
    location: "Gudang Sentral A (Rak A-04)",
    icon: "description"
  },
  {
    id: "item-5",
    sku: "SKU-PK-021",
    name: "Kursi Ergonomis Kantor",
    variant: "Mesh Breathable Lumbar Support",
    category: "Peralatan Kantor",
    supplier: "PT Sejahtera Furniture",
    stock: 12,
    unit: "Unit",
    minStock: 5,
    location: "Gudang Logistik C (Rak C-01)",
    icon: "chair"
  },
  {
    id: "item-6",
    sku: "SKU-AT-033",
    name: "Toner Printer HP LaserJet 85A",
    variant: "CE285A Hitam Monokrom Original",
    category: "ATK",
    supplier: "CV Graha Kertas",
    stock: 2,
    unit: "Pcs",
    minStock: 10,
    location: "Gudang Sentral A (Rak A-02)",
    icon: "print"
  },
  {
    id: "item-7",
    sku: "SKU-EL-045",
    name: "Kabel HDMI 2.1 2 Meter",
    variant: "Braided 8K@60Hz 48Gbps High-Speed",
    category: "Elektronik",
    supplier: "PT Maju Jaya Elektrik",
    stock: 88,
    unit: "Unit",
    minStock: 20,
    location: "Gudang Sentral A (Rak B-05)",
    icon: "cable"
  },
  {
    id: "item-8",
    sku: "SKU-AT-018",
    name: "Tinta Epson 003 Black",
    variant: "Original Dye Ink 65ml Botol",
    category: "ATK",
    supplier: "CV Graha Kertas",
    stock: 2,
    unit: "Unit",
    minStock: 30,
    location: "Gudang Sentral A (Rak A-03)",
    icon: "ink_pen"
  },
  {
    id: "item-9",
    sku: "SKU-EL-052",
    name: "Baterai Alkaline AA 4s",
    variant: "LR6 1.5V Ultra Power Pack",
    category: "Elektronik",
    supplier: "PT Maju Jaya Elektrik",
    stock: 5,
    unit: "Pack",
    minStock: 25,
    location: "Gudang Sentral A (Rak B-06)",
    icon: "battery_charging_full"
  },
  {
    id: "item-10",
    sku: "SKU-SP-005",
    name: "SSD Samsung 980 Pro 1TB",
    variant: "NVMe M.2 PCIe 4.0 High-End",
    category: "Sparepart",
    supplier: "PT Mitra Komputer",
    stock: 18,
    unit: "Unit",
    minStock: 8,
    location: "Gudang Sparepart S (Rak S-01)",
    icon: "memory"
  }
];

export const initialTransactions = [
  {
    id: "tx-1",
    refNo: "IN-202505-0041",
    time: "10:42 WIB",
    date: "2025-05-18",
    type: "MASUK",
    itemId: "item-1",
    itemName: "Monitor Dell UltraSharp 24\"",
    qty: 15,
    unit: "Unit",
    operator: "Ahmad Fauzi",
    supplier: "PT Maju Jaya Elektrik",
    suratJalan: "SJ-MJ-2025/112",
    notes: "Pengadaan tambahan unit workstation"
  },
  {
    id: "tx-2",
    refNo: "OUT-202505-0017",
    time: "09:15 WIB",
    date: "2025-05-18",
    type: "KELUAR",
    itemId: "item-4",
    itemName: "Kertas HVS A4 80gr Rim",
    qty: 50,
    unit: "Rim",
    operator: "Budi Santoso",
    department: "Divisi Keuangan & HR",
    receiver: "Dewi Lestari",
    notes: "Distribusi kebutuhan cetak operasional"
  },
  {
    id: "tx-3",
    refNo: "IN-202505-0040",
    time: "08:50 WIB",
    date: "2025-05-18",
    type: "MASUK",
    itemId: "item-3",
    itemName: "Mouse Wireless Logitech M331",
    qty: 30,
    unit: "Unit",
    operator: "Dedi Rahmadi",
    supplier: "PT Mitra Komputer",
    suratJalan: "SJ-MK-2025/088",
    notes: "Pengadaan rutin triwulan II"
  },
  {
    id: "tx-4",
    refNo: "OUT-202505-0016",
    time: "Kemarin",
    date: "2025-05-17",
    type: "KELUAR",
    itemId: "item-6",
    itemName: "Toner Printer HP LaserJet",
    qty: 4,
    unit: "Unit",
    operator: "Ahmad Fauzi",
    department: "Divisi Operasional Gudang",
    receiver: "Rian Pratama",
    notes: "Penggantian toner printer kantor gudang"
  },
  {
    id: "tx-5",
    refNo: "IN-202505-0039",
    time: "16 Mei 2025",
    date: "2025-05-16",
    type: "MASUK",
    itemId: "item-7",
    itemName: "Kabel HDMI 2.1 Braided 2M",
    qty: 100,
    unit: "Unit",
    operator: "Siti R.",
    supplier: "PT Maju Jaya Elektrik",
    suratJalan: "SJ-MJ-2025/104",
    notes: "Restock kabel meeting room & presentasi"
  }
];

export const initialSuppliers = [
  "PT Maju Jaya Elektrik",
  "PT Mitra Komputer",
  "CV Graha Kertas",
  "PT Sejahtera Furniture",
  "CV Sentosa Teknik",
  "PT Bintang Logistik Nusantara"
];

export const initialCategories = [
  "Elektronik",
  "ATK",
  "Peralatan Kantor",
  "Sparepart"
];

export const initialActivities = [
  {
    text: "Stok Mouse Logitech diperbarui oleh Andi",
    time: "2 menit lalu",
    icon: "update"
  },
  {
    text: "Penerimaan PO #9822 selesai diproses",
    time: "18 menit lalu",
    icon: "inventory"
  },
  {
    text: "Pengeluaran Kertas HVS disetujui Budi Santoso",
    time: "1 jam lalu",
    icon: "assignment_turned_in"
  },
  {
    text: "Stok Kabel HDMI 2.1 diverifikasi QC Gudang",
    time: "3 jam lalu",
    icon: "verified"
  }
];
