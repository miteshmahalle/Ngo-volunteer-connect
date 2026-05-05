import { ArrowRight, BookOpen, CheckCircle2, HandHeart, Recycle, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import IndiaMap from "../components/IndiaMap";
import Layout from "../components/Layout";

const campaignCards = [
  {
    title: "Waste Management Drives",
    icon: Recycle,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Education Support Camps",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Community Health Outreach",
    icon: HandHeart,
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  return (
    <Layout>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex rounded-full bg-leaf-100 px-4 py-2 text-sm font-bold text-leaf-700">
              Verified social impact network for India
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-leaf-900 sm:text-5xl lg:text-6xl">
              Connect NGOs and volunteers where help is needed most.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              SevaSetu helps Indian NGOs publish opportunities, helps volunteers find causes near them,
              and gives admins a trusted verification layer for safer collaboration.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf-600 px-6 py-3 font-bold text-white shadow-soft hover:bg-leaf-700">
                Register now <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center rounded-lg border border-leaf-200 px-6 py-3 font-bold text-leaf-700 hover:bg-leaf-50">
                Explore services
              </Link>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {["NGO verification", "Volunteer matching", "Admin management"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="text-leaf-600" size={18} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-lg shadow-soft sm:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
                alt="Volunteers serving food at a community campaign"
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
            <div className="rounded-lg bg-leaf-600 p-6 text-white">
              <UsersRound size={30} />
              <p className="mt-5 text-3xl font-black">12k+</p>
              <p className="mt-1 text-sm text-leaf-100">Potential volunteer network capacity</p>
            </div>
            <div className="rounded-lg border border-leaf-100 bg-white p-6">
              <p className="text-3xl font-black text-leaf-800">36</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">States and union territories ready to serve</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-leaf-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black text-leaf-900">Campaigns volunteers can discover</h2>
            <p className="mt-3 text-slate-600">
              Campaign cards are designed for searchable opportunity feeds in the next app phase.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {campaignCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="overflow-hidden rounded-lg bg-white shadow-soft">
                  <img src={card.image} alt={card.title} className="h-52 w-full object-cover" />
                  <div className="p-6">
                    <Icon className="text-leaf-600" />
                    <h3 className="mt-4 text-xl font-black text-leaf-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      NGOs can post location, dates, skill requirements, and volunteer capacity.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-leaf-900">India-wide discovery with local action</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The platform is built around Indian cities and states, so volunteers can filter by nearby campaigns
              while admins monitor verification and activity across regions.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["City-wise matching", "Cause-based filters", "Verified profiles", "Admin dashboards"].map((item) => (
                <div key={item} className="rounded-lg border border-leaf-100 bg-leaf-50 p-4 font-bold text-leaf-800">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <IndiaMap />
        </div>
      </section>
    </Layout>
  );
}

