/**
 * TypeScript types and interfaces for the Decision Canvas app.
 *
 * These supplement (and reference) the types from @mirohq/websdk-types.
 */

import type { StickyNoteColor } from "@mirohq/websdk-types";

// ---------------------------------------------------------------------------
// Colour scheme
// ---------------------------------------------------------------------------

/** Supported colour scheme identifiers. */
export type ColorScheme = "blue" | "green" | "purple" | "orange";

/**
 * Palette of colours applied to the three horizontal band backgrounds.
 * Each scheme lets users vary the overall look while keeping the per-section
 * semantic colours (e.g. facts = light-blue, constraints = light-red) fixed.
 */
export interface CanvasPalette {
  /** Fill colour for the outer canvas frame. */
  frameFill: string;
  /** Fill colour for the top band (Decision Statement area). */
  topBandFill: string;
  /** Fill colour for the middle band (brainstorming columns). */
  midBandFill: string;
  /** Fill colour for the bottom band (outcome area). */
  botBandFill: string;
}

// ---------------------------------------------------------------------------
// Template configuration
// ---------------------------------------------------------------------------

/** User-supplied configuration for a new Decision Canvas. */
export interface DecisionCanvasConfig {
  /** Title shown at the top of the canvas frame. */
  title: string;
  /** Visual colour scheme applied to every element. */
  colorScheme: ColorScheme;
  /**
   * X coordinate (in board units) of the top-left corner of the canvas.
   * Defaults to 0 when not supplied.
   */
  originX?: number;
  /**
   * Y coordinate (in board units) of the top-left corner of the canvas.
   * Defaults to 0 when not supplied.
   */
  originY?: number;
}

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------

/**
 * A single section inside the Decision Canvas.
 * Position and size are expressed relative to the canvas top-left origin
 * so the template can be placed anywhere on the board.
 */
export interface CanvasSection {
  /** Human-readable section name used as the box header. */
  label: string;
  /** Helper text pre-populated inside the section. */
  placeholder: string;
  /** Top-left X coordinate relative to the canvas origin (board units). */
  x: number;
  /** Top-left Y coordinate relative to the canvas origin (board units). */
  y: number;
  /** Section box width (board units). */
  width: number;
  /** Section box height (board units). */
  height: number;
  /** Hex fill colour for the section background box. */
  boxFill: string;
  /**
   * Sticky-note colour placed inside the section.
   * Set to `null` to skip creating a sticky note (used for narrow sections).
   */
  stickyFill: StickyNoteColor | null;
  /** Hex border colour for the section box. Defaults to "#333333". */
  borderColor?: string;
}

// ---------------------------------------------------------------------------
// Created canvas reference
// ---------------------------------------------------------------------------

/** References to Miro items that make up a created Decision Canvas. */
export interface CreatedCanvas {
  /** The outer frame that contains the entire canvas. */
  frameId: string;
  /** IDs of all section box shapes (one per section). */
  sectionHeaderIds: string[];
  /** IDs of all placeholder sticky notes. */
  stickyNoteIds: string[];
}
