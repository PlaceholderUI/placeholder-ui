<script lang="ts">
	import { Paper } from '$lib/index.js';
</script>

<h1>ComboBoxMulti</h1>
<p>ComboBoxMulti is the internal multi-select dropdown panel used by the SelectMulti component.</p>

<Paper title="Overview">
	<div class="info-section">
		<p class="info-text">
			ComboBoxMulti handles the multi-select dropdown panel rendering, keyboard navigation, and checkbox-style selection for the <strong>SelectMulti</strong> component. It is not exported directly for standalone use.
		</p>
		<p class="info-text">
			If you need a multi-select dropdown, use the <strong>SelectMulti</strong> component instead, which wraps ComboBoxMulti with label, error handling, search, and form integration.
		</p>
	</div>
</Paper>

<Paper title="How It Works">
	<div class="info-section">
		<p class="info-text">
			ComboBoxMulti receives grouped options from SelectMulti and renders them as a scrollable dropdown panel. Each option displays a checkbox indicator and supports:
		</p>
		<ul class="feature-list">
			<li>Keyboard navigation with arrow keys</li>
			<li>Enter/Space to toggle selection</li>
			<li>Grouped option rendering with group labels</li>
			<li>Loading and "no results" states</li>
			<li>Filter highlighting when search is active</li>
		</ul>
	</div>
</Paper>

<Paper title="Related Components">
	<div class="info-section">
		<ul class="related-list">
			<li><strong>SelectMulti</strong> - The public-facing multi-select component (use this)</li>
			<li><strong>ComboBox</strong> - The single-select dropdown panel counterpart</li>
			<li><strong>ComboBoxItemBuilder</strong> - Renders individual items within the dropdown</li>
		</ul>
	</div>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
.info-section { max-width: 600px; }
	.info-text { color: var(--pui-color-text-secondary); line-height: 1.6; margin-bottom: 0.75rem; }
	.related-list { padding-left: 1.5rem; color: var(--pui-color-text-secondary); line-height: 2; }
	.feature-list { padding-left: 1.5rem; color: var(--pui-color-text-secondary); line-height: 2; }
</style>
