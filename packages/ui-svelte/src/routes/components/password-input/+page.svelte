<script lang="ts">
	import { PasswordInput, Paper, iconLock } from '$lib/index.js';

	let basicValue = $state('');
	let iconValue = $state('');
	let requiredValue = $state('');
	let errorValue = $state('');
	let disabledValue = $state('s3cr3t');
	let visibleValue = $state('mypassword');
	let visible = $state(false);
</script>

<h1>PasswordInput</h1>
<p>Password input with visibility toggle, icons, and validation support.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<PasswordInput label="Password" bind:value={basicValue} placeholder="Enter your password" />
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
		<PasswordInput label="Password" bind:value={requiredValue} placeholder="Required field" required />
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
		<PasswordInput label="Password" bind:value={disabledValue} disabled />
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
		<div class="value-display">Visible: {visible} | Value: "{visibleValue}"</div>
	</div>
</Paper>

<Paper title="Loading State">
	<div class="form-grid">
		<PasswordInput label="Password" placeholder="Verifying..." loading />
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
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>value</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Bindable input value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text above input</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Placeholder text</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the input</td>
			</tr>
			<tr>
				<td><code>visible</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Bindable visibility state for the password</td>
			</tr>
			<tr>
				<td><code>loading</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows loading spinner instead of toggle</td>
			</tr>
			<tr>
				<td><code>leftIconSvg</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>SVG string for left icon</td>
			</tr>
			<tr>
				<td><code>showError</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows error styling</td>
			</tr>
			<tr>
				<td><code>errorText</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Error message text</td>
			</tr>
			<tr>
				<td><code>tooltipText</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Tooltip hint text</td>
			</tr>
			<tr>
				<td><code>onenter</code></td>
				<td><code>(v: string) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when Enter is pressed</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(e: Event) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Change event handler</td>
			</tr>
			<tr>
				<td><code>onVisibilityChange</code></td>
				<td><code>(visible: boolean) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when visibility is toggled</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
