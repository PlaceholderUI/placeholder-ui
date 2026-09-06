<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconTable } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	let showMenu = $state(false);
	let hoverRows = $state(0);
	let hoverCols = $state(0);

	const GRID_SIZE = 6;

	const toggleMenu = () => {
		showMenu = !showMenu;
		hoverRows = 0;
		hoverCols = 0;
	};

	const insertTable = (rows: number, cols: number) => {
		editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
		showMenu = false;
	};

	const runCommand = (command: () => boolean) => {
		command();
		showMenu = false;
	};
</script>

<div style="position: relative; display: inline-block;">
	<ToolbarButton
		icon={iconTable}
		title="Table"
		active={showMenu || editor.isActive('table')}
		onclick={toggleMenu}
	/>

	{#if showMenu}
		<div class="table-menu">
			{#if editor.isActive('table')}
				<div class="menu-title">Table actions</div>
				<button
					class="menu-item"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().addRowBefore().run())}
				>
					Add row above
				</button>
				<button
					class="menu-item"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().addRowAfter().run())}
				>
					Add row below
				</button>
				<button
					class="menu-item"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().addColumnBefore().run())}
				>
					Add column left
				</button>
				<button
					class="menu-item"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().addColumnAfter().run())}
				>
					Add column right
				</button>

				<div class="menu-divider"></div>

				<button
					class="menu-item"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().toggleHeaderRow().run())}
				>
					Toggle header row
				</button>
				<button
					class="menu-item"
					type="button"
					disabled={!editor.can().mergeCells()}
					onclick={() => runCommand(() => editor.chain().focus().mergeCells().run())}
				>
					Merge cells
				</button>
				<button
					class="menu-item"
					type="button"
					disabled={!editor.can().splitCell()}
					onclick={() => runCommand(() => editor.chain().focus().splitCell().run())}
				>
					Split cell
				</button>

				<div class="menu-divider"></div>

				<button
					class="menu-item"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().deleteRow().run())}
				>
					Delete row
				</button>
				<button
					class="menu-item"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().deleteColumn().run())}
				>
					Delete column
				</button>
				<button
					class="menu-item danger"
					type="button"
					onclick={() => runCommand(() => editor.chain().focus().deleteTable().run())}
				>
					Delete table
				</button>
			{:else}
				<div class="menu-title">Insert table</div>
				<div
					class="size-grid"
					onmouseleave={() => {
						hoverRows = 0;
						hoverCols = 0;
					}}
					role="presentation"
				>
					{#each Array(GRID_SIZE) as _, row}
						{#each Array(GRID_SIZE) as _, col}
							<button
								class="size-cell"
								class:highlighted={row < hoverRows && col < hoverCols}
								type="button"
								aria-label="Insert {row + 1} by {col + 1} table"
								onmouseenter={() => {
									hoverRows = row + 1;
									hoverCols = col + 1;
								}}
								onclick={() => insertTable(row + 1, col + 1)}
							></button>
						{/each}
					{/each}
				</div>
				<div class="size-label">
					{hoverRows > 0 ? `${hoverRows} × ${hoverCols}` : 'Select size'}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.table-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 4px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 8px;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		min-width: 180px;
	}

	:global(.dark) .table-menu {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.menu-title {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 8px 6px 8px;
	}

	.menu-item {
		padding: 6px 8px;
		border: none;
		background: transparent;
		color: var(--text-color);
		font-size: 13px;
		text-align: left;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.15s ease;
		white-space: nowrap;
	}

	.menu-item:hover:not(:disabled) {
		background: rgba(var(--ui-primary-rgbc), 0.1);
	}

	:global(.dark) .menu-item:hover:not(:disabled) {
		background: rgba(var(--ui-accent-rgbc), 0.1);
	}

	.menu-item:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.menu-item.danger {
		color: #dc3545;
	}

	:global(.dark) .menu-item.danger {
		color: #ea868f;
	}

	.menu-divider {
		height: 1px;
		background: var(--border-color);
		margin: 4px 0;
	}

	.size-grid {
		display: grid;
		grid-template-columns: repeat(6, 20px);
		gap: 3px;
		padding: 0 8px;
		justify-content: center;
	}

	.size-cell {
		width: 20px;
		height: 20px;
		padding: 0;
		border: 1px solid var(--border-color);
		border-radius: 3px;
		background: var(--paper-body-bg);
		cursor: pointer;
		transition: all 0.1s ease;
	}

	.size-cell.highlighted {
		background: var(--ui-tertiary);
		border-color: var(--ui-tertiary-dark);
	}

	:global(.dark) .size-cell.highlighted {
		background: var(--ui-accent);
		border-color: var(--ui-accent-dark);
	}

	.size-label {
		text-align: center;
		font-size: 12px;
		color: var(--text-muted);
		padding: 6px 0 2px 0;
	}
</style>
