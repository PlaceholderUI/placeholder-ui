<script lang="ts">
	import Avatar from '$lib/display/Avatar.svelte';
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';

	interface Props {
		option: ComboBoxItem;
		size?: 'small' | 'medium' | 'large';
		showStatus?: boolean;
	}

	let { option, size = 'small', showStatus = false }: Props = $props();

	const sizeMap = {
		small: 1.5,
		medium: 2,
		large: 2.5
	};
</script>

<div class="user-display">
	<Avatar src={(option as any).avatar} alt={option.label} size={sizeMap[size]} />
	<div class="user-info">
		<span class="user-name">{option.label}</span>
		{#if (option as any).email}
			<span class="user-email">{(option as any).email}</span>
		{/if}
	</div>
	{#if showStatus && (option as any).status}
		<span class="user-status status-{(option as any).status}">{(option as any).status}</span>
	{/if}
</div>

<style>
	.user-display {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
	}

	.user-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.user-name {
		font-weight: 500;
		color: var(--text-color);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.user-email {
		font-size: 0.875rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.user-status {
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.status-online {
		background-color: #10b981;
		color: white;
	}

	.status-offline {
		background-color: #6b7280;
		color: white;
	}

	.status-busy {
		background-color: #f59e0b;
		color: white;
	}

	.status-away {
		background-color: #3b82f6;
		color: white;
	}
</style>
