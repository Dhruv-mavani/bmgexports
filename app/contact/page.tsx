import type { Metadata } from "next";
import { Suspense } from "react";
import EnquiryForm from "@/components/EnquiryForm";
import SectionHeading from "@/components/SectionHeading";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Enquiries",
  description: "Send an enquiry to BMG Exports about a certified diamond. Tell us what you are looking for and we will reply with availability and pricing.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Ambient background light */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_10%,rgba(220,232,250,0.4),transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          level={1}
          eyebrow="Contact"
          title="Send an enquiry"
          intro="Tell us what you are looking for and we will respond promptly."
        />

        {/* Contact Info Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="group border border-mist/80 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-royal/50 hover:shadow-[0_16px_36px_rgba(15,42,82,0.06)]">
            <span className="text-royal text-xs inline-block mb-2" aria-hidden>◆</span>
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-slate font-medium">Direct Email</h2>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-3 block break-words font-serif text-[clamp(0.85rem,4.8vw,1.5rem)] text-navy transition-colors hover:text-royal"
            >
              {CONTACT.email}
            </a>
          </div>

          <div className="group border border-mist/80 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-royal/50 hover:shadow-[0_16px_36px_rgba(15,42,82,0.06)]">
            <span className="text-royal text-xs inline-block mb-2" aria-hidden>◆</span>
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-slate font-medium">Visit Office</h2>
            <address className="mt-3 font-serif text-lg sm:text-xl not-italic text-navy leading-snug">
              {CONTACT.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
        </div>

        {/* Enquiry Form Container */}
        <div className="mt-10 border border-mist/80 bg-white p-6 sm:p-10 shadow-xs">
          <Suspense fallback={<div className="py-12 text-center text-xs uppercase tracking-widest text-slate">Loading enquiry form...</div>}>
            <EnquiryForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
