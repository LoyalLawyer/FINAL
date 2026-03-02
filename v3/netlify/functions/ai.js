exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const key = process.env.GEMINI_API_KEY;
  if (!key) return { statusCode: 500, headers, body: JSON.stringify({ error: 'GEMINI_API_KEY not set in Netlify environment variables' }) };

  let parsed;
  try { parsed = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bad request' }) }; }

  const { prompt, search } = parsed;
  const model = search ? 'gemini-2.0-flash' : 'gemini-2.0-flash';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + key;

  const reqBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
  };

  if (search) reqBody.tools = [{ googleSearch: {} }];

  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    });
  } catch(e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Network error: ' + e.message }) };
  }

  const rawText = await resp.text();
  if (!resp.ok) return { statusCode: resp.status, headers, body: JSON.stringify({ error: 'Gemini error ' + resp.status + ': ' + rawText.slice(0, 400) }) };

  let data;
  try { data = JSON.parse(rawText); }
  catch(e) { return { statusCode: 500, headers, body: JSON.stringify({ error: 'Parse error', raw: rawText.slice(0, 300) }) }; }

  const candidate = data.candidates && data.candidates[0];
  if (!candidate) return { statusCode: 500, headers, body: JSON.stringify({ error: 'No response from Gemini', raw: rawText.slice(0, 300) }) };

  const text = (candidate.content && candidate.content.parts || []).filter(p => p.text).map(p => p.text).join('');
  const sources = ((candidate.groundingMetadata && candidate.groundingMetadata.groundingChunks) || []).filter(c => c.web).map(c => ({ title: c.web.title, url: c.web.uri }));

  return { statusCode: 200, headers, body: JSON.stringify({ text, sources }) };
};

