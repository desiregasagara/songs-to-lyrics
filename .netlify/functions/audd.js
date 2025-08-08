// netlify/functions/audd.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST")
      return { statusCode: 405, body: "Method Not Allowed" };
    if (!process.env.AUDD_TOKEN)
      return { statusCode: 500, body: "Missing AUDD_TOKEN" };

    // Netlify sends binary as base64
    const audioBuf = Buffer.from(
      event.body || "",
      event.isBase64Encoded ? "base64" : "utf8"
    );

    // Build multipart/form-data manually
    const boundary = "----auddboundary" + Date.now();
    const CRLF = "\r\n";
    const part = (name, value) =>
      Buffer.from(
        `--${boundary}${CRLF}` +
          `Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}` +
          `${value}${CRLF}`
      );
    const fileHeader = Buffer.from(
      `--${boundary}${CRLF}` +
        `Content-Disposition: form-data; name="file"; filename="clip.webm"${CRLF}` +
        `Content-Type: audio/webm${CRLF}${CRLF}`
    );
    const closing = Buffer.from(`${CRLF}--${boundary}--${CRLF}`);

    const body = Buffer.concat([
      part("api_token", process.env.AUDD_TOKEN),
      part("return", "lyrics,spotify,deezer,apple_music"),
      part("method", "recognize"),
      fileHeader,
      audioBuf,
      closing,
    ]);

    const r = await fetch("https://api.audd.io/", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });

    const text = await r.text();
    return {
      statusCode: r.status,
      headers: { "content-type": "application/json" },
      body: text,
    };
  } catch (e) {
    console.error("AUDD function error:", e);
    return { statusCode: 500, body: e?.message || "Server error" };
  }
};
