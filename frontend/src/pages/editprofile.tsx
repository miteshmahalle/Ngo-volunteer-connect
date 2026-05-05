import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { getMe, updateProfile } from "../api";

export default function EditProfile() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    email: "",
    registration_number: "",
    website: "",
    focus_areas: "",
    skills: "",
    aadhaar_number: "",
    availability: "",
    interests: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getMe();
        const user = result.user;

        setRole(user.role);

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          city: user.city || "",
          state: user.state || "",
          email: user.email || "",
          registration_number: user.profile?.registration_number || "",
          website: user.profile?.website || "",
          focus_areas: user.profile?.focus_areas?.join(", ") || "",
          skills: user.profile?.skills?.join(", ") || "",
          aadhaar_number: user.profile?.aadhaar_number || "",
          availability: user.profile?.availability || "",
          interests: user.profile?.interests?.join(", ") || "",
        });
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Failed to load profile");
      }
    }

    loadProfile();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setError("");

    const payload = {
      ...formData,
      focus_areas: formData.focus_areas
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      skills: formData.skills
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      interests: formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    };

    try {
      const result = await updateProfile(payload);

      localStorage.setItem("user", JSON.stringify(result.user));
      setStatus("Profile updated successfully");

      setTimeout(() => {
        if (result.user.role === "ngo") {
          navigate("/ngo/dashboard");
        } else if (result.user.role === "volunteer") {
          navigate("/volunteer/dashboard");
        } else if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        }
      }, 1000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Profile update failed");
    }
  }

  return (
    <section className="min-h-screen bg-leaf-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-soft"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-600 text-white"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-3xl font-black text-leaf-900">Edit Profile</h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-semibold text-gray-700">Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="rounded-lg border px-4 py-3"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm font-semibold text-gray-700">Phone</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="rounded-lg border px-4 py-3"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm font-semibold text-gray-700">City</span>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="rounded-lg border px-4 py-3"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm font-semibold text-gray-700">State</span>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="rounded-lg border px-4 py-3"
            />
          </label>

          {role === "ngo" && (
            <>
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-semibold text-gray-700">
                  NGO Registration Number
                </span>
                <input
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                />
              </label>

              <label className="flex flex-col">
                <span className="mb-1 text-sm font-semibold text-gray-700">Website</span>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                />
              </label>

              <label className="flex flex-col sm:col-span-2">
                <span className="mb-1 text-sm font-semibold text-gray-700">Focus Areas</span>
                <input
                  name="focus_areas"
                  value={formData.focus_areas}
                  onChange={handleChange}
                  placeholder="Education, Health, Environment"
                  className="rounded-lg border px-4 py-3"
                />
              </label>
            </>
          )}

          {role === "volunteer" && (
            <>
              <label className="flex flex-col sm:col-span-2">
                <span className="mb-1 text-sm font-semibold text-gray-700">Skills</span>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Teaching, Design, First Aid"
                  className="rounded-lg border px-4 py-3"
                />
              </label>

              <label className="flex flex-col">
                <span className="mb-1 text-sm font-semibold text-gray-700">Aadhaar Number (12 digits)</span>
                <input
                  name="aadhaar_number"
                  value={formData.aadhaar_number}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                />
              </label>

              <label className="flex flex-col">
                <span className="mb-1 text-sm font-semibold text-gray-700">Availability</span>
                <input
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="Weekends, Full-time, Part-time"
                  className="rounded-lg border px-4 py-3"
                />
              </label>

              <label className="flex flex-col sm:col-span-2">
                <span className="mb-1 text-sm font-semibold text-gray-700">Interests</span>
                <input
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Education, Health, Social Work"
                  className="rounded-lg border px-4 py-3"
                />
              </label>
            </>
          )}

          {role === "admin" && (
            <>
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-semibold text-gray-700">Email</span>
                <input
                  value={formData.email}
                  readOnly
                  className="rounded-lg border bg-gray-100 px-4 py-3"
                />
              </label>

              <label className="flex flex-col">
                <span className="mb-1 text-sm font-semibold text-gray-700">Aadhaar Number</span>
                <input
                  name="aadhaar_number"
                  value={formData.aadhaar_number}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                />
              </label>
            </>
          )}
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}
        {status && <p className="mt-4 text-green-700">{status}</p>}

        <button className="mt-6 rounded-lg bg-leaf-600 px-6 py-3 text-white">
          Update Profile
        </button>
      </form>
    </section>
  );
}