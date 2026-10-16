import { diamonds } from "@/data/diamonds";
import { abs, SITE } from "@/lib/site";

// Public, read-only catalogue for AI assistants and agents. Filters: ?shape=, ?min_carat=, ?max_carat=
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const shape = params.get("shape")?.toLowerCase();
  const min = Number(params.get("min_carat") ?? 0);
  const max = Number(params.get("max_carat") ?? Infinity);

  const results = diamonds
    .filter((d) => (!shape || d.shape.toLowerCase() === shape) && d.carat >= min && d.carat <= max)
    .map((d) => ({
      id: d.id,
      name: `${d.carat.toFixed(2)} ct ${d.shape}`,
      shape: d.shape,
      carat: d.carat,
      colour: d.color,
      clarity: d.clarity,
      cut: d.cut,
      certificate: d.certificate,
      url: abs(`/collection/${d.id}`),
      enquiry_url: abs(`/contact?stone=${d.id}`),
      image: abs(d.image),
    }));

  return Response.json(
    { source: SITE.url, note: "Prices are quoted on request. Send an enquiry via enquiry_url.", count: results.length, diamonds: results },
    { headers: { "Cache-Control": "public, max-age=300", "Access-Control-Allow-Origin": "*" } },
  );
}
