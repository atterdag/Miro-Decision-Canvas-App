/**
 * main.ts – Decision Canvas panel logic.
 *
 * Controls the UI rendered in the app panel (index.html).  Reads user input,
 * calls the template creator, and gives feedback via the status element.
 */

import type { ColorScheme } from "./types.js";
import { createDecisionCanvas } from "./template/decisionCanvas.js";
import { zoomToFrame } from "./utils/board.js";

// ---------------------------------------------------------------------------
// DOM element references
// ---------------------------------------------------------------------------

const titleInput = document.getElementById("canvas-title") as HTMLInputElement;
const colorSelect = document.getElementById(
  "color-scheme"
) as HTMLSelectElement;
const createBtn = document.getElementById("create-btn") as HTMLButtonElement;
const zoomBtn = document.getElementById("zoom-btn") as HTMLButtonElement;
const statusMsg = document.getElementById("status-msg") as HTMLDivElement;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** ID of the most-recently created canvas frame, used for the zoom action. */
let lastCreatedFrameId: string | null = null;

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

type StatusType = "success" | "error" | "loading";

function showStatus(message: string, type: StatusType): void {
  statusMsg.textContent = message;
  statusMsg.className = `status status--${type}`;
}

function hideStatus(): void {
  statusMsg.className = "status status--hidden";
  statusMsg.textContent = "";
}

// ---------------------------------------------------------------------------
// Event: Create button
// ---------------------------------------------------------------------------

createBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim() || "Decision Canvas";
  const colorScheme = (colorSelect.value as ColorScheme) ?? "blue";

  createBtn.disabled = true;
  zoomBtn.style.display = "none";
  showStatus("Creating Decision Canvas…", "loading");

  try {
    // Place the canvas near the viewport centre so it is immediately visible.
    const viewport = await miro.board.viewport.get();
    const originX = viewport.x + 80;
    const originY = viewport.y + 80;

    const created = await createDecisionCanvas({
      title,
      colorScheme,
      originX,
      originY,
    });

    lastCreatedFrameId = created.frameId;

    showStatus(
      `✅ Decision Canvas "${title}" created with ${created.sectionHeaderIds.length} sections.`,
      "success"
    );

    // Reveal the "Zoom to canvas" shortcut button.
    zoomBtn.style.display = "block";

    // Automatically zoom the board to the newly created canvas.
    await zoomToFrame(created.frameId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    showStatus(`❌ Failed to create canvas: ${message}`, "error");
    console.error("[DecisionCanvas] createDecisionCanvas error:", err);
  } finally {
    createBtn.disabled = false;
  }
});

// ---------------------------------------------------------------------------
// Event: Zoom button
// ---------------------------------------------------------------------------

zoomBtn.addEventListener("click", async () => {
  if (!lastCreatedFrameId) return;

  zoomBtn.disabled = true;
  try {
    await zoomToFrame(lastCreatedFrameId);
  } finally {
    zoomBtn.disabled = false;
  }
});

// ---------------------------------------------------------------------------
// Initialise – hide status on load
// ---------------------------------------------------------------------------

hideStatus();
