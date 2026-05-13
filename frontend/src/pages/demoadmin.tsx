import {
  Building2,
  ClipboardList,
  Clock,
  UsersRound,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import { Footer } from "../components/Layout";
import ProfileSidebar from "../components/profilesidebar";

type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  role: "ngo" | "volunteer";
  is_verified: boolean;
  profile?: {
    aadhaar_number?: string;
    registration_number?: string;
  };
};

type Stats = {
  ngos: number;
  volunteers: number;
  pending_verification: number;
  opportunities: number;
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole] = useState<"all" | "ngo" | "volunteer">("all");
  const [filterStatus] = useState<"all" | "verified" | "pending">("all");
  const [stats, setStats] = useState<Stats>({
    ngos: 0,
    volunteers: 0,
    pending_verification: 0,
    opportunities: 0,
  });

  const admin = {
    name: "Admin",
    email: "admin@sevasetu.com",
    role: "admin",
  };

  // ✅ DEMO DATA
  useEffect(() => {
    setStats({
      ngos: 128,
      volunteers: 542,
      pending_verification: 23,
      opportunities: 67,
    });

    const demoUsers: RegisteredUser[] = [
      {
        id: "1",
        name: "Seva Trust",
        email: "seva@gmail.com",
        role: "ngo",
        is_verified: true,
        profile: { registration_number: "NGO123" },
      },
      {
        id: "2",
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        role: "volunteer",
        is_verified: false,
        profile: { aadhaar_number: "1234-5678-9012" },
      },
      ...Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 3}`,
        name: `User ${i + 3}`,
        email: `user${i + 3}@mail.com`,
        role: (i % 2 === 0 ? "ngo" : "volunteer") as RegisteredUser["role"],
        is_verified: i % 3 === 0,
        profile:
          i % 2 === 0
            ? { registration_number: `NGO${100 + i}` }
            : { aadhaar_number: `0000-0000-${1000 + i}` },
      })),
    ];

    setUsers(demoUsers);
  }, []);

  // ✅ LOCAL UPDATE (no backend)
  function updateUser(id: string, is_verified: boolean) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, is_verified } : u
      )
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" ? user.is_verified : !user.is_verified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const cards = [
    { 
      title: "NGO Users", 
      value: stats.ngos, 
      icon: Building2,
      color: "from-green-700 to-green-800",
      bgColor: "bg-gradient-to-br",
      trend: "+12%",
    },
    { 
      title: "Volunteers", 
      value: stats.volunteers, 
      icon: UsersRound,
      color: "from-green-600 to-green-700",
      bgColor: "bg-gradient-to-br",
      trend: "+8%",
    },
    {
      title: "Pending Verification",
      value: stats.pending_verification,
      icon: Clock,
      color: "from-amber-600 to-orange-700",
      bgColor: "bg-gradient-to-br",
      trend: stats.pending_verification > 0 ? "Needs attention" : "All clear",
    },
    {
      title: "Opportunities",
      value: stats.opportunities,
      icon: ClipboardList,
      color: "from-green-800 to-emerald-900",
      bgColor: "bg-gradient-to-br",
      trend: "+5",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <DashboardHeader user={admin} title="Admin Dashboard" />

      <ProfileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={admin}
      />

      <main className="flex-1 px-6 py-8">

        {/* Demo Label */}
        <p className="text-sm text-gray-500 mb-4">
          ⚠️ Demo Dashboard (Sample Data)
        </p>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-green-200"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgColor} ${card.color} opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative z-10">
                  <div className={`inline-flex rounded-xl ${card.bgColor} ${card.color} p-3 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {card.title}
                  </p>
                  <div className="flex items-baseline justify-between mt-2">
                    <h2 className="text-4xl font-black text-gray-800">
                      {card.value}
                    </h2>
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      {card.trend}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border-2 border-green-300 bg-white shadow-xl overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b-2 border-green-200 bg-gradient-to-r from-green-50 to-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-green-700" />
                Registered Users
              </h2>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border-2 border-green-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Scrollable Table */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-green-50">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="py-4 px-6">{u.name}</td>
                    <td className="py-4 px-6">{u.role}</td>
                    <td className="py-4 px-6">
                      {u.role === "ngo"
                        ? u.profile?.registration_number
                        : u.profile?.aadhaar_number}
                    </td>
                    <td className="py-4 px-6">{u.email}</td>
                    <td className="py-4 px-6">
                      {u.is_verified ? "Active" : "Pending"}
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      <button onClick={() => updateUser(u.id, true)} className="text-green-600">
                        Approve
                      </button>
                      <button onClick={() => updateUser(u.id, false)} className="text-red-600">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}