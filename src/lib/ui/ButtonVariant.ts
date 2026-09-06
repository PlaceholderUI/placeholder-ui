/**
 * Visual variants shared by Button, Badge, ActionIcon, Dropdown and Accordion.
 *
 * Brand variants map onto the semantic colour tokens:
 *   - `primary`   → `--ui-primary`   (dark brand colour)
 *   - `accent`    → `--ui-accent`    (light brand colour)
 *   - `tertiary`  → `--ui-tertiary`  (supporting colour)
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
	| 'shaded';
