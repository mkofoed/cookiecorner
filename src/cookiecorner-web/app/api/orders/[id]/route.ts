type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://api:8080";
  const { id } = await context.params;

  const response = await fetch(`${apiBaseUrl}/api/orders/by-id/${id}`, {
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
