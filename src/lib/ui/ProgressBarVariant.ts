/**
 * Colour variants for ProgressBar. `midnight`, `pistachio` and `turquoise` are
 * legacy aliases for `primary`, `accent` and `tertiary`.
 */
export type ProgressBarVariant =
	'primary' | 'accent' | 'tertiary' | 'danger' | 'secondary' | LegacyProgressBarVariant;

/** @deprecated Use `primary`, `accent` and `tertiary` instead. */
export type LegacyProgressBarVariant = 'midnight' | 'pistachio' | 'turquoise';
