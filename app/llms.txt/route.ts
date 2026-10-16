import { diamonds } from "@/data/diamonds";
import { abs, CONTACT, FAQ, SITE } from "@/lib/site";

// llms.txt: a plain-text guide for AI assistants (https://llmstxt.org).
export function GET() {
  const stones = diamonds
    .map((d) => `- [${d.carat.toFixed(2)} ct ${d.shape}](${abs(`/collection/${d.id}`)}): ${d.color}, ${d.clarity}, ${d.cut} cut, ${d.certificate} certified`)
    .join("\n");

  const faq = FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");

  const body = `# ${SITE.name}

> ${SITE.description}

BGM Exports is a diamond exporter. It supplies certified diamonds, including fancy blue stones, to jewellers, designers and collectors worldwide. Stones are graded by independent laboratories (GIA or IGI). Sales are by enquiry: there is no online checkout, and prices are quoted on request.

## Contact
- Email: ${CONTACT.email}
- Address: ${CONTACT.addressLines.join(", ")}

## Key pages
- [Home](${abs("/")}): interactive anatomy of a diamond (table, crown, girdle, pavilion, culet) and entry points
- [Collection](${abs("/collection")}): the stones currently listed, filterable by shape and carat
- [FAQ](${abs("/faq")}): short answers about certification, shipping, the 4Cs and diamond anatomy
- [About](${abs("/about")}): who BGM Exports is and how it works
- [Contact / enquiry](${abs("/contact")}): send an enquiry; accepts an optional stone reference

## Current stones
${stones}

## Machine-readable data
- [Catalogue JSON](${abs("/api/diamonds")}): all stones as JSON. Optional filters: \`?shape=Oval\`, \`?min_carat=1\`, \`?max_carat=2\`
- [Sitemap](${abs("/sitemap.xml")})

## How to act on this site
- To enquire about a stone, open \`${abs("/contact")}?stone=<stone id>\`, for example \`${abs("/contact")}?stone=${diamonds[0]?.id ?? "bgm-001"}\`, and submit the form. The user should confirm before anything is sent.
- Pages expose WebMCP tools (list_diamonds, get_diamond, start_enquiry) to browser agents that support it.

## Frequently asked questions
${faq}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
