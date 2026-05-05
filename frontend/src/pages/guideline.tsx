import {Footer} from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";

export default function Guidelines() {
  return (
    <>
      {/* Dashboard Header */}
      <DashboardHeader title="Guidelines" user={{ name: "Guidelines" } as any} />

      <section className="bg-white py-10">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-2xl font-black text-leaf-900 mb-6">
            Platform Guidelines
          </h1>

          <div className="space-y-6 text-slate-700 leading-7">

            <div>
              <h2 className="font-bold text-leaf-800 mb-2">
                1. Respect and Professionalism
              </h2>
              <p>
                All users (NGOs and Volunteers) must maintain respectful and professional communication.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-leaf-800 mb-2">
                2. Accurate Information
              </h2>
              <p>
                Ensure that all profile and project details are accurate and up-to-date.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-leaf-800 mb-2">
                3. Verified Participation
              </h2>
              <p>
                Only verified NGOs can post opportunities and verified volunteers can participate.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-leaf-800 mb-2">
                4. No Misuse of Platform
              </h2>
              <p>
                Any misuse such as fake registrations, spam, or fraudulent activity will lead to account suspension.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-leaf-800 mb-2">
                5. Privacy Protection
              </h2>
              <p>
                Do not share sensitive personal information unnecessarily on the platform.
              </p>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}