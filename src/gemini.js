import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API Key yako
const API_KEY = "AIzaSyB_PGoABlGxRShYQ0vRbnxUg41H32vGoj4";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateMarketingContent = async (category, prompt, businessInfo) => {
  try {
    // Tunatumia gemini-1.5-flash - hii ndiyo model bora na ya bure kwa sasa
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `
      Wewe ni msaidizi bingwa wa masoko nchini Tanzania.
      Biashara: ${businessInfo?.name || "Biashara Yangu"}
      Kazi: Tengeneza ${category} ya kuvutia kwa: "${prompt}"
      Lugha: Kiswahili na Kiingereza (Sheng ya kibiashara).
      Toa maudhui pekee ya tangazo bila maelezo ya ziada.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("AI haijatoa jibu.");
    return text;

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Hapa tunaonyesha kosa halisi kutoka Google ili tujue kama ni API Key au kitu kingine
    return `Hitilafu ya AI: ${error.message}. Tafadhali hakikisha API Key yako ni sahihi kutoka Google AI Studio.`;
  }
};

export const generateLeads = async (businessInfo) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    return [];
  } catch (error) {
    return [];
  }
};
