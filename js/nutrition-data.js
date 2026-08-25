/**
 * NutriScan AI - Knowledge Base & Preset Food Datasets
 * Provides comprehensive test meals, medical condition profiles, and organ biological impact definitions.
 */

export const SAMPLE_FOODS = [
  {
    id: "cheeseburger-fries",
    name: "Double Bacon Cheeseburger with Large French Fries & Soda",
    category: "Fast Food / Ultra-Processed",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    portion: "1 meal combo (~580g total)",
    isJunkFood: true,
    healthScore: 18,
    nutriScore: "E",
    novaGroup: 4,
    novaDescription: "Ultra-Processed Food Product containing multiple industrial additives, hydrogenated oils, and flavor enhancers.",
    calories: 1240,
    macros: {
      protein: { grams: 42, percentage: 14, status: "moderate" },
      carbs: { grams: 135, percentage: 44, status: "excessive" },
      fats: { grams: 62, percentage: 42, status: "dangerously_high" },
      fiber: { grams: 4.5, percentage: 18, status: "deficient" },
      sugars: { grams: 68, percentage: 136, status: "critical_high" },
      addedSugars: { grams: 55, percentage: 110, status: "critical_high" },
      sodium: { mg: 1850, percentage: 80, status: "very_high" },
      cholesterol: { mg: 145, percentage: 48, status: "high" },
      saturatedFat: { grams: 24, percentage: 120, status: "critical_high" },
      transFat: { grams: 2.2, percentage: 110, status: "dangerous" }
    },
    micronutrients: [
      { name: "Calcium", amount: "280mg", dvPercent: 22, level: "moderate" },
      { name: "Iron", amount: "4.8mg", dvPercent: 27, level: "good" },
      { name: "Potassium", amount: "520mg", dvPercent: 11, level: "low" },
      { name: "Vitamin C", amount: "4mg", dvPercent: 4, level: "deficient" },
      { name: "Zinc", amount: "6.2mg", dvPercent: 56, level: "good" },
      { name: "Vitamin D", amount: "0.2mcg", dvPercent: 1, level: "deficient" }
    ],
    effectiveness: {
      satietyRating: "Short-lived (Crash in ~90 mins)",
      metabolicEfficiency: "Very Low — triggers steep insulin spike followed by reactive hypoglycemia and lethargy.",
      benefits: [
        "Provides fast caloric energy and complete beef protein for short-term muscle repair.",
        "Contains dietary heme iron and zinc from ground beef."
      ],
      drawbacks: [
        "Extreme caloric density with minimal micronutrient and antioxidant protection.",
        "High advanced glycation end-products (AGEs) from high-heat deep frying."
      ]
    },
    longTermDamage: {
      isJunk: true,
      damageSeverity: "Severe",
      timeline: {
        shortTerm: "Immediate 2-hour blood sugar and triglyceride surge. Arterial stiffness increases by up to 25% post-meal. Causes post-prandial somnolence ('food coma') and gastrointestinal bloating.",
        oneToThreeMonths: "Accelerated accumulation of deep visceral adipose tissue around vital abdominal organs. Early desensitization of muscle insulin receptors, elevated small dense LDL particles, and skin inflammation.",
        oneToFiveYears: "Progression towards Non-Alcoholic Fatty Liver Disease (NAFLD / MASLD). Arterial endothelial wall plaque buildup (early atherosclerosis), sustained pre-hypertension, and disrupted leptin signaling causing chronic overeating.",
        tenPlusYears: "Significantly elevated risk of Type 2 Diabetes (3.5x higher), Coronary Artery Disease, chronic kidney microvascular strain, and systemic low-grade chronic inflammation (elevated hs-CRP) accelerating biological aging."
      },
      organImpacts: [
        {
          organ: "Heart & Blood Vessels",
          severity: "Critical",
          score: 88,
          icon: "heart-pulse",
          summary: "Trans fats and 24g saturated fats elevate ApoB and small dense LDL particles. 1,850mg sodium triggers immediate fluid retention and elevated arterial pressure.",
          biologicalMechanism: "Endothelial dysfunction and foam cell accumulation in coronary arteries leading to atherosclerotic plaque."
        },
        {
          organ: "Liver",
          severity: "Severe",
          score: 82,
          icon: "activity",
          summary: "High-fructose corn syrup in the soda directly overloads hepatic de novo lipogenesis, driving non-alcoholic fatty liver changes.",
          biologicalMechanism: "Hepatic steatosis and mitochondrial oxidative stress in hepatocytes."
        },
        {
          organ: "Pancreas & Metabolism",
          severity: "Severe",
          score: 85,
          icon: "zap",
          summary: "Massive combined carbohydrate and fat bolus forces extreme beta-cell insulin hypersecretion, exhausting pancreatic reserve over time.",
          biologicalMechanism: "Beta-cell burnout, hyperinsulinemia, and progressive peripheral insulin resistance."
        },
        {
          organ: "Gut Microbiome",
          severity: "High",
          score: 78,
          icon: "shield-alert",
          summary: "Absence of prebiotic fiber combined with emulsifiers and oxidized fry oils starves beneficial short-chain fatty acid (SCFA) producers like Akkermansia.",
          biologicalMechanism: "Intestinal permeability (leaky gut) and lipopolysaccharide (LPS) translocation into circulation."
        },
        {
          organ: "Brain & Cognition",
          severity: "Moderate",
          score: 65,
          icon: "brain",
          summary: "Rapid sugar crash impairs prefrontal cortex executive focus and promotes neuroinflammation in the hippocampus over extended periods.",
          biologicalMechanism: "Disrupted brain-derived neurotrophic factor (BDNF) and neurovascular inflammatory signaling."
        }
      ]
    },
    medicalContraindications: {
      acuteIllnesses: [
        {
          condition: "Fever & Viral Infections",
          safeToEat: false,
          severity: "High Risk",
          reason: "During fever, the metabolic priority is immune defense, not heavy digestion. The 62g of heavy fats and sodium slow gastric emptying, cause nausea, worsen dehydration, and fuel systemic inflammatory prostaglandins. Opt for clear broths, coconut water, or rice soup instead."
        },
        {
          condition: "Acid Reflux / GERD / Gastritis",
          safeToEat: false,
          severity: "Critical Risk",
          reason: "Greasy fried beef and fries delay stomach emptying and trigger lower esophageal sphincter (LES) relaxation, causing severe acid regurgitation, heartburn, and gastric mucosal irritation."
        },
        {
          condition: "Diarrhea / Food Poisoning / Gastroenteritis",
          safeToEat: false,
          severity: "Critical Risk",
          reason: "Greasy trans fats, processed cheese, and excess fructose cause osmotic fluid shifts in the bowel, worsening cramping, watery stool, and electrolyte depletion."
        },
        {
          condition: "Sore Throat & Respiratory Illness",
          safeToEat: false,
          severity: "Moderate Risk",
          reason: "Crispy abrasive fried textures irritate inflamed pharyngeal mucosa, while high dairy cheese can cause perceived mucus thickening."
        }
      ],
      chronicConditions: [
        {
          condition: "Type 2 Diabetes / Pre-Diabetes",
          safeToEat: false,
          severity: "Critical Risk",
          warning: "Contains 135g carbs with 68g sugar. Causes rapid glycemic spike followed by prolonged high triglycerides."
        },
        {
          condition: "Hypertension / High Blood Pressure",
          safeToEat: false,
          severity: "Critical Risk",
          warning: "1,850mg sodium provides 80% of daily limit in a single meal, inducing immediate arterial vasoconstriction and fluid retention."
        },
        {
          condition: "High Cholesterol / CAD",
          safeToEat: false,
          severity: "Critical Risk",
          warning: "Excess saturated & trans fats promote atherogenic dyslipidemia and elevate circulating LDL-C."
        },
        {
          condition: "Gout / Hyperuricemia",
          safeToEat: false,
          severity: "High Risk",
          warning: "High-fructose corn syrup accelerates purine breakdown into uric acid, triggering acute gout flare-ups."
        },
        {
          condition: "Chronic Kidney Disease (CKD)",
          safeToEat: false,
          severity: "Severe Risk",
          warning: "High sodium and phosphorus additives in processed cheese/soda place severe filtration workload on nephrons."
        }
      ],
      medicationInteractions: [
        "ACE Inhibitors / ARBs: High sodium directly antagonizes blood pressure lowering efficacy.",
        "Statins: High saturated fat meal blunts lipid-lowering therapeutic targets."
      ]
    },
    smartAlternatives: [
      {
        name: "Grilled Turkey or Bison Burger on Whole Grain with Sweet Potato Wedges",
        calories: 540,
        calorieSavings: "700 kcal saved (-56%)",
        damageReduction: "85% reduction in cardiovascular & liver strain",
        highlights: "Lean protein, 9g prebiotic fiber, beta-carotene, zero trans fats."
      },
      {
        name: "Air-Fried Portobello & Black Bean Burger with Side Salad & Sparkling Lemon Water",
        calories: 420,
        calorieSavings: "820 kcal saved (-66%)",
        damageReduction: "95% reduction in systemic inflammatory markers",
        highlights: "Rich in polyphenols, plant sterols, zero added sugars."
      }
    ],
    harmMitigation: [
      "🚶 Take a brisk 20-minute walk immediately to stimulate muscle GLUT-4 glucose uptake and reduce the insulin spike.",
      "💧 Drink 500-750ml of water with electrolytes to assist kidneys in flushing out the sodium load.",
      "🥗 Consume a fresh green salad or 5g psyllium husk beforehand to slow down lipid and carbohydrate absorption.",
      "🚫 Avoid alcoholic beverages or sugary desserts for the remainder of the day to protect your liver."
    ]
  },
  {
    id: "mediterranean-salmon-bowl",
    name: "Wild Salmon Quinoa Bowl with Avocado, Spinach, Walnuts & Olive Oil",
    category: "Whole Foods / Heart Healthy",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    portion: "1 whole bowl (~420g)",
    isJunkFood: false,
    healthScore: 96,
    nutriScore: "A",
    novaGroup: 1,
    novaDescription: "Unprocessed or minimally processed wholesome foods rich in natural micronutrients, fiber, and polyphenols.",
    calories: 580,
    macros: {
      protein: { grams: 38, percentage: 26, status: "excellent" },
      carbs: { grams: 46, percentage: 32, status: "optimal" },
      fats: { grams: 27, percentage: 42, status: "healthy_fats" },
      fiber: { grams: 11, percentage: 44, status: "excellent" },
      sugars: { grams: 3, percentage: 6, status: "minimal" },
      addedSugars: { grams: 0, percentage: 0, status: "zero" },
      sodium: { mg: 340, percentage: 15, status: "optimal_low" },
      cholesterol: { mg: 65, percentage: 22, status: "moderate" },
      saturatedFat: { grams: 3.8, percentage: 19, status: "low" },
      transFat: { grams: 0, percentage: 0, status: "zero" }
    },
    micronutrients: [
      { name: "Omega-3 (EPA/DHA)", amount: "2.4g", dvPercent: 150, level: "super_rich" },
      { name: "Potassium", amount: "980mg", dvPercent: 21, level: "excellent" },
      { name: "Vitamin D", amount: "14.2mcg", dvPercent: 71, level: "super_rich" },
      { name: "Vitamin C", amount: "32mg", dvPercent: 35, level: "good" },
      { name: "Magnesium", amount: "115mg", dvPercent: 28, level: "excellent" },
      { name: "Folate (B9)", amount: "180mcg", dvPercent: 45, level: "excellent" }
    ],
    effectiveness: {
      satietyRating: "Very High (Sustained 4–5 hours)",
      metabolicEfficiency: "Superior — slow complex carbohydrates and healthy monounsaturated lipids ensure smooth, stable energy without glucose dips.",
      benefits: [
        "Potent anti-inflammatory EPA/DHA omega-3 fatty acids lower systemic cytokines and protect vascular endothelium.",
        "High dietary fiber (11g) promotes butyrate-producing gut microbiota and optimizes lipid profiles.",
        "Rich in lutein, astaxanthin, and magnesium for cellular longevity and neurological preservation."
      ],
      drawbacks: ["None for general populations; moderate caloric density requires sensible portioning for strict deficit goals."]
    },
    longTermDamage: {
      isJunk: false,
      damageSeverity: "Zero / Protective",
      timeline: {
        shortTerm: "Smooth glycemic trajectory, balanced insulin response, optimal post-prandial cognitive clarity, and sustained satiety.",
        oneToThreeMonths: "Reduction in baseline systolic/diastolic blood pressure, improvement in HDL-to-triglyceride ratio, and enhanced skin elasticity.",
        oneToFiveYears: "Up to 35% reduced incidence of cardiovascular events, protection against age-related macular degeneration, and sustained insulin sensitivity.",
        tenPlusYears: "Preserved telomere length, enhanced neuroprotection against dementia/cognitive decline, and robust cardiometabolic resilience."
      },
      organImpacts: [
        {
          organ: "Heart & Blood Vessels",
          severity: "Protective",
          score: 5,
          icon: "heart",
          summary: "Omega-3s stabilize cardiac rhythm, decrease plaque vulnerability, and reduce arterial stiffness.",
          biologicalMechanism: "Upregulation of endothelial nitric oxide synthase (eNOS) and suppression of VCAM-1 adhesion molecules."
        },
        {
          organ: "Liver",
          severity: "Protective",
          score: 8,
          icon: "activity",
          summary: "Monounsaturated fats from extra virgin olive oil and avocado actively prevent triglyceride accumulation in hepatocytes.",
          biologicalMechanism: "PPAR-alpha receptor activation promoting hepatic fatty acid beta-oxidation."
        },
        {
          organ: "Pancreas & Metabolism",
          severity: "Protective",
          score: 10,
          icon: "zap",
          summary: "Quinoa and fiber ensure low glycemic load, preventing pancreatic beta-cell overstimulation.",
          biologicalMechanism: "Enhanced GLP-1 hormone secretion and improved peripheral glucose uptake."
        },
        {
          organ: "Gut Microbiome",
          severity: "Protective",
          score: 4,
          icon: "shield-check",
          summary: "11g of soluble and prebiotic fiber nourishes Bifidobacteria and stimulates protective short-chain fatty acid synthesis.",
          biologicalMechanism: "Enhanced intestinal mucin barrier and reduced endotoxemia."
        },
        {
          organ: "Brain & Cognition",
          severity: "Protective",
          score: 5,
          icon: "brain",
          summary: "DHA incorporates directly into neuronal phospholipid bilayers, supporting synaptic plasticity and memory.",
          biologicalMechanism: "Elevated BDNF and neuroprotective resolvin/protectin anti-inflammatory mediators."
        }
      ]
    },
    medicalContraindications: {
      acuteIllnesses: [
        {
          condition: "Fever & Viral Infections",
          safeToEat: true,
          severity: "Safe / Beneficial",
          reason: "Nutrient-dense with high bioavailable zinc, astaxanthin, and clean protein to aid immune cellular turnover. Eat smaller portions if appetite is suppressed."
        },
        {
          condition: "Acid Reflux / GERD",
          safeToEat: true,
          severity: "Safe (Use light dressing)",
          reason: "Non-greasy, non-spicy, easily digestible whole foods that do not trigger acid reflux when eaten slowly."
        },
        {
          condition: "Diarrhea / Acute Gastroenteritis",
          safeToEat: false,
          severity: "Moderate Caution",
          reason: "The 11g of high roughage fiber and nuts may accelerate bowel transit during acute active diarrhea. Switch to plain poached salmon and white rice until digestion stabilizes."
        }
      ],
      chronicConditions: [
        {
          condition: "Type 2 Diabetes / Pre-Diabetes",
          safeToEat: true,
          severity: "Highly Recommended",
          warning: "Optimal low glycemic index meal that improves long-term HbA1c control."
        },
        {
          condition: "Hypertension / High BP",
          safeToEat: true,
          severity: "Highly Recommended",
          warning: "High potassium (980mg) and low sodium actively assist blood pressure reduction."
        },
        {
          condition: "Chronic Kidney Disease (Late Stage 4/5)",
          safeToEat: false,
          severity: "Caution (Potassium & Phosphorus)",
          warning: "Patients with advanced kidney failure on potassium restriction should monitor salmon and avocado intake with their nephrologist."
        }
      ],
      medicationInteractions: [
        "Warfarin (Coumadin): Contains moderate spinach (Vitamin K). Maintain consistent intake to avoid INR fluctuations."
      ]
    },
    smartAlternatives: [
      {
        name: "Wild Sardine & Edamame Kale Bowl",
        calories: 490,
        calorieSavings: "Lighter calorie option",
        damageReduction: "Even higher calcium & omega-3 concentration",
        highlights: "Super sustainable small cold-water fish with negligible heavy metals."
      }
    ],
    harmMitigation: [
      "✨ This meal is already exceptionally protective and requires no damage mitigation!",
      "💧 Stay hydrated to help soluble fibers expand comfortably in the digestive tract."
    ]
  },
  {
    id: "glazed-donuts",
    name: "Trio of Glazed Cream-Filled Donuts with Chocolate Drizzle",
    category: "Bakery / High Sugar Junk",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    portion: "3 donuts (~240g)",
    isJunkFood: true,
    healthScore: 12,
    nutriScore: "E",
    novaGroup: 4,
    novaDescription: "Ultra-processed fried confectionery formulated with refined white flour, palm shortening, and pure sucrose syrup.",
    calories: 890,
    macros: {
      protein: { grams: 9, percentage: 4, status: "deficient" },
      carbs: { grams: 118, percentage: 53, status: "dangerous_sugar" },
      fats: { grams: 44, percentage: 43, status: "very_high" },
      fiber: { grams: 1.8, percentage: 7, status: "negligible" },
      sugars: { grams: 76, percentage: 152, status: "extreme" },
      addedSugars: { grams: 72, percentage: 144, status: "extreme" },
      sodium: { mg: 480, percentage: 21, status: "moderate" },
      cholesterol: { mg: 45, percentage: 15, status: "moderate" },
      saturatedFat: { grams: 19, percentage: 95, status: "critical_high" },
      transFat: { grams: 1.5, percentage: 75, status: "dangerous" }
    },
    micronutrients: [
      { name: "Calcium", amount: "60mg", dvPercent: 5, level: "low" },
      { name: "Iron", amount: "1.4mg", dvPercent: 8, level: "low" },
      { name: "Potassium", amount: "110mg", dvPercent: 2, level: "deficient" },
      { name: "Vitamin C", amount: "0mg", dvPercent: 0, level: "zero" },
      { name: "Vitamin D", amount: "0mcg", dvPercent: 0, level: "zero" }
    ],
    effectiveness: {
      satietyRating: "Extremely Poor (Intense hunger & sugar cravings in 45–60 mins)",
      metabolicEfficiency: "Harmful — triggers extreme blood sugar spike followed by precipitous insulin crash and dopamine-driven craving loops.",
      benefits: ["Instant burst of simple glucose."],
      drawbacks: ["Zero vital micronutrients, high inflammatory trans-fats, triggers rapid metabolic fatigue."]
    },
    longTermDamage: {
      isJunk: true,
      damageSeverity: "Critical",
      timeline: {
        shortTerm: "Spikes blood glucose above 180mg/dL in healthy individuals; causes acute endothelial glycocalyx impairment, tiredness, and mood swings.",
        oneToThreeMonths: "Promotes rapid visceral fat deposition and hepatic insulin resistance due to excessive liver fructose influx.",
        oneToFiveYears: "High Advanced Glycation End-products (AGEs) cross-link collagen, causing premature skin wrinkling and stiffened coronary vessels.",
        tenPlusYears: "Drastic escalation in metabolic syndrome risk, Type 2 diabetes development, and accelerated microvascular retinal/renal damage."
      },
      organImpacts: [
        {
          organ: "Pancreas & Metabolism",
          severity: "Critical",
          score: 95,
          icon: "zap",
          summary: "76g of rapid simple sugars forces maximal pancreatic insulin discharge, driving severe insulin desensitization over time.",
          biologicalMechanism: "Exhaustion of beta-cell secretory granules and glucotoxicity."
        },
        {
          organ: "Liver",
          severity: "Severe",
          score: 86,
          icon: "activity",
          summary: "Refined sugars and palm shortening drive hepatic fat storage, contributing to metabolic dysfunction-associated steatotic liver disease.",
          biologicalMechanism: "ChREBP and SREBP-1c transcription activation driving steatosis."
        },
        {
          organ: "Brain & Mood",
          severity: "High",
          score: 79,
          icon: "brain",
          summary: "Hijacks the mesolimbic dopamine reward center similarly to addictive substances, causing intense withdrawal cravings.",
          biologicalMechanism: "Dopamine D2 receptor downregulation and neuroinflammatory signaling."
        },
        {
          organ: "Heart & Arteries",
          severity: "High",
          score: 75,
          icon: "heart-pulse",
          summary: "Sugar spikes increase circulating oxidized LDL particles and promote acute systemic inflammation.",
          biologicalMechanism: "Glycation of vascular wall proteins and oxidative stress."
        }
      ]
    },
    medicalContraindications: {
      acuteIllnesses: [
        {
          condition: "Fever & Bacterial/Viral Infection",
          safeToEat: false,
          severity: "Severe Risk",
          reason: "High sugar intake temporarily suppresses phagocytic white blood cell activity and increases inflammatory cytokine release, delaying recovery. Avoid completely during fever."
        },
        {
          condition: "Acid Reflux / GERD",
          safeToEat: false,
          severity: "High Risk",
          reason: "High sugar and deep-fried fats increase gastric acid secretion and lower esophageal sphincter weakness."
        },
        {
          condition: "Diarrhea / Upset Stomach",
          safeToEat: false,
          severity: "Critical Risk",
          reason: "Simple sugars draw excess water into the intestinal lumen (osmotic diarrhea), aggravating stomach cramps and loose stool."
        }
      ],
      chronicConditions: [
        {
          condition: "Type 1 & Type 2 Diabetes",
          safeToEat: false,
          severity: "Dangerous",
          warning: "Severe glycemic spike risk; requires large insulin bolus and risks severe post-prandial hyperglycemia."
        },
        {
          condition: "Non-Alcoholic Fatty Liver (NAFLD)",
          safeToEat: false,
          severity: "Critical Risk",
          warning: "Direct fuel for hepatic lipid synthesis and liver inflammation."
        }
      ],
      medicationInteractions: [
        "Metformin / SGLT2 Inhibitors / Insulin: Severely interferes with glycemic stability and requires monitoring."
      ]
    },
    smartAlternatives: [
      {
        name: "Baked Cinnamon Apple Slices with Greek Yogurt & Almond Butter",
        calories: 220,
        calorieSavings: "670 kcal saved (-75%)",
        damageReduction: "92% reduction in glycemic spike",
        highlights: "Natural sweetness, 15g protein, 6g pectin fiber, zero refined trans fats."
      },
      {
        name: "Dark Chocolate (85%) Dipped Strawberries with Walnuts",
        calories: 180,
        calorieSavings: "710 kcal saved (-80%)",
        damageReduction: "Cardioprotective flavonoids & polyphenols",
        highlights: "Rich in antioxidants with minimal sugar impact."
      }
    ],
    harmMitigation: [
      "🚶 Walk for 20-30 minutes immediately to activate GLUT-4 glucose transporters without needing excess insulin.",
      "🍵 Drink green tea or apple cider vinegar in water to help dampen the peak glucose response.",
      "🥗 Eat high-protein foods (boiled eggs, chicken breast, or protein shake) next to avoid further sugar craving cascades."
    ]
  }
];

export const MEDICAL_CONDITIONS_LIST = [
  { id: "fever", name: "Fever & Viral Infection", icon: "thermometer", category: "Acute Illness" },
  { id: "gerd", name: "Acid Reflux / GERD / Gastritis", icon: "flame", category: "Acute / Digestive" },
  { id: "diarrhea", name: "Diarrhea / Stomach Bug", icon: "alert-triangle", category: "Acute / Digestive" },
  { id: "sore_throat", name: "Cold, Cough & Sore Throat", icon: "wind", category: "Acute Respiratory" },
  { id: "diabetes", name: "Type 2 Diabetes / Pre-Diabetes", icon: "activity", category: "Chronic Metabolic" },
  { id: "hypertension", name: "Hypertension / High BP", icon: "heart", category: "Cardiovascular" },
  { id: "kidney", name: "Kidney Disease (CKD)", icon: "shield", category: "Renal" },
  { id: "gout", name: "Gout & High Uric Acid", icon: "zap", category: "Metabolic" },
  { id: "cholesterol", name: "High Cholesterol / CAD", icon: "heart-pulse", category: "Cardiovascular" }
];
