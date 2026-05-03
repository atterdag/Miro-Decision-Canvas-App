/**
 * Decision Canvas template.
 *
 * Builds the full Decision Canvas layout on the Miro board.
 * The layout mirrors the SVG reference design with three horizontal bands:
 *
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │  <Title>                                                         │
 *  │  ┌──────────────────────────────────────────┐  ┌──────────────┐ │
 *  │  │ Decision Statement                       │  │ Success      │ │  (TOP BAND – light grey)
 *  │  │                                          │  │ Criteria     │ │
 *  │  └──────────────────────────────────────────┘  └──────────────┘ │
 *  ├──────────────────────────────────────────────────────────────────┤
 *  │  ┌──────────┐  ┌─────────────┐  ┌──────────┐  ┌──────────────┐ │
 *  │  │  Facts   │  │ Constraints │  │Principles│  │   Options    │ │  (MIDDLE BAND – white)
 *  │  │ [sticky] │  │  [sticky]   │  │ [sticky] │  │  [sticky]    │ │
 *  │  └──────────┘  └─────────────┘  └──────────┘  └──────────────┘ │
 *  ├──────────────────────────────────────────────────────────────────┤
 *  │  ┌───────────────────────────────┐  ┌──────────┐  ┌──────────┐ │
 *  │  │       Decision Outcome        │  │  Risks & │  │Ownership │ │  (BOTTOM BAND – light green)
 *  │  │           [sticky]            │  │Trade-offs│  │& Next    │ │
 *  │  └───────────────────────────────┘  └──────────┘  └──────────┘ │
 *  └──────────────────────────────────────────────────────────────────┘
 */

import type {
  CanvasSection,
  CanvasPalette,
  ColorScheme,
  CreatedCanvas,
  DecisionCanvasConfig,
} from "../types.js";
import type { StickyNoteColor } from "@mirohq/websdk-types";
import {
  createFrame,
  createRectangle,
  createStickyNote,
  createText,
} from "../utils/board.js";

// ---------------------------------------------------------------------------
// Colour palettes  (band backgrounds change per scheme; section fills are fixed)
// ---------------------------------------------------------------------------

const PALETTES: Record<ColorScheme, CanvasPalette> = {
  blue: {
    frameFill: "#f5f5f5",
    topBandFill: "#f2f2f2",
    midBandFill: "#ffffff",
    botBandFill: "#e8f5e9",
  },
  green: {
    frameFill: "#f1f8e9",
    topBandFill: "#e8f5e9",
    midBandFill: "#f9fbe7",
    botBandFill: "#c8e6c9",
  },
  purple: {
    frameFill: "#f8f0ff",
    topBandFill: "#f3e5f5",
    midBandFill: "#fce4ec",
    botBandFill: "#ede7f6",
  },
  orange: {
    frameFill: "#fffde7",
    topBandFill: "#fff8e1",
    midBandFill: "#fff3e0",
    botBandFill: "#ffe0b2",
  },
};

// ---------------------------------------------------------------------------
// Canvas dimensions (in board units – directly match the SVG viewport)
// ---------------------------------------------------------------------------

const CANVAS_W = 1920;
const CANVAS_H = 1080;

// Outer margin between frame edge and first band
const MARGIN = 20;
const BAND_X = MARGIN;
const BAND_W = CANVAS_W - MARGIN * 2; // 1880

// Title area (sits above the first band)
const TITLE_Y = 40; // approximate centre-y of title text

// Top band
const TOP_BAND_Y = 60;
const TOP_BAND_H = 200;
const TOP_SEC_Y = 80;
const TOP_SEC_H = 160;
const DEC_STMT_X = 40;
const DEC_STMT_W = 1320;
const SUCCESS_X = 1400;
const SUCCESS_W = 460;

// Middle band
const MID_BAND_Y = 280;
const MID_BAND_H = 420;
const MID_SEC_Y = 320;
const MID_SEC_H = 340;
const MID_SEC_W = 430;
const FACTS_X = 40;
const CONSTRAINTS_X = 500;
const PRINCIPLES_X = 960;
const OPTIONS_X = 1420;

// Bottom band
const BOT_BAND_Y = 730;
const BOT_BAND_H = 320;
const BOT_SEC_Y = 770;
const BOT_SEC_H = 260;
const DEC_OUT_X = 40;
const DEC_OUT_W = 1000;
const RISKS_X = 1080;
const RISKS_W = 380;
const OWNERSHIP_X = 1480;
const OWNERSHIP_W = 380;

// Sticky note layout within sections
const SECTION_BORDER = "#333333";
const SECTION_BORDER_W = 2;
const STICKY_MARGIN = 10;
const STICKY_HEADER_H = 40; // space reserved at top of box for the header label

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------

/** Builds the full list of sections using the current palette for band fills. */
function buildSections(palette: CanvasPalette): CanvasSection[] {
  return [
    // ── TOP BAND ──────────────────────────────────────────────────────────
    {
      label: "Decision Statement",
      placeholder:
        "Decision Statement\n\nWhat decision must be made in this session?",
      x: DEC_STMT_X,
      y: TOP_SEC_Y,
      width: DEC_STMT_W,
      height: TOP_SEC_H,
      boxFill: palette.topBandFill,
      stickyFill: null, // section is too narrow for a square sticky
      borderColor: SECTION_BORDER,
    },
    {
      label: "Success Criteria",
      placeholder:
        "Success Criteria\n\n• Clear commitment\n• Executable outcome\n• Ownership assigned",
      x: SUCCESS_X,
      y: TOP_SEC_Y,
      width: SUCCESS_W,
      height: TOP_SEC_H,
      boxFill: "#ffffff",
      stickyFill: null,
      borderColor: SECTION_BORDER,
    },

    // ── MIDDLE BAND ───────────────────────────────────────────────────────
    {
      label: "Facts",
      placeholder: "List the known facts and data relevant to this decision.",
      x: FACTS_X,
      y: MID_SEC_Y,
      width: MID_SEC_W,
      height: MID_SEC_H,
      boxFill: "#e3f2fd",
      stickyFill: "light_blue" as StickyNoteColor,
      borderColor: SECTION_BORDER,
    },
    {
      label: "Constraints",
      placeholder: "What constraints, limitations, or non-negotiables apply?",
      x: CONSTRAINTS_X,
      y: MID_SEC_Y,
      width: MID_SEC_W,
      height: MID_SEC_H,
      boxFill: "#ffebee",
      stickyFill: "light_pink" as StickyNoteColor,
      borderColor: SECTION_BORDER,
    },
    {
      label: "Principles",
      placeholder:
        "Which design principles or values should guide this decision?",
      x: PRINCIPLES_X,
      y: MID_SEC_Y,
      width: MID_SEC_W,
      height: MID_SEC_H,
      boxFill: "#fffde7",
      stickyFill: "light_yellow" as StickyNoteColor,
      borderColor: SECTION_BORDER,
    },
    {
      label: "Options",
      placeholder: "List all options or alternatives being considered.",
      x: OPTIONS_X,
      y: MID_SEC_Y,
      width: MID_SEC_W,
      height: MID_SEC_H,
      boxFill: "#f3e5f5",
      stickyFill: "violet" as StickyNoteColor,
      borderColor: SECTION_BORDER,
    },

    // ── BOTTOM BAND ───────────────────────────────────────────────────────
    {
      label: "Decision Outcome",
      placeholder:
        "State the chosen decision clearly. Who made it and when was it made?",
      x: DEC_OUT_X,
      y: BOT_SEC_Y,
      width: DEC_OUT_W,
      height: BOT_SEC_H,
      boxFill: "#ffffff",
      stickyFill: "light_green" as StickyNoteColor,
      borderColor: SECTION_BORDER,
    },
    {
      label: "Risks & Trade-offs",
      placeholder: "What are the known risks and trade-offs of the chosen option?",
      x: RISKS_X,
      y: BOT_SEC_Y,
      width: RISKS_W,
      height: BOT_SEC_H,
      boxFill: "#ffffff",
      stickyFill: "light_pink" as StickyNoteColor,
      borderColor: SECTION_BORDER,
    },
    {
      label: "Ownership & Next Steps",
      placeholder: "List owners, due dates, and concrete follow-up actions.",
      x: OWNERSHIP_X,
      y: BOT_SEC_Y,
      width: OWNERSHIP_W,
      height: BOT_SEC_H,
      boxFill: "#ffffff",
      stickyFill: "cyan" as StickyNoteColor,
      borderColor: SECTION_BORDER,
    },
  ];
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Creates a full Decision Canvas on the current Miro board.
 *
 * Layout (board units, matches the SVG reference – 1920 × 1080):
 *  - Top band   (y 60–260):  Decision Statement  |  Success Criteria
 *  - Middle band(y 280–700): Facts | Constraints | Principles | Options
 *  - Bottom band(y 730–1050): Decision Outcome | Risks & Trade-offs | Ownership
 *
 * @param config - User-supplied configuration (title, colour scheme, origin).
 * @returns References to all created Miro items.
 */
export async function createDecisionCanvas(
  config: DecisionCanvasConfig
): Promise<CreatedCanvas> {
  const { title, colorScheme, originX = 0, originY = 0 } = config;
  const palette = PALETTES[colorScheme];
  const sections = buildSections(palette);

  // 1. Outer canvas frame
  const canvasFrame = await createFrame({
    title,
    x: originX,
    y: originY,
    width: CANVAS_W,
    height: CANVAS_H,
    fillColor: palette.frameFill,
  });
  const frameId = canvasFrame.id;

  // 2. Canvas title – positioned above the top band
  await createText({
    x: originX + CANVAS_W / 2,
    y: originY + TITLE_Y,
    content: title,
    fontSize: 28,
    color: "#1a1a2e",
  });

  // 3. Horizontal band backgrounds (created first so sections layer above them)
  const bandDefs = [
    { y: TOP_BAND_Y, h: TOP_BAND_H, fill: palette.topBandFill },
    { y: MID_BAND_Y, h: MID_BAND_H, fill: palette.midBandFill },
    { y: BOT_BAND_Y, h: BOT_BAND_H, fill: palette.botBandFill },
  ];
  for (const band of bandDefs) {
    await createRectangle({
      x: originX + BAND_X,
      y: originY + band.y,
      width: BAND_W,
      height: band.h,
      fillColor: band.fill,
      borderColor: SECTION_BORDER,
      borderWidth: SECTION_BORDER_W,
      parentId: frameId,
    });
  }

  // 4. Section boxes + optional sticky notes
  const sectionHeaderIds: string[] = [];
  const stickyNoteIds: string[] = [];

  for (const section of sections) {
    // Section background box with header label at the top
    const box = await createRectangle({
      x: originX + section.x,
      y: originY + section.y,
      width: section.width,
      height: section.height,
      fillColor: section.boxFill,
      borderColor: section.borderColor ?? SECTION_BORDER,
      borderWidth: SECTION_BORDER_W,
      content: section.label,
      textColor: "#1a1a2e",
      fontSize: 18,
      textAlignVertical: "top",
      parentId: frameId,
    });
    sectionHeaderIds.push(box.id);

    // Sticky note in the body of the section (skipped when stickyFill is null)
    if (section.stickyFill !== null) {
      // Make the sticky as wide as the section minus margins, and square
      const stickyW = Math.min(
        section.width - STICKY_MARGIN * 2,
        section.height - STICKY_HEADER_H - STICKY_MARGIN * 2
      );
      const sticky = await createStickyNote({
        x: originX + section.x + STICKY_MARGIN,
        y: originY + section.y + STICKY_HEADER_H + STICKY_MARGIN,
        width: stickyW,
        height: stickyW,
        content: section.placeholder,
        fillColor: section.stickyFill,
        parentId: frameId,
      });
      stickyNoteIds.push(sticky.id);
    }
  }

  return { frameId, sectionHeaderIds, stickyNoteIds };
}
