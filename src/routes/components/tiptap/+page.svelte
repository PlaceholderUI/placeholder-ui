<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import TipTap from '$lib/editors/tiptap/TipTap.svelte';
	import TipTapBubble from '$lib/editors/tiptap/TipTapBubble.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { Extension } from '@tiptap/core';

	// Example custom extension: inserts the current date/time via Ctrl+Shift+D
	const InsertDate = Extension.create({
		name: 'insertDate',
		addKeyboardShortcuts() {
			return {
				'Mod-Shift-d': ({ editor }) => {
					return editor.commands.insertContent(new Date().toLocaleDateString());
				}
			};
		}
	});

	let basicEditor: TipTap;
	let readOnlyContent = `
		<h2>Welcome to TipTap</h2>
		<p>This is a <strong>read-only</strong> editor showing formatted content.</p>
		<ul>
			<li>Rich text formatting</li>
			<li>Headings and lists</li>
			<li>Code blocks and quotes</li>
		</ul>
	`;
	let clickableLinkContent = `
		<h2>Link Actions</h2>
		<p>This editor has <a href="/components/buttons">an internal link</a> and <a href="https://tiptap.dev" target="_blank" rel="noopener noreferrer">an external TipTap link</a>.</p>
		<p>Click either link to open the link action popup.</p>
	`;
	let buttonContent = `
		<h2>Call to Action</h2>
		<p>Ready to get started? <a class="editor-button editor-button-primary" href="/components/buttons">See the buttons</a> or <a class="editor-button editor-button-accent-outline editor-button-sm" href="https://tiptap.dev" target="_blank" rel="noopener noreferrer">read the TipTap docs</a>.</p>
		<p>Select some text and press the button tool to turn it into a button, or press it with nothing selected to insert a new one.</p>
	`;
	let tableContent = `
		<p>Place the cursor inside the table and click the table button for row and column actions.</p>
		<table>
			<tbody>
				<tr><th>Component</th><th>Category</th><th>Status</th></tr>
				<tr><td>Button</td><td>UI</td><td>Stable</td></tr>
				<tr><td>TipTap</td><td>Editors</td><td>Stable</td></tr>
				<tr><td>FileTree</td><td>Display</td><td>New</td></tr>
			</tbody>
		</table>
	`;

	let codeContent = `
		<h2>Rich Code Blocks</h2>
		<p>Each code block below is a full CodeMirror editor. Click into one and start typing — you get syntax highlighting, autocompletion (Ctrl+Space), bracket matching and smart indentation. Use the picker on the block to switch language.</p>
		<pre><code class="language-csharp">public class Greeter
{
    private readonly string _name;

    public Greeter(string name) => _name = name;

    public void SayHello() => Console.WriteLine($"Hello, {_name}!");
}</code></pre>
		<p>PowerShell works too:</p>
		<pre><code class="language-powershell"># Find the largest log files
Get-ChildItem -Path C:\\Logs -Filter *.log |
    Where-Object { $_.Length -gt 1MB } |
    Sort-Object Length -Descending |
    Select-Object Name, Length</code></pre>
		<p>And SQL (T-SQL dialect):</p>
		<pre><code class="language-sql">SELECT TOP 10 m.MatterNumber, m.Title, COUNT(d.DocumentId) AS Documents
FROM Matters m
INNER JOIN Documents d ON d.MatterId = m.MatterId
WHERE m.OpenedDate >= @fromDate
GROUP BY m.MatterNumber, m.Title
ORDER BY Documents DESC;</code></pre>
	`;

	let customEditor: TipTap;
	let customContent = '';

	function handleCustomUpdate(html: string) {
		customContent = html;
	}

	let eventContent = '';
	let lastUpdate = '';

	function handleUpdate(html: string) {
		lastUpdate = new Date().toLocaleTimeString();
		console.log('Editor updated at:', lastUpdate);
	}

	// Example image upload handler - uses test endpoint that converts to base64
	async function handleImageUpload(file: File): Promise<string | null> {
		const formData = new FormData();
		formData.append('image', file);

		try {
			const response = await fetch('/api/upload-image', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = await response.json();
			return data.url || data.imageUrl || data.path || null;
		} catch (error) {
			console.error('Failed to upload image:', error);
			alert('Failed to upload image. Please try again.');
			return null;
		}
	}

	// Example document upload handler - the app is responsible for uploading and
	// returning the link label and URL, which appear as a hyperlink in the editor.
	async function handleDocumentUpload(file: File): Promise<{ label: string; url: string } | null> {
		const formData = new FormData();
		formData.append('document', file);

		try {
			const response = await fetch('/api/upload-document', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = await response.json();
			return { label: data.label ?? file.name, url: data.url };
		} catch (error) {
			console.error('Failed to upload document:', error);
			alert('Failed to upload document. Please try again.');
			return null;
		}
	}

	function getContent() {
		if (basicEditor) {
			const html = basicEditor.getHTML();
			alert('Current HTML content:\n\n' + html);
		}
	}

	function setContent() {
		if (customEditor) {
			customEditor.setContent(`
				<h1>Programmatically Set Content</h1>
				<p>This content was set using the <code>setContent</code> method.</p>
				<blockquote>You can update the editor content from your application code.</blockquote>
			`);
		}
	}

	function clearContent() {
		if (customEditor) {
			customEditor.clear();
		}
	}
</script>

<div class="page-header">
	<h1>TipTap Editor</h1>
	<p>A modern WYSIWYG rich text editor built on TipTap v3 for Svelte 5.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<p class="description">
			A fully-featured rich text editor with formatting toolbar. Try typing and using the formatting
			buttons.
		</p>
		<TipTap bind:this={basicEditor} placeholder="Start typing your content here..." />
		<div class="button-group">
			<Button onclick={getContent}>Get HTML Content</Button>
		</div>
	</Paper>

	<Paper title="With Label">
		<p class="description">
			Pass a <code>label</code> to display a form label above the editor, like other form
			components. Combine with <code>required</code> and <code>tooltipText</code>.
		</p>
		<TipTap
			label="Description"
			required
			tooltipText="Enter a detailed description"
			placeholder="Write a description..."
		/>
	</Paper>

	<Paper title="Bubble Menu Variant">
		<p class="description">
			An alternate editor that uses a floating bubble menu instead of a fixed toolbar. Select text
			to see the formatting options appear.
		</p>
		<TipTapBubble placeholder="Select text to see the bubble menu..." />
	</Paper>

	<Paper title="Read-Only Mode">
		<p class="description">
			Set <code>editable={false}</code> to display formatted content without allowing edits.
		</p>
		<TipTap value={readOnlyContent} editable={false} />
	</Paper>

	<Paper title="Link Actions">
		<p class="description">
			Click a link in the editor to open it, edit its URL, or remove it without leaving edit mode.
		</p>
		<TipTap bind:value={clickableLinkContent} />
	</Paper>

	<Paper title="Buttons">
		<p class="description">
			The button tool turns the selected text, or a new label, into a call-to-action link styled
			like the library's <code>Button</code>: pick a style and size and enter the URL. A button is a
			plain <code>&lt;a class="editor-button ..."&gt;</code> tag styled by <code>app.css</code>, so
			the saved HTML looks the same wherever it is rendered. Put the cursor in a button and press
			the tool again to change or remove it.
		</p>
		<TipTap bind:value={buttonContent} />
	</Paper>

	<Paper title="Programmatic Control">
		<p class="description">Use the exposed methods to control the editor programmatically.</p>
		<TipTap bind:this={customEditor} onUpdate={handleCustomUpdate} />
		<div class="button-group">
			<Button onclick={setContent}>Set Content</Button>
			<Button onclick={clearContent} variant="danger">Clear Content</Button>
		</div>
		{#if customContent}
			<div class="content-preview">
				<strong>Current HTML:</strong>
				<pre>{customContent}</pre>
			</div>
		{/if}
	</Paper>

	<Paper title="Update Events">
		<p class="description">
			Listen to content changes using the <code>onUpdate</code> callback.
		</p>
		<TipTap placeholder="Type to see update events..." onUpdate={handleUpdate} />
		{#if lastUpdate}
			<div class="event-display">
				<strong>Last updated:</strong>
				{lastUpdate}
				<br />
				<small>Check the browser console for detailed logs</small>
			</div>
		{/if}
	</Paper>

	<Paper title="Image Uploads">
		<p class="description">
			Enable image uploads by providing an <code>onImageUpload</code> callback. Click the image button
			in the toolbar, drag-and-drop images, or paste from clipboard.
		</p>
		<TipTap
			onImageUpload={handleImageUpload}
			placeholder="Click the image button, drag-and-drop, or paste an image..."
		/>
		<div class="info-box">
			<strong>Test Endpoint:</strong> <code>/api/upload-image</code>
			<br />
			<small>This test endpoint converts images to base64 data URLs (max 5MB, dev mode only)</small>
		</div>
	</Paper>

	<Paper title="Document Uploads">
		<p class="description">
			Enable document attachments by providing an <code>onDocumentUpload</code> callback. Click the
			paperclip button in the toolbar to pick a file. Your app uploads it and returns a
			<code>{'{ label, url }'}</code> object, which is inserted into the editor as a hyperlink.
		</p>
		<TipTap
			onDocumentUpload={handleDocumentUpload}
			placeholder="Click the paperclip button to attach a document..."
		/>
		<div class="info-box">
			<strong>Test Endpoint:</strong> <code>/api/upload-document</code>
			<br />
			<small>Your handler returns the link label and URL; the editor inserts the hyperlink.</small>
		</div>
	</Paper>

	<Paper title="Tables">
		<p class="description">
			The table button in the toolbar opens a size picker to insert a table; with the cursor inside
			a table, the same button offers row, column and header actions. Use
			<code>Tab</code> / <code>Shift+Tab</code> to move between cells, and drag column borders to
			resize. Also available on <code>TipTapBubble</code>.
		</p>
		<TipTap bind:value={tableContent} />
	</Paper>

	<Paper title="Code Blocks with Syntax Highlighting">
		<p class="description">
			Pass <code>codeBlocks</code> to enable rich code blocks powered by CodeMirror: syntax
			highlighting, autocompletion, bracket matching and smart indentation for JavaScript,
			TypeScript, HTML, CSS, JSON, Markdown, SQL, C# and PowerShell. Insert a block from the toolbar
			button or by typing <code>```csharp</code> at the start of a line. Press
			<code>Ctrl+Enter</code> to exit a block, and use the picker on each block to switch language.
			Content saves as standard <code>&lt;pre&gt;&lt;code class="language-..."&gt;</code> HTML. Also
			available on <code>TipTapBubble</code>.
		</p>
		<TipTap bind:value={codeContent} codeBlocks />
		<p class="description" style="margin-top: 1rem;">
			Pass a config object to restrict the offered languages and set the default for new blocks:
		</p>
		<TipTap
			codeBlocks={{
				languages: ['csharp', 'powershell', 'plaintext'],
				defaultLanguage: 'powershell'
			}}
			placeholder="Only C#, PowerShell and plain text are offered here..."
		/>
	</Paper>

	<Paper title="Custom Styling">
		<p class="description">Apply custom classes to style the editor wrapper.</p>
		<TipTap class="custom-editor" placeholder="This editor has custom styling..." />
	</Paper>

	<Paper title="Custom Extensions">
		<p class="description">
			Pass additional TipTap extensions via the <code>extensions</code> prop. This example adds a
			custom shortcut: press <code>Ctrl+Shift+D</code> to insert the current date.
		</p>
		<TipTap
			extensions={[InsertDate]}
			placeholder="Type here, then press Ctrl+Shift+D to insert today's date..."
		/>
	</Paper>

	<Paper title="Features">
		<div class="features-grid">
			<div class="feature">
				<h3>Text Formatting</h3>
				<ul>
					<li>Bold, italic, strikethrough</li>
					<li>Headings (H1, H2, H3)</li>
					<li>Paragraphs</li>
				</ul>
			</div>
			<div class="feature">
				<h3>Lists</h3>
				<ul>
					<li>Bullet lists</li>
					<li>Ordered lists</li>
					<li>Nested lists</li>
					<li>Tab to indent lists</li>
					<li>Shift+Tab to outdent</li>
				</ul>
			</div>
			<div class="feature">
				<h3>Advanced</h3>
				<ul>
					<li>Code blocks</li>
					<li>Blockquotes</li>
					<li>Horizontal rules</li>
					<li>Image uploads</li>
					<li>Tables</li>
					<li>Call-to-action buttons</li>
					<li>Undo/Redo</li>
					<li>Tab key support</li>
				</ul>
			</div>
			<div class="feature">
				<h3>Customization</h3>
				<ul>
					<li>Editable/Read-only modes</li>
					<li>Custom placeholders</li>
					<li>Update callbacks</li>
					<li>Programmatic control</li>
				</ul>
			</div>
		</div>
	</Paper>

	<Paper title="API Methods">
		<div class="api-section">
			<h3>Available Methods</h3>
			<table class="api-table">
				<thead>
					<tr>
						<th>Method</th>
						<th>Description</th>
						<th>Returns</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>getHTML()</code></td>
						<td>Get the current content as HTML string</td>
						<td>string</td>
					</tr>
					<tr>
						<td><code>getJSON()</code></td>
						<td>Get the current content as JSON object</td>
						<td>object</td>
					</tr>
					<tr>
						<td><code>setContent(html)</code></td>
						<td>Set the editor content from HTML string</td>
						<td>void</td>
					</tr>
					<tr>
						<td><code>clear()</code></td>
						<td>Clear all content from the editor</td>
						<td>void</td>
					</tr>
					<tr>
						<td><code>focus()</code></td>
						<td>Focus the editor</td>
						<td>void</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="api-section">
			<h3>Props</h3>
			<table class="api-table">
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
						<td><code>content</code></td>
						<td>string</td>
						<td>''</td>
						<td>Initial HTML content</td>
					</tr>
					<tr>
						<td><code>label</code></td>
						<td>string</td>
						<td>''</td>
						<td>Label text displayed above the editor</td>
					</tr>
					<tr>
						<td><code>required</code></td>
						<td>boolean</td>
						<td>false</td>
						<td>Mark field as required (shows asterisk next to label)</td>
					</tr>
					<tr>
						<td><code>groupClass</code></td>
						<td>string</td>
						<td>''</td>
						<td>CSS classes for the FormGroup wrapper</td>
					</tr>
					<tr>
						<td><code>tooltipText</code></td>
						<td>string</td>
						<td>undefined</td>
						<td>Tooltip text shown next to the label</td>
					</tr>
					<tr>
						<td><code>tooltipLocation</code></td>
						<td>'top' | 'bottom' | 'left' | 'right'</td>
						<td>'top'</td>
						<td>Position of the tooltip</td>
					</tr>
					<tr>
						<td><code>editable</code></td>
						<td>boolean</td>
						<td>true</td>
						<td>Whether the editor is editable</td>
					</tr>
					<tr>
						<td><code>placeholder</code></td>
						<td>string</td>
						<td>'Start typing...'</td>
						<td>Placeholder text when empty</td>
					</tr>
					<tr>
						<td><code>class</code></td>
						<td>string</td>
						<td>''</td>
						<td>Custom CSS classes</td>
					</tr>
					<tr>
						<td><code>uploadImageUrl</code></td>
						<td>string</td>
						<td>undefined</td>
						<td>API endpoint for image uploads (enables toolbar button, drag-drop, paste)</td>
					</tr>
					<tr>
						<td><code>onUpdate</code></td>
						<td>function</td>
						<td>undefined</td>
						<td>Callback when content changes</td>
					</tr>
					<tr>
						<td><code>codeBlocks</code></td>
						<td>boolean | CodeBlocksOptions</td>
						<td>false</td>
						<td>Enable CodeMirror-powered code blocks with highlighting and autocompletion</td>
					</tr>
					<tr>
						<td><code>extensions</code></td>
						<td>AnyExtension[]</td>
						<td>[]</td>
						<td>Additional TipTap extensions to register with the editor</td>
					</tr>
				</tbody>
			</table>
		</div>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
	}

	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.description {
		margin-bottom: 1rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.description code {
		background: var(--bs-secondary-bg);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.content-preview {
		margin-top: 1rem;
		padding: 1rem;
		background: var(--bs-secondary-bg);
		border: 1px solid var(--bs-border-color);
		border-radius: 0.375rem;
	}

	.content-preview pre {
		margin: 0.5rem 0 0 0;
		padding: 0.75rem;
		background: var(--bs-body-bg);
		border: 1px solid var(--bs-border-color);
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.75rem;
		overflow-x: auto;
		max-height: 200px;
		overflow-y: auto;
	}

	.event-display {
		margin-top: 1rem;
		padding: 0.75rem;
		background: var(--bs-secondary-bg);
		border: 1px solid var(--bs-border-color);
		border-radius: 0.375rem;
		font-size: 0.875rem;
	}

	.event-display small {
		color: var(--text-muted);
	}

	.info-box {
		margin-top: 1rem;
		padding: 0.75rem;
		background: var(--bs-info-bg-subtle);
		border: 1px solid var(--bs-info-border-subtle);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: var(--bs-info-text-emphasis);
	}

	.info-box code {
		background: rgba(var(--bs-info-rgb), 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	.info-box small {
		color: var(--text-muted);
	}

	:global(.custom-editor) {
		border: 2px solid var(--bs-primary);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.feature h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 0.75rem 0;
		color: var(--text-color);
	}

	.feature ul {
		margin: 0;
		padding-left: 1.25rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.feature li {
		margin-bottom: 0.375rem;
	}

	.api-section {
		margin-top: 1.5rem;
	}

	.api-section:first-child {
		margin-top: 0;
	}

	.api-section h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
		color: var(--text-color);
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.api-table th,
	.api-table td {
		padding: 0.75rem;
		text-align: left;
		border: 1px solid var(--bs-border-color);
	}

	.api-table th {
		background: var(--bs-secondary-bg);
		font-weight: 600;
		color: var(--text-color);
	}

	.api-table td {
		color: var(--text-muted);
	}

	.api-table code {
		background: var(--bs-secondary-bg);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--bs-primary);
	}

	@media (max-width: 768px) {
		.api-table {
			font-size: 0.75rem;
		}

		.api-table th,
		.api-table td {
			padding: 0.5rem;
		}
	}
</style>
