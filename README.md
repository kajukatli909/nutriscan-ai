# 🥗 NutriScan AI - Intelligent Food Scanner & Health Impact Visualizer

> Scan your food using Google Gemini Multimodal AI to instantly unlock detailed nutritional breakdowns, evaluate dietary effectiveness, simulate cumulative long-term biological organ damage from junk foods, and receive clinical medical warnings (e.g. when having a fever, diabetes, or acid reflux).

---

## ✨ Key Capabilities

1. **Multimodal Food Scanner (Gemini Vision)**
   - 📸 **Live Webcam / Mobile Camera Scanning**: Direct camera viewfinder with scan animation and camera flip.
   - 📁 **Drag-and-Drop Image Upload**: Analyze any meal photo (JPG, PNG, WebP).
   - ✍️ **Natural Language Meal Descriptions**: Describe your ingredients or recipes in text.
   - ⚡ **Instant Offline Presets**: Includes pre-analyzed meals (Double Bacon Cheeseburger & Fries, Mediterranean Salmon Quinoa Bowl, Trio of Glazed Donuts) to test without delay.

2. **Nutritional & Metabolic Profile**
   - Calories, Protein, Net Carbs, Total Fats, Saturated/Trans Fats, Fiber, Sugars, Sodium, and Cholesterol.
   - **Interactive Calorie-Macro Donut Chart** and Daily Value (% DV) comparison bars.
   - Micronutrient grid (Vitamins C, D, B9, Calcium, Iron, Potassium, Magnesium, Zinc).
   - Satiety duration index and metabolic efficiency rating.
   - **Health Score (0–100)** and **NOVA Food Processing Group (1 to 4)**.

3. **Junk Food & Long-Term Cumulative Biological Damage Engine**
   - **Chronological Pathology Timeline**:
     - *Short Term (Hours to 1 Week)*: Glucose spikes, arterial stiffness, digestive sluggishness, brain fog.
     - *1–3 Months*: Visceral adipose fat accumulation, LDL elevation, early insulin desensitization.
     - *1–5 Years*: Progression toward Fatty Liver (NAFLD/MASLD), atherosclerosis plaque buildup, hypertension.
     - *10+ Years*: Significant risk elevation for Type 2 Diabetes, Coronary Artery Disease, chronic inflammation.
   - **Organ-Specific Impact Dashboard**: Evaluates severity and biological mechanisms for the **Heart & Arteries**, **Liver**, **Pancreas**, **Gut Microbiome**, **Brain**, and **Kidneys**.

4. **Medical Contraindications & "When NOT to Eat" Advisor**
   - 🤒 **Acute Illness Warnings**:
     - **Fever & Viral Infections**: Explains why high-fat, high-sodium foods impair immunity and burden digestion during fever.
     - **Acid Reflux / GERD**: Triggers, gastric acidity, and lower esophageal sphincter relaxation.
     - **Diarrhea & Gastroenteritis**: High fats, roughage, and sugars worsening osmotic diarrhea.
     - **Respiratory / Sore Throat**: Mucus-aggravating and pharyngeal-abrasive ingredients.
   - 🩺 **Chronic Diseases**: Type 2 Diabetes, Hypertension, Kidney Disease (CKD), High Cholesterol, and Gout.
   - 💊 **Medication Interactions**: Highlights potential food-drug conflicts (e.g. ACE inhibitors, statins, blood thinners).
   - 🎯 **Active Health Profile Filter**: Toggle active health conditions to dynamically prioritize alerts.

5. **Smart Swaps & Harm Mitigation Protocol**
   - 2–3 satisfying, nutrient-dense alternatives with calorie savings and damage reduction stats.
   - Actionable 4-step immediate harm reduction checklist if you consume the meal today (e.g. post-meal walks, hydration, fiber sequencing).

6. **Interactive AI Clinical Nutritionist Chat**
   - Multi-turn conversation powered by Gemini to ask specific questions about the meal, workout nutrition, or custom recipe modifications.

7. **Print & Export Nutrition Card**
   - Print-ready stylesheet for doctors, dietitians, or personal health records.

---

## 🚀 Quick Start Guide

### 1. Open the App in Your Browser
Simply open `index.html` in any modern web browser, or serve it using any local static file server:

```bash
# Optional: using python or npx serve
python -m http.server 3000
# or
npx serve .
```

### 2. Configure Your Google Gemini API Key
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click the **"Set Gemini Key"** button in the top right navigation bar.
3. Paste your API key and click **"Test Connection"** to verify.
4. Select your preferred model (`gemini-3.5-flash-lite` (Default), `gemini-3.7-flash`, or `gemini-2.5-flash`).
5. Click **"Save Settings"**. Your key is securely stored in your local browser storage (`localStorage`).

---

## 📂 Project Structure

```
nutriscan-ai/
├── index.html              # Main single-page web app structure and responsive UI
├── css/
│   └── styles.css          # Glassmorphism, animations, badges, and print styles
├── js/
│   ├── app.js              # Application controller and event coordination
│   ├── gemini-service.js   # Gemini API client (Multimodal Vision + Structured JSON)
│   ├── camera.js           # Webcam & mobile camera stream capture module
│   ├── ui-renderer.js      # DOM visualizer for macros, timelines, organ map & alerts
│   └── nutrition-data.js   # Preset meals, fallback datasets & medical knowledge
└── README.md               # Documentation and usage guide
```

---

## 🔒 Privacy & Security Note
- Your Gemini API Key is stored only in your local browser's `localStorage` and is never sent to any third-party backend servers—only directly to Google's official Gemini API endpoint.
