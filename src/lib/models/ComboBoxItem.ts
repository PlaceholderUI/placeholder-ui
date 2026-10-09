import type { NotifyModel } from './NotifyModel.js';

export interface ComboBoxGroup {
	label: string;
	items: ComboBoxItem[];
	showGroupName?: boolean;
}

export interface ComboBoxItem {
	label: string;
	value: string;
	href?: string;
	class?: string;
	selected?: boolean;
	component?: any;
	componentProps?: any;
	selectedComponent?: any;
	selectedComponentProps?: any;
	groupName?: string;
	imageSrc?: string;
	description?: string;
	/** Shows the option but prevents it from being selected */
	disabled?: boolean;
	/** Marks a synthetic "add new value" suggestion (see Autocomplete) */
	isAddNew?: boolean;
}

export type FetchFunctionType = () => Promise<NotifyModel<ComboBoxItem[]>>;
/**
 * Remote search. `signal` is aborted when a newer search supersedes this one (the user
 * kept typing, cleared the input, or the component unmounted) — pass it to `fetch` to
 * cancel the request. Results from superseded searches are discarded either way.
 */
export type SearchFunctionType = (
	query: string,
	signal?: AbortSignal
) => Promise<NotifyModel<ComboBoxItem[]>>;
export type RetrieveLabelFunctionType = (value: any) => Promise<NotifyModel<string | undefined>>;
