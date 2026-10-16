import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About BMG Exports",
  description:
    "BMG Exports supplies certified diamonds to jewellers, designers and collectors worldwide, with honest grading, careful selection and responsible sourcing.",
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
      <section className="relative overflow-hidden py-20 sm:py-24">
        {/* Ambient background light */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_10%,rgba(220,232,250,0.4),transparent_70%)]"
          aria-hidden
        />

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading level={1} eyebrow="About" title="The BMG Exports story" />

          {/* Editorial Story Frame */}
          <div className="mx-auto mt-12 max-w-3xl border border-mist/80 bg-white p-8 sm:p-12 shadow-xs">
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate font-light">
              <p>
                BMG Exports supplies certified diamonds to jewellers, designers and collectors around the world.
                We combine careful selection with a straightforward, personal way of doing business.
              </p>
              <p>
                Every stone we offer is graded by a leading laboratory and inspected by our team before it ships. Our aim is
                simple: exceptional diamonds, delivered reliably, at fair prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t border-mist bg-ice/60 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-8 sm:grid-cols-3">
            {values.map((v) => (
              <li
                key={v.title}
                className="group border border-mist bg-white p-8 sm:p-10 text-center transition-all duration-300 hover:border-royal/50 hover:shadow-[0_16px_36px_rgba(15,42,82,0.06)]"
              >
                <span className="inline-block text-royal text-xs mb-3 transition-transform duration-300 group-hover:scale-125" aria-hidden>
                  ◆
                </span>
                <p className="font-serif text-2xl sm:text-3xl text-navy font-normal">{v.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
