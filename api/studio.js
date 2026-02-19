export default async function handler(req, res) {
  // ✅ CORS completo
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight (browser exige)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Só aceitamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { imageBase64, finalPrompt } = req.body;

    if (!imageBase64 || !finalPrompt) {
      return res.status(400).json({
        error: "Missing imageBase64 or finalPrompt"
      });
    }

    // ✅ Resposta dummy (ainda sem Gemini)
    return res.status(200).json({
      ok: true,
      receivedPrompt: finalPrompt.slice(0, 80),
      imageSize: imageBase64.length
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
`
