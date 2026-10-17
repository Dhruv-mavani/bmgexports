import { certificationPath, certificationTitle, certifications, diamonds, diamondsByCertification, disclosureText, shapePath, shapes, stoneCode, stoneName, stonePath, stoneSummary } from "@/data/diamonds";
import { abs, CONTACT, FAQ, SITE } from "@/lib/site";

// llms.txt: a plain-text guide for AI assistants (https://llmstxt.org).
export function GET() {
  const stones = diamonds
    .map((d) => `- [${stoneCode(d)} — ${stoneName(d)}](${abs(stonePath(d))}): ${stoneSummary(d)}`)
    .join("\n");

  const faq = FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");

  const body = `# ${SITE.name}

> ${SITE.description}

BMG Exports is a diamond exporter. It supplies lab-grown diamonds in radiant, cushion, oval and princess cuts to jewellers, designers and collectors worldwide. ${disclosureText()} Sales are by enquiry: there is no online checkout, and prices are quoted on request.

## Contact
- Email: ${CONTACT.email}
- Address: ${CONTACT.addressLines.join(", ")}

## Key pages
- [Home](${abs("/")}): interactive anatomy of a diamond (table, crown, girdle, pavilion, culet) and entry points
- [Collection](${abs("/collection")}): the stones currently listed, filterable by shape and carat
${certifications.map((c) => `- [${certificationTitle[c]} diamonds](${abs(certificationPath(c))}): ${diamondsByCertification(c).length} stone(s) currently listed`).join("\n")}
${shapes.map((s) => `- [${s} diamonds](${abs(shapePath(s))}): every ${s.toLowerCase()} stone in stock`).join("\n")}
- [FAQ](${abs("/faq")}): short answers about certification, shipping, the 4Cs and diamond anatomy
- [About](${abs("/about")}): who BMG Exports is and how it works
- [Contact / enquiry](${abs("/contact")}): send an enquiry; accepts an optional stone reference

## Current stones
Each stone has a permanent stock number such as BMG-0001. It is a single running number, so it is unique on its own and says nothing about the stone: look up a stone by typing /collection/<stock number> (for example /collection/bmg-0001). Quote it in any enquiry. A stone's page is /collection/<shape>/<stock number>.
${stones}

## Machine-readable data
- [Catalogue JSON](${abs("/api/diamonds")}): all stones as JSON. Optional filters: \`?shape=Oval\`, \`?min_carat=1\`, \`?max_carat=2\`
- [Sitemap](${abs("/sitemap.xml")})

## How to act on this site
- To enquire about a stone, open \`${abs("/contact")}?stone=<stock number>\`, for example \`${abs("/contact")}?stone=${diamonds[0] ? stoneCode(diamonds[0]) : "BMG-0001"}\`, and submit the form. The user should confirm before anything is sent.
- Pages expose WebMCP tools (list_diamonds, get_diamond, start_enquiry) to browser agents that support it.

## Frequently asked questions
${faq}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
