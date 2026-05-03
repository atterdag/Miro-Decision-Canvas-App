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
 * Palette of hex colours used throughout a Decision Canvas.
 * Each scheme defines colours for the main frame, section headers, and sticky
 * notes so the whole canvas looks visually consistent.
 */
export interface CanvasPalette {
  /** Background colour for the outer Decision Canvas frame. */
  frameFill: string;
  /** Fill colour for section header shapes. */
  headerFill: string;
  /** Text colour used on section headers. */
  headerText: string;
  /** Fill colour for sticky notes inside sections (must be a StickyNoteColor value). */
  stickyFill: StickyNoteColor;
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

/** A single section inside the Decision Canvas layout. */
export interface CanvasSection {
  /** Human-readable section name rendered as the header. */
  label: string;
  /** Emoji prefix shown in the section header. */
  emoji: string;
  /** Helper text pre-populated as a sticky note inside the section. */
  placeholder: string;
  /** Column index (0-based) within the two-column grid layout. */
  col: number;
  /** Row index (0-based) within the two-column grid layout. */
  row: number;
}

// ---------------------------------------------------------------------------
// Created canvas reference
// ---------------------------------------------------------------------------

/** References to Miro items that make up a created Decision Canvas. */
export interface CreatedCanvas {
  /** The outer frame that contains the entire canvas. */
  frameId: string;
  /** IDs of all section header shapes. */
  sectionHeaderIds: string[];
  /** IDs of all placeholder sticky notes. */
  stickyNoteIds: string[];
}
