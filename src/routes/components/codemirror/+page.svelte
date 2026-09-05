<script lang="ts">
  import { CodeMirror, Paper, themeState } from '$lib/index.js';

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
  <CodeMirror
    bind:value={jsCode}
    language="javascript"
    lineNumbers={false}
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    height="200px"
  />

  <h3 class="mt-4">Current Value:</h3>
  <pre class="code-preview p-3 rounded"><code>{jsCode}</code></pre>
</Paper>

<Paper>
  <h2>HTML Editor</h2>
  <CodeMirror
    bind:value={htmlCode}
    language="html"
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    height="250px"
  />
</Paper>

<Paper>
  <h2>CSS Editor</h2>
  <CodeMirror
    bind:value={cssCode}
    language="css"
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    height="250px"
  />
</Paper>

<Paper>
  <h2>JSON Editor</h2>
  <CodeMirror
    bind:value={jsonCode}
    language="json"
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    height="150px"
  />
</Paper>

<Paper>
  <h2>Markdown Editor</h2>
  <CodeMirror
    bind:value={markdownCode}
    language="markdown"
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    height="300px"
  />
</Paper>

<Paper>
  <h2>Read-Only Editor</h2>
  <p>This editor is read-only and cannot be edited.</p>
  <CodeMirror
    value={readOnlyCode}
    language="javascript"
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    readOnly={true}
    height="100px"
  />
</Paper>

<Paper>
  <h2>Copy Button</h2>
  <p>
    Set <code>copyButton</code> to show a button that copies the editor contents to the clipboard.
    It swaps to a checkmark for two seconds after a successful copy.
  </p>
  <CodeMirror
    bind:value={copyCode}
    language="javascript"
    copyButton
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    height="180px"
  />

  <h3 class="mt-4">Read-only snippet with copy</h3>
  <CodeMirror
    value={readOnlyCode}
    language="javascript"
    copyButton
    lineNumbers={false}
    readOnly={true}
    theme={themeState.isDarkMode ? 'dark' : 'light'}
    height="100px"
    onCopy={() => (lastCopied = 'Copied at ' + new Date().toLocaleTimeString())}
  />
  {#if lastCopied}
    <p class="mt-2 mb-0"><small>{lastCopied}</small></p>
  {/if}
</Paper>

<Paper>
  <h2>Dark Theme Editor</h2>
  <CodeMirror
    bind:value={jsCode}
    language="javascript"
    theme="dark"
    height="200px"
  />
</Paper>

<Paper>
  <h2>Usage</h2>
  <pre class="code-preview p-3 rounded"><code>{`<script>
  import { CodeMirror } from '@placeholderco/placeholder-ui';

  let code = \$state('console.log("Hello World");');
<\/script>

<CodeMirror
  bind:value={code}
  language="javascript"
  height="300px"
/>

<!-- Available languages: javascript, typescript, html, css, json, markdown -->
<!-- Available themes: light, dark -->
`}</code></pre>

  <h3>Props</h3>
  <ul>
    <li><code>value</code> - The code content (bindable)</li>
    <li><code>language</code> - Programming language: 'javascript', 'html', 'css', 'json', 'typescript', 'markdown'</li>
    <li><code>theme</code> - Editor theme: 'light' or 'dark'</li>
    <li><code>readOnly</code> - Make the editor read-only</li>
    <li><code>lineNumbers</code> - Show/hide the line number gutter (default: true)</li>
    <li><code>copyButton</code> - Show a copy-to-clipboard button (default: false)</li>
    <li><code>height</code> - Editor height (default: '500px')</li>
    <li><code>onChange</code> - Callback function when content changes</li>
    <li><code>onCopy</code> - Callback function after the contents are copied</li>
  </ul>

  <h3>Methods</h3>
  <ul>
    <li><code>getValue()</code> - Get the current editor value</li>
    <li><code>setValue(newValue)</code> - Set the editor value</li>
    <li><code>getView()</code> - Get the CodeMirror EditorView instance</li>
    <li><code>focus()</code> - Focus the editor</li>
  </ul>
</Paper>

<style>
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
