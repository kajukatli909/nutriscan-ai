/**
 * NutriScan AI - UI Renderer
 * Renders all dynamic components: Nutritional meters, Long-term damage timeline,
 * Organ impact visual cards, Medical contraindication alerts, and Smart swaps.
 */

export class UIRenderer {
  constructor() {
    this.macroChartInstance = null;
  }

  /**
   * Main entry point to render all food analysis panels
   */
  renderFoodAnalysis(data, container, activeConditions = []) {
    if (!data) return;

    // Header Overview
    this.renderHeaderOverview(data);

    // Tab 1: Nutritional Profile & Macros
    this.renderNutritionProfile(data);

    // Tab 2: Long-Term Cumulative Damage
    this.renderLongTermDamage(data);

    // Tab 3: Medical Contraindications & Acute Illnesses ("When NOT to Eat")
    this.renderMedicalContraindications(data, activeConditions);

    // Tab 4: Smart Swaps & Harm Mitigation
    this.renderSmartSwaps(data);
  }

  /**
   * Renders the top summary banner with Health Score, NutriScore, and NOVA group
   */
  renderHeaderOverview(data) {
    const titleEl = document.getElementById("foodTitle");
    const categoryEl = document.getElementById("foodCategory");
    const portionEl = document.getElementById("foodPortion");
    const caloriesEl = document.getElementById("headerCalories");
    const healthScoreEl = document.getElementById("healthScoreValue");
    const healthScoreProgress = document.getElementById("healthScoreCircle");
    const nutriScoreBadge = document.getElementById("nutriScoreBadge");
    const novaBadge = document.getElementById("novaBadge");
    const junkFoodAlert = document.getElementById("junkFoodAlert");

    if (titleEl) titleEl.textContent = data.name || "Scanned Meal";
    if (categoryEl) categoryEl.textContent = data.category || "General Food";
    if (portionEl) portionEl.textContent = `Portion: ${data.portion || "Standard Serving"}`;
    if (caloriesEl) caloriesEl.textContent = `${data.calories || 0} kcal`;

    // Health Score Circle
    const score = Math.max(0, Math.min(100, data.healthScore || 50));
    if (healthScoreEl) healthScoreEl.textContent = score;
    if (healthScoreProgress) {
      const strokeDashoffset = 283 - (283 * score) / 100;
      healthScoreProgress.style.strokeDashoffset = strokeDashoffset;
      
      // Color coding for score
      if (score >= 75) {
        healthScoreProgress.style.stroke = "#10b981"; // Emerald
      } else if (score >= 45) {
        healthScoreProgress.style.stroke = "#f59e0b"; // Amber
      } else {
        healthScoreProgress.style.stroke = "#ef4444"; // Red
      }
    }

    // NutriScore Badge
    if (nutriScoreBadge) {
      const grade = (data.nutriScore || "C").toUpperCase();
      nutriScoreBadge.className = `nutriscore-badge nutriscore-${grade} px-3 py-1 text-sm font-bold shadow-sm`;
      nutriScoreBadge.textContent = `Nutri-Score ${grade}`;
    }

    // NOVA Badge
    if (novaBadge) {
      const nova = data.novaGroup || (data.isJunkFood ? 4 : 1);
      novaBadge.className = `nova-${nova} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider`;
      novaBadge.textContent = `NOVA ${nova}: ${nova === 4 ? "Ultra-Processed" : nova === 3 ? "Processed" : nova === 2 ? "Culinary Ingredient" : "Minimally Processed"}`;
      novaBadge.title = data.novaDescription || "";
    }

    // Junk Food Alert Banner
    if (junkFoodAlert) {
      if (data.isJunkFood || (data.novaGroup === 4 && data.healthScore < 40)) {
        junkFoodAlert.classList.remove("hidden");
        junkFoodAlert.innerHTML = `
          <div class="flex items-start gap-3 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300">
            <i data-lucide="alert-octagon" class="w-6 h-6 text-red-400 shrink-0 mt-0.5"></i>
            <div>
              <h4 class="font-bold text-red-200 text-sm md:text-base flex items-center gap-2">
                Ultra-Processed / High-Risk Junk Food Detected
                <span class="text-xs bg-red-500/30 text-red-200 px-2 py-0.5 rounded-md font-mono">High Damage Potential</span>
              </h4>
              <p class="text-xs md:text-sm mt-1 text-red-300/90 leading-relaxed">
                This meal contains high amounts of refined carbohydrates, harmful fats, or chemical additives. Extended regular consumption causes severe cumulative cardiovascular, metabolic, and liver damage. Review the <strong>Long-Term Damage</strong> and <strong>When NOT to Eat</strong> tabs below.
              </p>
            </div>
          </div>
        `;
      } else {
        junkFoodAlert.classList.add("hidden");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Renders the Nutrition tab with charts and micronutrient cards
   */
  renderNutritionProfile(data) {
    const macros = data.macros || {};
    
    // Macro elements
    const proteinEl = document.getElementById("macroProteinVal");
    const carbsEl = document.getElementById("macroCarbsVal");
    const fatsEl = document.getElementById("macroFatsVal");
    const fiberEl = document.getElementById("macroFiberVal");
    const sugarEl = document.getElementById("macroSugarVal");
    const sodiumEl = document.getElementById("macroSodiumVal");

    if (proteinEl) proteinEl.textContent = `${macros.protein?.grams ?? 0}g`;
    if (carbsEl) carbsEl.textContent = `${macros.carbs?.grams ?? 0}g`;
    if (fatsEl) fatsEl.textContent = `${macros.fats?.grams ?? 0}g`;
    if (fiberEl) fiberEl.textContent = `${macros.fiber?.grams ?? 0}g`;
    if (sugarEl) sugarEl.textContent = `${macros.sugars?.grams ?? 0}g`;
    if (sodiumEl) sodiumEl.textContent = `${macros.sodium?.mg ?? 0}mg`;

    // Detailed Macro Bars
    const container = document.getElementById("detailedMacroList");
    if (container) {
      container.innerHTML = `
        <div class="space-y-4 text-sm">
          ${this.renderMacroBar("Protein", `${macros.protein?.grams ?? 0}g`, macros.protein?.percentage ?? 20, "bg-emerald-500", "Essential amino acids for muscle & immune repair")}
          ${this.renderMacroBar("Total Carbohydrates", `${macros.carbs?.grams ?? 0}g`, macros.carbs?.percentage ?? 40, "bg-blue-500", "Energy source")}
          ${this.renderMacroBar("Total Fats", `${macros.fats?.grams ?? 0}g`, macros.fats?.percentage ?? 30, "bg-amber-500", "Fatty acids")}
          ${this.renderMacroBar("Saturated Fat", `${macros.saturatedFat?.grams ?? 0}g`, macros.saturatedFat?.percentage ?? 10, "bg-orange-500", "Limits recommended < 10% total calories")}
          ${this.renderMacroBar("Trans Fat", `${macros.transFat?.grams ?? 0}g`, (macros.transFat?.grams ?? 0) > 0 ? 90 : 0, "bg-red-600", "Harmful industrial trans fats (Goal: 0g)")}
          ${this.renderMacroBar("Dietary Fiber", `${macros.fiber?.grams ?? 0}g`, macros.fiber?.percentage ?? 15, "bg-teal-400", "Soluble & insoluble gut health fiber (Goal: 28-35g/day)")}
          ${this.renderMacroBar("Total / Added Sugars", `${macros.sugars?.grams ?? 0}g (${macros.addedSugars?.grams ?? 0}g added)`, macros.sugars?.percentage ?? 20, "bg-rose-500", "Quick blood glucose & insulin surge")}
          ${this.renderMacroBar("Sodium", `${macros.sodium?.mg ?? 0}mg`, macros.sodium?.percentage ?? 30, "bg-indigo-400", "Electrolyte & fluid balance (Limit: < 2,300mg/day)")}
          ${this.renderMacroBar("Cholesterol", `${macros.cholesterol?.mg ?? 0}mg`, macros.cholesterol?.percentage ?? 15, "bg-yellow-500", "Dietary sterols")}
        </div>
      `;
    }

    // Render Micronutrient Grid
    const microContainer = document.getElementById("micronutrientGrid");
    if (microContainer) {
      const micros = data.micronutrients || [];
      if (micros.length === 0) {
        microContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No significant micronutrient data available.</p>`;
      } else {
        microContainer.innerHTML = micros.map(m => `
          <div class="glass-panel-light p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 font-medium block">${m.name}</span>
              <span class="text-sm font-semibold text-slate-100">${m.amount}</span>
            </div>
            <div class="text-right">
              <span class="text-xs px-2 py-0.5 rounded font-mono ${
                m.level === 'deficient' || m.level === 'zero' ? 'bg-red-500/20 text-red-300' :
                m.level === 'low' ? 'bg-amber-500/20 text-amber-300' :
                m.level === 'super_rich' || m.level === 'excellent' ? 'bg-emerald-500/20 text-emerald-300 font-bold' :
                'bg-blue-500/20 text-blue-300'
              }">${m.dvPercent}% DV</span>
            </div>
          </div>
        `).join("");
      }
    }

    // Metabolic & Effectiveness Box
    const effectContainer = document.getElementById("effectivenessBox");
    if (effectContainer && data.effectiveness) {
      effectContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span class="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
              <i data-lucide="clock" class="w-4 h-4 text-emerald-400"></i> Satiety Index & Fullness
            </span>
            <p class="text-sm font-semibold text-slate-200">${data.effectiveness.satietyRating || "Moderate"}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span class="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
              <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i> Metabolic & Energy Efficiency
            </span>
            <p class="text-sm text-slate-300">${data.effectiveness.metabolicEfficiency || "Standard metabolic profile"}</p>
          </div>
        </div>
        ${data.effectiveness.benefits?.length ? `
          <div class="mt-3 p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
            <h5 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <i data-lucide="check-circle-2" class="w-4 h-4"></i> Nutritional Strengths
            </h5>
            <ul class="text-xs text-emerald-200/90 space-y-1 list-disc list-inside">
              ${data.effectiveness.benefits.map(b => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
      `;
    }

    // Render Chart
    this.renderMacroChart(macros);
  }

  renderMacroBar(label, value, percentage, barColor, note = "") {
    const clampedPct = Math.min(100, Math.max(0, percentage));
    return `
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="font-medium text-slate-300">${label}</span>
          <span class="font-bold text-slate-100 font-mono">${value}</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/40">
          <div class="${barColor} h-2 rounded-full transition-all duration-700" style="width: ${clampedPct}%"></div>
        </div>
        ${note ? `<p class="text-[11px] text-slate-400 mt-0.5">${note}</p>` : ""}
      </div>
    `;
  }

  /**
   * Initializes or updates the Chart.js macro breakdown
   */
  renderMacroChart(macros) {
    const canvas = document.getElementById("macroChart");
    if (!canvas || !window.Chart) return;

    const p = macros.protein?.grams || 10;
    const c = macros.carbs?.grams || 20;
    const f = macros.fats?.grams || 10;

    if (this.macroChartInstance) {
      this.macroChartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");
    this.macroChartInstance = new window.Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Protein", "Carbs", "Fats"],
        datasets: [{
          data: [p, c, f],
          backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
          borderColor: "#0f172a",
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#cbd5e1",
              font: { size: 12, family: "Inter, sans-serif" },
              padding: 14
            }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw}g`
            }
          }
        },
        cutout: "70%"
      }
    });
  }

  /**
   * Renders the Long-Term Biological Damage tab
   */
  renderLongTermDamage(data) {
    const lt = data.longTermDamage || {};
    const timeline = lt.timeline || {};
    const organs = lt.organImpacts || [];

    // Timeline elements
    const shortTermEl = document.getElementById("damageShortTerm");
    const mediumEl = document.getElementById("damageMediumTerm");
    const longEl = document.getElementById("damageLongTerm");
    const decadeEl = document.getElementById("damageDecade");
    const damageSeverityBadge = document.getElementById("damageSeverityBadge");

    if (damageSeverityBadge) {
      const severity = lt.damageSeverity || (data.isJunkFood ? "Severe" : "Minimal");
      damageSeverityBadge.textContent = `Severity Level: ${severity}`;
      if (severity === "Critical" || severity === "Severe") {
        damageSeverityBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40";
      } else if (severity === "High" || severity === "Moderate") {
        damageSeverityBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40";
      } else {
        damageSeverityBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
      }
    }

    if (shortTermEl) shortTermEl.textContent = timeline.shortTerm || "Minor post-prandial glycemic surge.";
    if (mediumEl) mediumEl.textContent = timeline.oneToThreeMonths || "Mild metabolic fluctuation depending on overall caloric balance.";
    if (longEl) longEl.textContent = timeline.oneToFiveYears || "Gradual arterial or metabolic strain if eaten routinely.";
    if (decadeEl) decadeEl.textContent = timeline.tenPlusYears || "Elevated cardiometabolic disease risk under persistent intake.";

    // Organ Impact Cards
    const organContainer = document.getElementById("organImpactCards");
    if (organContainer) {
      if (organs.length === 0) {
        organContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No specific organ toxicity detected.</p>`;
      } else {
        organContainer.innerHTML = organs.map(org => {
          const sevClass = (org.severity || "moderate").toLowerCase();
          const badgeColor = 
            sevClass === "critical" ? "bg-red-950/80 text-red-300 border-red-500/50" :
            sevClass === "severe" ? "bg-rose-950/80 text-rose-300 border-rose-500/40" :
            sevClass === "high" ? "bg-orange-950/80 text-orange-300 border-orange-500/40" :
            sevClass === "moderate" ? "bg-amber-950/80 text-amber-300 border-amber-500/40" :
            sevClass === "protective" ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40" :
            "bg-blue-950/80 text-blue-300 border-blue-500/40";

          return `
            <div class="organ-card severity-${sevClass} glass-card p-4 rounded-xl relative overflow-hidden">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700/60">
                    <i data-lucide="${org.icon || 'activity'}" class="w-4 h-4 text-slate-300"></i>
                  </span>
                  <h4 class="font-bold text-slate-100 text-sm md:text-base">${org.organ}</h4>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}">
                  ${org.severity} Impact
                </span>
              </div>
              <p class="text-xs md:text-sm text-slate-300 mb-2 leading-relaxed">${org.summary}</p>
              ${org.biologicalMechanism ? `
                <div class="mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 font-mono flex items-start gap-1.5">
                  <i data-lucide="microscope" class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5"></i>
                  <span><strong>Biological Mechanism:</strong> ${org.biologicalMechanism}</span>
                </div>
              ` : ""}
            </div>
          `;
        }).join("");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Renders the Medical Contraindications & Acute Illness Warnings ("When NOT to Eat")
   */
  renderMedicalContraindications(data, activeConditions = []) {
    const med = data.medicalContraindications || {};
    const acuteList = med.acuteIllnesses || [];
    const chronicList = med.chronicConditions || [];
    const drugInteractions = med.medicationInteractions || [];

    // Acute Illnesses (Fever, GERD, Upset Stomach, Sore Throat)
    const acuteContainer = document.getElementById("acuteIllnessCards");
    if (acuteContainer) {
      if (acuteList.length === 0) {
        acuteContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No acute illness contraindications detected.</p>`;
      } else {
        acuteContainer.innerHTML = acuteList.map(item => {
          const isSafe = item.safeToEat;
          const isFever = item.condition.toLowerCase().includes("fever");
          
          return `
            <div class="glass-card p-4 rounded-xl border ${
              isSafe ? 'border-emerald-500/30 bg-emerald-950/10' :
              isFever ? 'border-red-500/40 bg-red-950/20 pulse-glow-danger' :
              'border-rose-500/30 bg-rose-950/10'
            }">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <i data-lucide="${isFever ? 'thermometer-snowflake' : isSafe ? 'check-circle' : 'alert-circle'}" class="w-5 h-5 ${isSafe ? 'text-emerald-400' : 'text-rose-400'}"></i>
                  <h4 class="font-bold text-slate-100 text-sm md:text-base">${item.condition}</h4>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                }">
                  ${isSafe ? '✅ Safe to Eat' : '❌ DO NOT EAT'}
                </span>
              </div>
              <p class="text-xs md:text-sm text-slate-300 leading-relaxed mt-1">
                ${item.reason}
              </p>
            </div>
          `;
        }).join("");
      }
    }

    // Chronic Conditions (Diabetes, Hypertension, CKD, etc.)
    const chronicContainer = document.getElementById("chronicConditionCards");
    if (chronicContainer) {
      if (chronicList.length === 0) {
        chronicContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No chronic disease warnings identified.</p>`;
      } else {
        chronicContainer.innerHTML = chronicList.map(item => {
          const isSafe = item.safeToEat;
          return `
            <div class="glass-panel-light p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
              <i data-lucide="${isSafe ? 'shield-check' : 'shield-alert'}" class="w-5 h-5 ${isSafe ? 'text-emerald-400' : 'text-amber-400'} shrink-0 mt-0.5"></i>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h5 class="font-semibold text-slate-200 text-sm">${item.condition}</h5>
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded ${
                    isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }">${item.severity || (isSafe ? 'Safe' : 'Caution')}</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">${item.warning || item.reason || ""}</p>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    // Medication Interactions
    const medContainer = document.getElementById("medicationInteractionList");
    if (medContainer) {
      if (drugInteractions.length === 0) {
        medContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No known adverse food-drug interactions for this profile.</p>`;
      } else {
        medContainer.innerHTML = drugInteractions.map(drug => `
          <li class="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <i data-lucide="pill" class="w-4 h-4 text-purple-400 shrink-0 mt-0.5"></i>
            <span>${drug}</span>
          </li>
        `).join("");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Renders the Smart Swaps & Harm Mitigation tab
   */
  renderSmartSwaps(data) {
    const swaps = data.smartAlternatives || [];
    const mitigations = data.harmMitigation || [];

    // Smart Alternatives
    const swapContainer = document.getElementById("smartSwapCards");
    if (swapContainer) {
      if (swaps.length === 0) {
        swapContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No alternative suggestions needed for this healthy meal.</p>`;
      } else {
        swapContainer.innerHTML = swaps.map(alt => `
          <div class="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
            <div class="flex items-start justify-between mb-2">
              <div>
                <span class="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">Healthier Alternative</span>
                <h4 class="font-bold text-slate-100 text-sm md:text-base mt-0.5">${alt.name}</h4>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ${alt.calories} kcal
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
              <div class="p-2 rounded bg-slate-900/60 text-slate-300">
                <span class="text-emerald-400 font-semibold block">⚡ Calorie Benefit:</span>
                ${alt.calorieSavings || "Significantly lighter"}
              </div>
              <div class="p-2 rounded bg-slate-900/60 text-slate-300">
                <span class="text-emerald-400 font-semibold block">🛡️ Damage Reduction:</span>
                ${alt.damageReduction || "Greatly reduced organ strain"}
              </div>
            </div>
            <p class="text-xs text-slate-300 mt-2"><strong class="text-slate-200">Key Strengths:</strong> ${alt.highlights || ""}</p>
          </div>
        `).join("");
      }
    }

    // Harm Mitigation Steps
    const mitContainer = document.getElementById("harmMitigationList");
    if (mitContainer) {
      if (mitigations.length === 0) {
        mitContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No special mitigation protocol necessary.</p>`;
      } else {
        mitContainer.innerHTML = mitigations.map(step => `
          <li class="p-3 rounded-xl glass-panel-light border border-slate-700/60 text-xs md:text-sm text-slate-200 flex items-start gap-2.5">
            <i data-lucide="check" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
            <span>${step}</span>
          </li>
        `).join("");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }
}
