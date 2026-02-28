require('dotenv').config();

exports.chatWithGemini = async (req, res) => {
  const userMessage = req.body.message;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing in backend .env" });
  }

  try {
    // STEP 1: Dynamically find a working model
    console.log("🔍 Finding available models...");
    const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const modelsResponse = await fetch(modelsUrl);
    const modelsData = await modelsResponse.json();

    if (!modelsData.models) {
      console.error("ListModels Failed:", modelsData);
      throw new Error("Could not fetch model list from Google.");
    }

    // Find the first model that supports 'generateContent'
    // We prefer 'flash' or 'pro' if available
    let chosenModel = modelsData.models.find(m => 
      m.supportedGenerationMethods.includes("generateContent") && m.name.includes("flash")
    ) || modelsData.models.find(m => 
      m.supportedGenerationMethods.includes("generateContent") && m.name.includes("pro")
    ) || modelsData.models.find(m => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    if (!chosenModel) {
      throw new Error("No chat models available for this API Key.");
    }

    console.log(`✅ Using Model: ${chosenModel.name}`);

    // STEP 2: Send the Chat Request using the found model
    // chosenModel.name already looks like "models/gemini-1.5-flash"
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${chosenModel.name}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are a helpful academic assistant for SyncAcademia. Keep it short. Student says: ${userMessage}`
        }]
      }]
    };

    const chatResponse = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const chatData = await chatResponse.json();

    if (!chatResponse.ok) {
      console.error("Generation Failed:", JSON.stringify(chatData, null, 2));
      return res.status(chatResponse.status).json({ error: chatData.error?.message || "AI Generation failed" });
    }

    const replyText = chatData.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ reply: replyText });

  } catch (error) {
    console.error("Server Logic Error:", error);
    res.status(500).json({ error: error.message });
  }
};