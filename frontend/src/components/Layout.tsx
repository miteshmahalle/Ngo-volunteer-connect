import {
  HeartHandshake,
  Leaf,
  Menu,
  X,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
    { to: "/demo-dashboard", label: "Demo" }, // 👈 ADD THIS
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-leaf-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-leaf-600 text-white">
            <HeartHandshake size={24} />
          </span>
          <span>
            <span className="block text-xl font-black text-leaf-900">SevaSetu</span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-leaf-600">
              NGO Volunteer Connect
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${
                  isActive ? "text-leaf-700" : "text-slate-600 hover:text-leaf-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/auth/login"
            className="rounded-lg px-4 py-2 text-sm font-bold text-leaf-700 hover:bg-leaf-50"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="rounded-lg bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-leaf-700"
          >
            Register
          </Link>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-leaf-100 text-leaf-800 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-leaf-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 font-semibold text-slate-700"
              >
                {item.label}
              </Link>
            ))}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/auth/login"
                className="rounded-lg border border-leaf-200 px-4 py-2 text-center font-bold text-leaf-700"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="rounded-lg bg-leaf-600 px-4 py-2 text-center font-bold text-white"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-leaf-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-leaf-700">
              <Leaf size={22} />
            </span>
            <span className="text-2xl font-black">SevaSetu</span>
          </div>

          <p className="mt-4 max-w-md text-sm leading-6 text-leaf-100">
            Bringing verified NGOs and passionate volunteers together for cleaner cities,
            stronger classrooms, healthier communities, and faster disaster response across India.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Platform</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-leaf-100">
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Follow Us</h3>

          <div className="mt-4 flex gap-4">
            <a href="#" className="transition hover:text-saffron">
              <Instagram size={22} />
            </a>
            <a href="#" className="transition hover:text-saffron">
              <Youtube size={22} />
            </a>
            <a href="#" className="transition hover:text-saffron">
              <Linkedin size={22} />
            </a>
            <a href="#" className="transition hover:text-saffron">
              <Twitter size={22} />
            </a>
          </div>

          <p className="mt-3 text-xs text-leaf-100">
            Stay connected with our community
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-leaf-100">
        © 2026 SevaSetu. Built for India’s social impact ecosystem.
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-leaf-50/40">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}