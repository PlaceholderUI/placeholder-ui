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
		margin: 8px;
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
		border: 2px solid #ccc;
		transition: 0.2s border-color ease;
	}

	:global(.dark) input:before {
		border-color: #666;
	}
	input:checked:before {
		border-color: var(--ui-primary);
		transition: 0.5s border-color ease;
	}
	:global(.dark) input:checked:before {
		border-color: var(--ui-accent);
	}

	input:disabled:before {
		border-color: #ccc;
		background-color: #ccc;
		opacity: 0.5;
	}
	:global(.dark) input:disabled:before {
		border-color: #666;
		background-color: #666;
	}
	input:after {
		content: '';
		display: block;
		position: absolute;
		box-sizing: content-box;
		top: 50%;
		left: 50%;
		transform-origin: 50% 50%;
		background-color: var(--ui-primary);
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		transform: translate(-50%, -50%) scale(0);
	}
	input:disabled:after {
		opacity: 0.5;
	}
	:global(.dark) input:after {
		background-color: var(--ui-accent);
	}
	input[type='radio']:before {
		border-radius: 100vh;
	}
	input[type='radio']:after {
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		transform: translate(-50%, -50%) scale(0);
	}
	input[type='radio']:checked:after {
		-webkit-animation: toggleOnRadio 0.2s ease forwards;
		animation: toggleOnRadio 0.2s ease forwards;
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
