<script lang="ts">
	interface Props {
		label?: string;
		required?: boolean;
		class?: string;
		inputId?: string;
		disabled?: boolean;
		showError?: boolean;
		errorText?: string;
		checked?: boolean;
		onchange?: (e: boolean) => void;
	}

	let {
		label,
		required = false,
		class: classes = '',
		inputId = undefined,
		disabled = false,
		showError = false,
		errorText = '',
		checked = $bindable(false),
		onchange = undefined
	}: Props = $props();

	const nonce = Math.random().toString(36).substring(2, 15);

	const id = $derived(inputId ? inputId : label ? `input-${label}` : `input-${nonce}`);
</script>

<div class="checkbox-container {disabled ? 'disabled' : ''}">
	<label for={id}>
		<input
			class="checkbox {showError && 'error'} {classes}"
			type="checkbox"
			{id}
			{disabled}
			bind:checked
			onchange={() => onchange?.(checked)}
		/>
		<span class="label-text"
			>{label}
			{#if required}
				<span class="required">*</span>
			{/if}</span
		>
	</label>
	{#if showError && errorText}
		<div class="error-text">{errorText}</div>
	{/if}
</div>

<style>
	.checkbox-container {
		display: flex;
		align-items: center;
		gap: var(--cui-spacing-1_5, 0.375rem);
	}

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
		border-color: var(--midnight);
		transition: 0.5s border-color ease;
	}
	:global(.dark) input:checked:before {
		border-color: var(--pistachio);
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
		background-color: var(--midnight);
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		transform: translate(-50%, -50%) scale(0);
	}
	input:disabled:after {
		opacity: 0.5;
	}
	:global(.dark) input:after {
		background-color: var(--pistachio);
	}

	input[type='checkbox']:before {
		border-radius: 4px;
	}
	input[type='checkbox']:after {
		width: 7px;
		height: 14px;
		border-radius: 0;
		transform: translate(-50%, -85%) scale(0) rotate(45deg);
		background-color: transparent;
		box-shadow: 4px 4px 0px 0px var(--midnight);
	}
	:global(.dark) input[type='checkbox']:after {
		box-shadow: 4px 4px 0px 0px var(--pistachio);
	}
	input[type='checkbox']:checked:after {
		-webkit-animation: toggleOnCheckbox 0.2s ease forwards;
		animation: toggleOnCheckbox 0.2s ease forwards;
	}
	input[type='checkbox'].filled:before {
		border-radius: 4px;
		transition:
			0.2s border-color ease,
			0.2s background-color ease;
	}
	input[type='checkbox'].filled:checked:not(:disabled):before {
		background-color: var(--midnight);
	}
	:global(.dark) input[type='checkbox'].filled:checked:not(:disabled):before {
		background-color: var(--pistachio);
	}
	input[type='checkbox'].filled:not(:disabled):after {
		box-shadow: 4px 4px 0px 0px white;
	}
	@-webkit-keyframes toggleOnCheckbox {
		0% {
			opacity: 0;
			transform: translate(-50%, -85%) scale(0) rotate(45deg);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -85%) scale(0.9) rotate(45deg);
		}
		100% {
			transform: translate(-50%, -85%) scale(0.8) rotate(45deg);
		}
	}
	@keyframes toggleOnCheckbox {
		0% {
			opacity: 0;
			transform: translate(-50%, -85%) scale(0) rotate(45deg);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -85%) scale(0.9) rotate(45deg);
		}
		100% {
			transform: translate(-50%, -85%) scale(0.8) rotate(45deg);
		}
	}

	input.error:before {
		border-color: var(--danger-text) !important;
	}

	.error-text {
		color: var(--danger-text);
	}
</style>
