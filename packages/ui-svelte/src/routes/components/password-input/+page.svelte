<script lang="ts">
	import { PasswordInput, Paper, Table, iconLock } from "$lib/index.js";
	import type { Column } from "$lib/index.js";

	let basicValue = $state("");
	let iconValue = $state("");
	let requiredValue = $state("");
	let errorValue = $state("");
	let disabledValue = $state("s3cr3t");
	let visibleValue = $state("mypassword");
	let visible = $state(false);

	interface PropRow {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: "prop", label: "Prop" },
		{ key: "type", label: "Type" },
		{ key: "default", label: "Default" },
		{ key: "description", label: "Description" },
	];

	const propsRows: PropRow[] = [
		{ prop: "value", type: "string", default: "''", description: "Bindable input value" },
		{ prop: "label", type: "string", default: "''", description: "Label text above input" },
		{ prop: "placeholder", type: "string", default: "undefined", description: "Placeholder text" },
		{ prop: "required", type: "boolean", default: "false", description: "Shows required indicator" },
		{ prop: "disabled", type: "boolean", default: "false", description: "Disables the input" },
		{ prop: "visible", type: "boolean", default: "false", description: "Bindable visibility state for the password" },
		{ prop: "loading", type: "boolean", default: "false", description: "Shows loading spinner instead of toggle" },
		{ prop: "leftIconSvg", type: "string", default: "undefined", description: "SVG string for left icon" },
		{ prop: "showError", type: "boolean", default: "false", description: "Shows error styling" },
		{ prop: "errorText", type: "string", default: "''", description: "Error message text" },
		{ prop: "tooltipText", type: "string", default: "undefined", description: "Tooltip hint text" },
		{ prop: "onenter", type: "(v: string) => void", default: "undefined", description: "Called when Enter is pressed" },
		{ prop: "onchange", type: "(e: Event) => void", default: "undefined", description: "Change event handler" },
		{ prop: "onVisibilityChange", type: "(visible: boolean) => void", default: "undefined", description: "Called when visibility is toggled" },
	];
</script>

<h1>PasswordInput</h1>
<p>Password input with visibility toggle, icons, and validation support.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				bind:value={basicValue}
				placeholder="Enter your password"
			/>
			<div class="value-display">Value: "{basicValue}"</div>
		</div>
	</Paper>

	<Paper title="With Icon">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				bind:value={iconValue}
				placeholder="Enter your password"
				leftIconSvg={iconLock}
			/>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				bind:value={requiredValue}
				placeholder="Required field"
				required
			/>
		</div>
	</Paper>

	<Paper title="Error State">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				bind:value={errorValue}
				placeholder="Enter password"
				showError={errorValue.length > 0 && errorValue.length < 8}
				errorText="Password must be at least 8 characters"
			/>
			<div class="value-display">Length: {errorValue.length}</div>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				bind:value={disabledValue}
				disabled
			/>
		</div>
	</Paper>

	<Paper title="Visibility Toggle">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				bind:value={visibleValue}
				bind:visible
				placeholder="Toggle visibility"
			/>
			<div class="value-display">
				Visible: {visible} | Value: "{visibleValue}"
			</div>
		</div>
	</Paper>

	<Paper title="Loading State">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				placeholder="Verifying..."
				loading
			/>
		</div>
	</Paper>

	<Paper title="With Tooltip">
		<div class="form-grid">
			<PasswordInput
				label="Password"
				placeholder="Enter a strong password"
				tooltipText="Use at least 8 characters with letters, numbers, and symbols"
			/>
		</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}
	p {
		color: var(--pui-color-text-secondary);
		margin-bottom: 1.5rem;
	}
	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}
	.value-display {
		font-size: 0.875rem;
		color: var(--pui-color-text-muted);
		font-family: monospace;
		margin-top: 0.5rem;
	}
</style>
