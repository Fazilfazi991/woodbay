---
name: WoodBay Admin
description: A calm, precise operations interface for WoodBay Decor & Interiors.
colors:
  workshop-black: "#191a16"
  workshop-black-deep: "#12130f"
  workshop-black-soft: "#24251f"
  ledger-ivory: "#f7f5ef"
  ledger-panel: "#fffefb"
  ledger-muted: "#efede6"
  ledger-line: "#ddd8cd"
  ledger-text-muted: "#66645d"
  woodbay-gold: "#c6a04f"
  attention-paper: "#fbf3dc"
  success-ink: "#245d3d"
  success-paper: "#eef7f1"
  danger-ink: "#873d35"
  danger-paper: "#faefed"
typography:
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  control: "7px"
  field: "8px"
  panel: "10px"
  card: "12px"
  pill: "999px"
  modal: "3px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "28px"
  xxl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.workshop-black}"
    textColor: "{colors.ledger-panel}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "42px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.workshop-black}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 15px"
    height: "42px"
  input:
    backgroundColor: "{colors.ledger-panel}"
    textColor: "{colors.workshop-black}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "8px 12px"
    height: "48px"
  card:
    backgroundColor: "{colors.ledger-panel}"
    textColor: "{colors.workshop-black}"
    rounded: "{rounded.card}"
    padding: "18px"
  status:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
---

# Design System: WoodBay Admin

## Overview

**Creative North Star: "The Quiet Operations Atelier"**

WoodBay Admin is a calm, precise, editorial workspace: a near-black workshop shell surrounds a warm ledger-like canvas where operational truth is easy to scan. It belongs to WoodBay's public identity, but trades marketing drama for trustworthy records, concise summaries, and safe action.

The interface is deliberately refined and restrained. Compact type, fine rules, honest counts, and small uses of gold create hierarchy without dashboard theatre. Dense workflows remain breathable, and responsive layouts change their structure instead of compressing desktop tables onto phones.

**Key Characteristics:**

- Near-black navigation framing a warm ivory workspace.
- Editorial hierarchy with compact labels and tabular operational numbers.
- Flat, bordered surfaces; gold appears sparingly as a signal.
- Responsive records that become readable cards when tables no longer fit.
- Real status language and visible, accessible interaction states.

## Colors

The palette feels like ink, ledger paper, and a single brass workshop marker: warm, quiet, and functional.

### Primary

- **WoodBay Gold:** The restrained brand accent for active navigation markers, attention edges, focus outlines, and exceptional calls to action.

### Neutral

- **Workshop Black:** Primary text, filled actions, and the decisive foreground for operational content.
- **Workshop Black Deep:** The navigation shell and deepest brand field.
- **Workshop Black Soft:** Hover and selected navigation surfaces inside the shell.
- **Ledger Ivory:** The continuous admin workspace background.
- **Ledger Panel:** Cards, rows, metrics, and form fields placed on the ledger.
- **Ledger Muted:** Table headers, filter bars, and low-emphasis status surfaces.
- **Ledger Line:** The fine boundary shared by panels, rows, controls, and dividers.
- **Ledger Text Muted:** Descriptions, metadata, helper text, and secondary labels.

### Named Rules

**The Brass Marker Rule.** WoodBay Gold marks focus, selection, or genuine attention; it is never broad decoration.

**The Ledger Contrast Rule.** Separate working surfaces with small tonal steps and fine borders, not alternating saturated blocks.

## Typography

**Body Font:** Manrope (with Arial and sans-serif fallbacks)

**Character:** Manrope keeps records compact and contemporary while retaining enough warmth for the WoodBay identity. Hierarchy comes from weight, scale, and spacing rather than switching typefaces inside the operations product.

### Hierarchy

- **Headline:** Bold and compact for page identity; reserved for the single page heading.
- **Title:** Firm, slightly tightened titles for cards and record groups.
- **Body:** Clear operating copy, descriptions, fields, and record content.
- **Label:** Small, bold, tracked text for navigation groups, controls, column headers, and statuses; uppercase where the interface uses categorical language.

### Named Rules

**The One Heading Rule.** Every workflow has one unmistakable page heading; card titles and labels stay subordinate.

**The Scan-Line Rule.** Use tabular numerals for counts and keep metadata short enough to scan without competing with the record name.

## Layout

The desktop shell uses a fixed 244px navigation rail and a flexible workspace. A sticky 72px top bar anchors location and account identity; the main region is centered where appropriate and grows to a 1280px content ceiling, with horizontal padding increasing from 18px on phones to 28px on tablets and 40px on wide screens.

Operational summaries move from two columns by default, to three columns at 640px. Recent record groups become three columns at 1180px. The permanent sidebar begins at 768px; below that width it becomes a focused navigation drawer. Wide record tables are desktop patterns, while mobile uses stacked record cards with the same data priority.

Spacing follows a compact 4/8/12/18/28/40px rhythm. One-pixel gaps and rules may form continuous metric grids, while workflow groups use 18–30px separation to preserve calm scanning.

## Elevation & Depth

The system is flat and layered. Ledger Ivory, Ledger Panel, Ledger Muted, and Ledger Line establish depth through tone and containment; surfaces at rest do not float. Shadow is reserved for modal overlays, where it clarifies interruption and stacking above the dimmed workspace.

### Shadow Vocabulary

- **Modal Overlay:** A strong, diffuse overlay shadow (`0 25px 50px -12px rgb(0 0 0 / 0.25)`) for the focused voucher dialog only.

### Named Rules

**The Flat Workshop Rule.** If a border or tonal step can explain the hierarchy, do not add a shadow.

## Shapes

Corners are gently practical rather than plush. Controls use 7–8px corners, grouped panels use 10–12px corners, and status markers use full pills. The modal's tighter 3px corner gives the interruption a deliberate, tool-like character. Fine one-pixel borders are structural and should remain visible on ivory surfaces.

## Components

### Buttons

- **Shape:** Compact controls with gently rounded 7px corners and a 42px minimum height.
- **Primary:** Workshop Black fill, Ledger Panel text, compact tracked uppercase label, and 18px horizontal padding.
- **Hover / Focus:** Hover shifts tone without lifting; keyboard focus uses a 2px WoodBay Gold outline with a 3px offset.
- **Secondary:** Transparent against Ledger Ivory with a Workshop Black border and label.

### Chips

- **Style:** Small uppercase pills with a pale tonal fill, matching border, and dark semantic ink.
- **State:** Green identifies available or positive records; warm neutral identifies redeemed records; muted red identifies disabled or expired records.

### Cards / Containers

- **Corner Style:** Grouped operational cards use 10–12px corners.
- **Background:** Ledger Panel on Ledger Ivory, with Ledger Muted reserved for structural headers and filter regions.
- **Shadow Strategy:** Flat at rest; see Elevation & Depth.
- **Border:** One-pixel Ledger Line boundaries and internal dividers.
- **Internal Padding:** Usually 18px, expanding to 28px only for larger workflow regions.

### Inputs / Fields

- **Style:** Ledger Panel fill, Ledger Line stroke, 8px corners, and a 48px minimum height.
- **Focus:** A visible outline; within the admin system the brand focus color is WoodBay Gold.
- **Error / Disabled:** Error copy and controls use the established muted red family; disabled controls reduce opacity and block interaction.

### Navigation

The navigation is a near-black vertical rail with compact line icons, 13px semibold item labels, and small tracked uppercase group labels. Hover uses Workshop Black Soft; the active row gains a slightly lighter dark field and a narrow WoodBay Gold marker. On mobile, the same navigation becomes a modal drawer with a dimmed backdrop, focus containment, Escape handling, and focus restoration.

### Metric Grid

Metrics are joined Ledger Panel cells separated by a one-pixel Ledger Line grid. Labels remain quiet, values use large tabular numerals, and only metrics requiring attention receive a thin inset gold marker.

### Attention Strip

The attention strip uses a pale warm field and gold-brown border, with concise exception copy and one direct review link. It appears only when real stored data requires action.

## Do's and Don'ts

### Do:

- **Do** use WoodBay Gold only for focus, current location, verified attention, or a high-value action.
- **Do** keep operational counts and statuses tied to real stored data and established state definitions.
- **Do** preserve the 4/8/12/18/28/40px spacing rhythm and fine one-pixel structure.
- **Do** replace wide tables with prioritized record cards on small screens.
- **Do** provide explicit labels, keyboard focus, semantic dialogs, and sufficient contrast.

### Don't:

- **Don't** add decorative dashboard charts, fabricated growth metrics, or unread indicators.
- **Don't** use shadows on ordinary cards, metrics, tables, fields, or navigation.
- **Don't** turn gold into a broad background or repeated ornament.
- **Don't** compress desktop tables until their records become illegible on phones.
- **Don't** introduce soft, oversized, playful components that weaken the precise workshop character.
