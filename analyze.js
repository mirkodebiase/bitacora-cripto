// Esta función corre en el servidor de Vercel, nunca en el navegador del visitante.
// La API key vive en una variable de entorno (ANTHROPIC_API_KEY) que configurás en el
// panel de Vercel, así que nunca viaja al cliente ni queda visible en el código fuente.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en las variables de entorno de Vercel.' });
    return;
  }

  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) {
    res.status(500).json({ error: 'Falta configurar APP_PASSWORD en las variables de entorno de Vercel.' });
    return;
  }
  const providedPassword = req.headers['x-app-password'];
  if (!providedPassword || providedPassword !== appPassword) {
    res.status(401).json({ error: 'Contraseña de acceso incorrecta.' });
    return;
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Falta el campo "prompt" en la solicitud.' });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'Error al consultar Anthropic.' });
      return;
    }

    const text = (data.content || [])
      .map((block) => block.text || '')
      .filter(Boolean)
      .join('\n');

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: 'Error inesperado del servidor: ' + err.message });
  }
};
