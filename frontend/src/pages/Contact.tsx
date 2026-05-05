import { Mail, MapPin, Phone } from "lucide-react";
import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout>
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h1 className="text-4xl font-black text-leaf-900">Contact</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Reach out for NGO onboarding, volunteer partnerships, or platform administration support.
            </p>
            <div className="mt-8 grid gap-4">
              <p className="flex items-center gap-3 font-bold text-slate-700"><Mail className="text-leaf-600" /> sevasetu@gmail.com</p>
              <p className="flex items-center gap-3 font-bold text-slate-700"><Phone className="text-leaf-600" /> +91 90000 00000</p>
              <p className="flex items-center gap-3 font-bold text-slate-700"><MapPin className="text-leaf-600" /> Mumbai, Maharashtra, India</p>
            </div>
          </div>
          <form className="rounded-lg border border-leaf-100 bg-leaf-50 p-7 shadow-soft">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Name</span>
              <input className="mt-2 w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600" />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Email</span>
              <input type="email" className="mt-2 w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600" />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Message</span>
              <textarea rows={5} className="mt-2 w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600" />
            </label>
            <button type="button" className="mt-6 rounded-lg bg-leaf-600 px-6 py-3 font-black text-white hover:bg-leaf-700">
              Send message
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

