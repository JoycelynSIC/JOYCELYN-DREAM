import axios from 'axios'

// ── Konfigurasi Supabase ──────────────────────────────────────────────────────
const API_URL     = "https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1/transaksi"
const RPC_URL     = "https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1/rpc"
const API_KEY     = "sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ"

const headers = {
    apikey:         API_KEY,
    Authorization:  `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Prefer":       "return=minimal",
}

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Normalise baris mentah dari Supabase ke shape yang dipakai komponen.
 *
 * Skema DDL persis (semua kolom dengan spasi & huruf besar):
 *   "ID Transaksi"       VARCHAR PK
 *   "ID Pelanggan"       VARCHAR FK → customer
 *   "Nama Pelanggan"     VARCHAR
 *   "Kelompok Usia"      VARCHAR
 *   "Status Keanggotaan" VARCHAR   ← nama resmi di tabel ini (bukan "Status Member")
 *   "Tanggal Transaksi"  VARCHAR
 *   "Bulan"              VARCHAR
 *   "Tahun"              INTEGER
 *   "ID Produk Utama"    VARCHAR FK → produk
 *   "Nama Produk"        VARCHAR
 *   "Kategori Produk"    VARCHAR
 *   "Qty"                INTEGER
 *   "Harga Satuan (Rp)"  INTEGER
 *   "Subtotal (Rp)"      INTEGER
 *   "Diskon (Rp)"        INTEGER
 *   "Total Bayar (Rp)"   INTEGER
 *   "Poin Diperoleh"     INTEGER
 *   "Metode Pembayaran"  VARCHAR
 *   "Saluran Pembelian"  VARCHAR
 *   "Status Transaksi"   VARCHAR   ← status dinamis dari DB, jangan hardcode!
 *   "Status Member"      VARCHAR   ← kolom alias/legacy, tetap dipetakan
 */
export const normaliseTransaksi = (t) => ({
    // ── Identifikasi ──────────────────────────────────────────────────────
    id:              t['ID Transaksi'],
    idPelanggan:     t['ID Pelanggan']        ?? '',
    customer:        t['Nama Pelanggan']      ?? '',
    kelompokUsia:    t['Kelompok Usia']        ?? '',

    // ── Status ────────────────────────────────────────────────────────────
    statusKeanggotaan: t['Status Keanggotaan'] ?? '',
    statusMember:      t['Status Member']      ?? '',
    // STATUS UTAMA — normalise nilai dari DB ke label display yang konsisten
    // DB: 'Diproses'   → tampil: 'Proses'
    // DB: 'Dibatalkan' → tampil: 'Batal'
    status: (() => {
        const raw = t['Status Transaksi'] ?? ''
        if (raw === 'Diproses')   return 'Proses'
        if (raw === 'Dibatalkan') return 'Batal'
        return raw   // 'Selesai', 'Dikirim', dll. tampil apa adanya
    })(),

    // ── Waktu ─────────────────────────────────────────────────────────────
    tanggal:         t['Tanggal Transaksi']   ?? '',
    bulan:           t['Bulan']               ?? '',
    tahun:           t['Tahun']               ?? null,

    // ── Produk ────────────────────────────────────────────────────────────
    idProduk:        t['ID Produk Utama']     ?? '',
    produk:          t['Nama Produk']         ?? '',
    kategoriProduk:  t['Kategori Produk']     ?? '',

    // ── Keuangan ──────────────────────────────────────────────────────────
    qty:             t['Qty']                 ?? 1,
    hargaSatuan:     t['Harga Satuan (Rp)']   ?? 0,
    subtotal:        t['Subtotal (Rp)']       ?? 0,
    diskon:          t['Diskon (Rp)']         ?? 0,
    total:           t['Total Bayar (Rp)']    ?? 0,
    poin:            t['Poin Diperoleh']      ?? 0,

    // ── Lainnya ───────────────────────────────────────────────────────────
    metode:          t['Metode Pembayaran']   ?? '',
    saluran:         t['Saluran Pembelian']   ?? '',

    // gambar tidak ada di tabel transaksi — null
    gambar:          null,
})

// ── API Functions ─────────────────────────────────────────────────────────────

export const transaksiAPI = {
    /**
     * Ambil transaksi dengan server-side pagination.
     * @param {object} opts
     * @param {number} opts.page     - halaman (1-based), default 1
     * @param {number} opts.limit    - jumlah per halaman, default 20
     * @param {string} opts.search   - filter nama/id pelanggan (opsional)
     * @param {string} opts.status   - filter status transaksi (opsional)
     * @returns {{ data: object[], total: number }}
     */
    async fetchTransaksiPaged({ page = 1, limit = 20, search = '', status = '' } = {}) {
        const offset = (page - 1) * limit
        let url = `${API_URL}?order=%22ID%20Transaksi%22.desc&limit=${limit}&offset=${offset}`

        // Filter status
        if (status && status !== 'Semua') {
            const dbStatus = status === 'Proses' ? 'Diproses'
                           : status === 'Batal'  ? 'Dibatalkan'
                           : status
            url += `&%22Status%20Transaksi%22=eq.${encodeURIComponent(dbStatus)}`
        }

        // Filter pencarian nama pelanggan
        if (search.trim()) {
            url += `&%22Nama%20Pelanggan%22=ilike.*${encodeURIComponent(search.trim())}*`
        }

        const countHeaders = { ...headers, Prefer: 'count=exact' }
        const res = await axios.get(url, { headers: countHeaders })

        // Supabase returns total count in Content-Range header: "0-19/1001"
        const contentRange = res.headers['content-range'] ?? ''
        const total = parseInt(contentRange.split('/')[1] ?? '0') || 0

        return { data: res.data, total }
    },

    /** Ambil semua transaksi sekaligus — hanya untuk keperluan export/report */
    async fetchAllTransaksi() {
        const res = await axios.get(
            `${API_URL}?order=%22ID%20Transaksi%22.desc`,
            { headers }
        )
        return res.data
    },

    /**
     * Ambil jumlah transaksi per status langsung dari DB (count=exact).
     * Dipakai untuk stat cards di halaman Orders.
     * @returns {{ total: number, selesai: number, proses: number }}
     */
    async fetchStatCounts() {
        const countHdr = { ...headers, Prefer: 'count=exact' }
        const getCount = async (extraQuery = '') => {
            const res = await axios.get(
                `${API_URL}?limit=1${extraQuery}`,
                { headers: countHdr }
            )
            const cr = res.headers['content-range'] ?? ''
            return parseInt(cr.split('/')[1] ?? '0') || 0
        }
        const [total, selesai, proses] = await Promise.all([
            getCount(),
            getCount('&%22Status%20Transaksi%22=eq.Selesai'),
            getCount('&%22Status%20Transaksi%22=eq.Diproses'),
        ])
        return { total, selesai, proses }
    },

    /**
     * Ambil transaksi milik satu pelanggan, diurutkan terbaru di atas.
     * @param {string} idPelanggan - contoh: 'CST-0001'
     */
    async fetchTransaksiByKustomer(idPelanggan) {
        const res = await axios.get(
            `${API_URL}?%22ID%20Pelanggan%22=eq.${encodeURIComponent(idPelanggan)}&order=%22ID%20Transaksi%22.desc`,
            { headers }
        )
        return res.data
    },

    /**
     * Update status transaksi di Supabase via RPC (POST) — aman dari CORS.
     * Butuh SQL function: update_status_transaksi(p_id TEXT, p_status TEXT)
     * @param {string} idTransaksi  - contoh: 'TRX-001'
     * @param {string} statusBaru   - 'Selesai' | 'Proses' | 'Batal'
     */
    async updateStatus(idTransaksi, statusBaru) {
        const dbStatus = statusBaru === 'Proses' ? 'Diproses'
                       : statusBaru === 'Batal'  ? 'Dibatalkan'
                       : statusBaru
        await axios.post(
            `${RPC_URL}/update_status_transaksi`,
            { p_id: idTransaksi, p_status: dbStatus },
            { headers }
        )
    },

    /**
     * Update poin diperoleh pada transaksi di Supabase via PATCH.
     * @param {string} idTransaksi
     * @param {number} poin
     */
    async updatePoinTransaksi(idTransaksi, poin) {
        await axios.patch(
            `${API_URL}?%22ID%20Transaksi%22=eq.${encodeURIComponent(idTransaksi)}`,
            { "Poin Diperoleh": poin },
            { headers: { ...headers, Prefer: 'return=minimal' } }
        )
    },

    /**
     * Buat transaksi baru dari keranjang user.
     * Satu panggilan per item di cart (1 row = 1 produk).
     *
     * @param {object} param
     * @param {object} param.customer       - { idPelanggan, namaLengkap, statusMember, kelompokUsia }
     * @param {object} param.item           - { product: { id, name, kategori, harga }, qty }
     * @param {number} param.hargaSatuan    - harga setelah diskon tier
     * @param {number} param.diskon         - diskon voucher proporsional untuk item ini
     * @param {number} param.totalBayar     - grand total item setelah semua diskon
     * @param {string} param.metodePembayaran
     * @param {string} param.idTransaksi    - ID unik yang sudah digenerate di client
     */
    async createTransaksi({ customer, item, hargaSatuan, diskon, totalBayar, metodePembayaran, idTransaksi }) {
        // Validasi: ID Pelanggan wajib ada (FK constraint ke tabel customer)
        if (!customer.idPelanggan) {
            throw new Error('ID Pelanggan tidak ditemukan. Pastikan akun sudah terdaftar sebagai member.')
        }

        const now     = new Date()
        const tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        const bulan   = now.toLocaleDateString('id-ID', { month: 'long' })
        const tahun   = now.getFullYear()

        const payload = {
            "ID Transaksi":       idTransaksi,
            "ID Pelanggan":       customer.idPelanggan,
            "Nama Pelanggan":     customer.namaLengkap   ?? '',
            "Kelompok Usia":      customer.kelompokUsia  ?? '',
            "Status Member":      customer.statusMember  ?? 'Reguler',
            "Tanggal Transaksi":  tanggal,
            "Bulan":              bulan,
            "Tahun":              tahun,
            "ID Produk Utama":    item.product.id        ?? '',
            "Nama Produk":        item.product.name      ?? '',
            "Kategori Produk":    item.product.kategori  ?? '',
            "Qty":                item.qty,
            "Harga Satuan (Rp)":  hargaSatuan,
            "Subtotal (Rp)":      hargaSatuan * item.qty,
            "Diskon (Rp)":        diskon,
            "Total Bayar (Rp)":   totalBayar,
            "Poin Diperoleh":     0,
            "Metode Pembayaran":  metodePembayaran,
            "Saluran Pembelian":  "Online",
            "Status Transaksi":   "Diproses",
        }

        console.log('[transaksiAPI.createTransaksi] payload:', payload);

        try {
            await axios.post(API_URL, payload, {
                headers: { ...headers, Prefer: "return=minimal" }
            })
        } catch (err) {
            // Ekstrak pesan error dari response Supabase
            const msg = err?.response?.data?.message ?? err?.message ?? 'Gagal menyimpan pesanan.'
            if (msg.includes('foreign key') || msg.includes('fkey')) {
                throw new Error('ID Pelanggan tidak valid. Coba logout dan login kembali.')
            }
            throw new Error(msg)
        }
    },

    /**
     * Generate ID Transaksi unik format TRX-XXXXXX.
     */
    _generateIdTransaksi() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const rand  = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        return `TRX-${rand}`
    },

    /**
     * Buat transaksi baru dari form admin (tanpa FK user, bisa manual).
     * @param {{ namaPelanggan, idPelanggan, produk, idProduk, kategoriProduk, qty, hargaSatuan, total, metode, status }} data
     */
    async createTransaksiAdmin({ namaPelanggan, idPelanggan, produk, idProduk, kategoriProduk, qty, hargaSatuan, total, metode, status }) {
        const now     = new Date()
        const tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        const bulan   = now.toLocaleDateString('id-ID', { month: 'long' })
        const tahun   = now.getFullYear()
        const dbStatus = status === 'Proses'  ? 'Diproses'
                       : status === 'Batal'   ? 'Dibatalkan'
                       : status

        const payload = {
            'ID Transaksi':      this._generateIdTransaksi(),
            'ID Pelanggan':      idPelanggan || null,  // null jika tidak ada, bukan string kosong
            'Nama Pelanggan':    namaPelanggan ?? '',
            'Tanggal Transaksi': tanggal,
            'Bulan':             bulan,
            'Tahun':             tahun,
            'ID Produk Utama':   idProduk      ?? '',
            'Nama Produk':       produk        ?? '',
            'Kategori Produk':   kategoriProduk ?? '',
            'Qty':               Number(qty)   || 1,
            'Harga Satuan (Rp)': Number(hargaSatuan) || 0,
            'Subtotal (Rp)':     Number(hargaSatuan) * (Number(qty) || 1),
            'Diskon (Rp)':       0,
            'Total Bayar (Rp)':  Number(total) || 0,
            'Poin Diperoleh':    0,
            'Metode Pembayaran': metode        ?? 'Transfer Bank',
            'Saluran Pembelian': 'Offline',
            'Status Transaksi':  dbStatus,
        }
        try {
            const res = await axios.post(API_URL, payload, {
                headers: { ...headers, Prefer: 'return=representation' }
            })
            return res.data[0] ? normaliseTransaksi(res.data[0]) : null
        } catch (err) {
            const msg = err?.response?.data?.message ?? err?.message ?? 'Gagal menyimpan pesanan.'
            throw new Error(msg)
        }
    },
}
