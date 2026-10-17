import type { Metadata } from "next";
import CertificationListing, { certificationMetadata } from "@/components/CertificationListing";

export const metadata: Metadata = certificationMetadata("certified");

export default function Page() {
  return <CertificationListing certification="certified" />;
}
