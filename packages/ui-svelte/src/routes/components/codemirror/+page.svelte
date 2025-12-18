<script lang="ts">
	import { CodeMirror, Paper, Button } from '$lib/index.js';

	let jsCode = $state(`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`);

	let htmlCode = $state(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`);

	let jsonCode = $state(`{
  "name": "ui-svelte",
  "version": "1.0.0",
  "dependencies": {
    "svelte": "^5.0.0"
  }
}`);

	let cssCode = $state(`.container {
  display: flex;
  gap: 1rem;
  padding: 2rem;
  background: var(--bg-color);
}`);

	let darkTheme = $state(false);
</script>

<h1>CodeMirror</h1>
<p>A powerful code editor component built on CodeMirror 6 with syntax highlighting and theme support.</p>

<Paper title="JavaScript">
	<CodeMirror bind:value={jsCode} language="javascript" height="200px" />
	<p class="value-display">Lines: {jsCode.split('\n').length}</p>
</Paper>

<Paper title="HTML">
	<CodeMirror value={htmlCode} language="html" height="200px" />
</Paper>

<Paper title="CSS">
	<CodeMirror value={cssCode} language="css" height="150px" />
</Paper>

<Paper title="JSON">
	<CodeMirror value={jsonCode} language="json" height="150px" />
</Paper>

<Paper title="Dark Theme">
	<div class="theme-toggle">
		<Button
			variant={darkTheme ? 'secondary' : 'midnight'}
			onclick={() => (darkTheme = false)}
		>
			Light
		</Button>
		<Button
			variant={darkTheme ? 'midnight' : 'secondary'}
			onclick={() => (darkTheme = true)}
		>
			Dark
		</Button>
	</div>
	<CodeMirror
		value="const theme = 'Toggle the buttons above!';"
		language="javascript"
		height="100px"
		theme={darkTheme ? 'dark' : 'light'}
	/>
</Paper>

<Paper title="Read-Only">
	<CodeMirror
		value="// This code cannot be edited\nconst readOnly = true;"
		language="javascript"
		height="80px"
		readOnly
	/>
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
				<td>Bindable editor content</td>
			</tr>
			<tr>
				<td><code>language</code></td>
				<td><code>'javascript' | 'html' | 'css' | 'json' | 'typescript'</code></td>
				<td><code>'javascript'</code></td>
				<td>Syntax highlighting language</td>
			</tr>
			<tr>
				<td><code>theme</code></td>
				<td><code>'light' | 'dark'</code></td>
				<td><code>'light'</code></td>
				<td>Editor color theme</td>
			</tr>
			<tr>
				<td><code>readOnly</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disable editing</td>
			</tr>
			<tr>
				<td><code>height</code></td>
				<td><code>string</code></td>
				<td><code>'500px'</code></td>
				<td>Editor height</td>
			</tr>
			<tr>
				<td><code>onChange</code></td>
				<td><code>(value: string) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when content changes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<Paper title="Methods">
	<table class="props-table">
		<thead>
			<tr>
				<th>Method</th>
				<th>Returns</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>getValue()</code></td>
				<td><code>string</code></td>
				<td>Get current editor content</td>
			</tr>
			<tr>
				<td><code>setValue(value)</code></td>
				<td><code>void</code></td>
				<td>Set editor content programmatically</td>
			</tr>
			<tr>
				<td><code>focus()</code></td>
				<td><code>void</code></td>
				<td>Focus the editor</td>
			</tr>
			<tr>
				<td><code>getView()</code></td>
				<td><code>EditorView | null</code></td>
				<td>Get underlying CodeMirror view</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--cui-color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.value-display {
		font-size: 0.875rem;
		color: var(--cui-color-text-muted);
		font-family: monospace;
		margin-top: 0.5rem;
	}

	.theme-toggle {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.props-table th,
	.props-table td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--cui-color-border);
	}

	.props-table th {
		font-weight: 600;
		background: var(--cui-color-bg-secondary);
	}

	.props-table code {
		background: var(--cui-color-bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.8125rem;
	}
</style>
