/**
 * Board utility helpers.
 *
 * Thin wrappers around the Miro Web SDK that centralise error-handling and
 * provide convenient defaults so the rest of the app stays declarative.
 */

import type { Frame, Shape, StickyNote, StickyNoteColor } from "@mirohq/websdk-types";

// ---------------------------------------------------------------------------
// Frame helpers
// ---------------------------------------------------------------------------

export interface CreateFrameOptions {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Optional hex fill colour (e.g. "#f0f4ff"). */
  fillColor?: string;
}

/** Creates a frame on the board and returns the resulting item. */
export async function createFrame(
  options: CreateFrameOptions
): Promise<Frame> {
  const { title, x, y, width, height, fillColor } = options;
  return miro.board.createFrame({
    title,
    x: x + width / 2,
    y: y + height / 2,
    width,
    height,
    style: {
      fillColor: fillColor ?? "#ffffff",
    },
  });
}

// ---------------------------------------------------------------------------
// Shape helpers
// ---------------------------------------------------------------------------

export interface CreateRectangleOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  /** Text colour as a hex string (maps to ShapeStyle.color). */
  textColor?: string;
  content?: string;
  /** Font size in points. Defaults to 14. */
  fontSize?: number;
  /** Vertical text alignment inside the shape. Defaults to "middle". */
  textAlignVertical?: "top" | "middle" | "bottom";
  /** Hex border stroke colour. Defaults to no visible border (borderWidth=0). */
  borderColor?: string;
  /** Border stroke width in board units. Defaults to 0 (no border). */
  borderWidth?: number;
  /** Parent frame ID. */
  parentId?: string;
}

/** Creates a rounded-rectangle shape and returns the resulting item. */
export async function createRectangle(
  options: CreateRectangleOptions
): Promise<Shape> {
  const {
    x,
    y,
    width,
    height,
    fillColor,
    textColor = "#1a1a2e",
    content = "",
    fontSize = 14,
    textAlignVertical = "middle",
    borderColor = "#000000",
    borderWidth = 0,
    parentId,
  } = options;

  return miro.board.createShape({
    shape: "round_rectangle",
    x: x + width / 2,
    y: y + height / 2,
    width,
    height,
    content,
    parentId,
    style: {
      fillColor,
      color: textColor,
      fontSize,
      fontFamily: "open_sans",
      textAlign: "left",
      textAlignVertical,
      borderColor,
      borderWidth,
    },
  });
}

// ---------------------------------------------------------------------------
// Sticky note helpers
// ---------------------------------------------------------------------------

export interface CreateStickyNoteOptions {
  x: number;
  y: number;
  width?: number;
  /** Height of the sticky note (board units). Defaults to the same value as width. */
  height?: number;
  content: string;
  fillColor?: StickyNoteColor;
  /** Parent frame ID to attach the sticky to. */
  parentId?: string;
}

/** Creates a sticky note and returns the resulting item. */
export async function createStickyNote(
  options: CreateStickyNoteOptions
): Promise<StickyNote> {
  const { x, y, width = 200, content, fillColor = "gray", parentId } =
    options;
  const height = options.height ?? width;

  return miro.board.createStickyNote({
    content,
    x: x + width / 2,
    y: y + height / 2,
    width,
    parentId,
    style: {
      fillColor,
      textAlign: "left",
      textAlignVertical: "top",
    },
  });
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

export interface CreateTextOptions {
  x: number;
  y: number;
  content: string;
  /** Font size in points. Defaults to 28. */
  fontSize?: number;
  color?: string;
}

/** Creates a text item (heading) and returns the resulting item. */
export async function createText(options: CreateTextOptions) {
  const { x, y, content, fontSize = 28, color = "#1a1a2e" } = options;
  return miro.board.createText({
    content,
    x,
    y,
    style: {
      color,
      fontSize,
      fontFamily: "open_sans",
      textAlign: "left",
    },
  });
}

// ---------------------------------------------------------------------------
// Viewport helpers
// ---------------------------------------------------------------------------

/** Zooms and pans the viewport to make the given frame fully visible. */
export async function zoomToFrame(frameId: string): Promise<void> {
  const results = await miro.board.get({ id: frameId });
  if (results.length > 0) {
    await miro.board.viewport.zoomTo(results[0]);
  }
}
