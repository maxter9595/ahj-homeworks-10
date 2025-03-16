/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/CustomVideoPlayer.js
class CustomVideoPlayer {
  constructor(container, videoUrl) {
    this.container = container;
    this.video = container.querySelector("video");
    this.video.src = videoUrl;
    this.playPauseBtn = container.querySelector(".play-pause-btn");
    this.progressBar = container.querySelector(".progress-bar");
    this.progress = container.querySelector(".progress");
    this.thumb = container.querySelector(".thumb");
    this.video.loop = true;
    this.video.addEventListener("timeupdate", () => this.updateProgress());
    this.video.addEventListener("ended", () => this.handleVideoEnd());
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.thumb.addEventListener("mousedown", e => this.startDrag(e));
    this.isDragging = false;
    this.drag = this.drag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
  }
  togglePlayPause() {
    if (this.video.paused) {
      this.video.play();
      this.playPauseBtn.textContent = "⏸️";
    } else {
      this.video.pause();
      this.playPauseBtn.textContent = "▶️";
    }
  }
  updateProgress() {
    if (!this.isDragging) {
      const percent = this.video.currentTime / this.video.duration * 100;
      this.progress.style.width = `${percent}%`;
      this.thumb.style.left = `${percent}%`;
    }
  }
  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    document.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.stopDrag);
  }
  drag(e) {
    const progressBarRect = this.progressBar.getBoundingClientRect();
    let offsetX = e.clientX - progressBarRect.left;
    offsetX = Math.max(0, Math.min(offsetX, progressBarRect.width));
    const percent = offsetX / progressBarRect.width * 100;
    this.progress.style.width = `${percent}%`;
    this.thumb.style.left = `${percent}%`;
    if (!isFinite(this.video.duration) || this.video.duration === 0) {
      console.warn("Video duration is not loaded yet.");
      return;
    }
    const newTime = percent / 100 * this.video.duration;
    if (isFinite(newTime)) {
      this.video.currentTime = newTime;
    } else {
      console.warn("Invalid time value:", newTime);
    }
  }
  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.drag);
      document.removeEventListener("mouseup", this.stopDrag);
    }
  }
  handleVideoEnd() {
    if (this.video.loop) {
      this.video.currentTime = 0;
      this.video.play();
    }
  }
}
;// CONCATENATED MODULE: ./src/js/CustomAudioPlayer.js
class CustomAudioPlayer {
  constructor(container, audioUrl) {
    this.container = container;
    this.audio = new Audio(audioUrl);
    this.playPauseBtn = container.querySelector(".play-pause-btn");
    this.progressBar = container.querySelector(".progress-bar");
    this.progress = container.querySelector(".progress");
    this.thumb = container.querySelector(".thumb");
    this.audio.loop = true;
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.handleAudioEnd());
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.progressBar.addEventListener("click", e => this.seek(e));
    this.thumb.addEventListener("mousedown", e => this.startDrag(e));
    this.isDragging = false;
    this.drag = this.drag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
  }
  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play();
      this.playPauseBtn.textContent = "⏸️";
    } else {
      this.audio.pause();
      this.playPauseBtn.textContent = "▶️";
    }
  }
  updateProgress() {
    if (!this.isDragging) {
      const percent = this.audio.currentTime / this.audio.duration * 100;
      this.progress.style.width = `${percent}%`;
      this.thumb.style.left = `${percent}%`;
    }
  }
  seek(e) {
    const progressBarRect = this.progressBar.getBoundingClientRect();
    const clickX = e.clientX - progressBarRect.left;
    const width = progressBarRect.width;
    if (!isFinite(this.audio.duration) || this.audio.duration === 0) {
      console.warn("Audio duration is not loaded yet.");
      return;
    }
    const seekTime = clickX / width * this.audio.duration;
    if (isFinite(seekTime)) {
      this.audio.currentTime = seekTime;
    } else {
      console.warn("Invalid seek time:", seekTime);
    }
  }
  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    document.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.stopDrag);
  }
  drag(e) {
    const progressBarRect = this.progressBar.getBoundingClientRect();
    let offsetX = e.clientX - progressBarRect.left;
    offsetX = Math.max(0, Math.min(offsetX, progressBarRect.width));
    const percent = offsetX / progressBarRect.width * 100;
    this.progress.style.width = `${percent}%`;
    this.thumb.style.left = `${percent}%`;
    if (!isFinite(this.audio.duration) || this.audio.duration === 0) {
      console.warn("Audio duration is not loaded yet.");
      return;
    }
    const newTime = percent / 100 * this.audio.duration;
    if (isFinite(newTime)) {
      this.audio.currentTime = newTime;
    } else {
      console.warn("Invalid time value:", newTime);
    }
  }
  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.drag);
      document.removeEventListener("mouseup", this.stopDrag);
    }
  }
  handleAudioEnd() {
    if (this.audio.loop) {
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }
}
;// CONCATENATED MODULE: ./src/js/TimelineApp.js


class TimelineApp {
  constructor() {
    this.textInput = document.getElementById("text-input");
    this.audioBtn = document.getElementById("audio-btn");
    this.videoBtn = document.getElementById("video-btn");
    this.modal = document.getElementById("modal");
    this.coordsInput = document.getElementById("coords-input");
    this.cancelBtn = document.getElementById("cancel-btn");
    this.okBtn = document.getElementById("ok-btn");
    this.videoRecorder = document.getElementById("video-recorder");
    this.timer = document.getElementById("timer");
    this.okBtnRecord = document.getElementById("ok-btn-record");
    this.cancelBtnRecord = document.getElementById("cancel-btn-record");
    this.currentMessage = "";
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordingStartTime = null;
    this.timerInterval = null;
    this.isRecording = false;
    this.mediaUrl = null;
    this.mediaStream = null;
    this.overlay = document.createElement("div");
    this.overlay.className = "overlay";
    document.body.appendChild(this.overlay);
    this.init();
  }
  formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  init() {
    this.textInput.addEventListener("keypress", e => this.handleTextInput(e));
    this.audioBtn.addEventListener("click", () => this.startAudioRecording());
    this.videoBtn.addEventListener("click", () => this.startVideoRecording());
    this.okBtnRecord.addEventListener("click", () => this.stopRecording(true));
    this.cancelBtnRecord.addEventListener("click", () => this.stopRecording(false));
  }
  handleTextInput(e) {
    if (e.key === "Enter") {
      this.currentMessage = this.textInput.value;
      this.getLocation(coords => {
        this.addMessage(this.currentMessage, coords.latitude, coords.longitude);
      });
    }
  }
  getLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, () => {
        this.showModal(callback);
      });
    } else {
      this.showModal(callback);
    }
  }
  showModal(callback) {
    this.modal.style.display = "flex";
    const handleOkClick = () => {
      const coords = this.parseCoordinates(this.coordsInput.value);
      if (coords) {
        callback(coords);
        this.modal.style.display = "none";
        this.okBtn.removeEventListener("click", handleOkClick);
        this.cancelBtn.removeEventListener("click", handleCancelClick);
      } else {
        alert("Неверный формат координат");
      }
    };
    const handleCancelClick = () => {
      this.modal.style.display = "none";
      this.okBtn.removeEventListener("click", handleOkClick);
      this.cancelBtn.removeEventListener("click", handleCancelClick);
    };
    this.okBtn.addEventListener("click", handleOkClick);
    this.cancelBtn.addEventListener("click", handleCancelClick);
  }
  parseCoordinates(input) {
    if (!input.trim()) return null;
    input = input.replace(/\[|\]/g, "").replace(/−/g, "-").trim();
    const regex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = input.match(regex);
    if (!match) {
      throw new Error("Invalid coordinates format");
    }
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[3])
    };
  }
  addMessage(text, latitude, longitude) {
    const timeline = document.querySelector(".timeline");
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerHTML = `
      <div class="line"></div>
      <div class="content">
        <div class="time">${this.formatDate(new Date())}</div> <!-- Используем метод formatDate -->
        <div class="text">${text}</div>
        <div class="coords">[${latitude}, ${longitude}] 
          <span class="eye-icon"></span>
        </div>
      </div>
    `;
    timeline.prepend(messageElement);
    if (!timeline.classList.contains("has-messages")) {
      timeline.classList.add("has-messages");
    }
    this.textInput.value = "";
  }
  async startAudioRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      this.startRecording(stream, "audio");
    } catch (error) {
      alert(`Не удалось получить доступ к микрофону: ${error.message}`);
    }
  }
  async startVideoRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      this.videoRecorder.srcObject = stream;
      this.videoRecorder.play();
      document.getElementById("video-preview").style.display = "block";
      this.overlay.style.display = "block";
      this.startRecording(stream, "video");
    } catch (error) {
      alert(`Не удалось получить доступ к камере: ${error.message}`);
    }
  }
  startRecording(stream, type) {
    this.isRecording = true;
    this.mediaStream = stream;
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = event => this.recordedChunks.push(event.data);
    this.mediaRecorder.onstop = () => this.handleRecordingStop(type);
    this.mediaRecorder.start();
    this.recordingStartTime = Date.now();
    this.startTimer();
    this.toggleRecordingControls(true);
  }
  handleRecordingStop(type) {
    if (this.isRecording) {
      const blob = new Blob(this.recordedChunks, {
        type: type === "audio" ? "audio/wav" : "video/mp4"
      });
      this.mediaUrl = URL.createObjectURL(blob);
      this.getLocation(coords => {
        if (type === "audio") {
          this.addAudioMessage(this.mediaUrl, coords.latitude, coords.longitude);
        } else {
          this.addVideoMessage(this.mediaUrl, coords.latitude, coords.longitude);
        }
      });
    }
    this.resetRecording();
  }
  addAudioMessage(audioUrl, latitude, longitude) {
    const timeline = document.querySelector(".timeline");
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerHTML = `
      <div class="line"></div>
      <div class="content">
        <div class="time">${this.formatDate(new Date())}</div>
        <div class="media">
          <div class="custom-audio-player">
            <button class="play-pause-btn">▶️</button>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress"></div>
                <div class="thumb"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="coords">[${latitude}, ${longitude}] 
          <span class="eye-icon"></span>
        </div>
      </div>
    `;
    timeline.prepend(messageElement);
    new CustomAudioPlayer(messageElement.querySelector(".custom-audio-player"), audioUrl);
  }
  addVideoMessage(videoUrl, latitude, longitude) {
    const timeline = document.querySelector(".timeline");
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerHTML = `
      <div class="line"></div>
      <div class="content">
        <div class="time">${this.formatDate(new Date())}</div>
        <div class="media">
          <div class="custom-video-player">
            <video muted></video>
            <button class="play-pause-btn">▶️</button>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress"></div>
                <div class="thumb"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="coords">[${latitude}, ${longitude}] 
          <span class="eye-icon"></span>
        </div>
      </div>
    `;
    timeline.prepend(messageElement);
    new CustomVideoPlayer(messageElement.querySelector(".custom-video-player"), videoUrl);
  }
  stopRecording(save) {
    this.isRecording = save;
    this.mediaRecorder.stop();
    this.overlay.style.display = "none";
  }
  resetRecording() {
    this.recordedChunks = [];
    this.mediaRecorder = null;
    this.stopTimer();
    this.toggleRecordingControls(false);
    document.getElementById("video-preview").style.display = "none";
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.videoRecorder.srcObject) {
      this.videoRecorder.srcObject.getTracks().forEach(track => track.stop());
      this.videoRecorder.srcObject = null;
    }
  }
  toggleRecordingControls(isRecording) {
    this.textInput.disabled = isRecording;
    this.audioBtn.style.display = isRecording ? "none" : "inline-block";
    this.videoBtn.style.display = isRecording ? "none" : "inline-block";
    this.okBtnRecord.style.display = isRecording ? "inline-block" : "none";
    this.cancelBtnRecord.style.display = isRecording ? "inline-block" : "none";
    this.timer.style.display = isRecording ? "inline-block" : "none";
  }
  startTimer() {
    this.timerInterval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
      const seconds = (elapsedTime % 60).toString().padStart(2, "0");
      this.timer.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.timerInterval);
    this.timer.textContent = "00:00";
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

document.addEventListener("DOMContentLoaded", () => new TimelineApp());
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;