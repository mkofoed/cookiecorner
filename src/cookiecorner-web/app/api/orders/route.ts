export async function GET() {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://api:8080";

  const response = await fetch(`${apiBaseUrl}/api/orders`, {
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function POST(request: Request) {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://api:8080";
  const body = await request.text();

  const response = await fetch(`${apiBaseUrl}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
