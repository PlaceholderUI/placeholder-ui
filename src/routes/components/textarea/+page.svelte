<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import TextArea from '$lib/form/TextArea.svelte';

	let basicValue = '';
	let placeholderValue = '';
	let requiredValue = '';
	let disabledValue = 'This textarea is disabled and cannot be edited by the user.';
	let longTextValue = `This is a longer text example that demonstrates how the textarea component handles multi-line content.

It can contain multiple paragraphs and will automatically expand to show the content.

You can resize this textarea by dragging the bottom-right corner if your browser supports it.`;
	let characterCountValue = '';
	let eventValue = '';
</script>

<div class="page-header">
	<h1>TextArea</h1>
	<p>Multi-line text input component for longer content with automatic resizing.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<TextArea
				label="Basic textarea"
				placeholder="Enter your message..."
				bind:value={basicValue}
			/>
			<div class="value-display">
				<strong>Value:</strong>
				<pre class="value-text">{basicValue || '(empty)'}</pre>
			</div>
		</div>
	</Paper>

	<Paper title="Placeholder and Styling">
		<div class="form-grid">
			<TextArea
				label="With placeholder"
				height="100px"
				placeholder="Tell us about yourself..."
				bind:value={placeholderValue}
			/>
			<TextArea
				label="Custom styling"
				height="6rem"
				placeholder="This has custom height"
				class="custom-height"
				bind:value={placeholderValue}
			/>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<TextArea
				label="Required field"
				required={true}
				placeholder="This field is required"
				bind:value={requiredValue}
			/>
			<TextArea label="Disabled" disabled bind:value={disabledValue} />
		</div>
	</Paper>

	<Paper title="Content Examples">
		<div class="form-grid">
			<TextArea label="Long text example" bind:value={longTextValue} />
			<TextArea
				label="Character counter example"
				placeholder="Type something and watch the character count..."
				bind:value={characterCountValue}
			/>
		</div>
		{#if characterCountValue}
			<div class="character-count">
				Character count: <strong>{characterCountValue.length}</strong> characters
			</div>
		{/if}
	</Paper>

	<Paper title="Events">
		<div class="form-grid">
			<TextArea
				label="Event handling"
				placeholder="Focus, blur, or type to see events"
				bind:value={eventValue}
				onfocus={() => console.log('TextArea focused')}
				onblur={() => console.log('TextArea blurred')}
				oninput={() => console.log('TextArea input:', eventValue)}
				onchange={() => console.log('TextArea changed:', eventValue)}
			/>
			<div class="event-info">
				<p><strong>Check browser console for events:</strong></p>
				<ul>
					<li>Focus event when clicked</li>
					<li>Input event on every keystroke</li>
					<li>Change event when focus is lost</li>
					<li>Blur event when focus leaves</li>
				</ul>
			</div>
		</div>
	</Paper>

	<Paper title="No Label">
		<div class="form-grid">
			<TextArea placeholder="TextArea without label" />
			<TextArea placeholder="Another example without label" class="custom-height" />
		</div>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
	}

	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.value-display {
		padding: 1rem;
		background: var(--input-bg-color);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
	}

	.value-text {
		margin: 0.5rem 0 0 0;
		padding: 0.5rem;
		background: var(--bg-color);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--text-color);
		white-space: pre-wrap;
		min-height: 2rem;
	}

	.character-count {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: var(--input-bg-color);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.event-info {
		padding: 1rem;
		background: var(--input-bg-color);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
	}

	.event-info p {
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.event-info ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.event-info li {
		margin-bottom: 0.25rem;
	}

	:global(.custom-height textarea) {
		min-height: 120px;
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
	}
</style>
