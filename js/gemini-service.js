/**
 * NutriScan AI - Gemini API Integration Service
 * Uses Google Gemini Multimodal Vision API (gemini-2.5-flash / gemini-3.7-flash)
 * with structured JSON schema outputs for deep nutritional, biological damage,
 * and medical contraindication analysis.
 */

import { CONFIG } from "../config.js";

export class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem("gemini_api_key") || CONFIG.DEFAULT_GEMINI_API_KEY || "";
    this.selectedModel = localStorage.getItem("gemini_selected_model") || CONFIG.DEFAULT_MODEL || "gemini-3.5-flash-lite";
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : "";
    if (this.apiKey) {
      localStorage.setItem("gemini_api_key", this.apiKey);
    } else {
      localStorage.removeItem("gemini_api_key");
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  setModel(modelName) {
    this.selectedModel = modelName;
    localStorage.setItem("gemini_selected_model", modelName);
  }

  getModel() {
    return this.selectedModel;
  }

  /**
   * Validates if the given API key is active by sending a minimal test query.
   */
  async testApiKey(keyToTest = null) {
    const key = keyToTest || this.apiKey;
    if (!key) throw new Error("No API key provided.");

    const url = `${this.baseUrl}/${this.selectedModel}:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Respond with the word 'OK' only." }] }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP error ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    return Boolean(data.candidates && data.candidates.length > 0);
  }

  /**
   * System Instruction / Schema definition for Gemini Food & Health Intelligence
   */
  getSystemPrompt() {
    return `You are an elite Clinical Nutritionist, Metabolic Health Specialist, and Toxicologist AI.
Your task is to analyze the provided food meal (from an image or detailed description) with clinical rigor, scientific accuracy, and compassionate health advocacy.

You must return a STRICT, VALID JSON OBJECT (no markdown backticks, raw JSON only) containing:
1. Food Name, Category, Estimated Portion Size, and whether it classifies as Junk / Ultra-Processed food.
2. Health Score (0 to 100), Nutri-Score grade (A, B, C, D, or E), and NOVA Processing Group (1 to 4 with clear rationale).
3. Exact Nutritional Values: Calories, Protein (g), Total Carbs (g), Healthy vs Bad Fats (g), Dietary Fiber (g), Total Sugars (g), Added Sugars (g), Sodium (mg), Cholesterol (mg), Saturated Fat (g), Trans Fat (g).
4. Micronutrients: Key vitamins and minerals present or deficient.
5. Effectiveness & Metabolic Profile: Satiety duration, metabolic efficiency, key benefits, and major drawbacks.
6. Cumulative Long-Term Damage Timeline if consumed frequently:
   - shortTerm (Hours to 1 Week): immediate glucose/lipid spikes, bloating, brain fog.
   - oneToThreeMonths: visceral fat, early insulin resistance, lipid dysregulation.
   - oneToFiveYears: hepatic steatosis/fatty liver, arterial plaque, hypertension.
   - tenPlusYears: cardiovascular disease, Type 2 Diabetes, chronic systemic inflammation.
7. Organ-Specific Impact Breakdown with severity ('Low', 'Moderate', 'High', 'Severe', 'Critical', or 'Protective') and biological mechanisms for:
   - Heart & Arteries
   - Liver
   - Pancreas & Blood Sugar
   - Gut Microbiome
   - Brain & Cognition
   - Kidneys
8. Medical Contraindications & "When NOT to Eat" Advisor:
   - Acute Illnesses: Specific warnings for Fever & Viral Infections (explain digestive burden & immune response), Acid Reflux/GERD, Diarrhea/Gastroenteritis, and Sore Throat/Cough.
   - Chronic Conditions: Type 2 Diabetes, Hypertension, Kidney Disease, High Cholesterol, Gout/Uric Acid, and IBS.
   - Medication Interactions: Common drug classes that may interact (e.g. blood pressure meds, blood thinners, statins, insulin).
9. Smart Healthy Swaps: 2 delicious, nutrient-dense alternatives with estimated calorie savings and damage reduction percentage.
10. Immediate Harm Mitigation / Damage Control Protocol: 4 actionable steps if someone eats this food today (e.g., walking, hydration, dietary fiber buffers, detox support).

Ensure your analysis is grounded in evidence-based medicine and biochemistry.`;
  }

  /**
   * Analyzes food from an image (base64) using Gemini Vision
   */
  async analyzeFoodImage(base64Data, mimeType = "image/jpeg", userHealthContext = "") {
    if (!this.hasApiKey()) {
      throw new Error("Gemini API key is required. Please add your key in the settings.");
    }

    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

    const promptText = `Analyze this food image comprehensively.
${userHealthContext ? `IMPORTANT USER HEALTH CONTEXT: The user reports the following active conditions: "${userHealthContext}". Give extra detailed, prominent warnings addressing these conditions.` : ""}

Return ONLY a valid JSON object strictly matching this schema:
{
  "name": "string",
  "category": "string",
  "portion": "string",
  "isJunkFood": boolean,
  "healthScore": number,
  "nutriScore": "A" | "B" | "C" | "D" | "E",
  "novaGroup": 1 | 2 | 3 | 4,
  "novaDescription": "string",
  "calories": number,
  "macros": {
    "protein": { "grams": number, "percentage": number, "status": "string" },
    "carbs": { "grams": number, "percentage": number, "status": "string" },
    "fats": { "grams": number, "percentage": number, "status": "string" },
    "fiber": { "grams": number, "percentage": number, "status": "string" },
    "sugars": { "grams": number, "percentage": number, "status": "string" },
    "addedSugars": { "grams": number, "percentage": number, "status": "string" },
    "sodium": { "mg": number, "percentage": number, "status": "string" },
    "cholesterol": { "mg": number, "percentage": number, "status": "string" },
    "saturatedFat": { "grams": number, "percentage": number, "status": "string" },
    "transFat": { "grams": number, "percentage": number, "status": "string" }
  },
  "micronutrients": [
    { "name": "string", "amount": "string", "dvPercent": number, "level": "string" }
  ],
  "effectiveness": {
    "satietyRating": "string",
    "metabolicEfficiency": "string",
    "benefits": ["string"],
    "drawbacks": ["string"]
  },
  "longTermDamage": {
    "isJunk": boolean,
    "damageSeverity": "string",
    "timeline": {
      "shortTerm": "string",
      "oneToThreeMonths": "string",
      "oneToFiveYears": "string",
      "tenPlusYears": "string"
    },
    "organImpacts": [
      {
        "organ": "string",
        "severity": "Low" | "Moderate" | "High" | "Severe" | "Critical" | "Protective",
        "score": number,
        "icon": "string",
        "summary": "string",
        "biologicalMechanism": "string"
      }
    ]
  },
  "medicalContraindications": {
    "acuteIllnesses": [
      {
        "condition": "string",
        "safeToEat": boolean,
        "severity": "string",
        "reason": "string"
      }
    ],
    "chronicConditions": [
      {
        "condition": "string",
        "safeToEat": boolean,
        "severity": "string",
        "warning": "string"
      }
    ],
    "medicationInteractions": ["string"]
  },
  "smartAlternatives": [
    {
      "name": "string",
      "calories": number,
      "calorieSavings": "string",
      "damageReduction": "string",
      "highlights": "string"
    }
  ],
  "harmMitigation": ["string"]
}`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: this.getSystemPrompt() }]
      },
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const url = `${this.baseUrl}/${this.selectedModel}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Gemini API error (${response.status}): ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("No response returned by Gemini model. Please try another image.");
    }

    return this.parseJsonResponse(rawText);
  }

  /**
   * Analyzes food from a text prompt or recipe description
   */
  async analyzeFoodText(foodText, userHealthContext = "") {
    if (!this.hasApiKey()) {
      throw new Error("Gemini API key is required. Please add your key in the settings.");
    }

    const promptText = `Analyze the following meal: "${foodText}".
${userHealthContext ? `IMPORTANT USER HEALTH CONTEXT: The user reports the following active conditions: "${userHealthContext}".` : ""}
Provide a complete, comprehensive nutritional, biological organ damage, and medical contraindication analysis in the requested JSON structure.`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: this.getSystemPrompt() }]
      },
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const url = `${this.baseUrl}/${this.selectedModel}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Gemini API error (${response.status}): ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("No response returned by Gemini model.");
    }

    return this.parseJsonResponse(rawText);
  }

  /**
   * Follow-up AI Clinical Nutritionist conversation about the current meal
   */
  async askNutritionQuestion(foodAnalysisData, userQuestion, conversationHistory = []) {
    if (!this.hasApiKey()) {
      throw new Error("Gemini API key is required to chat with the AI Clinical Nutritionist.");
    }

    const systemPrompt = `You are NutriScan AI's Chief Clinical Nutritionist and Metabolic Health Consultant.
You are discussing this specific scanned meal:
Food: ${foodAnalysisData.name}
Calories: ${foodAnalysisData.calories} kcal
Is Junk Food: ${foodAnalysisData.isJunkFood ? "Yes" : "No"}
Health Score: ${foodAnalysisData.healthScore}/100
NutriScore: ${foodAnalysisData.nutriScore}
Key Warnings: ${foodAnalysisData.medicalContraindications?.acuteIllnesses?.map(i => `${i.condition}: ${i.reason}`).join("; ") || "None"}

Provide precise, evidence-based, practical medical & nutritional advice in response to the user's question. Be direct, helpful, empathetic, and scientifically rigorous. Use markdown formatting with bullet points.`;

    const formattedContents = [];

    // Append history
    for (const msg of conversationHistory) {
      formattedContents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      });
    }

    // Append current user question
    formattedContents.push({
      role: "user",
      parts: [{ text: userQuestion }]
    });

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    const url = `${this.baseUrl}/${this.selectedModel}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || "Failed to generate answer from Gemini.");
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  }

  /**
   * Robust JSON parser with cleansing for code blocks
   */
  parseJsonResponse(rawText) {
    try {
      let cleaned = rawText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
      }
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", rawText, e);
      throw new Error("Failed to parse Gemini API response into structured nutritional data.");
    }
  }
}
