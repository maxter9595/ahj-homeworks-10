export default class CustomVideoPlayer {
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
    this.thumb.addEventListener("mousedown", (e) => this.startDrag(e));
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
      const percent = (this.video.currentTime / this.video.duration) * 100;
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
    const percent = (offsetX / progressBarRect.width) * 100;
    this.progress.style.width = `${percent}%`;
    this.thumb.style.left = `${percent}%`;
    if (!isFinite(this.video.duration) || this.video.duration === 0) {
      console.warn("Video duration is not loaded yet.");
      return;
    }
    const newTime = (percent / 100) * this.video.duration;
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
