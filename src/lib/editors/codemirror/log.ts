import type { Extension, Text } from '@codemirror/state';
import { RangeSetBuilder } from '@codemirror/state';
import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	type ViewUpdate
} from '@codemirror/view';
import { LanguageSupport, StreamLanguage, type StreamParser } from '@codemirror/language';

export type LogLevel = 'error' | 'warning' | 'info' | 'debug' | 'marker';

// `[2026-11-10 17:11:30]`, an ISO timestamp (Serilog's default puts a space before the offset),
// or a bare `17:11:30` at the start of the line.
const TIMESTAMP =
	/^(?:\[?\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z| ?[+-]\d{2}:?\d{2})?\]?|\d{2}:\d{2}:\d{2}(?:\.\d+)?)/;
// Run boundaries as a job wrapper writes them, and separator rules.
const MARKER = /\] (?:START|END|STOPPED|RETRY|TIMED OUT|TIMEOUT)\b|^\s*(?:-{20,}|={20,})\s*$/i;
const TAG =
	/^\[(?:ERROR|ERR|FATAL|FTL|CRITICAL|WARN(?:ING)?|WRN|DEBUG|DBG|VERBOSE|VRB|TRACE|INFO(?:RMATION)?|INF)\]/i;
// A bracketed tag anywhere wins, in this order; otherwise a bare level word after the timestamp.
// Serilog writes `[ERR]` (`{Level:u3}`) or `[Error]`; .NET's console logger starts a line `fail: `.
const TAGS: [RegExp, LogLevel][] = [
	[/\[(?:ERROR|ERR|FATAL|FTL|CRITICAL)\]/i, 'error'],
	[/\[(?:WARN(?:ING)?|WRN)\]/i, 'warning'],
	[/\[(?:DEBUG|DBG|VERBOSE|VRB|TRACE)\]/i, 'debug'],
	[/\[(?:INFO(?:RMATION)?|INF)\]/i, 'info']
];
const WORDS: [RegExp, LogLevel][] = [
	[
		/^\s*(?:(?:ERROR|FATAL|CRITICAL)\b|(?:fail|crit):|Traceback \(most recent call last\)|UNHANDLED EXCEPTION)/i,
		'error'
	],
	[/^\s*WARN(?:ING)?\b/i, 'warning'],
	[/^\s*(?:(?:DEBUG|VERBOSE|TRACE)\b|(?:dbug|trce):)/i, 'debug'],
	[/^\s*INFO\b/i, 'info']
];
// The rest of a multi-line entry: an indented line (a stack frame, a Python traceback),
// `--- End of ...` and ` ---> Inner`, or an exception's first line.
const CONTINUATION = /^\s+\S|^\s*---[\s>]|^[A-Za-z_][\w.`]*(?:Exception|Error)\b/;
// How far a continuation line looks back for the entry it belongs to.
const LOOKBACK = 500;

function ownLevel(line: string): LogLevel | undefined {
	for (const [pattern, level] of TAGS) {
		if (pattern.test(line)) return level;
	}
	if (MARKER.test(line)) return 'marker';
	const stamp = TIMESTAMP.exec(line);
	const body = stamp ? line.slice(stamp[0].length) : line;
	for (const [pattern, level] of WORDS) {
		if (pattern.test(body)) return level;
	}
	return undefined;
}

function continues(line: string): boolean {
	const stamp = TIMESTAMP.exec(line);
	return CONTINUATION.test(stamp ? line.slice(stamp[0].length).replace(/^ /, '') : line);
}

/** A line's level: its own, or for a continuation line, that of the entry it belongs to. */
export function logLevelAt(doc: Text, lineNumber: number): LogLevel | undefined {
	const own = ownLevel(doc.line(lineNumber).text);
	if (own || !continues(doc.line(lineNumber).text)) return own;

	for (let n = lineNumber - 1; n >= Math.max(1, lineNumber - LOOKBACK); n--) {
		const text = doc.line(n).text;
		const level = ownLevel(text);
		if (level) return level === 'marker' ? undefined : level;
		if (!continues(text)) return undefined;
	}
	return undefined;
}

const lineClasses = Object.fromEntries(
	(['error', 'warning', 'info', 'debug', 'marker'] as LogLevel[]).map((level) => [
		level,
		Decoration.line({ class: `cm-log-${level}` })
	])
) as Record<LogLevel, Decoration>;

function levelDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const doc = view.state.doc;
	for (const { from, to } of view.visibleRanges) {
		for (let n = doc.lineAt(from).number; n <= doc.lineAt(to).number; n++) {
			const level = logLevelAt(doc, n);
			if (level) builder.add(doc.line(n).from, doc.line(n).from, lineClasses[level]);
		}
	}
	return builder.finish();
}

const levelPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = levelDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged) {
				this.decorations = levelDecorations(update.view);
			}
		}
	},
	{ decorations: (plugin) => plugin.decorations }
);

// Timestamps and level tags as tokens; the line's colour comes from its level.
const parser: StreamParser<null> = {
	name: 'log',
	startState: () => null,
	token(stream) {
		if (stream.sol() && stream.match(TIMESTAMP)) return 'meta';
		if (stream.match(TAG)) return 'strong';
		stream.next();
		stream.eatWhile(/[^[]/);
		return null;
	}
};

// Overridable per app through the `--cm-log-*` custom properties.
const levelTheme = EditorView.baseTheme({
	'&light .cm-log-error': { color: 'var(--cm-log-error, #c92a2a)' },
	'&light .cm-log-warning': { color: 'var(--cm-log-warning, #b45309)' },
	'&light .cm-log-info': { color: 'var(--cm-log-info, #0e7490)' },
	'&light .cm-log-debug': { color: 'var(--cm-log-debug, #15803d)' },
	'&dark .cm-log-error': { color: 'var(--cm-log-error, #ffa8a8)' },
	'&dark .cm-log-warning': { color: 'var(--cm-log-warning, #ffd43b)' },
	'&dark .cm-log-info': { color: 'var(--cm-log-info, #66d9e8)' },
	'&dark .cm-log-debug': { color: 'var(--cm-log-debug, #8ce99a)' },
	'.cm-log-marker': { fontWeight: '600' }
});

/** Log output: each line coloured by its level, with stack traces in their entry's colour. */
export function log(): Extension {
	return new LanguageSupport(StreamLanguage.define(parser), [levelPlugin, levelTheme]);
}
