<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import {
		Decoration,
		EditorView,
		lineNumbers as lineNumbersGutter,
		highlightActiveLineGutter,
		highlightSpecialChars,
		drawSelection,
		dropCursor,
		rectangularSelection,
		crosshairCursor,
		highlightActiveLine,
		keymap,
		placeholder as placeholderText
	} from '@codemirror/view';
	import { EditorState, Compartment, RangeSetBuilder, type Extension } from '@codemirror/state';
	import {
		foldGutter,
		foldKeymap,
		indentOnInput,
		syntaxHighlighting,
		defaultHighlightStyle,
		bracketMatching
	} from '@codemirror/language';
	import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
	import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
	import {
		closeBrackets,
		closeBracketsKeymap,
		autocompletion,
		completionKeymap
	} from '@codemirror/autocomplete';
	import { lintKeymap } from '@codemirror/lint';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { themeState } from '../theme.svelte.js';
	import ActionIcon from '../ui/ActionIcon.svelte';
	import { iconArrowDown, iconCopy, iconCheck } from '../icon/index.js';
	import { resolveCodeLanguage, type CodeLanguageId } from './codemirror/languages.js';
	import { libraryTheme } from './codemirror/theme.js';

	export interface CodeMirrorProps {
		/** Editor content value (bindable). A new value that extends the current one is
		 * appended, so a growing log keeps its selection and scroll position. */
		value?: string;
		/** Language for syntax highlighting: an id from `codeLanguages` or one of its aliases
		 * ('ps1', 'py', 'yml', ...). Anything unrecognised shows as plain text. */
		language?: CodeLanguageId | (string & {});
		/** Color theme. 'auto' (the default) follows the app's mode with the library's own
		 * colours; 'light' and 'dark' force CodeMirror's default style and One Dark. */
		theme?: 'light' | 'dark' | 'auto';
		/** Disable editing */
		readOnly?: boolean;
		/** Show line numbers in the gutter */
		lineNumbers?: boolean;
		/** Number shown for the first line, when the value is a window into a longer file */
		firstLineNumber?: number;
		/** Wrap long lines instead of scrolling sideways */
		wrap?: boolean;
		/** Keep the last line in view as the value grows, until the user scrolls up; a button
		 * then jumps back to the end */
		follow?: boolean;
		/** Line numbers (as shown, so counted from `firstLineNumber`) to highlight, such as
		 * search matches */
		markedLines?: number[];
		/** Text shown while the editor is empty */
		placeholder?: string;
		/** Accessible name for the editor */
		ariaLabel?: string;
		/** Extra CodeMirror extensions, added after the built-in ones; changes apply live */
		extensions?: Extension[];
		/** Show a button that copies the editor contents to the clipboard */
		copyButton?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Height of the editor */
		height?: string;
		/** Callback when content changes */
		onChange?: (value: string) => void;
		/** Callback after the contents are copied to the clipboard */
		onCopy?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		language = 'javascript',
		theme = 'auto',
		readOnly = false,
		lineNumbers = true,
		firstLineNumber = 1,
		wrap = true,
		follow = false,
		markedLines = [],
		placeholder = '',
		ariaLabel = '',
		extensions = [],
		copyButton = false,
		class: className = '',
		height = '31.25rem',
		onChange,
		onCopy
	}: CodeMirrorProps = $props();

	let editorContainer: HTMLDivElement | undefined = $state();
	let view: EditorView | null = $state(null);
	let themeCompartment = new Compartment();
	let gutterCompartment = new Compartment();
	let languageCompartment = new Compartment();
	let readOnlyCompartment = new Compartment();
	let wrapCompartment = new Compartment();
	let marksCompartment = new Compartment();
	let attributesCompartment = new Compartment();
	let userCompartment = new Compartment();
	let copied = $state(false);
	let copiedTimeout: ReturnType<typeof setTimeout>;
	/** Whether the view is at the last line, so `follow` keeps it there. */
	let pinned = $state(true);

	// basicSetup minus the gutters, which we swap in via a compartment so the
	// `lineNumbers` prop can be toggled after the editor is created.
	const baseSetup = [
		highlightSpecialChars(),
		history(),
		drawSelection(),
		dropCursor(),
		EditorState.allowMultipleSelections.of(true),
		indentOnInput(),
		syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
		bracketMatching(),
		closeBrackets(),
		autocompletion(),
		rectangularSelection(),
		crosshairCursor(),
		highlightActiveLine(),
		highlightSelectionMatches(),
		keymap.of([
			...closeBracketsKeymap,
			...defaultKeymap,
			...searchKeymap,
			...historyKeymap,
			...foldKeymap,
			...completionKeymap,
			...lintKeymap
		])
	];

	const getGutterExtension = (show: boolean, first: number) =>
		show
			? [
					lineNumbersGutter(first === 1 ? {} : { formatNumber: (n) => String(n + first - 1) }),
					highlightActiveLineGutter(),
					foldGutter()
				]
			: [];

	// Derive effective dark mode from prop or app theme
	let isDark = $derived(theme === 'auto' ? themeState.isDarkMode : theme === 'dark');

	const getThemeExtension = () => (theme === 'auto' ? libraryTheme(isDark) : isDark ? oneDark : []);

	const getLanguageExtension = (lang: string) => resolveCodeLanguage(lang)?.load() ?? [];

	const markedLine = Decoration.line({ class: 'cm-marked-line' });

	function getMarksExtension(lines: number[], first: number): Extension {
		if (lines.length === 0) return [];
		const sorted = [...new Set(lines)].sort((a, b) => a - b);
		// A function, so the marks follow the document as it changes.
		return EditorView.decorations.of((editor) => {
			const doc = editor.state.doc;
			const builder = new RangeSetBuilder<Decoration>();
			for (const shown of sorted) {
				const n = shown - first + 1;
				if (n >= 1 && n <= doc.lines) builder.add(doc.line(n).from, doc.line(n).from, markedLine);
			}
			return builder.finish();
		});
	}

	const getAttributesExtension = (text: string, label: string): Extension => [
		text ? placeholderText(text) : [],
		label ? EditorView.contentAttributes.of({ 'aria-label': label }) : []
	];

	function onScroll() {
		if (!view) return;
		const scroller = view.scrollDOM;
		pinned = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 4;
	}

	onMount(() => {
		if (!editorContainer) return;

		const setup = [
			gutterCompartment.of(getGutterExtension(lineNumbers, firstLineNumber)),
			baseSetup,
			languageCompartment.of(getLanguageExtension(language)),
			wrapCompartment.of(wrap ? EditorView.lineWrapping : []),
			themeCompartment.of(getThemeExtension()),
			readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
			marksCompartment.of(getMarksExtension(markedLines, firstLineNumber)),
			attributesCompartment.of(getAttributesExtension(placeholder, ariaLabel)),
			// Always add update listener to sync bindable value
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					const newValue = update.state.doc.toString();
					value = newValue;
					if (onChange) {
						onChange(newValue);
					}
				}
			}),
			userCompartment.of(extensions)
		];

		const startState = EditorState.create({
			doc: value,
			extensions: setup
		});

		view = new EditorView({
			state: startState,
			parent: editorContainer
		});
		view.scrollDOM.addEventListener('scroll', onScroll, { passive: true });
		if (follow) scrollToEnd();
	});

	onDestroy(() => {
		view?.scrollDOM.removeEventListener('scroll', onScroll);
		view?.destroy();
		clearTimeout(copiedTimeout);
	});

	async function copyToClipboard() {
		const text = view?.state.doc.toString() ?? value;

		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			clearTimeout(copiedTimeout);
			copiedTimeout = setTimeout(() => (copied = false), 2000);
			onCopy?.(text);
		} catch (err) {
			console.error('CodeMirror: failed to copy to clipboard', err);
		}
	}

	// Watch for theme changes and reconfigure
	$effect(() => {
		if (!view) return;

		view.dispatch({
			effects: themeCompartment.reconfigure(getThemeExtension())
		});
	});

	// Watch for language changes and swap the language support
	$effect(() => {
		if (!view) return;

		view.dispatch({
			effects: languageCompartment.reconfigure(getLanguageExtension(language))
		});
	});

	// Watch for lineNumbers changes and reconfigure the gutter
	$effect(() => {
		if (!view) return;

		view.dispatch({
			effects: gutterCompartment.reconfigure(getGutterExtension(lineNumbers, firstLineNumber))
		});
	});

	$effect(() => {
		if (!view) return;

		view.dispatch({
			effects: [
				readOnlyCompartment.reconfigure(EditorState.readOnly.of(readOnly)),
				wrapCompartment.reconfigure(wrap ? EditorView.lineWrapping : []),
				attributesCompartment.reconfigure(getAttributesExtension(placeholder, ariaLabel))
			]
		});
	});

	$effect(() => {
		if (!view) return;

		view.dispatch({
			effects: marksCompartment.reconfigure(getMarksExtension(markedLines, firstLineNumber))
		});
	});

	$effect(() => {
		if (!view) return;

		view.dispatch({ effects: userCompartment.reconfigure(extensions) });
	});

	// Watch for external value changes and update editor
	$effect(() => {
		if (!view) return;

		// The document stores line breaks as \n, so a value with \r\n compares in that form.
		const next = value.replace(/\r\n?/g, '\n');
		const currentValue = view.state.doc.toString();
		if (next === currentValue) return;

		const keepAtEnd = untrack(() => follow && pinned);
		view.dispatch({
			changes: next.startsWith(currentValue)
				? { from: currentValue.length, insert: next.slice(currentValue.length) }
				: { from: 0, to: currentValue.length, insert: next }
		});
		// A transaction of its own: CodeMirror clips a scroll target to the document as it was
		// before the transaction's changes, which would leave the view at the old end.
		if (keepAtEnd) scrollToEnd();
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

	/** Scrolls the line with this number (as shown) to the middle of the view. */
	export function scrollToLine(lineNumber: number) {
		if (!view) return;
		const n = Math.min(Math.max(lineNumber - firstLineNumber + 1, 1), view.state.doc.lines);
		view.dispatch({
			effects: EditorView.scrollIntoView(view.state.doc.line(n).from, { y: 'center' })
		});
	}

	/** Scrolls to the last line, where `follow` keeps the view. */
	export function scrollToEnd() {
		if (!view) return;
		view.dispatch({
			effects: EditorView.scrollIntoView(view.state.doc.length, { y: 'end' })
		});
		pinned = true;
	}
</script>

<div class="codemirror-container {className}" style="height: {height}">
	{#if copyButton}
		<div class="codemirror-action codemirror-copy" class:copied class:dark={isDark}>
			<ActionIcon
				svg={copied ? iconCheck : iconCopy}
				size="1rem"
				tooltip={copied ? 'Copied' : 'Copy to clipboard'}
				ariaLabel={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
				onclick={copyToClipboard}
			/>
		</div>
	{/if}
	<div class="codemirror-wrapper" bind:this={editorContainer}></div>
	{#if follow && !pinned}
		<div class="codemirror-action codemirror-end">
			<ActionIcon
				svg={iconArrowDown}
				size="1rem"
				tooltip="Jump to the last line"
				ariaLabel="Jump to the last line"
				onclick={scrollToEnd}
			/>
		</div>
	{/if}
</div>

<style>
	.codemirror-container {
		position: relative;
		width: 100%;
		border: 1px solid var(--border-color, #ddd);
		border-radius: var(--ui-radius-lg);
		overflow: hidden;
		background: var(--input-bg-color);
	}

	/* The ActionIcon supplies the button chrome; this only places it and gives it
     an opaque backing so it stays readable over the code underneath. */
	.codemirror-action {
		position: absolute;
		right: 0.375rem;
		z-index: 2;
		display: inline-flex;
		border-radius: var(--ui-radius-sm);
	}

	.codemirror-copy {
		top: 0.375rem;
		opacity: 0.65;
		transition: opacity 0.15s ease;
	}

	.codemirror-end {
		bottom: 0.375rem;
	}

	.codemirror-container:hover .codemirror-copy,
	.codemirror-copy:hover,
	.codemirror-copy:focus-within,
	.codemirror-copy.copied {
		opacity: 1;
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

	/* Syntax colours for theme="auto", overridable per app. Not brand colours: each mode's set
	   is picked to read on that mode's input background. */
	.codemirror-container {
		--cm-keyword: #be123c;
		--cm-string: #15803d;
		--cm-number: #b45309;
		--cm-comment: var(--text-muted);
		--cm-function: #1d4ed8;
		--cm-type: #7c3aed;
		--cm-variable: #0e7490;
		--cm-property: #0e7490;
		--cm-tag: #be123c;
		--cm-operator: #495057;
		--cm-invalid: #c92a2a;
	}

	:global(.dark) .codemirror-container {
		--cm-keyword: #ff8fa3;
		--cm-string: #8ce99a;
		--cm-number: #ffc078;
		--cm-function: #74c0fc;
		--cm-type: #d0bfff;
		--cm-variable: #66d9e8;
		--cm-property: #66d9e8;
		--cm-tag: #ff8fa3;
		--cm-operator: #ced4da;
		--cm-invalid: #ff8787;
	}

	.codemirror-wrapper :global(.cm-marked-line) {
		background-color: var(--cm-marked-line-bg, rgba(var(--ui-tertiary-rgbc), 0.25));
	}
</style>
