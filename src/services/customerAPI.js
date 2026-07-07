import axios from 'axios'

// ── Konfigurasi Supabase ──────────────────────────────────────────────────────
const API_URL = "https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1/customer"
const API_KEY = "sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ"

const headers = {
    apikey:         API_KEY,
    Authorization:  `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Normalise baris mentah dari Supabase ke shape yang dipakai komponen.
 *
 * Skema DDL PERSIS (sesuai CREATE TABLE):
 *   "ID Pelanggan"                    VARCHAR PK
 *   "Nama Lengkap"                    VARCHAR
 *   "Nomor HP / WhatsApp"             VARCHAR
 *   "Email"                           VARCHAR
 *   "Tanggal Lahir"                   DATE
 *   "Jenis Kelamin"                   VARCHAR
 *   "Kelompok Usia"                   VARCHAR
 *   "Foto Profil"                     VARCHAR
 *   "Alamat Lengkap"                  TEXT
 *   "Status Keanggotaan"              VARCHAR  → aktif/nonaktif
 *   "Total Poin Saat Ini"             INT      default 0
 *   "Total Poin yang Sudah Ditukar"   INT      default 0
 *   "Tanggal Bergabung (Member Since)" DATE
 *   "Total Belanja Keseluruhan (Rp)"  INT      default 0
 *   "Riwayat Belanja"                 TEXT
 *   "Tanggal Transaksi Terakhir"      DATE
 *   "Kategori Aksesoris Favorit"      VARCHAR
 *   "Warna Favorit"                   VARCHAR
 *   "Gaya Aksesoris Favorit"          VARCHAR
 *   "Material Favorit"                VARCHAR
 *   "Rentang Harga yang Sering Dibeli" VARCHAR
 *   "Ukuran Aksesoris Tertentu"       VARCHAR
 *   "Saluran Komunikasi yang Disukai" VARCHAR
 *   "Jenis Notifikasi yang Ingin Diterima" VARCHAR
 *   "Bersedia Menerima Pesan Promosi" VARCHAR
 *   "Metode Pembayaran Favorit"       VARCHAR
 *   user_profile_id                   BIGINT FK
 *   "Status Member"                   VARCHAR  → Reguler/Silver/Gold/Platinum
 *   "Total Transaksi"                 INT      default 0
 */
export const normaliseCustomer = (c) => ({
    // ── Identitas ──────────────────────────────────────────────────────────
    id:            c['ID Pelanggan'],
    name:          c['Nama Lengkap']                          ?? '',
    email:         c['Email']                                 ?? '',
    phone:         c['Nomor HP / WhatsApp']                   ?? '',
    tanggalLahir:  c['Tanggal Lahir']                         ?? null,
    jenisKelamin:  c['Jenis Kelamin']                         ?? '',
    kelompokUsia:  c['Kelompok Usia']                         ?? '',
    fotoProfil:    c['Foto Profil']                           ?? null,
    alamat:        c['Alamat Lengkap']                        ?? '',

    // ── Status ────────────────────────────────────────────────────────────
    // "Status Member"      = tier: Reguler / Silver / Gold / Platinum
    member:        c['Status Member']                         ?? 'Reguler',
    // "Status Keanggotaan" = kondisi akun: Aktif / Tidak Aktif / dll.
    status:        c['Status Keanggotaan']                    ?? 'Aktif',

    // ── Statistik (pastikan angka, minimum 0) ─────────────────────────────
    poin:          Math.max(0, Number(c['Total Poin Saat Ini']              ?? 0)),
    poinDitukar:   Math.max(0, Number(c['Total Poin yang Sudah Ditukar']    ?? 0)),
    totalBelanja:  Math.max(0, Number(c['Total Belanja Keseluruhan (Rp)']   ?? 0)),
    transaksi:     Math.max(0, Number(c['Total Transaksi']                  ?? 0)),

    // ── Tanggal ───────────────────────────────────────────────────────────
    bergabung:         c['Tanggal Bergabung (Member Since)']  ?? '',
    transaksiTerakhir: c['Tanggal Transaksi Terakhir']        ?? null,

    // ── Preferensi ────────────────────────────────────────────────────────
    favKategori:      c['Kategori Aksesoris Favorit']         ?? '',
    favWarna:         c['Warna Favorit']                      ?? '',
    favGaya:          c['Gaya Aksesoris Favorit']             ?? '',
    favMaterial:      c['Material Favorit']                   ?? '',
    rentangHarga:     c['Rentang Harga yang Sering Dibeli']   ?? '',
    ukuran:           c['Ukuran Aksesoris Tertentu']          ?? '',

    // ── Komunikasi ────────────────────────────────────────────────────────
    saluranKomunikasi:  c['Saluran Komunikasi yang Disukai']       ?? '',
    jenisNotifikasi:    c['Jenis Notifikasi yang Ingin Diterima']   ?? '',
    bersediaPromosi:    c['Bersedia Menerima Pesan Promosi']        ?? '',
    metodePembayaran:   c['Metode Pembayaran Favorit']             ?? '',
    riwayatBelanja:     c['Riwayat Belanja']                       ?? '',

    // ── Relasi ────────────────────────────────────────────────────────────
    userProfileId: c.user_profile_id ?? null,
})

// ── API Functions ─────────────────────────────────────────────────────────────

export const customerAPI = {
    /** Ambil semua customer. */
    async fetchAllCustomers() {
        const res = await axios.get(API_URL, { headers })
        return res.data
    },

    /**
     * Ambil customer berdasarkan user_profile_id (FK ke users_profile.id).
     * @param {string|number} userProfileId
     */
    async fetchCustomerByUserId(userProfileId) {
        const res = await axios.get(
            `${API_URL}?user_profile_id=eq.${userProfileId}`,
            { headers }
        )
        return res.data
    },

    /**
     * Generate ID pelanggan unik format CST-XXXXXX.
     */
    _generateIdPelanggan() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const rand  = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        return `CST-${rand}`
    },

    /**
     * Buat pelanggan baru di tabel customer.
     * @param {{ name, email, phone, member, status }} data
     * @returns {object} customer yang sudah dinormalisasi
     */
    async createCustomer({ name, email, phone, member, status }) {
        const today = new Date().toISOString().split('T')[0]
        const payload = {
            'ID Pelanggan':                     this._generateIdPelanggan(),
            'Nama Lengkap':                     name,
            'Email':                            email,
            'Nomor HP / WhatsApp':             phone ?? '',
            'Status Member':                    member ?? 'Reguler',
            'Status Keanggotaan':               status ?? 'Aktif',
            'Total Poin Saat Ini':              0,
            'Total Poin yang Sudah Ditukar':    0,
            'Total Transaksi':                  0,
            'Total Belanja Keseluruhan (Rp)':   0,
            'Tanggal Bergabung (Member Since)': today,
        }
        const res = await axios.post(
            API_URL,
            payload,
            { headers: { ...headers, Prefer: 'return=representation' } }
        )
        return normaliseCustomer(res.data[0])
    },

    /**
     * Update data pelanggan.
     * @param {string} idPelanggan - contoh: 'CST-ABCDEF'
     * @param {{ name, email, phone, member, status }} data
     */
    async updateCustomer(idPelanggan, { name, email, phone, member, status }) {
        const payload = {
            'Nama Lengkap':          name,
            'Email':                 email,
            'Nomor HP / WhatsApp':  phone ?? '',
            'Status Member':         member,
            'Status Keanggotaan':    status,
        }
        await axios.patch(
            `${API_URL}?%22ID%20Pelanggan%22=eq.${encodeURIComponent(idPelanggan)}`,
            payload,
            { headers: { ...headers, Prefer: 'return=minimal' } }
        )
    },

    /**
     * Search customer by name (autocomplete).
     * @param {string} query - nama pelanggan (partial match)
     * @param {number} limit - max hasil
     * @returns {Promise<Array>} daftar customer yang match
     */
    async searchCustomerByName(query, limit = 10) {
        if (!query || query.trim().length < 2) return [];
        const res = await axios.get(
            `${API_URL}?%22Nama%20Lengkap%22=ilike.*${encodeURIComponent(query)}*&select=*&limit=${limit}`,
            { headers }
        );
        return res.data.map(normaliseCustomer);
    },

    /**
     * Hapus pelanggan dari tabel customer.
     * @param {string} idPelanggan
     */
    async deleteCustomer(idPelanggan) {
        await axios.delete(
            `${API_URL}?%22ID%20Pelanggan%22=eq.${encodeURIComponent(idPelanggan)}`,
            { headers }
        )
    },
}
