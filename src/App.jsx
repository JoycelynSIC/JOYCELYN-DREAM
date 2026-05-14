import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import NotFound from "./pages/NotFound";

// ── Layouts ──────────────────────────────────────────
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AuthLayout  = lazy(() => import("./layouts/AuthLayout"));

// ── Halaman Admin ─────────────────────────────────────
const Dashboard       = lazy(() => import("./pages/Dashboard"));
const Inventory       = lazy(() => import("./pages/Inventory"));
const InventoryDetail = lazy(() => import("./pages/InventoryDetail")); // Dynamic Route
const Customers       = lazy(() => import("./pages/Customers"));
const Analytics       = lazy(() => import("./pages/Analytics"));
const Schedule        = lazy(() => import("./pages/Schedule"));
const Orders          = lazy(() => import("./pages/Orders"));
const Reviews         = lazy(() => import("./pages/Reviews"));
const ErrorPage       = lazy(() => import("./pages/ErrorPage"));

// ── Halaman Auth ──────────────────────────────────────
const Login    = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot   = lazy(() => import("./pages/auth/Forgot"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ── Grup Auth ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />}   />
        </Route>

        {/* ── Grup Admin ── */}
        <Route element={<AdminLayout />}>
          <Route path="/"               element={<Dashboard />}       />
          <Route path="/orders"         element={<Orders />}          />
          <Route path="/inventory"      element={<Inventory />}       />
          <Route path="/inventory/:id"  element={<InventoryDetail />} />
          <Route path="/customers"      element={<Customers />}       />
          <Route path="/analytics"      element={<Analytics />}       />
          <Route path="/schedule"       element={<Schedule />}        />
          <Route path="/reviews"        element={<Reviews />}         />

          {/* ── Halaman Error (Pertemuan 6) ── */}
          <Route path="/error/400" element={
            <ErrorPage kode={400} deskripsi="Permintaan tidak valid. Data yang dikirim tidak sesuai format yang diharapkan oleh sistem Na_store.id." />
          } />
          <Route path="/error/401" element={
            <ErrorPage kode={401} deskripsi="Kamu belum login atau sesi kamu telah berakhir. Silakan login kembali untuk mengakses halaman ini." />
          } />
          <Route path="/error/403" element={
            <ErrorPage kode={403} deskripsi="Akses ditolak. Kamu tidak memiliki izin untuk mengakses halaman atau fitur ini di Na_store.id." />
          } />
        </Route>

        {/* ── 404 Not Found ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
