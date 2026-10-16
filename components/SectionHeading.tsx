export default function SectionHeading({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-royal">{eyebrow}</p>}
      <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl lg:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-slate">{intro}</p>}
    </div>
  );
}
