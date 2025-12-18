<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState, Compartment } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { css } from '@codemirror/lang-css';
	import { json } from '@codemirror/lang-json';
	import { oneDark } from '@codemirror/theme-one-dark';

	interface Props {
		value?: string;
		language?: 'javascript' | 'html' | 'css' | 'json' | 'typescript';
		theme?: 'light' | 'dark';
		readOnly?: boolean;
		lineNumbers?: boolean;
		class?: string;
		height?: string;
		onChange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		language = 'javascript',
		theme = 'light',
		readOnly = false,
		lineNumbers = true,
		class: className = '',
		height = '500px',
		onChange
	}: Props = $props();

	let editorContainer: HTMLDivElement | undefined = $state();
	let view: EditorView | null = $state(null);
	let themeCompartment = new Compartment();

	const getLanguageExtension = (lang: string) => {
		switch (lang) {
			case 'javascript':
			case 'typescript':
				return javascript();
			case 'html':
				return html();
			case 'css':
				return css();
			case 'json':
				return json();
			default:
				return javascript();
		}
	};

	onMount(() => {
		if (!editorContainer) return;

		const extensions = [
			basicSetup,
			getLanguageExtension(language),
			EditorView.lineWrapping,
			themeCompartment.of(theme === 'dark' ? oneDark : [])
		];

		if (readOnly) {
			extensions.push(EditorState.readOnly.of(true));
		}

		// Always add update listener to sync bindable value
		extensions.push(
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					const newValue = update.state.doc.toString();
					value = newValue;
					if (onChange) {
						onChange(newValue);
					}
				}
			})
		);

		const startState = EditorState.create({
			doc: value,
			extensions
		});

		view = new EditorView({
			state: startState,
			parent: editorContainer
		});
	});

	onDestroy(() => {
		view?.destroy();
	});

	// Watch for theme changes and reconfigure
	$effect(() => {
		if (!view) return;

		const currentTheme = theme;
		view.dispatch({
			effects: themeCompartment.reconfigure(currentTheme === 'dark' ? oneDark : [])
		});
	});

	// Watch for external value changes and update editor
	$effect(() => {
		if (!view) return;

		const currentValue = view.state.doc.toString();
		if (value !== currentValue) {
			view.dispatch({
				changes: { from: 0, to: currentValue.length, insert: value }
			});
		}
	});

	// Public API methods
	export function getValue(): string {
		return view?.state.doc.toString() || '';
	}

	export function setValue(newValue: string) {
		if (!view) return;
		view.dispatch({
			changes: { from: 0, to: view.state.doc.length, insert: newValue }
		});
	}

	export function getView(): EditorView | null {
		return view;
	}

	export function focus() {
		view?.focus();
	}
</script>

<div class="codemirror-container {className}" style="height: {height}">
	<div class="codemirror-wrapper" bind:this={editorContainer}></div>
</div>

<style>
	.codemirror-container {
		width: 100%;
		border: 1px solid var(--cui-color-border, #ddd);
		border-radius: 6px;
		overflow: hidden;
		background: var(--cui-color-bg-primary, #fff);
	}

	.codemirror-wrapper {
		width: 100%;
		height: 100%;
	}

	.codemirror-wrapper :global(.cm-editor) {
		height: 100%;
	}

	.codemirror-wrapper :global(.cm-scroller) {
		overflow: auto;
	}
</style>
