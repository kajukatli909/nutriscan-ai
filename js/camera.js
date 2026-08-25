/**
 * NutriScan AI - Camera and Media Capture Controller
 * Handles webcam stream, camera switching (user/environment), shutter capture, and image optimization.
 */

export class CameraController {
  constructor(videoElement, canvasElement) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.stream = null;
    this.facingMode = "environment"; // default to rear camera on mobile
    this.isActive = false;
  }

  /**
   * Initializes and starts the camera feed
   */
  async startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera API is not supported in this browser. Please use file upload.");
    }

    this.stopCamera();

    const constraints = {
      video: {
        facingMode: this.facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();
      this.isActive = true;
      return true;
    } catch (err) {
      console.warn("Could not start environment camera, attempting default camera...", err);
      try {
        // Fallback to simple video
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.videoElement.srcObject = this.stream;
        await this.videoElement.play();
        this.isActive = true;
        return true;
      } catch (fallbackErr) {
        this.isActive = false;
        throw new Error("Unable to access camera. Please verify camera permissions in your browser.");
      }
    }
  }

  /**
   * Stops the active camera stream
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.isActive = false;
  }

  /**
   * Toggles between front and back cameras
   */
  async toggleCameraFacing() {
    this.facingMode = this.facingMode === "environment" ? "user" : "environment";
    if (this.isActive) {
      await this.startCamera();
    }
  }

  /**
   * Captures the current video frame to JPEG base64 string
   */
  captureFrame() {
    if (!this.isActive || !this.videoElement) {
      throw new Error("Camera is not active.");
    }

    const video = this.videoElement;
    const canvas = this.canvasElement;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    // Convert to compressed JPEG data URL
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    return dataUrl;
  }

  /**
   * Helper to convert an uploaded File object to Base64
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Resizes an image data URL if it exceeds max dimension to optimize API payload
   */
  static resizeImage(dataUrl, maxDimension = 1200) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension) {
          resolve(dataUrl);
          return;
        }

        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = dataUrl;
    });
  }
}
