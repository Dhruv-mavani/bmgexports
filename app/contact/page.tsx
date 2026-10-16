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
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
      <SectionHeading level={1} eyebrow="Contact" title="Send an enquiry" intro="Tell us what you are looking for and we will respond promptly." />
      <div className="mt-12 grid gap-px border border-mist bg-mist sm:grid-cols-2">
        <div className="bg-white p-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-royal">Email</h2>
          <a href={`mailto:${CONTACT.email}`} className="mt-2 block break-all font-serif text-xl text-navy transition-colors hover:text-royal">
            {CONTACT.email}
          </a>
        </div>
        <div className="bg-white p-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-royal">Visit</h2>
          <address className="mt-2 font-serif text-xl not-italic text-navy">
            {CONTACT.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
        </div>
      </div>
      <div className="mt-12">
        <Suspense>
          <EnquiryForm />
        </Suspense>
      </div>
    </section>
  );
}
