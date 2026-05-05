import { useState } from "react";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:8000/api/auth/change-password/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      }
    );

    const data = await res.json(); // 👈 IMPORTANT

    if (!res.ok) {
      throw new Error(data.detail); // 👈 show backend error
    }

    alert("✅ Password changed successfully");

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err: any) {
    alert(err.message || "Error changing password");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card with enhanced styling */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header with gradient accent */}
          <div className="relative bg-gradient-to-r from-leaf-600 to-leaf-500 px-6 py-5">
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2.5">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Change Password</h2>
                <p className="mt-0.5 text-sm text-white/80">
                  Secure your account with a new password
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Old Password Field */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Old Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-10 py-2.5 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-400/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Create a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-10 py-2.5 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-400/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Use at least 6 characters with letters and numbers
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-10 py-2.5 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-400/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-leaf-600 to-leaf-500 hover:from-leaf-700 hover:to-leaf-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              Change Password
            </button>

            {/* Security Note */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-leaf-50 p-3">
              <Shield className="h-3.5 w-3.5 text-leaf-600" />
              <p className="text-xs text-leaf-700">
                Your password is encrypted and securely stored
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}