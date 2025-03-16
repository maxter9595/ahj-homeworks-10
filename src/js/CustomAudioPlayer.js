export default class CustomAudioPlayer {
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
    this.progressBar.addEventListener("click", (e) => this.seek(e));
    this.thumb.addEventListener("mousedown", (e) => this.startDrag(e));
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
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
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
    const seekTime = (clickX / width) * this.audio.duration;
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
    const percent = (offsetX / progressBarRect.width) * 100;
    this.progress.style.width = `${percent}%`;
    this.thumb.style.left = `${percent}%`;
    if (!isFinite(this.audio.duration) || this.audio.duration === 0) {
      console.warn("Audio duration is not loaded yet.");
      return;
    }
    const newTime = (percent / 100) * this.audio.duration;
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
