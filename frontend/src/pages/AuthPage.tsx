import { Building2, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loginUser, registerUser } from "../api";
import Layout from "../components/Layout";

type Role = "ngo" | "volunteer" | "admin";

export default function AuthPage() {
  const { mode = "login" } = useParams();
  const isRegister = mode === "register";
  const [role, setRole] = useState<Role>("ngo");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(() => (isRegister ? "Create your account" : "Welcome back"), [isRegister]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError("");
  setStatus("");

  const form = new FormData(event.currentTarget);

  if (isRegister && role === "admin") {
    setError("Admin cannot register from frontend. Admin is created from backend.");
    return;
  }

  const common = {
    email: String(form.get("email")),
    password: String(form.get("password")),
  };

  try {
    const result = isRegister
      ? await registerUser({
          ...common,
          role: role as "ngo" | "volunteer",
          name: String(form.get("name")),
          phone: String(form.get("phone")),
          city: String(form.get("city")),
          state: String(form.get("state")),
          registration_number: String(form.get("registration_number")),
          aadhaar_number: String(form.get("aadhaar_number")),
          focus_areas: String(form.get("focus_areas") ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          skills: String(form.get("skills") ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        })
      : await loginUser({
          ...common,
          role,
        });

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    if (result.user.role === "ngo") {
      window.location.href = "/ngo/dashboard";
    } else if (result.user.role === "volunteer") {
      window.location.href = "/volunteer/dashboard";
    } else if (result.user.role === "admin") {
      window.location.href = "/admin/dashboard";
    }

    setStatus(
      `${result.user.name || "User"} signed in as ${result.user.role}. Verification status: ${
        result.user.is_verified ? "verified" : "pending"
      }.`
    );
  } catch (caught) {
    setError(caught instanceof Error ? caught.message : "Something went wrong");
  }
}

  return (
    <Layout>
      <section className="bg-white py-6">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <span className="rounded-full bg-leaf-100 px-4 py-2 text-sm font-bold text-leaf-700">
              {isRegister ? "Registration" : "Login"}
            </span>
            <h1 className="mt-6 text-4xl font-black text-leaf-900">{title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Choose NGO or volunteer. Admin users can log in with admin credentials created by the backend team. And user can login only when admin verify them.
            </p>
            <div className="mt-8 grid gap-4">
              <button 
               type="button"
                onClick={() => setRole("ngo")}
                className={`flex items-center gap-4 rounded-lg border p-5 text-left ${
                  role === "ngo" ? "border-leaf-600 bg-leaf-50" : "border-slate-200 bg-white"
                }`}
              >
                <Building2 className="text-leaf-600" />
                <span>
                  <span className="block font-black text-leaf-900">NGO Organisation</span>
                  <span className="text-sm text-slate-600">Register campaigns and volunteer needs.</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("volunteer")}
                className={`flex items-center gap-4 rounded-lg border p-5 text-left ${
                  role === "volunteer" ? "border-leaf-600 bg-leaf-50" : "border-slate-200 bg-white"
                }`}
              >
                <UserRound className="text-leaf-600" />
                <span>
                  <span className="block font-black text-leaf-900">Volunteer</span>
                  <span className="text-sm text-slate-600">Find verified causes and apply.</span>
                </span>
              </button>
                {!isRegister && (
               <button
                   type="button"
                   onClick={() => setRole("admin")}
                   className={`flex items-center gap-4 rounded-lg border p-5 text-left ${
                   role === "admin" ? "border-leaf-600 bg-leaf-50" : "border-slate-200 bg-white"
                }`}
                >
             <UserRound className="text-leaf-600" />
             <span>
             <span className="block font-black text-leaf-900">Admin</span>
             <span className="text-sm text-slate-600">Manage users, verification, and platform data.</span>
            </span>
            </button>
  )}
            </div>
          </div>
   

          <form onSubmit={handleSubmit} className="mt-12 rounded-lg border border-leaf-100 bg-leaf-50 p-6 shadow-soft sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {isRegister && (
                <label className="sm:col-span-2">
                  <span className="text-sm font-bold text-slate-700">Full name / Organisation name</span>
                  <input name="name" required className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600" />
                </label>
              )}
              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Email</span>
                <input type="email" name="email" required className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Password</span>
                <input type="password" name="password" required className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600" />
              </label>
              {isRegister && (
                <>
                 <label>
                    <span className="text-sm font-bold text-slate-700">Phone</span>
                       <input
                           name="phone"
                           required
                           type="tel"
                           maxLength={10}
                           pattern="[0-9]{10}"
                           onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
               }}
                  className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600"
                />
                 </label>
                  <label>
                    <span className="text-sm font-bold text-slate-700">City</span>
                    <input name="city" className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600" />
                  </label>
                  <label>
                    <span className="text-sm font-bold text-slate-700">State</span>
                    <input name="state" className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600" />
                  </label>
                  {role === "ngo" ? (
                    <>
                      <label>
                        <span className="text-sm font-bold text-slate-700">NGO Registration No.</span>
                        <input name="registration_number" className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600" />
                      </label>
                      <label className="sm:col-span-2">
                        <span className="text-sm font-bold text-slate-700">Focus areas</span>
                        <input name="focus_areas" placeholder="Education, Waste, Health" className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600" />
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="sm:col-span-2">
                        <span className="text-sm font-bold text-slate-700">Skills</span>
                        <input
                            name="skills"
                            required
                            placeholder="Teaching, Design, First aid"
                            className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600"
                    />
                       </label>

                      <label className="sm:col-span-2">
                      <span className="text-sm font-bold text-slate-700">Aadhaar Number</span>
                     <input
                          name="aadhaar_number"
                           required
                          type="text"
                          maxLength={12}
                          pattern="[0-9]{12}"
                          placeholder="Enter 12 digit Aadhaar number"
                          onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 12);
                   }}
                   className="mt-2 w-full rounded-lg border border-leaf-100 bg-white px-4 py-3 outline-none focus:border-leaf-600"
                   />
                       </label>
                    </>
              )}
                </>
              )}
            </div>

            {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
            {status && <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm font-bold text-leaf-700">{status}</p>}

            <button className="mt-6 w-full rounded-lg bg-leaf-600 px-6 py-3 font-black text-white hover:bg-leaf-700">
              {isRegister ? `Register as ${role}` : `Login as ${role}`}
            </button>
            <p className="mt-4 text-center text-sm text-slate-600">
              {isRegister ? "Already registered?" : "New to SevaSetu?"}{" "}
              <Link className="font-bold text-leaf-700" to={isRegister ? "/auth/login" : "/auth/register"}>
                {isRegister ? "Login" : "Register"}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}

