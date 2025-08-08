exports.handler = async (event) => {
  try {
    const query = event.queryStringParameters.q;
    if (!query) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing query' }) };
    }

    const token = process.env.GENIUS_TOKEN;
    if (!token) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing GENIUS_TOKEN in env vars' }) };
    }

    const apiUrl = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: 'Genius API request failed' }) };
    }

    const data = await res.json();

    // Shape the response to only include what you need
    const hits = data.response?.hits?.map(h => ({
      title: h.result.title,
      artist: h.result.primary_artist.name,
      url: h.result.url,
      thumb: h.result.song_art_image_thumbnail_url
    })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ hits })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}