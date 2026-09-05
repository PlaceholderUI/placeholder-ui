<script lang="ts">
	import { MessageTypes, Paper, Select, type NotifyModel } from '$lib/index.js';
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';
	import TestCustomElement from '../TestCustomElement.svelte';

	let basicSelectValue = $state<string | undefined>('');
	let basicSelectLabel = $state<string | undefined>('');
	let basicSelectApiValue = $state('');

	let groupedSelectValue = $state<string | undefined>('');
	let groupedSelectLabel = $state<string | undefined>('');

	const basicSelectOptions = [
		{ label: 'Test option 1', value: '1', selected: false },
		{ label: 'Test option 2', value: '2', selected: false },
		{ label: 'Test option 3', value: '3', selected: false },
		{ label: 'Test option 4', value: '4', selected: false }
	];

	const groupedSelectOptions = [
		{
			label: 'Group 1',
			items: [
				{ label: 'Group 1 Test option 1', value: '1', selected: false },
				{ label: 'Group 1 Test option 2', value: '2', selected: false },
				{ label: 'Group 1 Test option 3', value: '3', selected: false },
				{ label: 'Group 1 Test option 4', value: '4', selected: false }
			]
		},
		{
			label: 'Group 2',
            showGroupName: false,
			items: [
				{ label: 'Group 2 Test option 5', value: '5', selected: false },
				{ label: 'Group 2 Test option 6', value: '6', selected: false },
				{ label: 'Group 2 Test option 7', value: '7', selected: false },
				{ label: 'Group 2 Test option 8', value: '8', selected: false }
			]
		},
		{
			label: '',
			items: [
				{ label: 'Group 3 Test option 9', value: '9', selected: false },
				{ label: 'Group 3 Test option 10', value: '10', selected: false },
				{ label: 'Group 3 Test option 11', value: '11', selected: false },
				{ label: 'Group 3 Test option 12', value: '12', selected: false }
			]
		}
	];

	async function apiLoad(): Promise<NotifyModel<ComboBoxItem[]>> {
		// delay for 3 seconds
		await new Promise((resolve) => setTimeout(resolve, 3000));
		return {
			message: 'Success',
			type: MessageTypes.success,
			isError: false,
			isSuccess: true,
			object: [
				{ label: 'test', value: '1' },
				{ label: 'test2', value: '2' }
			]
		};
	}

	async function serverSideSearch(query: string): Promise<NotifyModel<ComboBoxItem[]>> {
		console.log('starting search for:', query);
		// delay for 3 seconds
		const options = [
			{ label: 'alpha', value: '1' },
			{ label: 'beta', value: '2' },
			{ label: 'gamma', value: '3' },
			{ label: 'sigma', value: '4' }
		];
		await new Promise((resolve) => setTimeout(resolve, 100));
		return {
			message: 'Success',
			type: MessageTypes.success,
			isError: false,
			isSuccess: true,
			object: options.filter((option) => option.label.includes(query))
		};
	}

	async function serverSideRetrieveLabel(value: any): Promise<NotifyModel<string>> {
		const options = [
			{ label: 'alpha', value: '1' },
			{ label: 'beta', value: '2' },
			{ label: 'gamma', value: '3' },
			{ label: 'sigma', value: '4' }
		];

		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			message: 'Success',
			type: MessageTypes.success,
			isError: false,
			isSuccess: true,
			object: options.find((x) => x.value === value)?.label
		};
	}

	const customComponentOptions: ComboBoxItem[] = [
		{ label: 'Item 1', value: '1', selected: false, component: TestCustomElement },
		{
			label: 'Item 2',
			value: '2',
			selected: false,
			component: TestCustomElement,
			componentProps: { prop: 'string' }
		}
	];
</script>

{#snippet tooltipContent()}
	<div>Tooltip content</div>
	<div>Tooltip content</div>
	<div>Tooltip content</div>
{/snippet}

<Paper title="Select" bodyClass="flex flex-col gap-y-2">
	<div>
		<Select
			label="Basic select"
			showError
			errorText="This is an error"
			options={basicSelectOptions}
			placeholder="Placeholder"
			bind:value={basicSelectValue}
			onchangeRaw={(e) => (basicSelectLabel = e?.label)}
		/>
		<div>Value: {basicSelectValue}</div>
		<div>RawValue: {basicSelectLabel}</div>
	</div>
	<div>
		<Select
			allowSearch
			label="Grouped select"
			showError
			errorText="This is an error"
			groupedOptions={groupedSelectOptions}
			placeholder="Placeholder"
			bind:value={groupedSelectValue}
			onchangeRaw={(e) => {
				groupedSelectLabel = e?.label;
				console.log('grouped select change', $state.snapshot(e));
			}}
		/>
		<div>Value: {basicSelectValue}</div>
		<div>RawValue: {basicSelectLabel}</div>
	</div>
	<button onclick={() => (basicSelectValue = '2')}>Set value to 2</button>
	<div>
		<Select
			label="With tooltip"
			options={basicSelectOptions}
			placeholder="Placeholder"
			bind:value={basicSelectValue}
			{tooltipContent}
		></Select>
		<div>Value: {basicSelectValue}</div>
	</div>
	<div>
		<Select
			label="Select with required value"
			required
			options={basicSelectOptions}
			bind:value={basicSelectValue}
		/>
		<div>Value: {basicSelectValue}</div>
	</div>
	<div>
		<Select
			label="Select options loaded via API"
			fetchFunction={apiLoad}
			bind:value={basicSelectApiValue}
		/>
		<div>Value: {basicSelectApiValue}</div>
	</div>
	<div>
		<Select
			label="Select options loaded via API with preset value"
			fetchFunction={apiLoad}
			value="2"
		/>
	</div>
	<div>
		<Select
			label="Select with search function"
			searchFunction={serverSideSearch}
			retrieveLabelFunction={serverSideRetrieveLabel}
			value="2"
		/>
	</div>
	<div>
		<Select label="Disabled" disabled />
	</div>
	<div>
		<Select label="Select with custom component options" options={customComponentOptions} />
	</div>
</Paper>
