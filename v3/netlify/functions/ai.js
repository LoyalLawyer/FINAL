exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const key = process.env.GROQ_API_KEY;
  if (!key) return { statusCode: 500, headers, body: JSON.stringify({ error: 'GROQ_API_KEY not set in Netlify environment variables' }) };

  let parsed;
  try { parsed = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bad request' }) }; }

  const { prompt } = parsed;

  let resp;
  try {
    resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024
      })
    });
  } catch(e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Network error: ' + e.message }) };
  }

  const rawText = await resp.text();
  if (!resp.ok) return { statusCode: resp.status, headers, body: JSON.stringify({ error: 'Groq error ' + resp.status + ': ' + rawText.slice(0, 400) }) };

  let data;
  try { data = JSON.parse(rawText); }
  catch(e) { return { statusCode: 500, headers, body: JSON.stringify({ error: 'Parse error', raw: rawText.slice(0, 300) }) }; }

  const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!text) return { statusCode: 500, headers, body: JSON.stringify({ error: 'No response from Groq', raw: rawText.slice(0, 300) }) };

  return { statusCode: 200, headers, body: JSON.stringify({ text: text, sources: [] }) };
};

