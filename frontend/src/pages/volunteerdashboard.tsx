import { CalendarDays, MapPin, Search, UsersRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getMe, getOpportunities } from "../api";
import DashboardHeader from "../components/DashboardHeader";
import { Footer } from "../components/Layout";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  focus_area: string;
  start_date: string;
  end_date?: string;
  required_volunteers: number;
  ngo_name?: string;
  ngo_email?: string;
  ngo_phone?: string;
};

export default function VolunteerDashboard() {
  const [user, setUser] = useState({
    name: "Volunteer",
    email: "",
    role: "volunteer",
  });

  const [posts, setPosts] = useState<Opportunity[]>([]);
  const [selectedPost, setSelectedPost] = useState<Opportunity | null>(null);
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const meResult = await getMe();
        setUser(meResult.user);

        const opportunityResult = await getOpportunities();
        setPosts(opportunityResult.opportunities || []);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Failed to load dashboard");
      }
    }

    loadDashboard();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const locationMatch = `${post.city} ${post.state}`
        .toLowerCase()
        .includes(location.toLowerCase());

      const keywordMatch = `${post.title} ${post.focus_area} ${post.description}`
        .toLowerCase()
        .includes(keyword.toLowerCase());

      return locationMatch && keywordMatch;
    });
  }, [posts, location, keyword]);

  function handleApply() {
    alert("Application submitted successfully.");
    setSelectedPost(null);

    // Later we will connect this with:
    // POST /api/opportunities/:id/apply/
    // volunteer details will come from token/profile automatically
  }

  return (
    <div className="min-h-screen bg-leaf-50/40">
      <DashboardHeader user={user} title="Volunteer Dashboard" />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div>
            <p className="text-sm font-bold text-leaf-600">Volunteer Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-leaf-900">
              Welcome, {user.name}
            </h1>
            <p className="mt-2 text-slate-600">
              Search internships and volunteering opportunities by location.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-4 shadow-soft">
            <div className="grid gap-3 md:grid-cols-[1fr_1.3fr_1fr_auto]">
              <select className="rounded-xl border border-slate-200 px-4 py-3 text-slate-600 outline-none">
                <option>Select job type</option>
                <option>Volunteer</option>
                <option>Internship</option>
                <option>Social Work</option>
              </select>

              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Enter keyword / designation / organisation"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-leaf-600"
              />

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Enter location"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-leaf-600"
              />

              <button className="flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-6 py-3 font-bold text-white hover:bg-leaf-700">
                <Search size={18} />
                Search
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}

          <div className="mt-8 grid gap-5">
            {filteredPosts.map((post) => (
              <article key={post.id} className="rounded-2xl bg-white p-6 shadow-soft">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {post.title}
                    </h2>

                    <p className="mt-1 font-bold text-slate-700">
                      {post.ngo_name || "NGO Organisation"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={17} className="text-leaf-600" />
                        {post.start_date} to {post.end_date || "Not specified"}
                      </span>

                      <span className="flex items-center gap-2">
                        <MapPin size={17} className="text-leaf-600" />
                        {post.city}, {post.state}
                      </span>

                      <span className="flex items-center gap-2">
                        <UsersRound size={17} className="text-leaf-600" />
                        Required: {post.required_volunteers}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="rounded-xl bg-leaf-600 px-6 py-3 font-bold text-white hover:bg-leaf-700"
                  >
                    View Post
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-leaf-900">
                  {selectedPost.title}
                </h2>
                <p className="mt-1 font-bold text-slate-700">
                  {selectedPost.ngo_name || "NGO Organisation"}
                </p>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X />
              </button>
            </div>

            <div className="mt-6 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
              <p className="sm:col-span-2">
                <b>Description:</b>
                <br />
                {selectedPost.description}
              </p>

              <p>
                <b>Organisation Email:</b>
                <br />
                {selectedPost.ngo_email || "Not available"}
              </p>

              <p>
                <b>Organisation Number:</b>
                <br />
                {selectedPost.ngo_phone || "Not available"}
              </p>

              <p>
                <b>Location:</b>
                <br />
                {selectedPost.city}
              </p>

              <p>
                <b>State:</b>
                <br />
                {selectedPost.state}
              </p>

              <p>
                <b>Start Date:</b>
                <br />
                {selectedPost.start_date}
              </p>

              <p>
                <b>End Date:</b>
                <br />
                {selectedPost.end_date || "Not specified"}
              </p>

              <p>
                <b>Required Volunteers:</b>
                <br />
                {selectedPost.required_volunteers}
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="rounded-xl bg-leaf-600 px-6 py-3 font-bold text-white hover:bg-leaf-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}