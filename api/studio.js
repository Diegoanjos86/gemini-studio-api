// api/studio.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight CORS
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'API studio viva. Use POST para gerar.' });
  }

  if (req.method === 'POST') {
    try {
      const { finalPrompt, imageBase64 } = req.body;

      if (!finalPrompt || !imageBase64) {
        return res.status(400).json({ ok: false, error: 'Faltando finalPrompt ou imageBase64' });
      }

      const apiKey = process.env.GEMINI_API_KEY; // Pega do Vercel
      if (!apiKey) throw new Error('GEMINI_API_KEY não configurada');

      // Chamada ao Gemini (exemplo genérico, ajuste conforme API real)
      const response = await fetch('https://api.gemini.com/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          image: imageBase64,
          // você pode adicionar outros parâmetros que o Gemini aceitar
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({ ok: false, error: text });
      }

      const data = await response.json();

      // Supondo que o Gemini retorne { imageBase64: "...", copy: "..." }
      const result = {
        ok: true,
        generatedImage: data.imageBase64 || null,
        copy: data.copy || null,
      };

      return res.status(200).json(result);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // Método não permitido
  return res.status(405).json({ ok: false, error: 'Método não permitido' });
}
