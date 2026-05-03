/**
 * Decision Canvas template.
 *
 * Builds the full Decision Canvas layout on the Miro board:
 *   ┌─────────────────────────────────────────────────┐
 *   │  <Title>                              [canvas]  │
 *   │  ┌───────────────┐  ┌───────────────┐           │
 *   │  │ Problem Stmt  │  │    Options    │           │
 *   │  │  [sticky]     │  │  [sticky]     │           │
 *   │  └───────────────┘  └───────────────┘           │
 *   │  ┌───────────────┐  ┌───────────────┐           │
 *   │  │ Pros & Cons   │  │   Decision    │           │
 *   │  │  [sticky]     │  │  [sticky]     │           │
 *   │  └───────────────┘  └───────────────┘           │
 *   │  ┌───────────────┐  ┌───────────────┐           │
 *   │  │  Rationale    │  │  Next Steps   │           │
 *   │  │  [sticky]     │  │  [sticky]     │           │
 *   │  └───────────────┘  └───────────────┘           │
 *   └─────────────────────────────────────────────────┘
 */

import type { CanvasSection, CanvasPalette, ColorScheme, CreatedCanvas, DecisionCanvasConfig } from "../types.js";
import type { StickyNoteColor } from "@mirohq/websdk-types";
import {
  createFrame,
  createRectangle,
  createStickyNote,
  createText,
} from "../utils/board.js";

// ---------------------------------------------------------------------------
// Colour palettes
// ---------------------------------------------------------------------------

const PALETTES: Record<ColorScheme, CanvasPalette> = {
  blue: {
    frameFill: "#eef1ff",
    headerFill: "#4262ff",
    headerText: "#ffffff",
    stickyFill: "light_blue" as StickyNoteColor,
  },
  green: {
    frameFill: "#edfbf0",
    headerFill: "#1a9c45",
    headerText: "#ffffff",
    stickyFill: "light_green" as StickyNoteColor,
  },
  purple: {
    frameFill: "#f5eeff",
    headerFill: "#7c3aed",
    headerText: "#ffffff",
    stickyFill: "violet" as StickyNoteColor,
  },
  orange: {
    frameFill: "#fff8ed",
    headerFill: "#e07b00",
    headerText: "#ffffff",
    stickyFill: "yellow" as StickyNoteColor,
  },
};

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------

const SECTIONS: CanvasSection[] = [
  {
    label: "🎯 Problem Statement",
    emoji: "🎯",
    placeholder:
      "Describe the problem or decision that needs to be made. What is the context and why is a decision needed?",
    col: 0,
    row: 0,
  },
  {
    label: "💡 Options",
    emoji: "💡",
    placeholder:
      "List all possible options or approaches being considered. Add one option per sticky note.",
    col: 1,
    row: 0,
  },
  {
    label: "⚖️ Pros & Cons",
    emoji: "⚖️",
    placeholder:
      "For each option list the advantages (+) and disadvantages (−). Use separate stickies for pros and cons.",
    col: 0,
    row: 1,
  },
  {
    label: "✅ Decision",
    emoji: "✅",
    placeholder:
      "State the chosen option clearly. Who made the decision and when was it made?",
    col: 1,
    row: 1,
  },
  {
    label: "📝 Rationale",
    emoji: "📝",
    placeholder:
      "Explain why this option was chosen over the others. What criteria were most important?",
    col: 0,
    row: 2,
  },
  {
    label: "🚀 Next Steps",
    emoji: "🚀",
    placeholder:
      "List the concrete actions required to implement the decision. Include owners and due dates.",
    col: 1,
    row: 2,
  },
];

// ---------------------------------------------------------------------------
// Layout constants (board units)
// ---------------------------------------------------------------------------

const CANVAS_PADDING = 48;
const TITLE_HEIGHT = 60;
const TITLE_MARGIN_BOTTOM = 24;

const NUM_COLS = 2;
const NUM_ROWS = SECTIONS.length / NUM_COLS; // 3

const SECTION_WIDTH = 560;
const SECTION_HEIGHT = 360;
const SECTION_GAP = 24;

const HEADER_HEIGHT = 48;
const STICKY_MARGIN = 16;
const STICKY_SIZE = SECTION_WIDTH - STICKY_MARGIN * 2;

const CANVAS_WIDTH =
  CANVAS_PADDING * 2 + NUM_COLS * SECTION_WIDTH + (NUM_COLS - 1) * SECTION_GAP;
const CANVAS_HEIGHT =
  CANVAS_PADDING * 2 +
  TITLE_HEIGHT +
  TITLE_MARGIN_BOTTOM +
  NUM_ROWS * SECTION_HEIGHT +
  (NUM_ROWS - 1) * SECTION_GAP;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Creates a full Decision Canvas on the current Miro board.
 *
 * @param config - User-supplied configuration (title, colour scheme, origin).
 * @returns References to all created Miro items.
 */
export async function createDecisionCanvas(
  config: DecisionCanvasConfig
): Promise<CreatedCanvas> {
  const { title, colorScheme, originX = 0, originY = 0 } = config;
  const palette = PALETTES[colorScheme];

  // 1. Create the outer canvas frame
  const canvasFrame = await createFrame({
    title,
    x: originX,
    y: originY,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    fillColor: palette.frameFill,
  });

  const frameId = canvasFrame.id;

  // 2. Add the canvas title text
  await createText({
    x: originX + CANVAS_PADDING,
    y: originY + CANVAS_PADDING + TITLE_HEIGHT / 2,
    content: title,
    fontSize: 32,
    color: "#1a1a2e",
  });

  // 3. Create sections
  const sectionHeaderIds: string[] = [];
  const stickyNoteIds: string[] = [];

  for (const section of SECTIONS) {
    const sectionX =
      originX +
      CANVAS_PADDING +
      section.col * (SECTION_WIDTH + SECTION_GAP);
    const sectionY =
      originY +
      CANVAS_PADDING +
      TITLE_HEIGHT +
      TITLE_MARGIN_BOTTOM +
      section.row * (SECTION_HEIGHT + SECTION_GAP);

    // Section header rectangle
    const header = await createRectangle({
      x: sectionX,
      y: sectionY,
      width: SECTION_WIDTH,
      height: HEADER_HEIGHT,
      fillColor: palette.headerFill,
      textColor: palette.headerText,
      content: section.label,
      fontSize: 15,
      parentId: frameId,
    });
    sectionHeaderIds.push(header.id);

    // Placeholder sticky note
    const stickyY = sectionY + HEADER_HEIGHT + STICKY_MARGIN;
    const sticky = await createStickyNote({
      x: sectionX + STICKY_MARGIN,
      y: stickyY,
      width: STICKY_SIZE,
      content: section.placeholder,
      fillColor: palette.stickyFill,
      parentId: frameId,
    });
    stickyNoteIds.push(sticky.id);
  }

  return { frameId, sectionHeaderIds, stickyNoteIds };
}
