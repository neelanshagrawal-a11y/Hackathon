const fileInput = document.getElementById("video-upload");
const dropzone = document.getElementById("dropzone");
const videoPreview = document.getElementById("video-preview");
const emptyState = document.getElementById("empty-state");
const metaPanel = document.getElementById("video-meta");
const metaName = document.getElementById("meta-name");
const metaSize = document.getElementById("meta-size");
const metaType = document.getElementById("meta-type");
const metaDuration = document.getElementById("meta-duration");
const intakeForm = document.getElementById("intake-form");
const statusCopy = document.getElementById("status-copy");
const payloadPreview = document.getElementById("payload-preview");
const sessionIdInput = document.getElementById("session-id");
const trainerIdInput = document.getElementById("trainer-id");
const memberIdInput = document.getElementById("member-id");
const branchInput = document.getElementById("branch-name");
const analysisGoalInput = document.getElementById("analysis-goal");

let currentVideoFile = null;
let currentObjectUrl = null;

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
    video: currentVideoFile
      ? {
          name: currentVideoFile.name,
          size: currentVideoFile.size,
          type: currentVideoFile.type,
        }
      : null,
    sessionId: sessionIdInput.value.trim(),
    trainerId: trainerIdInput.value.trim(),
    memberId: memberIdInput.value.trim(),
    branch: branchInput.value.trim(),
    analysisGoal: analysisGoalInput.value.trim(),
    status,
  };
}

function refreshPayload(status = "draft") {
  payloadPreview.textContent = JSON.stringify(buildPayload(status), null, 2);
}

function showVideo(file) {
  if (!file || !file.type.startsWith("video/")) {
    return;
  }

  currentVideoFile = file;

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
  }

  currentObjectUrl = URL.createObjectURL(file);
  videoPreview.src = currentObjectUrl;
  videoPreview.hidden = false;
  emptyState.hidden = true;
  metaPanel.hidden = false;

  metaName.textContent = file.name;
  metaSize.textContent = formatBytes(file.size);
  metaType.textContent = file.type || "Unknown";
  metaDuration.textContent = "Loading...";
  statusCopy.textContent = "Video selected. Add metadata and prepare the payload.";
  refreshPayload();
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

videoPreview.addEventListener("loadedmetadata", () => {
  metaDuration.textContent = formatDuration(videoPreview.duration);
  refreshPayload();
});

[sessionIdInput, trainerIdInput, memberIdInput, branchInput, analysisGoalInput].forEach((input) => {
  input.addEventListener("input", () => refreshPayload());
});

intakeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!currentVideoFile) {
    statusCopy.textContent = "Add a video first so we can prepare the ML payload.";
    refreshPayload("missing_video");
    return;
  }

  statusCopy.textContent = "Payload prepared. Next step: send this object to your backend or model API.";
  refreshPayload("ready_for_model");
});

refreshPayload();
