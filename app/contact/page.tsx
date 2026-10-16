import type { Metadata } from "next";
import { Suspense } from "react";
import EnquiryForm from "@/components/EnquiryForm";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
      <SectionHeading eyebrow="Contact" title="Send an enquiry" intro="Tell us what you are looking for and we will respond promptly." />
      <div className="mt-12">
        <Suspense>
          <EnquiryForm />
        </Suspense>
      </div>
    </section>
  );
}
