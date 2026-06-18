import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import NotFound from "./pages/NotFound";

// ── Layouts ──────────────────────────────────────────
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const UserLayout  = lazy(() => import("./layouts/UserLayout"));
const AuthLayout  = lazy(() => import("./layouts/AuthLayout"));

// ── Halaman Admin / User ──────────────────────────────
const AdminDashboard  = lazy(() => import("./pages/AdminDashboard"));
const UserDashboard   = lazy(() => import("./pages/UserDashboard"));
const Inventory       = lazy(() => import("./pages/Inventory"));
const InventoryDetail = lazy(() => import("./pages/InventoryDetail"));
const Customers       = lazy(() => import("./pages/Customers"));
const Analytics       = lazy(() => import("./pages/Analytics"));
const Schedule        = lazy(() => import("./pages/Schedule"));
const Orders          = lazy(() => import("./pages/Orders"));
const Reviews         = lazy(() => import("./pages/Reviews"));
const ErrorPage       = lazy(() => import("./pages/ErrorPage"));
const Users           = lazy(() => import("./pages/Users"));

// ── Halaman Auth ──────────────────────────────────────
const Login    = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot   = lazy(() => import("./pages/auth/Forgot"));

// Komponen Helper untuk memproteksi halaman Admin (hanya bisa diakses role admin)
const AdminRoute = ({ children, isAdmin }) => {
  return isAdmin ? children : <Navigate to="/" replace />;
};

export default function App() {
  // Cek apakah ada token di localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Cek role user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = isAuthenticated && user.role === "admin";

  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ── Grup Auth ── */}
        {/* Jika sudah login, user tidak boleh ke halaman login lagi, lempar ke dashboard (/) */}
        <Route element={!isAuthenticated ? <AuthLayout /> : <Navigate to="/" replace />}>
          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />}   />
        </Route>

        {/* ── Grup Admin / User (PROTECTED) ── */}
        {/* Jika BELUM login, lempar paksa ke /login */}
        <Route element={isAuthenticated ? (isAdmin ? <AdminLayout /> : <UserLayout />) : <Navigate to="/login" replace />}>
          <Route path="/"              element={isAdmin ? <AdminDashboard /> : <UserDashboard />}       />
          
          {/* Halaman-halaman khusus Admin */}
          <Route path="/orders"        element={<AdminRoute isAdmin={isAdmin}><Orders /></AdminRoute>}          />
          <Route path="/inventory"     element={<AdminRoute isAdmin={isAdmin}><Inventory /></AdminRoute>}       />
          <Route path="/inventory/:id" element={<AdminRoute isAdmin={isAdmin}><InventoryDetail /></AdminRoute>} />
          <Route path="/customers"     element={<AdminRoute isAdmin={isAdmin}><Customers /></AdminRoute>}       />
          <Route path="/analytics"     element={<AdminRoute isAdmin={isAdmin}><Analytics /></AdminRoute>}       />
          <Route path="/schedule"      element={<AdminRoute isAdmin={isAdmin}><Schedule /></AdminRoute>}        />
          <Route path="/reviews"       element={<AdminRoute isAdmin={isAdmin}><Reviews /></AdminRoute>}         />
          <Route path="/karyawan"      element={<AdminRoute isAdmin={isAdmin}><Users /></AdminRoute>}           />
          <Route path="/users"         element={<AdminRoute isAdmin={isAdmin}><Users /></AdminRoute>}           />

          {/* ── Halaman Error ── */}
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