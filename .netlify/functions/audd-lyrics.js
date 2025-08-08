export default async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    if (!process.env.AUDD_TOKEN) {
      return { statusCode: 500, body: "Missing AUDD_TOKEN" };
    }
    const q = new URLSearchParams(event.queryStringParameters || {}).get("q");
    if (!q) return { statusCode: 400, body: "Missing q" };
    const url = `https://api.audd.io/findLyrics/?q=${encodeURIComponent(q)}&api_token=${encodeURIComponent(process.env.AUDD_TOKEN)}`;
    const r = await fetch(url);
    const text = await r.text();
    return {
      statusCode: r.status,
      headers: { "content-type": "application/json" },
      body: text
    };
  } catch (e) {
    return { statusCode: 500, body: e?.message || "Server error" };
  }
};