<script lang="ts">
	import { Table, Avatar, Paper, iconUser } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let clickedAvatar = $state('');

	interface PropRow {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: 'prop', label: 'Prop' },
		{ key: 'type', label: 'Type' },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows: PropRow[] = [
		{ prop: 'src', type: 'string', default: 'required', description: 'Image source URL' },
		{ prop: 'alt', type: 'string', default: '\'\'', description: 'Alt text for the image' },
		{ prop: 'size', type: 'number', default: '2.5', description: 'Size in rem units' },
		{ prop: 'initials', type: 'string', default: '\'\'', description: 'Initials to display when image fails' },
		{ prop: 'fallBackSvg', type: 'string', default: 'undefined', description: 'SVG icon to display as fallback' },
		{ prop: 'shape', type: '\'circle\' | \'rounded\' | \'square\'', default: '\'circle\'', description: 'Shape of the avatar' },
		{ prop: 'href', type: 'string', default: 'undefined', description: 'Wraps avatar in a link' },
		{ prop: 'backgroundColor', type: 'string', default: 'undefined', description: 'Background color for initials/fallback' },
		{ prop: 'onClick', type: '() => void', default: 'undefined', description: 'Click handler (wraps in a button)' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>Avatar</h1>
<p>Avatar displays a user's profile image, initials, or a fallback icon in a circular or shaped container.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-row">
			<Avatar src="https://i.pravatar.cc/150?u=1" alt="User 1" />
			<Avatar src="https://i.pravatar.cc/150?u=2" alt="User 2" />
			<Avatar src="https://i.pravatar.cc/150?u=3" alt="User 3" />
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="demo-row">
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=4" size={1.5} alt="XS" />
				<span class="size-label">1.5</span>
			</div>
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=5" size={2} alt="SM" />
				<span class="size-label">2</span>
			</div>
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=6" size={2.5} alt="MD" />
				<span class="size-label">2.5</span>
			</div>
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=7" size={3.5} alt="LG" />
				<span class="size-label">3.5</span>
			</div>
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=8" size={5} alt="XL" />
				<span class="size-label">5</span>
			</div>
		</div>
	</Paper>

	<Paper title="Shapes">
		<div class="demo-row">
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=10" shape="circle" size={3} alt="Circle" />
				<span class="size-label">circle</span>
			</div>
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=11" shape="rounded" size={3} alt="Rounded" />
				<span class="size-label">rounded</span>
			</div>
			<div class="avatar-demo">
				<Avatar src="https://i.pravatar.cc/150?u=12" shape="square" size={3} alt="Square" />
				<span class="size-label">square</span>
			</div>
		</div>
	</Paper>

	<Paper title="With Initials">
		<div class="demo-row">
			<Avatar src="" initials="AJ" size={3} backgroundColor="#3b82f6" />
			<Avatar src="" initials="BS" size={3} backgroundColor="#10b981" />
			<Avatar src="" initials="CW" size={3} backgroundColor="#f59e0b" />
			<Avatar src="" initials="DM" size={3} backgroundColor="#ef4444" />
		</div>
		<div class="value-display">Initials are shown when the image source fails to load or is empty</div>
	</Paper>

	<Paper title="With Fallback Icon">
		<div class="demo-row">
			<Avatar src="" fallBackSvg={iconUser} size={3} />
			<Avatar src="" fallBackSvg={iconUser} size={3} backgroundColor="#6366f1" />
		</div>
	</Paper>

	<Paper title="As Link">
		<div class="demo-row">
			<Avatar src="https://i.pravatar.cc/150?u=20" href="/" size={3} alt="Clickable avatar" />
		</div>
		<div class="value-display">This avatar is wrapped in a link and navigates to the homepage.</div>
	</Paper>

	<Paper title="Clickable">
		<div class="demo-row">
			<Avatar src="https://i.pravatar.cc/150?u=21" size={3} alt="Click me" onClick={() => (clickedAvatar = 'Avatar clicked!')} />
		</div>
		<div class="value-display">{clickedAvatar || 'Click the avatar above'}</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }.avatar-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.375rem;
	}

	.size-label {
		font-size: 0.75rem;
		color: var(--pui-text-muted);
		font-family: monospace;
	}
</style>
