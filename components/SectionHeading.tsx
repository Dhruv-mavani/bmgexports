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
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-royal">{eyebrow}</p>}
      <Heading className="mt-3 font-serif text-3xl text-navy sm:text-4xl lg:text-5xl">{title}</Heading>
      {intro && <p className="mt-4 text-slate">{intro}</p>}
    </div>
  );
}
