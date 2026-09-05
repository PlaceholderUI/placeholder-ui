/**
 * Visual variants shared by Button, Badge, ActionIcon, Dropdown and Accordion.
 *
 * Brand variants map onto the semantic colour tokens:
 *   - `primary`   → `--ui-primary`   (dark brand colour)
 *   - `accent`    → `--ui-accent`    (light brand colour)
 *   - `tertiary`  → `--ui-tertiary`  (supporting colour)
 *
 * The `midnight`, `pistachio` and `turquoise` names are legacy aliases for
 * `primary`, `accent` and `tertiary` respectively. They keep working but new code
 * should use the semantic names.
 */
export type ButtonVariant =
	| 'white'
	| 'secondary'
	| 'secondary-subtle'
	| 'secondary-selected'
	| 'danger'
	| 'danger-subtle'
	| 'auto-subtle'
	| 'auto-outline'
	| 'primary'
	| 'primary-outline'
	| 'primary-subtle'
	| 'accent'
	| 'accent-outline'
	| 'accent-subtle'
	| 'tertiary'
	| 'tertiary-subtle'
	| 'shaded'
	| LegacyButtonVariant;

/** @deprecated Use `primary`, `accent` and `tertiary` instead. */
export type LegacyButtonVariant =
	| 'pistachio'
	| 'pistachio-outline'
	| 'pistachio-subtle'
	| 'midnight'
	| 'midnight-outline'
	| 'midnight-subtle'
	| 'turquoise'
	| 'turquoise-subtle';
