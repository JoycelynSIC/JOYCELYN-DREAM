/**
 * dashboardAPI.js — Na_store.id
 * Query agregat untuk AdminDashboard & Analytics.
 * Semua data real dari Supabase (axios, tanpa supabase.js).
 */
import axios from 'axios'

const BASE    = 'https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1'
const API_KEY = 'sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ'
const H       = { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` }
const HC      = { ...H, Prefer: 'count=exact' }

const get = (path, extraHeaders = {}) =>
  axios.get(`${BASE}${path}`, { headers: { ...H, ...extraHeaders } }).then(r => r.data)

const countOf = async (table, filter = '') => {
  const url = `${BASE}/${table}?select=count${filter ? '&' + filter : ''}`
  const r   = await axios.get(url, { headers: HC })
  return parseInt((r.headers['content-range'] ?? '').split('/')[1] ?? '0') || 0
}

// Urutan bulan Indonesia
const BULAN_IDX = {
  Januari:1, Februari:2, Maret:3, April:4, Mei:5, Juni:6,
  Juli:7, Agustus:8, September:9, Oktober:10, November:11, Desember:12,
}
const sortBulan = (arr) => [...arr].sort((a,b) => (BULAN_IDX[a.bulan]??99) - (BULAN_IDX[b.bulan]??99))

// ─────────────────────────────────────────────────────────────────────────────

export const dashboardAPI = {

  // ── Tahun yang tersedia di data transaksi ────────────────────────────────────
  async fetchAvailableYears() {
    const rows = await get('/transaksi?select=Tahun&order=Tahun.asc')
    const years = [...new Set(rows.map(r => r['Tahun']).filter(Boolean))].sort()
    return years
  },

  // ── Stat cards utama ─────────────────────────────────────────────────────────
  async fetchStatCards() {
    const [totalCustomer, totalProduk, totalTrx, trxProses, stokHabis, allTrx] = await Promise.all([
      countOf('customer'),
      countOf('produk'),
      countOf('transaksi'),
      countOf('transaksi', '%22Status%20Transaksi%22=eq.Diproses'),
      countOf('produk', '%22Stok%20Tersedia%22=eq.0'),
      get('/transaksi?%22Status%20Transaksi%22=eq.Selesai&select=%22Total%20Bayar%20(Rp)%22,%22Diskon%20(Rp)%22,%22Qty%22'),
    ])
    const totalOmzet    = allTrx.reduce((s,r) => s + (r['Total Bayar (Rp)'] ?? 0), 0)
    const totalDiskon   = allTrx.reduce((s,r) => s + (r['Diskon (Rp)'] ?? 0), 0)
    const totalUnit     = allTrx.reduce((s,r) => s + (r['Qty'] ?? 0), 0)
    const avgOrderValue = allTrx.length > 0 ? Math.round(totalOmzet / allTrx.length) : 0

    return { totalCustomer, totalProduk, totalTrx, trxProses, stokHabis,
             totalOmzet, totalDiskon, totalUnit, avgOrderValue,
             totalTrxSelesai: allTrx.length }
  },

  // ── Transaksi per bulan — satu tahun ─────────────────────────────────────────
  async fetchTrxPerBulan(tahun) {
    const rows = await get(
      `/transaksi?Tahun=eq.${tahun}&select=Bulan,%22Total%20Bayar%20(Rp)%22,%22Diskon%20(Rp)%22,%22Qty%22,%22Status%20Transaksi%22`
    )
    const map = {}
    rows.forEach(r => {
      const b = r['Bulan'] ?? 'Unknown'
      if (!map[b]) map[b] = { bulan: b, trx: 0, omzet: 0, diskon: 0, unit: 0, batal: 0 }
      map[b].trx++
      if (r['Status Transaksi'] === 'Selesai') {
        map[b].omzet  += r['Total Bayar (Rp)'] ?? 0
        map[b].diskon += r['Diskon (Rp)']       ?? 0
        map[b].unit   += r['Qty']               ?? 0
      }
      if (r['Status Transaksi'] === 'Dibatalkan') map[b].batal++
    })
    return sortBulan(Object.values(map)).map(d => ({
      label:  d.bulan.slice(0, 3),
      bulan:  d.bulan,
      trx:    d.trx,
      omzet:  d.omzet,
      diskon: d.diskon,
      unit:   d.unit,
      batal:  d.batal,
      avg:    d.trx > 0 ? Math.round(d.omzet / (d.trx - d.batal || 1)) : 0,
    }))
  },

  // ── Transaksi per tahun (ringkasan untuk perbandingan) ───────────────────────
  async fetchTrxPerTahun(years) {
    const results = await Promise.all(
      years.map(async y => {
        const rows = await get(
          `/transaksi?Tahun=eq.${y}&select=%22Total%20Bayar%20(Rp)%22,%22Qty%22,%22Status%20Transaksi%22`
        )
        const selesai = rows.filter(r => r['Status Transaksi'] === 'Selesai')
        return {
          label:  String(y),
          tahun:  y,
          trx:    rows.length,
          omzet:  selesai.reduce((s,r) => s + (r['Total Bayar (Rp)'] ?? 0), 0),
          unit:   selesai.reduce((s,r) => s + (r['Qty'] ?? 0), 0),
          batal:  rows.filter(r => r['Status Transaksi'] === 'Dibatalkan').length,
        }
      })
    )
    return results
  },

  // ── Perbandingan YoY dua tahun berturut ──────────────────────────────────────
  async fetchYoYComparison(yearA, yearB) {
    const [a, b] = await Promise.all([
      this.fetchTrxPerBulan(yearA),
      this.fetchTrxPerBulan(yearB),
    ])
    // Gabung per bulan
    const allBulan = [...new Set([...a.map(d=>d.bulan), ...b.map(d=>d.bulan)])]
    return sortBulan(allBulan.map(bln => ({
      bulan:   bln,
      label:   bln.slice(0, 3),
      [`trx_${yearA}`]:   a.find(d=>d.bulan===bln)?.trx   ?? 0,
      [`trx_${yearB}`]:   b.find(d=>d.bulan===bln)?.trx   ?? 0,
      [`omzet_${yearA}`]: a.find(d=>d.bulan===bln)?.omzet ?? 0,
      [`omzet_${yearB}`]: b.find(d=>d.bulan===bln)?.omzet ?? 0,
    })))
  },

  // ── Segmentasi member ─────────────────────────────────────────────────────────
  async fetchSegmentasiMember() {
    const rows = await get('/customer?select=%22Status%20Member%22')
    const map = {}
    rows.forEach(r => { const s = r['Status Member']??'Reguler'; map[s] = (map[s]??0)+1 })
    const ORDER = ['Platinum','Gold','Silver','Reguler']
    return ORDER.filter(k => map[k]).map(k => ({ label: k, value: map[k] }))
  },

  // ── Kelompok usia ─────────────────────────────────────────────────────────────
  async fetchKelompokUsia() {
    const rows = await get('/customer?select=%22Kelompok%20Usia%22')
    const map = {}
    rows.forEach(r => {
      const k = r['Kelompok Usia']||null
      if (!k) return
      map[k] = (map[k]??0)+1
    })
    return Object.entries(map)
      .sort((a,b) => b[1]-a[1])
      .map(([fullLabel, value]) => ({
        label: fullLabel.split(' ')[0],   // "Mahasiswi", "Dewasa", "Remaja"
        fullLabel,
        value,
      }))
  },

  // ── Kategori produk terlaris (sum Terjual) ─────────────────────────────────
  async fetchKategoriTerlaris() {
    const rows = await get('/produk?select=%22Kategori%20Produk%22,Terjual,%22Harga%20(Rp)%22,%22Stok%20Tersedia%22')
    const map = {}
    rows.forEach(r => {
      const k = r['Kategori Produk']??'Lainnya'
      if (!map[k]) map[k] = { terjual: 0, omzetEst: 0, stok: 0, produkCount: 0 }
      map[k].terjual    += r['Terjual'] ?? 0
      map[k].omzetEst   += (r['Terjual']??0) * (r['Harga (Rp)']??0)
      map[k].stok       += r['Stok Tersedia'] ?? 0
      map[k].produkCount++
    })
    return Object.entries(map)
      .sort((a,b) => b[1].terjual-a[1].terjual)
      .map(([label, v]) => ({ label, value: v.terjual, ...v }))
  },

  // ── Top N produk ──────────────────────────────────────────────────────────────
  async fetchTopProduk(limit = 6) {
    const rows = await get(
      `/produk?select=%22Nama%20Produk%22,%22Kategori%20Produk%22,Terjual,%22Harga%20(Rp)%22,%22Foto%20Produk%22,%22Stok%20Tersedia%22&order=Terjual.desc&limit=${limit}`
    )
    return rows.map(r => ({
      name:     r['Nama Produk']     ?? '',
      kategori: r['Kategori Produk'] ?? '',
      terjual:  r['Terjual']         ?? 0,
      harga:    r['Harga (Rp)']      ?? 0,
      stok:     r['Stok Tersedia']   ?? 0,
      gambar:   r['Foto Produk']     ?? null,
      omzetEst: (r['Terjual']??0) * (r['Harga (Rp)']??0),
    }))
  },

  // ── Top N pelanggan ───────────────────────────────────────────────────────────
  async fetchTopPelanggan(limit = 5) {
    const rows = await get(
      `/customer?select=%22Nama%20Lengkap%22,%22Status%20Member%22,%22Total%20Poin%20Saat%20Ini%22,%22Total%20Poin%20yang%20Sudah%20Ditukar%22,%22Total%20Belanja%20Keseluruhan%20(Rp)%22,%22Total%20Transaksi%22,%22Tanggal%20Bergabung%20(Member%20Since)%22&order=%22Total%20Belanja%20Keseluruhan%20(Rp)%22.desc&limit=${limit}`
    )
    return rows.map(r => ({
      nama:           r['Nama Lengkap']                       ?? '',
      statusMember:   r['Status Member']                      ?? 'Reguler',
      poin:           r['Total Poin Saat Ini']                ?? 0,
      poinDitukar:    r['Total Poin yang Sudah Ditukar']       ?? 0,
      totalBelanja:   r['Total Belanja Keseluruhan (Rp)']      ?? 0,
      totalTrx:       r['Total Transaksi']                     ?? 0,
      bergabung:      r['Tanggal Bergabung (Member Since)']    ?? null,
    }))
  },

  // ── Metode pembayaran ─────────────────────────────────────────────────────────
  async fetchMetodePembayaran() {
    const rows = await get('/transaksi?select=%22Metode%20Pembayaran%22,%22Total%20Bayar%20(Rp)%22')
    const map = {}
    rows.forEach(r => {
      const m = r['Metode Pembayaran']||'Lainnya'
      if (!map[m]) map[m] = { count: 0, omzet: 0 }
      map[m].count++
      map[m].omzet += r['Total Bayar (Rp)'] ?? 0
    })
    return Object.entries(map)
      .sort((a,b) => b[1].count-a[1].count)
      .slice(0, 6)
      .map(([label, v]) => ({ label, value: v.count, omzet: v.omzet }))
  },

  // ── Saluran pembelian ─────────────────────────────────────────────────────────
  async fetchSaluranPembelian() {
    const rows = await get('/transaksi?select=%22Saluran%20Pembelian%22,%22Total%20Bayar%20(Rp)%22')
    const map = {}
    rows.forEach(r => {
      const s = r['Saluran Pembelian']||'Lainnya'
      if (!map[s]) map[s] = { count: 0, omzet: 0 }
      map[s].count++
      map[s].omzet += r['Total Bayar (Rp)'] ?? 0
    })
    return Object.entries(map)
      .sort((a,b) => b[1].count-a[1].count)
      .map(([label, v]) => ({ label, value: v.count, omzet: v.omzet }))
  },

  // ── 5 transaksi terbaru ───────────────────────────────────────────────────────
  async fetchTrxTerbaru(limit = 5) {
    const rows = await get(
      `/transaksi?select=%22ID%20Transaksi%22,%22Nama%20Pelanggan%22,%22Nama%20Produk%22,%22Kategori%20Produk%22,%22Total%20Bayar%20(Rp)%22,%22Poin%20Diperoleh%22,%22Metode%20Pembayaran%22,%22Status%20Transaksi%22,%22Tanggal%20Transaksi%22,Qty&order=%22ID%20Transaksi%22.desc&limit=${limit}`
    )
    return rows.map(r => ({
      id:       r['ID Transaksi']      ?? '',
      customer: r['Nama Pelanggan']    ?? '',
      produk:   r['Nama Produk']       ?? '',
      kategori: r['Kategori Produk']   ?? '',
      total:    r['Total Bayar (Rp)']  ?? 0,
      poin:     r['Poin Diperoleh']    ?? 0,
      metode:   r['Metode Pembayaran'] ?? '',
      status:   r['Status Transaksi']  ?? '',
      tanggal:  r['Tanggal Transaksi'] ?? '',
      qty:      r['Qty']               ?? 1,
    }))
  },

  // ── Kategori favorit pelanggan ────────────────────────────────────────────────
  async fetchKategoriFavoritPelanggan() {
    const rows = await get('/customer?select=%22Kategori%20Aksesoris%20Favorit%22')
    const map = {}
    rows.forEach(r => {
      const k = r['Kategori Aksesoris Favorit']||null
      if (!k) return
      map[k] = (map[k]??0)+1
    })
    return Object.entries(map)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }))
  },

  // ── Analitik CRM pelanggan ────────────────────────────────────────────────────
  async fetchCRMStats() {
    const rows = await get(
      '/customer?select=%22Total%20Poin%20Saat%20Ini%22,%22Total%20Poin%20yang%20Sudah%20Ditukar%22,%22Total%20Belanja%20Keseluruhan%20(Rp)%22,%22Total%20Transaksi%22,%22Status%20Member%22,%22Jenis%20Kelamin%22'
    )
    const totalPoinAktif   = rows.reduce((s,r) => s + (r['Total Poin Saat Ini']??0), 0)
    const totalPoinDitukar = rows.reduce((s,r) => s + (r['Total Poin yang Sudah Ditukar']??0), 0)
    const avgBelanja       = rows.length > 0
      ? Math.round(rows.reduce((s,r) => s + (r['Total Belanja Keseluruhan (Rp)']??0), 0) / rows.length)
      : 0
    const avgTrxPerCustomer = rows.length > 0
      ? +(rows.reduce((s,r) => s + (r['Total Transaksi']??0), 0) / rows.length).toFixed(1)
      : 0

    // Customer repeat (transaksi > 1)
    const repeatCustomer = rows.filter(r => (r['Total Transaksi']??0) > 1).length
    const repeatRate     = rows.length > 0 ? Math.round((repeatCustomer / rows.length) * 100) : 0

    // Gender split
    const genderMap = {}
    rows.forEach(r => {
      const g = r['Jenis Kelamin']||'Tidak Diisi'
      genderMap[g] = (genderMap[g]??0)+1
    })

    return {
      totalPoinAktif,
      totalPoinDitukar,
      avgBelanja,
      avgTrxPerCustomer,
      repeatRate,
      repeatCustomer,
      genderData: Object.entries(genderMap)
        .sort((a,b) => b[1]-a[1])
        .map(([label, value]) => ({ label, value })),
    }
  },
}
