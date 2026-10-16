"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "idle" | "sending" | "sent" | "error";

// Web3Forms emails the enquiry to the account owner. Its access key is designed to be used in the browser,
// but it lives in an environment variable so it is not committed to the repository.
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const field =
  "mt-2 w-full border border-mist bg-white px-4 py-3 text-navy outline-none transition-colors focus:border-royal";

export default function EnquiryForm() {
  const stone = useSearchParams().get("stone") ?? "";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      if (!ACCESS_KEY) throw new Error("The enquiry form is not set up yet. Please email us directly.");
      const fields = Object.fromEntries(new FormData(form)) as Record<string, string>;
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          access_key: ACCESS_KEY,
          from_name: "BMG Exports website",
          subject: `New enquiry from ${fields.name}${fields.stone ? ` — ${fields.stone}` : ""}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message ?? "Something went wrong. Please try again or email us.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-mist bg-ice p-8 text-center" role="status">
        <p className="font-serif text-3xl">Thank you.</p>
        <p className="mt-2 text-slate">We have received your enquiry and will reply shortly.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
      // WebMCP: lets browser agents discover this form as a tool (the user still reviews and sends it).
      {...{ toolname: "send_enquiry", tooldescription: "Send an enquiry to BMG Exports about a diamond. Requires name, email and message; stone is an optional stone id such as bmg-001." }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          Name
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="block text-sm">
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          Phone (optional)
          <input name="phone" type="tel" maxLength={30} autoComplete="tel" className={field} />
        </label>
        <label className="block text-sm">
          Stone reference (optional)
          <input name="stone" defaultValue={stone} maxLength={50} className={field} />
        </label>
      </div>
      {/* Honeypot: real visitors never see or tick this; bots that fill every field get filtered out. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <label className="block text-sm">
        Message
        <textarea name="message" required rows={5} maxLength={2000} className={field} />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-navy px-6 py-3 text-xs sm:px-8 sm:text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-royal disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
