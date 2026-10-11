
export default async (request) => {
  const headers = {
    "Content-Type": "application/json"
  };

  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Snap MC applications API is running!"
    }),
    { status: 200, headers }
  );
};
