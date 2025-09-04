import { useAuthStore } from "@/shared/stores/auth"
import { LogOut } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom";

const DashboardPage = () => {

  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const handleLogout = () => {
    useAuthStore.getState().clearToken()
    navigate(`/${lang}/login`);
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between px-6 border-b bg-black text-white h-[8vh] font-bold">
        <h1 className="text-lg">Dashboard</h1>
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Dashboard Page</p>
      </main>
    </div>
  )
}

export default DashboardPage
