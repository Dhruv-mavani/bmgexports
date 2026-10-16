export default function SectionHeading({
  eyebrow,
  title,
  intro,
  level = 2,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Use 1 for the page's main heading. */
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 border border-mist/80 bg-white/80 px-3.5 py-1 text-[10px] uppercase tracking-[0.3em] text-royal shadow-2xs backdrop-blur-xs">
          <span className="text-[7px]">◆</span>
          <span>{eyebrow}</span>
          <span className="text-[7px]">◆</span>
        </div>
      )}
      <Heading className="mt-4 font-serif text-3xl font-normal tracking-tight text-navy sm:text-4xl lg:text-5xl">
        {title}
      </Heading>
      {intro && <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate max-w-2xl mx-auto">{intro}</p>}
      <div className="mt-6 flex items-center justify-center gap-3 text-mist" aria-hidden>
        <span className="h-px w-12 bg-mist" />
        <span className="text-royal text-xs">◆</span>
        <span className="h-px w-12 bg-mist" />
      </div>
    </div>
  );
}
