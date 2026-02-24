/**
 * Centralized design tokens for consistent dimensions across the app.
 * Use these instead of hardcoded numbers for spacing, typography, and sizes.
 */

/** Base spacing scale (4px grid). Use for padding, margin, gap. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Font size scale. Use for all text. */
export const fontSize = {
  caption: 10,
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
} as const;

/** Icon and control sizes. Use for avatars, icons, touch targets. */
export const size = {
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 28,
  iconXl: 32,
  touch: 40,
  touchLg: 48,
  avatarSm: 56,
  avatarMd: 64,
  avatarLg: 80,
  avatarXl: 88,
  avatarXXl: 96,
  /** Filter/card tile (e.g. season/body type selector) */
  filterTile: 100,
  /** Sheet handle bar */
  handleWidth: 40,
  handleHeight: 4,
  /** Outfit strip (day column) */
  outfitStripWidth: 64,
  outfitStripHeight: 200,
} as const;

/** Border radius scale. */
export const radius = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  round: 20,
  roundLg: 24,
  pill: 999,
} as const;

/** Standard shadow offsets (width is always 0). */
export const shadow = {
  sm: { width: 0 as const, height: 2 },
  md: { width: 0 as const, height: 4 },
} as const;

/** Common composite values */
export const theme = {
  spacing,
  fontSize,
  size,
  radius,
  shadow,
} as const;

export default theme;
