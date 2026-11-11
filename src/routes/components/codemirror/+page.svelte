<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button, CodeMirror, Paper, Select, Textbox, codeLanguages } from '#lib/index.js';
	import Switch from '#lib/form/Switch.svelte';

	const samples: Record<string, string> = {
		powershell: `<#
.SYNOPSIS
    Copies yesterday's exports.
#>
param([string]$Root = 'D:\\exports')

$since = (Get-Date).AddDays(-1)
Get-ChildItem -Path $Root -Filter *.csv |
    Where-Object { $_.LastWriteTime -gt $since } |
    ForEach-Object { Copy-Item $_.FullName -Destination "$Root\\archive" }
exit 0`,
		python: `import sys
from pathlib import Path


def main(root: str) -> int:
    """Counts the CSV files under root."""
    files = [p for p in Path(root).rglob("*.csv") if p.stat().st_size > 0]
    print(f"{len(files)} files")
    return 0 if files else 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))`,
		sql: `SELECT TOP (10) m.MatterId, m.Title, COUNT(*) AS Documents
FROM dbo.Matters AS m
JOIN dbo.Documents AS d ON d.MatterId = m.MatterId
WHERE m.OpenedOn >= @since
GROUP BY m.MatterId, m.Title
ORDER BY Documents DESC;`,
		csharp: `public sealed record Job(string Name, TimeSpan Timeout);

public static class Jobs
{
	public static bool IsDue(Job job, DateTime last) => DateTime.Now - last > job.Timeout;
}`,
		yaml: `name: deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4`,
		shell: `#!/usr/bin/env bash
set -euo pipefail
for f in ./logs/*.log; do
  echo "$f: $(wc -l < "$f") lines"
done`,
		xml: `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers><add name="aspNetCore" path="*" verb="*" /></handlers>
  </system.webServer>
</configuration>`
	};

	let sampleLanguage = $state('powershell');
	const sampleOptions = codeLanguages
		.filter((def) => samples[def.id])
		.map((def) => ({ label: def.label, value: def.id }));

	const logLines = [
		'[2026-11-10 17:11:30] [INFO] Started sync for 42 matters',
		'[2026-11-10 17:11:31] [DEBUG] Connecting to sql01: Server=sql01.example.local;Database=Matters;Encrypt=True;TrustServerCertificate=False;Connect Timeout=30;Application Name=Sync;MultipleActiveResultSets=True',
		'[2026-11-10 17:11:32] [WARN] Matter 1093 has no owner; skipped',
		'[2026-11-10 17:11:33] [ERROR] Upload failed for matter 2201',
		'System.Net.Http.HttpRequestException: Response status code does not indicate success: 503.',
		'   at Sync.Client.PostAsync(String path) in Client.cs:line 88',
		'   at Sync.Program.Main() in Program.cs:line 21',
		'[2026-11-10 17:11:34] [INFO] Finished: 41 of 42 matters'
	];
	let logText = $state(logLines.slice(0, 4).join('\n'));
	let logIndex = 4;
	let streaming = $state(false);
	let wrapLog = $state(false);
	let find = $state('');
	let logViewer: ReturnType<typeof CodeMirror> | undefined = $state();
	let streamTimer: ReturnType<typeof setInterval> | undefined;

	function addLogLine() {
		logText += '\n' + logLines[logIndex % logLines.length];
		logIndex++;
	}

	$effect(() => {
		clearInterval(streamTimer);
		if (streaming) streamTimer = setInterval(addLogLine, 700);
	});
	onDestroy(() => clearInterval(streamTimer));

	const findHits = $derived(
		find.trim()
			? logText
					.split('\n')
					.flatMap((line, index) =>
						line.toLowerCase().includes(find.trim().toLowerCase()) ? [index + 1] : []
					)
			: []
	);

	let jsCode = $state(`function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('World');`);

	let htmlCode = $state(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</body>
</html>`);

	let cssCode = $state(`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}`);

	let jsonCode = $state(`{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "svelte": "^5.0.0"
  }
}`);

	let markdownCode = $state(`# Hello World

This is a **bold** and *italic* text example.

## Features

- Syntax highlighting
- Line numbers
- Multiple themes

\`\`\`javascript
const greeting = "Hello!";
console.log(greeting);
\`\`\`

> This is a blockquote

[Visit our site](https://example.com)`);

	let readOnlyCode = $state(`// This editor is read-only
const message = "You cannot edit this code";
console.log(message);`);

	let copyCode = $state(`const config = {
  retries: 3,
  timeout: 5000
};`);

	let lastCopied = $state('');
</script>

<h1>CodeMirror Editor</h1>
<p class="lead">A modern code editor component powered by CodeMirror 6</p>

<Paper>
	<h2>JavaScript Editor</h2>
	<CodeMirror bind:value={jsCode} language="javascript" lineNumbers={false} height="200px" />

	<h3 class="mt-4">Current Value:</h3>
	<pre class="code-preview p-3 rounded"><code>{jsCode}</code></pre>
</Paper>

<Paper>
	<h2>HTML Editor</h2>
	<CodeMirror bind:value={htmlCode} language="html" height="250px" />
</Paper>

<Paper>
	<h2>CSS Editor</h2>
	<CodeMirror bind:value={cssCode} language="css" height="250px" />
</Paper>

<Paper>
	<h2>JSON Editor</h2>
	<CodeMirror bind:value={jsonCode} language="json" height="150px" />
</Paper>

<Paper>
	<h2>Markdown Editor</h2>
	<CodeMirror bind:value={markdownCode} language="markdown" height="300px" />
</Paper>

<Paper>
	<h2>Read-Only Editor</h2>
	<p>This editor is read-only and cannot be edited.</p>
	<CodeMirror value={readOnlyCode} language="javascript" readOnly={true} height="100px" />
</Paper>

<Paper>
	<h2>Copy Button</h2>
	<p>
		Set <code>copyButton</code> to show a button that copies the editor contents to the clipboard. It
		swaps to a checkmark for two seconds after a successful copy.
	</p>
	<CodeMirror bind:value={copyCode} language="javascript" copyButton height="180px" />

	<h3 class="mt-4">Read-only snippet with copy</h3>
	<CodeMirror
		value={readOnlyCode}
		language="javascript"
		copyButton
		lineNumbers={false}
		readOnly={true}
		height="100px"
		onCopy={() => (lastCopied = 'Copied at ' + new Date().toLocaleTimeString())}
	/>
	{#if lastCopied}
		<p class="mt-2 mb-0"><small>{lastCopied}</small></p>
	{/if}
</Paper>

<Paper>
	<h2>Dark Theme Editor</h2>
	<CodeMirror bind:value={jsCode} language="javascript" theme="dark" height="200px" />
</Paper>

<Paper>
	<h2>More Languages</h2>
	<p>
		Languages come from <code>codeLanguages</code>, the registry rich code blocks also use.
		<code>language</code> takes an id or an alias such as <code>ps1</code>, <code>py</code> or
		<code>yml</code>, and can change after mount.
	</p>
	<div class="demo-controls">
		<div class="language-select">
			<Select
				label="Language"
				options={sampleOptions}
				value={sampleLanguage}
				onchange={(value) => (sampleLanguage = value ?? 'powershell')}
			/>
		</div>
	</div>
	<CodeMirror
		value={samples[sampleLanguage]}
		language={sampleLanguage}
		readOnly
		copyButton
		height="16rem"
	/>
	<p class="mt-2 mb-0">
		<small>
			All ids:
			{codeLanguages.map((def) => def.id).join(', ')}
		</small>
	</p>
</Paper>

<Paper>
	<h2>Log Viewer</h2>
	<p>
		<code>language="log"</code> colours each line by its level and keeps a stack trace in its
		entry's colour. With <code>follow</code>, the last line stays in view as the value grows, until
		you scroll up; a button then jumps back. A value that extends the current one is appended, so
		polling a log is cheap. <code>markedLines</code> highlights lines and
		<code>scrollToLine()</code> brings one into view. <code>wrap</code> (on by default, off here) folds
		a long line, such as the DEBUG connection string, onto the next row instead of scrolling sideways.
	</p>
	<div class="demo-controls">
		<Button variant="secondary-subtle" onclick={addLogLine}>Add a line</Button>
		<Switch label="Stream" bind:checked={streaming} />
		<Switch label="Wrap" bind:checked={wrapLog} />
		<Textbox
			placeholder="Find"
			value={find}
			oninput={(event) => (find = (event.target as HTMLInputElement).value)}
			onenter={() => findHits.length && logViewer?.scrollToLine(findHits[0])}
		/>
		<small>{find.trim() ? `${findHits.length} matching lines` : ''}</small>
	</div>
	<CodeMirror
		bind:this={logViewer}
		value={logText}
		language="log"
		readOnly
		follow
		wrap={wrapLog}
		markedLines={findHits}
		copyButton
		placeholder="(no output yet)"
		ariaLabel="Job log"
		height="14rem"
	/>
</Paper>

<Paper>
	<h2>Usage</h2>
	<pre class="code-preview p-3 rounded"><code
			>{`<script>
  import { CodeMirror } from '@placeholderco/placeholder-ui';

  let code = \$state('console.log("Hello World");');
<\/script>

<CodeMirror
  bind:value={code}
  language="javascript"
  height="300px"
/>

<!-- Languages: any id or alias in codeLanguages -->
<!-- Available themes: light, dark -->
`}</code
		></pre>

	<h3>Props</h3>
	<ul>
		<li>
			<code>value</code> - The code content (bindable); a value that extends the current one is appended
		</li>
		<li>
			<code>language</code> - An id or alias from <code>codeLanguages</code>: {codeLanguages
				.map((def) => def.id)
				.join(', ')}
		</li>
		<li><code>theme</code> - Editor theme: 'light', 'dark' or 'auto' (default)</li>
		<li><code>readOnly</code> - Make the editor read-only</li>
		<li><code>lineNumbers</code> - Show/hide the line number gutter (default: true)</li>
		<li><code>firstLineNumber</code> - Number shown for the first line (default: 1)</li>
		<li><code>wrap</code> - Wrap long lines (default: true)</li>
		<li><code>follow</code> - Keep the last line in view as the value grows (default: false)</li>
		<li><code>markedLines</code> - Line numbers to highlight, as shown</li>
		<li><code>placeholder</code> - Text shown while the editor is empty</li>
		<li><code>ariaLabel</code> - Accessible name for the editor</li>
		<li><code>extensions</code> - Extra CodeMirror extensions; changes apply live</li>
		<li><code>copyButton</code> - Show a copy-to-clipboard button (default: false)</li>
		<li><code>height</code> - Editor height (default: '31.25rem')</li>
		<li><code>onChange</code> - Callback function when content changes</li>
		<li><code>onCopy</code> - Callback function after the contents are copied</li>
	</ul>

	<h3>Methods</h3>
	<ul>
		<li><code>getValue()</code> - Get the current editor value</li>
		<li><code>setValue(newValue)</code> - Set the editor value</li>
		<li><code>getView()</code> - Get the CodeMirror EditorView instance</li>
		<li><code>focus()</code> - Focus the editor</li>
		<li><code>scrollToLine(lineNumber)</code> - Scroll a line (as shown) to the middle</li>
		<li><code>scrollToEnd()</code> - Scroll to the last line</li>
	</ul>
</Paper>

<style>
	.demo-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	/* The menu takes the trigger's width, so size it for the longest language name. */
	.language-select {
		width: 14rem;
		max-width: 100%;
	}

	.code-preview {
		background-color: #f5f5f5;
		border: 1px solid #e0e0e0;
	}

	:global(.dark) .code-preview {
		background-color: #2d2d2d;
		border-color: #444;
		color: #e0e0e0;
	}
</style>
