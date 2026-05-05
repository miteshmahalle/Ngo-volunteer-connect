import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-leaf-900">About SevaSetu</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            SevaSetu is designed for India’s NGO ecosystem, where trust, locality, and quick mobilisation matter.
            NGOs can build verified profiles, volunteers can discover nearby opportunities, and admins can manage
            verification from one place.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {["Trust-first onboarding", "Indian city and state discovery", "Simple REST API foundation"].map((item) => (
              <div key={item} className="rounded-lg border border-leaf-100 bg-leaf-50 p-6 text-lg font-black text-leaf-900">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

