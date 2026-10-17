import { disclosureText } from "@/data/diamonds";

// Plain-language origin / certification disclosure. Text comes from the stone data, so it is always accurate.
export default function LabGrownNotice({ className = "" }: { className?: string }) {
  const text = disclosureText();
  if (!text) return null;
  return (
    <aside className={`border border-mist/80 bg-ice/60 px-4 py-3 text-left ${className}`} aria-label="Disclosure">
      <p className="text-[11px] leading-relaxed text-slate sm:text-xs">
        <span className="mr-1.5 font-medium uppercase tracking-[0.2em] text-royal">◆ Disclosure</span>
        {text}
      </p>
    </aside>
  );
}
