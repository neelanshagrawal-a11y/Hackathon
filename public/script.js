const fileInput = document.getElementById("video-upload");
const dropzone = document.getElementById("dropzone");
const intakeForm = document.getElementById("intake-form");
const videoPreview = document.getElementById("video-preview");
const emptyPreview = document.getElementById("empty-preview");
const payloadPreview = document.getElementById("payload-preview");
const statusText = document.getElementById("status-text");
const metaGrid = document.getElementById("meta-grid");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const fileType = document.getElementById("file-type");
const fileDuration = document.getElementById("file-duration");
const sessionIdInput = document.getElementById("session-id");
const trainerIdInput = document.getElementById("trainer-id");
const memberIdInput = document.getElementById("member-id");
const branchInput = document.getElementById("branch");
const modelTaskInput = document.getElementById("model-task");

let selectedVideo = null;
let objectUrl = null;

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "Unknown";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

function buildPayload(status = "draft") {
  return {
    sessionId: sessionIdInput.value.trim(),
    trainerId: trainerIdInput.value.trim(),
    memberId: memberIdInput.value.trim(),
    branch: branchInput.value.trim(),
    modelTask: modelTaskInput.value.trim(),
    video: selectedVideo
      ? {
          name: selectedVideo.name,
          type: selectedVideo.type,
          size: selectedVideo.size,
        }
      : null,
    status,
  };
}

function renderPayload(status = "draft") {
  payloadPreview.textContent = JSON.stringify(buildPayload(status), null, 2);
}

function loadVideo(file) {
  if (!file || !file.type.startsWith("video/")) {
    statusText.textContent = "Please choose a valid video file.";
    return;
  }

  selectedVideo = file;

  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }

  objectUrl = URL.createObjectURL(file);
  videoPreview.src = objectUrl;
  videoPreview.hidden = false;
  emptyPreview.hidden = true;
  metaGrid.hidden = false;

  fileName.textContent = file.name;
  fileSize.textContent = formatBytes(file.size);
  fileType.textContent = file.type || "Unknown";
  fileDuration.textContent = "Loading...";
  statusText.textContent = "Video loaded. Add context and prepare the payload.";
  renderPayload();
}

fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  loadVideo(file);
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
  loadVideo(file);
});

videoPreview.addEventListener("loadedmetadata", () => {
  fileDuration.textContent = formatDuration(videoPreview.duration);
});

[sessionIdInput, trainerIdInput, memberIdInput, branchInput, modelTaskInput].forEach((input) => {
  input.addEventListener("input", () => renderPayload());
});

intakeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedVideo) {
    statusText.textContent = "Upload a video first.";
    renderPayload("missing_video");
    return;
  }

  statusText.textContent = "Payload ready. Next we can POST this to a backend or model endpoint.";
  renderPayload("ready_for_model");
});

renderPayload();
