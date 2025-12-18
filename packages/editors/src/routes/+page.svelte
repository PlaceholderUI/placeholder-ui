<script lang="ts">
	import { CodeMirror } from '$lib/index.js';

	let code = $state(`function hello() {
  console.log("Hello from CodeMirror!");
}`);
</script>

<h1>Placeholder UI Editors</h1>
<p>Development preview for @placeholderco/placeholder-ui-editors</p>

<h2>CodeMirror</h2>
<CodeMirror bind:value={code} language="javascript" height="200px" />

<pre>{code}</pre>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}
	h2 {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
	pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 1rem;
	}
</style>
