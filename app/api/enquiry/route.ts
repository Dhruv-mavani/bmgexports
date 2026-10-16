const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const enquiry = {
    name: str(body.name, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 30),
    stone: str(body.stone, 50),
    message: str(body.message, 2000),
  };

  if (!enquiry.name || !enquiry.message || !EMAIL.test(enquiry.email)) {
    return Response.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  // TODO: deliver by email (e.g. Resend). Until a provider is connected, enquiries are only logged.
  console.log("New enquiry", enquiry);

  return Response.json({ ok: true });
}
