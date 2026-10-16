import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About BGM Exports",
  description:
    "BGM Exports supplies certified diamonds to jewellers, designers and collectors worldwide, with honest grading, careful selection and responsible sourcing.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Integrity", text: "Honest grading and transparent pricing on every stone." },
  { title: "Craft", text: "Hand-selected for cut, brilliance and character." },
  { title: "Responsibility", text: "Conflict-free sourcing with full traceability." },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <SectionHeading level={1} eyebrow="About" title="The BGM Exports story" />
        <div className="mx-auto mt-10 max-w-2xl space-y-5 text-slate">
          <p>
            BGM Exports supplies certified natural diamonds to jewellers, designers and collectors around the world.
            We combine careful selection with a straightforward, personal way of doing business.
          </p>
          <p>
            Every stone we offer is graded by a leading laboratory and inspected by our team before it ships. Our aim is
            simple: exceptional diamonds, delivered reliably, at fair prices.
          </p>
        </div>
      </section>
      <section className="border-t border-mist bg-ice">
        <ul className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 py-20 text-center sm:grid-cols-3">
          {values.map((v) => (
            <li key={v.title}>
              <p className="font-serif text-3xl">{v.title}</p>
              <p className="mt-2 text-sm text-slate">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
