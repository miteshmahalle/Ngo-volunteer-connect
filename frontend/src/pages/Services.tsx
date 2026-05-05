import { BadgeCheck, ClipboardList, Search, Settings } from "lucide-react";
import Layout from "../components/Layout";

const services = [
  { title: "NGO Registration", icon: ClipboardList, text: "Create organization profiles, list focus areas, and post volunteering opportunities after verification." },
  { title: "Volunteer Discovery", icon: Search, text: "Search campaigns by city, state, cause, dates, and skills needed." },
  { title: "Admin Verification", icon: BadgeCheck, text: "Approve or reject NGOs and volunteers to keep the platform reliable." },
  { title: "App Management", icon: Settings, text: "Track users, pending requests, platform stats, and opportunity activity." },
];

export default function Services() {
  return (
    <Layout>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-leaf-900">Services</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            The platform covers the full flow from registration to verification to campaign discovery.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="rounded-lg border border-leaf-100 bg-leaf-50 p-7">
                  <Icon className="text-leaf-600" size={32} />
                  <h2 className="mt-5 text-2xl font-black text-leaf-900">{service.title}</h2>
                  <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

