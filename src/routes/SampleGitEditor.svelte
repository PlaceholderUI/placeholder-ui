<!-- <script lang="ts">
	import GitCard from '$lib/cards/GitCard.svelte';
	import Select from '$lib/form/Select.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import { iconArrowsMove } from '$lib/icon/index.js';
	import type { GitEmployee } from '$lib/models/Employee.js';
	import Sortable from 'sortablejs';
	import { onDestroy, onMount } from 'svelte';

	export let onchange: (selectedGits: string[]) => void;

	const employees: GitEmployee[] = [
		{
			fullName: 'John Doe',
			jobTitle: 'Software Engineer',
			upn: 'jdoe@example.com',
			emplid: '123456'
		},
		{
			fullName: 'Jane Doe',
			jobTitle: 'Software Engineer',
			upn: 'janedoe@example.com',
			emplid: '123456'
		}
	];

	const options = employees.map((employee) => ({
		value: employee.upn,
		label: employee.fullName
	}));

	function onEmployeeChange(upn: string) {
		if (selectedGits.find((x) => x.upn === upn)) {
			selectedGits = selectedGits.filter((x) => x.upn !== upn);
			onchange(selectedGits.map((x) => x.upn));
			return;
		}

		selectedGits = [...selectedGits, employees.find((x) => x.upn === upn)!];
		onchange(selectedGits.map((x) => x.upn));
	}

	let selectedGits: GitEmployee[] = [];
	let container: HTMLDivElement;

	let sortable: Sortable;

	onMount(async function () {
		sortable = Sortable.create(container, {
			group: {
				name: 'git',
				put: true
			},
			animation: 200,
			onUpdate: (event) => {
				const upns: string[] = [];
				container.querySelectorAll('.draggable').forEach((element) => {
					const el = element as HTMLElement;
					upns.push(el.dataset.id as string);
				});
				onchange(upns);
			}
		});
	});

	onDestroy(() => {
		sortable?.destroy();
	});
</script>

<Select onchange={(e: string) => onEmployeeChange(e)} {options} />

<div class="flex flex-wrap gap-4 mt-4" bind:this={container}>
	{#each selectedGits as git (git.upn)}
		<div class="draggable" data-id={git.upn}>
			<GitCard {git} imgSrc="https://i.pravatar.cc/96" />
			<div class="drag-overlay">
				<div class="handle">
					<Icon svg={iconArrowsMove} size="2em" />
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.draggable {
		position: relative;
		cursor: grab;
	}

	.draggable:hover .drag-overlay {
		display: block;
	}

	.drag-overlay {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.75);
		z-index: 100;
	}

	.handle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: var(--ui-accent);
	}
</style> -->
