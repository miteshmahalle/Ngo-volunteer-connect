import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  Plus,
  Recycle,
  ShieldAlert,
  Soup,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import { createOpportunity, getOpportunities ,getReceivedApplications} from "../api";
import { Footer } from "../components/Layout";
type User = {
  name: string;
  email: string;
  profile?: {
    focus_areas?: string[] | string;
  };
};
type Post = {
  focus_area: string;
  required_volunteers: number;
};

type Application = {
  opportunity_id: string;
  opportunity_title: string;
  focus_area: string;
  volunteer?: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
    profile?: {
      skills?: string[];
      interests?: string[];
    };
  };
};

const focusAreaData = {
  education: { title: "Education", icon: BookOpen, bg: "bg-blue-50", text: "text-blue-700" },
  healthcare: { title: "Healthcare", icon: HeartPulse, bg: "bg-red-50", text: "text-red-700" },
  "waste management": { title: "Waste Management", icon: Recycle, bg: "bg-green-50", text: "text-green-700" },
  "food donation": { title: "Food Donation", icon: Soup, bg: "bg-orange-50", text: "text-orange-700" },
  "disaster management": { title: "Disaster Management", icon: ShieldAlert, bg: "bg-purple-50", text: "text-purple-700" },
};

function normalizeFocusAreas(focusAreas?: string[] | string) {
  if (!focusAreas) return [];

  if (Array.isArray(focusAreas)) {
    return focusAreas.map((item) => item.trim()).filter(Boolean);
  }

  return focusAreas.split(",").map((item) => item.trim()).filter(Boolean);
}

export default function NgoDashboard() {
  const [user, setUser] = useState<User>({
    name: "NGO User",
    email: "ngo@example.com",
    profile: { focus_areas: ["Education", "Healthcare"] },
  });

  const [openPostForm, setOpenPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedFocusArea, setSelectedFocusArea] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
 useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
    }
  }
}, []);

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const result = await getOpportunities();

       setPosts(
      result.opportunities.map((item: any) => ({
    focus_area: String(item.focus_area || "").trim(),
    required_volunteers: Number(item.required_volunteers || 0),
  }))
);
  
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Failed to load opportunities");
      }
    }

    loadOpportunities();
  }, []);
    useEffect(() => {
  async function loadApplications() {
    try {
      const result = await getReceivedApplications();
      setApplications(result.applications || []);
      console.log("Received applications:", result.applications);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to load applications");
    }
  }

  loadApplications();
}, []);

  const focusAreas = useMemo(() => {
    return normalizeFocusAreas(user.profile?.focus_areas);
  }, [user.profile?.focus_areas]);

   function normalizeText(value: string) {
     return value.trim().toLowerCase();
  }

   function getRequiredVolunteers(area: string) {
        return posts
    .filter((post) => normalizeText(post.focus_area) === normalizeText(area))
    .reduce((total, post) => total + Number(post.required_volunteers || 0), 0);
   }
  function getApplicationsCount(area: string) {
  return applications.filter(
    (application) => normalizeText(application.focus_area) === normalizeText(area)
  ).length;
}

const filteredApplications = applications.filter((application) => {
 // if (!application.volunteer) return false; // safety

  const matchesFocus =
    selectedFocusArea &&
    normalizeText(application.focus_area) === normalizeText(selectedFocusArea);

  const location = `${application.volunteer?.city || ""} ${application.volunteer?.state || ""}`;

  const matchesLocation = location
    .toLowerCase()
    .includes(searchLocation.toLowerCase());

  return matchesFocus && matchesLocation;
});

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    const form = new FormData(event.currentTarget);

    const payload = {
      title: String(form.get("title")),
      description: String(form.get("description")),
      city: String(form.get("city")),
      state: String(form.get("state")),
      focus_area: String(form.get("focus_area")),
      start_date: String(form.get("start_date")),
      end_date: String(form.get("end_date") || ""),
      required_volunteers: Number(form.get("required_volunteers") || 1),
    };

    try {
      await createOpportunity(payload);

      setPosts((prev) => [
        ...prev,
        {
          focus_area: payload.focus_area,
          required_volunteers: payload.required_volunteers,
        },
      ]);

      setStatus("Opportunity post created successfully.");
      setOpenPostForm(false);
      event.currentTarget.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong");
    }
  }

  return (
    <>
    <div className="min-h-screen bg-leaf-50">
      <DashboardHeader user={user} title="NGO Dashboard" />

      <main className="mx-auto max-w-7xl px-5 py-10">
        <section className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-leaf-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-4xl font-black text-leaf-900">
                Welcome, {user.name}
              </h2>

              <p className="mt-3 max-w-2xl text-slate-600">
                Manage your NGO focus areas, check volunteer applications, and create new opportunity posts.
              </p>
            </div>

            <button
              onClick={() => setOpenPostForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-6 py-3 font-black text-white shadow-soft hover:bg-leaf-700"
            >
              <Plus size={20} />
              New Post
            </button>
          </div>
        </section>

        {status && (
          <p className="mt-5 rounded-xl bg-white px-5 py-3 font-bold text-leaf-700">
            {status}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-5 py-3 font-bold text-red-700">
            {error}
          </p>
        )}

        <section className="mt-10">
          <h3 className="text-2xl font-black text-leaf-900">Focus Areas</h3>
          <p className="mt-1 text-slate-600">
            Cards are generated from your registered NGO focus areas.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area) => {
              const key = area.toLowerCase();
              const card =
                focusAreaData[key as keyof typeof focusAreaData] ?? {
                  title: area,
                  icon: ClipboardList,
                  bg: "bg-leaf-50",
                  text: "text-leaf-700",
                };

              const Icon = card.icon;

              return (
                <article
                  key={area}
                  className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${card.bg} ${card.text}`}
                  >
                    <Icon size={34} />
                  </div>

                  <h4 className="mt-5 text-xl font-black text-leaf-900">
                    {card.title}
                  </h4>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-leaf-50 p-4">
                         <p className="text-2xl font-black text-leaf-900">
                              {getApplicationsCount(area)}
                          </p>
                      <p className="mt-1 text-xs font-bold text-slate-600">
                        Applications Received
                      </p>
                    </div>

                    <div className="rounded-2xl bg-leaf-50 p-4">
                      <p className="text-2xl font-black text-leaf-900">
                        {getRequiredVolunteers(area)}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-600">
                        Required Volunteers
                      </p>
                    </div>
                  </div>

                  <button
                     onClick={() => setSelectedFocusArea(area)}
                     className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border bg-leaf-700 py-3 font-bold text-white"
                    >
                        View Details
                       <ChevronRight size={18} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
               {selectedFocusArea && (
          <section className="mt-10">
            <h3 className="text-2xl font-black text-leaf-900">
              Applications for {selectedFocusArea}
            </h3>

            <input
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by city or state"
              className="mt-5 w-full rounded-2xl border border-leaf-100 px-5 py-4 outline-none focus:border-leaf-600"
            />

            <div className="mt-6 grid gap-5">
              {filteredApplications.length === 0 ? (
                <p className="rounded-2xl bg-white p-5 font-bold text-slate-600">
                  No applications found.
                </p>
              ) : (
                filteredApplications.map((application) => (
                  <article
                    key={`${application.opportunity_id}-${application.volunteer?.email || application.opportunity_title}`}
                    className="rounded-3xl bg-white p-6 shadow-soft"
                  >
                    <p className="text-sm font-bold text-leaf-600">
                      {application.opportunity_title}
                    </p>

                    <h4 className="mt-2 text-xl font-black text-leaf-900">
                      {application.volunteer?.name ||  "Volunteer details not loaded"}
                    </h4>

                    <p className="mt-2 text-slate-600">
                      Skills: {application.volunteer?.profile?.skills?.join(", ") || "Not added"}
                    </p>

                    <p className="mt-1 text-slate-600">
                      Location: {application.volunteer?.city || "Not added"}, {application.volunteer?.state || "Not added"}
                    </p>

                    <button
                      onClick={() => setSelectedCandidate(application)}
                      className="mt-5 rounded-xl bg-leaf-600 px-6 py-3 font-black text-white hover:bg-leaf-700"
                    >
                      View Details
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {openPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
          <form
            onSubmit={handleCreatePost}
            className="my-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-black text-leaf-900">
                Create Opportunity
              </h3>

              <button type="button" onClick={() => setOpenPostForm(false)}>
                <X className="text-slate-600" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Job title</span>
                <input
                  name="title"
                  required
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                />
              </label>

              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Description</span>
                <textarea
                  name="description"
                  required
                  maxLength={300}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                />
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">City</span>
                <input
                  name="city"
                  required
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                />
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">State</span>
                <input
                  name="state"
                  required
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                />
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">Focus area</span>
                <select
                  name="focus_area"
                  required
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                >
                  <option value="">Select focus area</option>
                  {focusAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">
                  Required Volunteers
                </span>
                <input
                  type="number"
                  name="required_volunteers"
                  min={1}
                  defaultValue={1}
                  required
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                />
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">Start date</span>
                <input
                  type="date"
                  name="start_date"
                  required
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                />
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">End date</span>
                <input
                  type="date"
                  name="end_date"
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setOpenPostForm(false)}
                className="w-1/2 rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-1/2 rounded-xl bg-leaf-600 px-6 py-3 font-black text-white shadow-soft transition hover:bg-leaf-700"
              >
                Post Opportunity
              </button>
            </div>
          </form>
        </div>
      )}
            {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-leaf-900">
                Candidate Details
              </h3>

              <button onClick={() => setSelectedCandidate(null)}>
                <X />
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-slate-700">
             <p><b>Name:</b> {selectedCandidate.volunteer?.name || "Volunteer details not loaded"}</p>
             <p><b>Email:</b> {selectedCandidate.volunteer?.email || "Not added"}</p>
             <p><b>Phone:</b> {selectedCandidate.volunteer?.phone || "Not added"}</p>
             <p><b>City:</b> {selectedCandidate.volunteer?.city || "Not added"}</p>
             <p><b>State:</b> {selectedCandidate.volunteer?.state || "Not added"}</p>
             <p>
            <b>Skills:</b>{" "}
              {selectedCandidate.volunteer?.profile?.skills?.join(", ") || "Not added"}
             </p>
             <p>
               <b>Interests:</b>{" "}
             {selectedCandidate.volunteer?.profile?.interests?.join(", ") || "Not added"}
             </p>
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="mt-6 w-full rounded-xl bg-leaf-600 px-6 py-3 font-black text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer />
   </>
  );
}