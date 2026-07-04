import axios from 'axios'

// ── Konfigurasi Supabase ──────────────────────────────────────────────────────
const SUPABASE_URL = "https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1"
const API_KEY      = "sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ"
const STORAGE_URL  = "https://jnavjwdglqkrazwcklbj.supabase.co/storage/v1/object/public/produk-images"

const headers = {
    apikey:         API_KEY,
    Authorization:  `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Generate URL publik gambar dari Supabase Storage.
 * Kolom "Foto Produk" bisa berisi:
 *   - URL lengkap (http...)  → pakai langsung
 *   - Nama file (misal: "Kalung Choker.png") → gabung ke STORAGE_URL
 */
export const getProdukImageUrl = (fotoProduk) => {
    if (!fotoProduk) return null
    if (fotoProduk.startsWith('http')) return fotoProduk
    return `${STORAGE_URL}/${encodeURIComponent(fotoProduk)}`
}

/**
 * Normalise row mentah dari tabel `produk`.
 * Nama kolom DB (persis):
 *   "ID Produk", "Nama Produk", "Kategori Produk",
 *   "Material", "Stok Tersedia", "Foto Produk", "Harga (Rp)"
 */
export const normaliseProduk = (p) => {
    const stok = p['Stok Tersedia'] ?? 0
    return {
        id:       p['ID Produk']       ?? '',
        name:     p['Nama Produk']     ?? '',
        kategori: p['Kategori Produk'] ?? '',
        material: p['Material']        ?? null,
        harga:    p['Harga (Rp)']      ?? 0,
        stock:    stok,
        terjual:  p['Terjual']         ?? 0,
        gambar:   p['Foto Produk']     ?? null,
        status:   stok === 0 ? 'Habis' : stok <= 8 ? 'Hampir Habis' : 'Aman',
    }
}

// ── API Functions ─────────────────────────────────────────────────────────────

export const produkAPI = {

    /** Ambil semua produk dari tabel public.produk (sudah dinormalisasi) */
    async fetchAllProduk() {
        const res = await axios.get(
            `${SUPABASE_URL}/produk?select=*`,
            { headers }
        )
        return res.data.map(normaliseProduk)
    },

    /** Ambil semua produk dalam bentuk raw (belum dinormalisasi) — untuk Orders.jsx */
    async fetchAllProdukRaw() {
        const res = await axios.get(
            `${SUPABASE_URL}/produk?select=*`,
            { headers }
        )
        return res.data
    },

    /** Ambil satu produk by ID */
    async fetchProdukById(idProduk) {
        const res = await axios.get(
            `${SUPABASE_URL}/produk?ID%20Produk=eq.${encodeURIComponent(idProduk)}&select=*`,
            { headers }
        )
        const row = res.data[0] ?? null
        return row ? normaliseProduk(row) : null
    },

    /**
     * Ambil persentase_diskon dari tabel crm_tier_config
     * sesuai nama_tier (misal: 'Silver', 'Gold', 'Platinum').
     * Regular tidak ada di tabel → return 0.
     */
    async fetchDiskonByTier(namaTier) {
        if (!namaTier || namaTier === 'Regular') return 0
        try {
            const res = await axios.get(
                `${SUPABASE_URL}/crm_tier_config?nama_tier=eq.${encodeURIComponent(namaTier)}&select=persentase_diskon`,
                { headers }
            )
            let persen = Number(res.data[0]?.persentase_diskon ?? 0)
            if (persen === 0) {
                if (namaTier === 'Silver') persen = 2;
                else if (namaTier === 'Gold') persen = 5;
                else if (namaTier === 'Platinum') persen = 10;
            }
            console.log(`[produkAPI] fetchDiskonByTier("${namaTier}") →`, res.data, `→ ${persen}%`)
            return persen
        } catch (err) {
            console.warn(`[produkAPI] fetchDiskonByTier gagal:`, err?.message)
            if (namaTier === 'Silver') return 2;
            if (namaTier === 'Gold') return 5;
            if (namaTier === 'Platinum') return 10;
            return 0
        }
    },

    /**
     * Ambil "Status Keanggotaan" customer dari tabel customer
     * berdasarkan user_profile_id (FK ke users_profile.id).
     */
    async fetchCustomerTier(userProfileId) {
        if (!userProfileId) return null
        try {
            const res = await axios.get(
                `${SUPABASE_URL}/customer?user_profile_id=eq.${userProfileId}&select=Status%20Keanggotaan`,
                { headers }
            )
            return res.data[0]?.['Status Keanggotaan'] ?? null
        } catch {
            return null
        }
    },

    /**
     * Kurangi stok produk saat pesanan selesai.
     * Ambil stok saat ini → validasi → PATCH dengan nilai absolut.
     * Throw error jika stok tidak mencukupi.
     *
     * @param {string} idProduk  - contoh: 'PRD-001'
     * @param {number} qty       - jumlah yang dikurangi
     */
    async kurangiStok(idProduk, qty) {
        if (!idProduk || qty <= 0) return

        // 1. Ambil stok saat ini
        const fetchUrl = `${SUPABASE_URL}/produk`
            + `?%22ID%20Produk%22=eq.${encodeURIComponent(idProduk)}`
            + `&select=%22Stok%20Tersedia%22`
        const fetchRes = await axios.get(fetchUrl, { headers })
        const row = fetchRes.data[0]
        if (!row) throw new Error(`Produk ${idProduk} tidak ditemukan.`)

        const stokSekarang = Number(row['Stok Tersedia'] ?? 0)

        // 2. Validasi: tidak boleh jadi negatif
        if (stokSekarang < qty) {
            throw new Error(
                `Stok produk tidak mencukupi (tersedia: ${stokSekarang}, dibutuhkan: ${qty}). ` +
                `Status tidak diubah.`
            )
        }

        // 3. PATCH dengan nilai absolut baru
        const patchUrl = `${SUPABASE_URL}/produk`
            + `?%22ID%20Produk%22=eq.${encodeURIComponent(idProduk)}`
        await axios.patch(
            patchUrl,
            { 'Stok Tersedia': stokSekarang - qty },
            { headers: { ...headers, Prefer: 'return=minimal' } }
        )
    },

    /**
     * Kembalikan stok produk saat pesanan dibatalkan / refund
     * (hanya dipanggil jika status sebelumnya adalah 'Selesai').
     *
     * @param {string} idProduk  - contoh: 'PRD-001'
     * @param {number} qty       - jumlah yang dikembalikan
     */
    async kembalikanStok(idProduk, qty) {
        if (!idProduk || qty <= 0) return

        // 1. Ambil stok saat ini
        const fetchUrl = `${SUPABASE_URL}/produk`
            + `?%22ID%20Produk%22=eq.${encodeURIComponent(idProduk)}`
            + `&select=%22Stok%20Tersedia%22`
        const fetchRes = await axios.get(fetchUrl, { headers })
        const row = fetchRes.data[0]
        if (!row) return // produk tidak ditemukan, lewati saja

        const stokSekarang = Number(row['Stok Tersedia'] ?? 0)

        // 2. PATCH dengan nilai absolut (stok + qty yang dikembalikan)
        const patchUrl = `${SUPABASE_URL}/produk`
            + `?%22ID%20Produk%22=eq.${encodeURIComponent(idProduk)}`
        await axios.patch(
            patchUrl,
            { 'Stok Tersedia': stokSekarang + qty },
            { headers: { ...headers, Prefer: 'return=minimal' } }
        )
    },

    /**
     * Upload gambar produk ke Supabase Storage via REST API (axios).
     * @param {File} file - File object dari input[type=file]
     * @returns {string} nama file yang tersimpan di bucket
     */
    async uploadGambarProduk(file) {
        if (!file) return null
        const ext  = file.name.split('.').pop()
        const nama = `produk_${Date.now()}.${ext}`
        const uploadUrl = `https://jnavjwdglqkrazwcklbj.supabase.co/storage/v1/object/produk-images/${encodeURIComponent(nama)}`
        await axios.put(uploadUrl, file, {
            headers: {
                apikey:         API_KEY,
                Authorization:  `Bearer ${API_KEY}`,
                'Content-Type': file.type || 'image/jpeg',
                'x-upsert':     'true',
            },
        })
        return nama
    },

    /**
     * Generate ID produk unik dengan format PRD-XXXXXX.
     */
    _generateIdProduk() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const rand  = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        return `PRD-${rand}`
    },

    /**
     * Buat produk baru di tabel produk.
     * @param {{ name, kategori, harga, stock, gambar }} data
     * @returns {object} produk yang sudah dinormalisasi
     */
    async createProduk({ name, kategori, harga, stock, gambar }) {
        const payload = {
            'ID Produk':       this._generateIdProduk(),
            'Nama Produk':     name,
            'Kategori Produk': kategori,
            'Harga (Rp)':      Number(harga),
            'Stok Tersedia':   Number(stock),
            'Foto Produk':     gambar ?? null,
        }
        const res = await axios.post(
            `${SUPABASE_URL}/produk`,
            payload,
            { headers: { ...headers, Prefer: 'return=representation' } }
        )
        return normaliseProduk(res.data[0])
    },

    /**
     * Update data produk.
     * @param {string} idProduk
     * @param {{ name, kategori, harga, stock, gambar }} data
     */
    async updateProduk(idProduk, { name, kategori, harga, stock, gambar }) {
        const payload = {
            'Nama Produk':     name,
            'Kategori Produk': kategori,
            'Harga (Rp)':      Number(harga),
            'Stok Tersedia':   Number(stock),
        }
        if (gambar !== undefined) payload['Foto Produk'] = gambar
        await axios.patch(
            `${SUPABASE_URL}/produk?%22ID%20Produk%22=eq.${encodeURIComponent(idProduk)}`,
            payload,
            { headers: { ...headers, Prefer: 'return=minimal' } }
        )
    },

    /**
     * Hapus produk dari tabel produk.
     * @param {string} idProduk
     */
    async deleteProduk(idProduk) {
        await axios.delete(
            `${SUPABASE_URL}/produk?%22ID%20Produk%22=eq.${encodeURIComponent(idProduk)}`,
            { headers }
        )
    },
}
