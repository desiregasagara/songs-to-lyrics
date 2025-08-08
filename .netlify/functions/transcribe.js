// netlify/functions/transcribe.js
// Optional server-side speech-to-text fallback using OpenAI Whisper
// ENV REQUIRED: OPENAI_API_KEY
// Be sure to add a redirect in netlify.toml:
// [[redirects]]
//   from = "/api/transcribe"
//   to = "/.netlify/functions/transcribe"
//   status = 200

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: 'Missing OPENAI_API_KEY' };
    }

    // Browser posts raw binary (audio/webm) to this function
    const audioBuf = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8');

    // Build multipart/form-data body manually (no deps)
    const boundary = '----whisper' + Date.now();
    const CRLF = '\r\n';

    const part = (name, value) => Buffer.from(
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
      part('model', 'whisper-1'),
      fileHeader,
      audioBuf,
      closing,
    ]);

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': String(body.length)
      },
      body
    });

    const text = await r.text();
    return {
      statusCode: r.status,
      headers: { 'content-type': 'application/json' },
      body: text
    };
  } catch (e) {
    console.error('transcribe error', e);
    return { statusCode: 500, body: e?.message || 'Server error' };
  }
};
