export default async function handler(req, res) {
  // ✅ CORS completo
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ GET só para teste
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "API studio viva. Use POST para gerar."
    });
  }

  // ✅ Só POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // ✅ Garantir que body existe
    let body = req.body;

    // Caso venha como string
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    if (!body) {
      return res.status(400).json({
        error: "Body vazio ou não parseado"
      });
    }

    const { imageBase64, finalPrompt } = body;

    if (!imageBase64 || !finalPrompt) {
      return res.status(400).json({
        error: "Campos ausentes",
        received: body
      });
    }

    // ✅ Dummy response
    return res.status(200).json({
      ok: true,
      promptPreview: finalPrompt.slice(0, 60),
      imageLength: imageBase64.length
    });
  } catch (err) {
    return res.status(500).json({
      error: "Crash no handler",
      details: err.message
    });
  }
}
