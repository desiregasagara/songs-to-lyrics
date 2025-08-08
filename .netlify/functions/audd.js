// netlify/functions/audd.js
const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    if (!process.env.AUDD_TOKEN) {
      return { statusCode: 500, body: 'Missing AUDD_TOKEN' };
    }

    // Netlify sends binary request bodies base64-encoded
    const buf = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8');

    const form = new FormData();
    form.append('api_token', process.env.AUDD_TOKEN);
    form.append('return', 'lyrics,spotify,deezer,apple_music');
    form.append('method', 'recognize');
    form.append('audio', buf, { filename: 'clip.webm', contentType: 'audio/webm' });

    const r = await fetch('https://api.audd.io/', { method: 'POST', body: form });
    const text = await r.text();

    return {
      statusCode: r.status,
      headers: { 'content-type': 'application/json' },
      body: text,
    };
  } catch (e) {
    return { statusCode: 500, body: e?.message || 'Server error' };
  }
};
