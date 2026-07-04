import axios from 'axios'

const SUPABASE_URL = "https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1"
const API_URL = `${SUPABASE_URL}/users_profile`
const API_KEY = "sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

// ── Helper: generate ID Pelanggan unik ─────────────────────────────────────────
const generateCustomerId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    return `NST-${rand}`
}

export const userAPI = {
    async fetchUsers() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    /**
     * Buat user baru di tabel users_profile.
     * Return: object user yang baru dibuat (dengan id-nya).
     */
    async createUser(data) {
        const response = await axios.post(API_URL, data, {
            headers: { ...headers, Prefer: "return=representation" }
        })
        return response.data
    },

    async login(email, password) {
        const response = await axios.get(`${API_URL}?email=eq.${email}&password=eq.${password}`, { headers })
        return response.data
    },

    async updateUser(id, data) {
        await axios.patch(
            `${API_URL}?id=eq.${id}`,
            data,
            { headers }
        )
    },

    async deleteUser(id) {
        await axios.delete(
            `${API_URL}?id=eq.${id}`,
            { headers }
        )
    },

    /**
     * Buat baris profil member di tabel public.customer.
     * Dipanggil otomatis setelah createUser sukses.
     *
     * @param {object} param
     * @param {number} param.userProfileId  - id dari tabel users_profile
     * @param {string} param.namaDepan
     * @param {string} param.namaBelakang
     * @param {string} param.email
     */
    async createCustomerProfile({ userProfileId, namaDepan, namaBelakang, email }) {
        const payload = {
            "ID Pelanggan":                     generateCustomerId(),
            "Nama Lengkap":                     `${namaDepan} ${namaBelakang}`.trim(),
            "Email":                            email,
            "Status Member":                    "Regular",
            "Status Keanggotaan":               "Aktif",
            "Total Poin Saat Ini":              0,
            "Total Poin yang Sudah Ditukar":    0,
            "Total Transaksi":                  0,
            "Total Belanja Keseluruhan (Rp)":   0,
            "user_profile_id":                  userProfileId,
        }
        const response = await axios.post(
            `${SUPABASE_URL}/customer`,
            payload,
            { headers: { ...headers, Prefer: "return=representation" } }
        )
        return response.data
    },

    /**
     * Ambil data customer (poin, tier, status) berdasarkan user_profile_id.
     * Dipakai saat login untuk sync state userProfile.
     */
    async fetchCustomerByProfileId(userProfileId) {
        if (!userProfileId) return null
        try {
            const response = await axios.get(
                `${SUPABASE_URL}/customer?user_profile_id=eq.${userProfileId}&select=*&limit=1`,
                { headers }
            )
            return response.data[0] ?? null
        } catch {
            return null
        }
    },

    /**
     * Tambah poin ke customer via Supabase RPC (POST /rpc/) — aman dari CORS.
     * RPC dipanggil dari Orders.jsx saat status pesanan → Selesai.
     * @param {string} idPelanggan  - contoh: 'NST-ABCDEF'
     * @param {number} tambahPoin   - jumlah poin (bisa negatif untuk rollback)
     */
    async tambahPoinCustomer(idPelanggan, tambahPoin) {
        if (!idPelanggan || tambahPoin === 0) return

        // GET: ambil user_profile_id dari ID Pelanggan
        const res = await axios.get(
            `${SUPABASE_URL}/customer?%22ID%20Pelanggan%22=eq.${encodeURIComponent(idPelanggan)}&select=user_profile_id&limit=1`,
            { headers }
        )
        const userProfileId = res.data[0]?.user_profile_id
        if (!userProfileId) return

        // POST ke RPC — tidak kena CORS preflight seperti PATCH
        await axios.post(
            `${SUPABASE_URL}/rpc/tambah_poin`,
            { p_user_profile_id: userProfileId, p_poin: tambahPoin },
            { headers }
        )
    },

    /**
     * Kurangi poin customer via Supabase RPC (POST /rpc/) — aman dari CORS.
     * Dipanggil saat user menukar reward.
     * @param {number} userProfileId  - id dari tabel users_profile
     * @param {number} poinDitukar    - jumlah poin yang dikurangi
     */
    async kurangiPoinCustomer(userProfileId, poinDitukar) {
        if (!userProfileId || poinDitukar <= 0) return

        // Validasi: cek apakah customer punya cukup poin
        const res = await axios.get(
            `${SUPABASE_URL}/customer?user_profile_id=eq.${userProfileId}&select=Total%20Poin%20Saat%20Ini&limit=1`,
            { headers }
        )
        const customer = res.data[0]
        if (!customer) throw new Error('Data customer tidak ditemukan di database.')

        const poinSekarang = customer['Total Poin Saat Ini'] ?? 0
        if (poinSekarang < poinDitukar) throw new Error('Poin tidak mencukupi.')

        // POST ke RPC — tidak kena CORS preflight seperti PATCH
        await axios.post(
            `${SUPABASE_URL}/rpc/kurangi_poin`,
            { p_user_profile_id: userProfileId, p_poin: poinDitukar },
            { headers }
        )
    },
}
