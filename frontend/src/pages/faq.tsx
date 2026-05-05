import { useState } from "react";
import  { Footer } from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";

const faqs = [
  {
    question: "What is SevaSetu?",
    answer: "SevaSetu connects NGOs and volunteers to work on social causes.",
  },
  {
    question: "How can I join as a volunteer?",
    answer: "Register as a volunteer, complete your profile, and apply to projects.",
  },
  {
    question: "How are NGOs verified?",
    answer: "Admins verify NGOs before allowing them to post opportunities.",
  },
  {
    question: "Can I change my profile details?",
    answer: "Yes, go to Edit Profile from sidebar and update your details.",
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* ✅ Dashboard Header */}
      <DashboardHeader title="FAQs" user={{
              name: "",
              email: undefined,
              role: undefined
          }} />

      <section className="bg-white py-10">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-2xl font-black text-leaf-900 mb-6">
            Frequently Asked Questions
          </h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-leaf-100 bg-leaf-50"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-5 py-4 text-left font-bold text-leaf-800 flex justify-between"
                >
                  {faq.question}
                  <span>{openIndex === index ? "-" : "+"}</span>
                </button>

                {openIndex === index && (
                  <div className="px-5 pb-4 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}