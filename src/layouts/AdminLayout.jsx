import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-surface-neutral font-poppins">
      <div className="flex-none sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        <main className="flex-1 p-7">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
