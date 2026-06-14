import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb"
    }
  }
};

const MAX_DATA_URL_LENGTH = 16 * 1024 * 1024;

function buildPrompt({ material, color, lamelbreedte, montage }) {
  return `
You are an interior visualizer for Shutter Plaza, a premium but accessible shutter brand in the Netherlands.

TASK:
Edit the uploaded room/window photo by adding realistic custom-made interior shutters to the visible window(s).

STYLE SELECTION:
- Material: ${material || "wooden shutters"}
- Color: ${color || "warm white"}
- Slat width: ${lamelbreedte || "89 mm"}
- Mounting: ${montage || "inside the window frame"}

STRICT VISUAL RULES:
- Preserve the original room, wall colors, furniture, flooring, lighting, shadows, camera angle, and perspective.
- Only add shutters to the windows; do not replace the whole room.
- Make the shutters look realistic, premium, and installed in the correct perspective.
- Keep natural daylight and shadows consistent with the original image.
- Do not add text, logos, price tags, people, or unrealistic objects.
- Do not change the architecture except for adding shutters.
- If there are multiple windows, apply the same shutter style consistently.

OUTPUT:
A realistic before/after style interior visualization image showing how the selected shutters would look in the uploaded room.`.trim();
}

function extractGeneratedImage(response) {
  const imageOutput = response.output
    ?.filter((output) => output.type === "image_generation_call")
    ?.map((output) => output.result)
    ?.find(Boolean);

  if (imageOutput) return imageOutput;

  // Fallback parser for future/alternate response shapes
  const json = JSON.stringify(response);
  const match = json.match(/"result"\s*:\s*"([A-Za-z0-9+/=]+)"/);
  return match?.[1] || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, material, color, lamelbreedte, montage } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY ontbreekt op de server." });
    }

    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Upload een geldige afbeelding." });
    }

    if (image.length > MAX_DATA_URL_LENGTH) {
      return res.status(413).json({ error: "Afbeelding is te groot. Gebruik maximaal ongeveer 10 MB." });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildPrompt({ material, color, lamelbreedte, montage });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: image }
          ]
        }
      ],
      tools: [{ type: "image_generation" }]
    });

    const base64Image = extractGeneratedImage(response);

    if (!base64Image) {
      return res.status(502).json({ error: "AI heeft geen afbeelding teruggegeven. Probeer een duidelijkere raamfoto." });
    }

    return res.status(200).json({
      image: `data:image/png;base64,${base64Image}`,
      promptUsed: prompt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "AI visualisatie mislukt. Controleer je API-key, modeltoegang en probeer opnieuw.",
      details: error?.message || "Unknown error"
    });
  }
}
