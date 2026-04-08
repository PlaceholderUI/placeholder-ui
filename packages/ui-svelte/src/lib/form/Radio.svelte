<script lang="ts">
	export interface RadioProps {
		/** HTML name attribute for the radio input */
		name?: string;
		/** Label text displayed next to the radio */
		label?: string;
		/** Custom ID for the input element */
		id?: string;
		/** Additional CSS classes */
		class?: string;
		/** Disable the radio */
		disabled?: boolean;
		/** Whether the radio is checked (bindable) */
		checked?: boolean;
		/** When true, the radio state is controlled externally only. Clicking will call onchange but won't toggle the radio. */
		controlled?: boolean;
		/** Callback when checked state changes */
		onchange?: (checked: boolean) => void;
	}

	const nonce = Math.random().toString(36).substring(2, 15);

	let {
		name,
		label,
		id = `radio-${nonce}`,
		class: classes = '',
		disabled = false,
		checked = $bindable(false),
		controlled = false,
		onchange = undefined
	}: RadioProps = $props();
</script>

<div class="radio-wrapper {disabled ? 'disabled' : ''}">
	<label class={disabled ? 'cursor-not-allowed' : ''} for={id}>
		<input
			{id}
			type="radio"
			class="accent-accent {classes}"
			{name}
			{disabled}
			{checked}
			onchange={(e) => {
				if (controlled) {
					e.currentTarget.checked = checked;
					onchange?.(!checked);
				} else {
					checked = e.currentTarget.checked;
					onchange?.(checked);
				}
			}}
		/>
		{#if label}
			{label}
		{/if}
	</label>
</div>

<style>
	label {
		display: flex;
		flex-direction: row;
		align-items: center;
		user-select: none;
		cursor: pointer;
	}

	.disabled label,
	.disabled input {
		cursor: not-allowed;
	}

	input {
		position: relative !important;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin: var(--pui-spacing-2);
		box-sizing: content-box;
		overflow: hidden;
		cursor: pointer;
	}

	input:before {
		content: '';
		display: block;
		box-sizing: content-box;
		width: 16px;
		height: 16px;
		border: 2px solid var(--pui-border-disabled);
		transition: var(--pui-transition-fast) border-color var(--pui-ease-out);
	}

	:global(.dark) input:before {
		border-color: var(--pui-color-gray-600);
	}
	input:checked:before {
		border-color: var(--pui-color-primary);
		transition: var(--pui-transition-slow) border-color var(--pui-ease-out);
	}
	:global(.dark) input:checked:before {
		border-color: var(--pui-color-secondary);
	}

	input:disabled:before {
		border-color: var(--pui-border-disabled);
		background-color: var(--pui-border-disabled);
		opacity: 0.5;
	}
	:global(.dark) input:disabled:before {
		border-color: var(--pui-color-gray-600);
		background-color: var(--pui-color-gray-600);
	}
	input:after {
		content: '';
		display: block;
		position: absolute;
		box-sizing: content-box;
		top: 50%;
		left: 50%;
		transform-origin: 50% 50%;
		background-color: var(--pui-color-primary);
		width: 16px;
		height: 16px;
		border-radius: var(--pui-radius-full);
		transform: translate(-50%, -50%) scale(0);
	}
	input:disabled:after {
		opacity: 0.5;
	}
	:global(.dark) input:after {
		background-color: var(--pui-color-secondary);
	}
	input[type='radio']:before {
		border-radius: var(--pui-radius-full);
	}
	input[type='radio']:after {
		width: 16px;
		height: 16px;
		border-radius: var(--pui-radius-full);
		transform: translate(-50%, -50%) scale(0);
	}
	input[type='radio']:checked:after {
		-webkit-animation: toggleOnRadio var(--pui-transition-fast) ease forwards;
		animation: toggleOnRadio var(--pui-transition-fast) ease forwards;
	}
	@-webkit-keyframes toggleOnRadio {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(0.9);
		}
		100% {
			transform: translate(-50%, -50%) scale(0.8);
		}
	}
	@keyframes toggleOnRadio {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(0.9);
		}
		100% {
			transform: translate(-50%, -50%) scale(0.8);
		}
	}
</style>
