export default async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    const { ACRCLOUD_HOST, ACRCLOUD_ACCESS_KEY, ACRCLOUD_ACCESS_SECRET } = process.env;
    if (!ACRCLOUD_HOST || !ACRCLOUD_ACCESS_KEY || !ACRCLOUD_ACCESS_SECRET) {
      return { statusCode: 500, body: "Missing ACRCloud env vars" };
    }
    const buf = Buffer.from(event.body || "", "base64");
    const contentType = "application/octet-stream";
    const contentLength = buf.length;
    const now = new Date().toUTCString();
    const stringToSign = [
      "POST",
      "/v1/identify",
      `host:${ACRCLOUD_HOST}`,
      `date:${now}`,
      `content-type:${contentType}`,
      `content-length:${contentLength}`,
      "",
      ""
    ].join("\n");
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(ACRCLOUD_ACCESS_SECRET),
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"]
    );
    const sigArrayBuf = await crypto.subtle.sign("HMAC", key, enc.encode(stringToSign));
    const sig = Buffer.from(sigArrayBuf).toString("base64");
    const auth = `ACR ${ACRCLOUD_ACCESS_KEY}:${sig}`;
    const r = await fetch(`https://${ACRCLOUD_HOST}/v1/identify`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(contentLength),
        "Authorization": auth,
        "Date": now
      },
      body: buf
    });
    const json = await r.json();
    if (!json || json.status?.code !== 0 || !json.metadata) {
      return { statusCode: 200, body: JSON.stringify(null) };
    }
    const m = (json.metadata.humming || json.metadata.music || [])[0];
    if (!m) return { statusCode: 200, body: JSON.stringify(null) };
    const result = {
      title: m.title,
      artist: (m.artists || []).map(a => a.name).join(", "),
      album: m.album?.name || "",
      release_date: m.release_date || "",
      score: m.score || json.metadata.score || 0,
      song_link: m.external_urls?.[0]?.url || ""
    };
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result)
    };
  } catch (e) {
    return { statusCode: 500, body: e?.message || "Server error" };
  }
};