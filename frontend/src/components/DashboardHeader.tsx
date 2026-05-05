import { HeartHandshake, UserRound, Search} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProfileSidebar from "./profilesidebar";

type DashboardHeaderProps = {
  user: {
    name: string;
    email?: string;
    role?: string;
  };
  title?: string;
};

export default function DashboardHeader({
  user,
  title = "Dashboard",
}: DashboardHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-leaf-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">

  {/* LEFT - LOGO */}
  <Link to="/" className="flex items-center gap-3">
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-600 text-white">
      <HeartHandshake size={24} />
    </span>

    <span>
      <span className="block text-xl font-black text-leaf-900">
        SevaSetu
      </span>
      <span className="block text-xs font-semibold uppercase tracking-wider text-leaf-600">
        {title}
      </span>
    </span>
  </Link>

  {/* CENTER - SEARCH BOX */}
  <div className="flex-1 max-w-xl">
    <div className="flex items-center rounded-full border border-gray-300 bg-gray-100 px-4 py-2">
      <Search className="text-gray-500 mr-2" size={18} />
      <input
        type="text"
        placeholder="Search Opportunities"
        className="w-full bg-transparent outline-none text-sm"
      />
    </div>
  </div>

  {/* RIGHT - USER */}
  <div className="flex items-center gap-3">
    <span className="text-lg font-black text-leaf-900">
      {user.name}
    </span>

    <button
      onClick={() => setSidebarOpen(true)}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-leaf-200 bg-leaf-50 text-leaf-700 hover:bg-leaf-100"
    >
      <UserRound size={24} />
    </button>
  </div>

</div>
      </header>

      <ProfileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
    </>
  );
}