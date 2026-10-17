import type { Metadata } from "next";
import CertificationListing, { certificationMetadata } from "@/components/CertificationListing";

export const metadata: Metadata = certificationMetadata("non-certified");

export default function Page() {
  return <CertificationListing certification="non-certified" />;
}
