import {
  Building2,
  ClipboardList,
  Clock,
  UsersRound,
  TrendingUp,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Filter,
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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "ngo" | "volunteer">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending">("all");
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

  async function loadStats() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/auth/admin/stats/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setStats(data);
  }

  async function loadUsers() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/auth/admin/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUsers(data.users || []);
  }

  async function updateUser(id: string, is_verified: boolean) {
    const token = localStorage.getItem("token");

    await fetch(`${API_BASE_URL}/auth/admin/verify-user/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_verified }),
    });

    loadUsers();
    loadStats();
  }

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
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

        {/* Users Table Section */}
        <div className="rounded-2xl border-2 border-green-300 bg-white shadow-xl overflow-hidden">
          {/* Table Header with Filters */}
          <div className="px-6 py-5 border-b-2 border-green-200 bg-gradient-to-r from-green-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <UsersRound className="h-5 w-5 text-green-700" />
                  Registered Users
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and verify user accounts
                </p>
              </div>
              
              <div className="flex gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white text-sm w-64"
                  />
                </div>
                
                {/* Role Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="px-3 py-2 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="ngo">NGO Only</option>
                  <option value="volunteer">Volunteers Only</option>
                </select>
                
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-green-50 border-b-2 border-green-200">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">ID/Registration</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-green-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <UsersRound className="h-12 w-12 text-gray-300" />
                        <p className="font-semibold text-gray-500">
                          No registered users found
                        </p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, index) => (
                    <tr 
                      key={u.id} 
                      className="hover:bg-green-50/50 transition-colors duration-150 group border-b border-green-100"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-700 to-emerald-800 flex items-center justify-center text-white font-bold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {u.role === "ngo" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                            <Building2 className="h-3 w-3" />
                            NGO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            <UsersRound className="h-3 w-3" />
                            Volunteer
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-green-200">
                          {u.role === "ngo"
                            ? u.profile?.registration_number || "N/A"
                            : u.profile?.aadhaar_number || "N/A"}
                        </code>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{u.email}</td>
                      <td className="py-4 px-6">
                        {u.is_verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateUser(u.id, true)}
                            disabled={u.is_verified}
                            className={`
                              inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200
                              ${u.is_verified
                                ? "cursor-not-allowed bg-green-100 text-green-500"
                                : "bg-green-700 text-white hover:bg-green-800 hover:shadow-lg transform hover:-translate-y-0.5"
                              }
                            `}
                          >
                            <CheckCircle className="h-4 w-4" />
                            {u.is_verified ? "Approved" : "Approve"}
                          </button>

                          <button
                            onClick={() => updateUser(u.id, false)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t-2 border-green-200 bg-green-50">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-700">
                  Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{users.length}</span> users
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-white border-2 border-green-300 rounded-lg hover:bg-green-100 transition-colors text-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}