// api/studio.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // --- HEADERS CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // --- Preflight OPTIONS ---
  if (req.method === "OPTIONS") return res.status(200).end();

  // --- GET para teste ---
  if (req.method === "GET") {
    console.log("📥 GET recebido");
    return res.status(200).json({
      ok: true,
      message: "API studio viva. Use POST para gerar imagem e copy."
    });
  }

  // --- POST para gerar imagem/comercial ---
  if (req.method === "POST") {
    try {
      console.log("📥 Request body:", req.body);

      const { finalPrompt, imageBase64, imageSize } = req.body;

      // Validação mínima
      if (!finalPrompt || !imageBase64) {
        console.error("❌ Faltando finalPrompt ou imageBase64");
        return res.status(400).json({
          ok: false,
          error: "Faltando finalPrompt ou imageBase64"
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY não configurada no Vercel");

      // --- Payload para Gemini ---
      const payload = {
        prompt: finalPrompt,
        image: imageBase64.startsWith("data:image/")
          ? imageBase64
          : `data:image/png;base64,${imageBase64}`,
        ...(imageSize && { size: imageSize })
      };

      console.log("📤 Payload enviado ao Gemini:", payload);

      // --- Chamada à API Gemini ---
      const response = await fetch("https://api.gemini.com/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Erro da Gemini:", text);
        return res.status(response.status).json({ ok: false, error: text });
      }

      const data = await response.json();
      console.log("📥 Resposta do Gemini:", data);

      // --- Retorno para Lovable ---
      return res.status(200).json({
        ok: true,
        generatedImage: data.imageBase64 || null,
        generatedCopy: data.copy || null
      });

    } catch (err) {
      console.error("❌ Erro interno:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // --- Método não permitido ---
  return res.status(405).json({ ok: false, error: "Método não permitido" });
}
