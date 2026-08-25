/**
 * NutriScan AI - Main Application Controller
 * Coordinates Camera, Gemini Multimodal Service, UI Renderer, and Event Listeners.
 */

import { GeminiService } from "./gemini-service.js";
import { CameraController } from "./camera.js";
import { UIRenderer } from "./ui-renderer.js";
import { SAMPLE_FOODS } from "./nutrition-data.js";

class NutriScanApp {
  constructor() {
    this.gemini = new GeminiService();
    this.ui = new UIRenderer();
    this.currentFoodData = null;
    this.activeHealthConditions = new Set();
    this.chatHistory = [];

    // DOM Elements
    this.videoEl = document.getElementById("webcamVideo");
    this.canvasEl = document.getElementById("captureCanvas");
    this.camera = new CameraController(this.videoEl, this.canvasEl);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateApiKeyStatus();
    
    // Load default sample meal (Double Cheeseburger & Fries) for instant rich view
    this.loadPresetFood("cheeseburger-fries");

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupEventListeners() {
    // 1. Settings Modal
    const btnOpenSettings = document.getElementById("btnOpenSettings");
    const btnCloseSettings = document.getElementById("btnCloseSettings");
    const settingsModal = document.getElementById("settingsModal");
    const settingsForm = document.getElementById("settingsForm");
    const inputApiKey = document.getElementById("inputApiKey");
    const selectModel = document.getElementById("selectModel");
    const btnTestKey = document.getElementById("btnTestKey");

    if (btnOpenSettings) {
      btnOpenSettings.addEventListener("click", () => {
        if (inputApiKey) inputApiKey.value = this.gemini.getApiKey();
        if (selectModel) selectModel.value = this.gemini.getModel();
        document.getElementById("apiKeyTestResult").classList.add("hidden");
        settingsModal.classList.remove("hidden");
      });
    }

    if (btnCloseSettings) {
      btnCloseSettings.addEventListener("click", () => {
        settingsModal.classList.add("hidden");
      });
    }

    if (settingsForm) {
      settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const key = inputApiKey.value.trim();
        const model = selectModel.value;
        this.gemini.setApiKey(key);
        this.gemini.setModel(model);
        this.updateApiKeyStatus();
        settingsModal.classList.add("hidden");
      });
    }

    if (btnTestKey) {
      btnTestKey.addEventListener("click", async () => {
        const testResultEl = document.getElementById("apiKeyTestResult");
        testResultEl.classList.remove("hidden", "bg-emerald-500/20", "text-emerald-300", "bg-red-500/20", "text-red-300");
        testResultEl.textContent = "Testing connection with Gemini API...";
        testResultEl.className = "text-xs p-3 rounded-xl bg-slate-800 text-slate-300";

        try {
          const key = inputApiKey.value.trim();
          await this.gemini.testApiKey(key);
          testResultEl.className = "text-xs p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
          testResultEl.textContent = "✅ Gemini API key is valid and connected!";
        } catch (err) {
          testResultEl.className = "text-xs p-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30";
          testResultEl.textContent = `❌ Connection error: ${err.message}`;
        }
      });
    }

    // 2. Active Health Profile Condition Toggles
    const conditionPills = document.querySelectorAll(".condition-pill");
    conditionPills.forEach(pill => {
      pill.addEventListener("click", () => {
        const condition = pill.getAttribute("data-condition");
        if (this.activeHealthConditions.has(condition)) {
          this.activeHealthConditions.delete(condition);
          pill.classList.remove("border-emerald-400", "bg-emerald-950/40", "text-emerald-300");
          pill.classList.add("border-slate-700", "bg-slate-900/80", "text-slate-300");
        } else {
          this.activeHealthConditions.add(condition);
          pill.classList.add("border-emerald-400", "bg-emerald-950/40", "text-emerald-300");
          pill.classList.remove("border-slate-700", "bg-slate-900/80", "text-slate-300");
        }

        // Re-render medical contraindications with active conditions highlighted
        if (this.currentFoodData) {
          this.ui.renderMedicalContraindications(this.currentFoodData, Array.from(this.activeHealthConditions));
        }
      });
    });

    // 3. Input Mode Tabs (Camera vs Upload vs Describe)
    const tabBtnCamera = document.getElementById("tabBtnCamera");
    const tabBtnUpload = document.getElementById("tabBtnUpload");
    const tabBtnText = document.getElementById("tabBtnText");
    const cameraSection = document.getElementById("cameraSection");
    const uploadSection = document.getElementById("uploadSection");
    const textSection = document.getElementById("textSection");

    const switchInputTab = (activeBtn, activeSec) => {
      [tabBtnCamera, tabBtnUpload, tabBtnText].forEach(b => {
        b.className = "flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-all bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 flex items-center justify-center gap-1.5";
      });
      [cameraSection, uploadSection, textSection].forEach(s => s.classList.add("hidden"));

      activeBtn.className = "flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-1.5";
      activeSec.classList.remove("hidden");
    };

    if (tabBtnCamera) tabBtnCamera.addEventListener("click", () => switchInputTab(tabBtnCamera, cameraSection));
    if (tabBtnUpload) {
      tabBtnUpload.addEventListener("click", () => {
        switchInputTab(tabBtnUpload, uploadSection);
        this.camera.stopCamera();
        this.updateCameraUI(false);
      });
    }
    if (tabBtnText) {
      tabBtnText.addEventListener("click", () => {
        switchInputTab(tabBtnText, textSection);
        this.camera.stopCamera();
        this.updateCameraUI(false);
      });
    }

    // 4. Camera Controls
    const btnStartCamera = document.getElementById("btnStartCamera");
    const btnStopCamera = document.getElementById("btnStopCamera");
    const btnCapturePhoto = document.getElementById("btnCapturePhoto");
    const btnFlipCamera = document.getElementById("btnFlipCamera");

    if (btnStartCamera) {
      btnStartCamera.addEventListener("click", async () => {
        try {
          await this.camera.startCamera();
          this.updateCameraUI(true);
        } catch (err) {
          alert(err.message);
        }
      });
    }

    if (btnStopCamera) {
      btnStopCamera.addEventListener("click", () => {
        this.camera.stopCamera();
        this.updateCameraUI(false);
      });
    }

    if (btnFlipCamera) {
      btnFlipCamera.addEventListener("click", async () => {
        try {
          await this.camera.toggleCameraFacing();
        } catch (err) {
          console.error(err);
        }
      });
    }

    if (btnCapturePhoto) {
      btnCapturePhoto.addEventListener("click", async () => {
        await this.handleCameraCapture();
      });
    }

    // 5. File Upload Dropzone
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");

    if (dropZone && fileInput) {
      dropZone.addEventListener("click", () => fileInput.click());

      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("border-emerald-500", "bg-emerald-950/20");
      });

      dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("border-emerald-500", "bg-emerald-950/20");
      });

      dropZone.addEventListener("drop", async (e) => {
        e.preventDefault();
        dropZone.classList.remove("border-emerald-500", "bg-emerald-950/20");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          await this.handleFileUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", async (e) => {
        if (e.target.files && e.target.files[0]) {
          await this.handleFileUpload(e.target.files[0]);
        }
      });
    }

    // 6. Text Food Analysis
    const btnAnalyzeText = document.getElementById("btnAnalyzeText");
    const textFoodInput = document.getElementById("textFoodInput");

    if (btnAnalyzeText && textFoodInput) {
      btnAnalyzeText.addEventListener("click", async () => {
        const text = textFoodInput.value.trim();
        if (!text) {
          alert("Please enter a food description or meal ingredients.");
          return;
        }
        await this.handleTextAnalysis(text);
      });
    }

    // 7. Preset Food Buttons
    const presetBtns = document.querySelectorAll(".preset-btn");
    presetBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-preset");
        this.loadPresetFood(id);
      });
    });

    // 8. Main Tab Navigation (Overview, Damage, Contraindications, Swaps, Chat)
    const tabs = [
      { btn: "navTabOverview", content: "contentOverview" },
      { btn: "navTabDamage", content: "contentDamage" },
      { btn: "navTabContraindications", content: "contentContraindications" },
      { btn: "navTabSwaps", content: "contentSwaps" },
      { btn: "navTabChat", content: "contentChat" },
    ];

    tabs.forEach(tab => {
      const btnEl = document.getElementById(tab.btn);
      const contentEl = document.getElementById(tab.content);

      if (btnEl && contentEl) {
        btnEl.addEventListener("click", () => {
          tabs.forEach(t => {
            const b = document.getElementById(t.btn);
            const c = document.getElementById(t.content);
            if (b) {
              b.classList.remove("border-emerald-500", "text-emerald-400", "active");
              b.classList.add("border-transparent", "text-slate-400");
            }
            if (c) c.classList.add("hidden");
          });

          btnEl.classList.add("border-emerald-500", "text-emerald-400", "active");
          btnEl.classList.remove("border-transparent", "text-slate-400");
          contentEl.classList.remove("hidden");

          // Trigger resize for Chart.js if switching to Overview
          if (tab.btn === "navTabOverview" && this.currentFoodData) {
            this.ui.renderMacroChart(this.currentFoodData.macros || {});
          }
        });
      }
    });

    // 9. AI Clinical Nutritionist Chat
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const quickChips = document.querySelectorAll(".quick-chat-chip");

    if (chatForm && chatInput) {
      chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        chatInput.value = "";
        await this.handleSendMessage(msg);
      });
    }

    quickChips.forEach(chip => {
      chip.addEventListener("click", async () => {
        const text = chip.textContent.trim();
        await this.handleSendMessage(text);
      });
    });

    // 10. Print / Export Report
    const btnPrintReport = document.getElementById("btnPrintReport");
    if (btnPrintReport) {
      btnPrintReport.addEventListener("click", () => {
        window.print();
      });
    }
  }

  /**
   * Updates camera elements in DOM when streaming starts/stops
   */
  updateCameraUI(isActive) {
    const video = document.getElementById("webcamVideo");
    const placeholder = document.getElementById("cameraPlaceholder");
    const overlay = document.getElementById("cameraControlsOverlay");
    const laser = document.getElementById("scannerLaser");

    if (isActive) {
      video.classList.remove("hidden");
      placeholder.classList.add("hidden");
      overlay.classList.remove("hidden");
      laser.classList.remove("hidden");
    } else {
      video.classList.add("hidden");
      placeholder.classList.remove("hidden");
      overlay.classList.add("hidden");
      laser.classList.add("hidden");
    }
  }

  /**
   * Updates API key status badge in header
   */
  updateApiKeyStatus() {
    const dot = document.getElementById("apiKeyStatusDot");
    const text = document.getElementById("apiKeyStatusText");
    const hasKey = this.gemini.hasApiKey();

    if (hasKey) {
      dot.className = "w-2 h-2 rounded-full bg-emerald-400";
      text.textContent = `Gemini: ${this.gemini.getModel()}`;
    } else {
      dot.className = "w-2 h-2 rounded-full bg-amber-400";
      text.textContent = "Set Gemini Key";
    }
  }

  /**
   * Loads a preset food dataset instantly
   */
  loadPresetFood(presetId) {
    const food = SAMPLE_FOODS.find(f => f.id === presetId) || SAMPLE_FOODS[0];
    this.currentFoodData = food;

    const imgPreview = document.getElementById("scannedImagePreview");
    if (imgPreview && food.image) {
      imgPreview.src = food.image;
    }

    this.chatHistory = [];
    this.resetChatBox();
    this.ui.renderFoodAnalysis(food, document.body, Array.from(this.activeHealthConditions));
  }

  /**
   * Handles photo capture from webcam and sends to Gemini API
   */
  async handleCameraCapture() {
    if (!this.gemini.hasApiKey()) {
      document.getElementById("settingsModal").classList.remove("hidden");
      alert("Please configure your Google Gemini API key to scan live food photos.");
      return;
    }

    try {
      this.setScanningState(true, "Scanning food with Gemini Vision API...");
      const rawBase64 = this.camera.captureFrame();
      const resizedBase64 = await CameraController.resizeImage(rawBase64, 1024);

      // Update preview image
      const imgPreview = document.getElementById("scannedImagePreview");
      if (imgPreview) imgPreview.src = resizedBase64;

      const healthContext = Array.from(this.activeHealthConditions).join(", ");
      const analysis = await this.gemini.analyzeFoodImage(resizedBase64, "image/jpeg", healthContext);

      this.currentFoodData = analysis;
      this.chatHistory = [];
      this.resetChatBox();
      this.ui.renderFoodAnalysis(analysis, document.body, Array.from(this.activeHealthConditions));
      this.setScanningState(false, "Scan Complete");
    } catch (err) {
      console.error(err);
      alert(`Food Analysis Failed: ${err.message}`);
      this.setScanningState(false, "Scan Error");
    }
  }

  /**
   * Handles uploaded image file and sends to Gemini API
   */
  async handleFileUpload(file) {
    if (!this.gemini.hasApiKey()) {
      document.getElementById("settingsModal").classList.remove("hidden");
      alert("Please configure your Google Gemini API key to analyze food images.");
      return;
    }

    try {
      this.setScanningState(true, "Processing image & analyzing with Gemini...");
      const base64 = await CameraController.fileToBase64(file);
      const resizedBase64 = await CameraController.resizeImage(base64, 1024);

      const imgPreview = document.getElementById("scannedImagePreview");
      if (imgPreview) imgPreview.src = resizedBase64;

      const healthContext = Array.from(this.activeHealthConditions).join(", ");
      const analysis = await this.gemini.analyzeFoodImage(resizedBase64, file.type || "image/jpeg", healthContext);

      this.currentFoodData = analysis;
      this.chatHistory = [];
      this.resetChatBox();
      this.ui.renderFoodAnalysis(analysis, document.body, Array.from(this.activeHealthConditions));
      this.setScanningState(false, "Scan Complete");
    } catch (err) {
      console.error(err);
      alert(`Food Analysis Failed: ${err.message}`);
      this.setScanningState(false, "Scan Error");
    }
  }

  /**
   * Handles text description meal input
   */
  async handleTextAnalysis(foodText) {
    if (!this.gemini.hasApiKey()) {
      document.getElementById("settingsModal").classList.remove("hidden");
      alert("Please configure your Google Gemini API key to analyze food descriptions.");
      return;
    }

    try {
      this.setScanningState(true, "Analyzing nutritional profile with Gemini...");
      const healthContext = Array.from(this.activeHealthConditions).join(", ");
      const analysis = await this.gemini.analyzeFoodText(foodText, healthContext);

      this.currentFoodData = analysis;
      this.chatHistory = [];
      this.resetChatBox();
      this.ui.renderFoodAnalysis(analysis, document.body, Array.from(this.activeHealthConditions));
      this.setScanningState(false, "Analysis Complete");
    } catch (err) {
      console.error(err);
      alert(`Food Analysis Failed: ${err.message}`);
      this.setScanningState(false, "Scan Error");
    }
  }

  /**
   * Handles interactive conversational Q&A with AI Clinical Nutritionist
   */
  async handleSendMessage(userText) {
    if (!this.currentFoodData) {
      alert("Please scan or select a food item first.");
      return;
    }

    if (!this.gemini.hasApiKey()) {
      document.getElementById("settingsModal").classList.remove("hidden");
      alert("Please configure your Google Gemini API key to chat with the AI Nutritionist.");
      return;
    }

    const chatContainer = document.getElementById("chatMessages");
    
    // Append User Message
    const userMsgEl = document.createElement("div");
    userMsgEl.className = "flex items-start gap-3 justify-end text-slate-200";
    userMsgEl.innerHTML = `
      <div class="bg-emerald-600/20 border border-emerald-500/30 p-3 rounded-xl max-w-lg text-emerald-100">
        <p>${this.escapeHtml(userText)}</p>
      </div>
      <div class="w-7 h-7 rounded-lg bg-emerald-600 text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">
        U
      </div>
    `;
    chatContainer.appendChild(userMsgEl);

    // Append Loading Indicator
    const loadingEl = document.createElement("div");
    loadingEl.id = "chatLoadingIndicator";
    loadingEl.className = "flex items-start gap-3 text-slate-400";
    loadingEl.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="glass-panel-light p-3 rounded-xl max-w-lg flex items-center gap-2">
        <span class="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
        <span class="text-xs">Consulting Gemini Clinical Nutritionist...</span>
      </div>
    `;
    chatContainer.appendChild(loadingEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (window.lucide) window.lucide.createIcons();

    try {
      const reply = await this.gemini.askNutritionQuestion(this.currentFoodData, userText, this.chatHistory);
      
      this.chatHistory.push({ role: "user", text: userText });
      this.chatHistory.push({ role: "model", text: reply });

      loadingEl.remove();

      // Append AI Reply
      const aiMsgEl = document.createElement("div");
      aiMsgEl.className = "flex items-start gap-3 text-slate-300";
      aiMsgEl.innerHTML = `
        <div class="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <i data-lucide="bot" class="w-4 h-4"></i>
        </div>
        <div class="glass-panel-light p-3.5 rounded-xl max-w-xl text-xs md:text-sm text-slate-200 leading-relaxed space-y-1">
          ${this.formatMarkdownReply(reply)}
        </div>
      `;
      chatContainer.appendChild(aiMsgEl);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    } catch (err) {
      loadingEl.remove();
      const errEl = document.createElement("div");
      errEl.className = "p-3 rounded-xl bg-red-500/20 text-red-300 text-xs border border-red-500/30";
      errEl.textContent = `Error: ${err.message}`;
      chatContainer.appendChild(errEl);
    }
  }

  resetChatBox() {
    const chatContainer = document.getElementById("chatMessages");
    if (!chatContainer) return;
    chatContainer.innerHTML = `
      <div class="flex items-start gap-3 text-slate-300">
        <div class="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <i data-lucide="bot" class="w-4 h-4"></i>
        </div>
        <div class="glass-panel-light p-3 rounded-xl max-w-xl">
          <p>Hello! I'm your AI Clinical Nutritionist. I've analyzed your scanned meal: <strong>${this.currentFoodData?.name || "Meal"}</strong>. Ask me anything about calories, acute fever suitability, or long-term organ health!</p>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  setScanningState(isScanning, statusText) {
    const badge = document.getElementById("scanningStatusBadge");
    if (badge) {
      badge.textContent = statusText;
      badge.className = isScanning 
        ? "absolute top-2 left-2 bg-emerald-600/90 text-white font-bold px-2.5 py-1 rounded text-[10px] font-mono animate-pulse"
        : "absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30";
    }
  }

  formatMarkdownReply(text) {
    // Simple markdown helper for bold, lists, and linebreaks
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return html;
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.nutriScanApp = new NutriScanApp();
});
