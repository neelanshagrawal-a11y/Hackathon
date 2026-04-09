const fileInput = document.getElementById("video-upload");
const dropzone = document.getElementById("dropzone");
const videoPreview = document.getElementById("video-preview");
const emptyState = document.getElementById("empty-state");
const metaPanel = document.getElementById("video-meta");
const metaName = document.getElementById("meta-name");
const metaSize = document.getElementById("meta-size");
const metaType = document.getElementById("meta-type");

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function showVideo(file) {
  if (!file || !file.type.startsWith("video/")) {
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  videoPreview.src = objectUrl;
  videoPreview.hidden = false;
  emptyState.hidden = true;
  metaPanel.hidden = false;

  metaName.textContent = file.name;
  metaSize.textContent = formatBytes(file.size);
  metaType.textContent = file.type || "Unknown";
}

fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  showVideo(file);
});

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragging");
  });
});

dropzone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer.files;

  if (!file) {
    return;
  }

  fileInput.files = event.dataTransfer.files;
  showVideo(file);
});
