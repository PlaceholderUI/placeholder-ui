import type {
	ComboBoxGroup,
	ComboBoxItem,
	FetchFunctionType,
	RetrieveLabelFunctionType,
	SearchFunctionType
} from '$lib/models/ComboBoxItem.js';
import type { NotifyModel } from '$lib/models/NotifyModel.js';

/**
 * Option/search lifecycle shared by every option-driven input regardless of
 * whether it holds a single value or many. Value-specific concerns
 * (selected-state, value preloading) are supplied by the subclasses.
 *
 * Value/rawValue accessors live on the subclass configs because they are
 * `$bindable` props on the host component and can't be referenced from here.
 */
export interface ComboBoxDataConfig {
	/** Current flat options, read reactively */
	getOptions: () => ComboBoxItem[];
	/** Current grouped options, read reactively */
	getGroupedOptions: () => ComboBoxGroup[];
	getFetchFunction: () => FetchFunctionType | null;
	getSearchFunction: () => SearchFunctionType | null;
	getRetrieveLabelFunction: () => RetrieveLabelFunctionType | null;
	/** Called after options are (re)applied so the host can re-run its active filter */
	onOptionsChanged?: () => void;
}

/** Config for single-value inputs (Select, Autocomplete). */
export interface ComboBoxCoreConfig extends ComboBoxDataConfig {
	/** Current bound value, read reactively */
	getValue: () => string | undefined;
	/** Update the bound value */
	setValue: (value: string | undefined) => void;
	/** Update the bound rawValue */
	setRawValue: (raw: ComboBoxItem | undefined) => void;
	/**
	 * When the value isn't among static options, clear it (Select — so forms don't
	 * submit a stale key) instead of keeping it as freeform text (Autocomplete).
	 */
	clearUnknownStatic?: boolean;
	/** Called after preloadValues clears the value via the static-unknown path */
	onValueCleared?: () => void;
	/** Called once an async retrieveLabel resolves a rawValue */
	onRawValueResolved?: (raw: ComboBoxItem | undefined) => void;
}

/** Config for multi-value inputs (SelectMulti, AutocompleteMulti). */
export interface ComboBoxMultiCoreConfig extends ComboBoxDataConfig {
	/** Current bound values, read reactively */
	getValues: () => string[];
	/**
	 * Snapshot of the caller-supplied initial rawValues. Used as a label source for
	 * values the options can't resolve, so parents can preset selections with known
	 * labels without a retrieveLabel round-trip. A snapshot (not the live binding) so
	 * items selected later still go through the normal stale-value cleanup.
	 */
	initialRawValues?: ComboBoxItem[];
	/** Update the bound values */
	setValues: (values: string[]) => void;
	/** Update the bound rawValues */
	setRawValues: (raw: ComboBoxItem[]) => void;
	/** Drop values not found among static options (SelectMulti) instead of keeping them (AutocompleteMulti) */
	clearUnknownStatic?: boolean;
	/** Called after preloadValues drops unknown static values */
	onValuesCleared?: () => void;
	/** Called once async retrieveLabel calls resolve the rawValues */
	onRawValuesResolved?: (raw: ComboBoxItem[]) => void;
}

export function flattenItems(groups: ComboBoxGroup[]): ComboBoxItem[] {
	return groups.flatMap((group) => group.items);
}

export function findItemByValue(
	groups: ComboBoxGroup[],
	value: string | undefined
): ComboBoxItem | undefined {
	if (value === undefined || value === '') return undefined;
	return flattenItems(groups).find((item) => item.value === value);
}

/**
 * Owns the option/search data lifecycle shared by the single- and multi-value
 * inputs: converting options into groups, reacting to option-prop changes,
 * one-shot fetch, debounced remote search and local filtering.
 *
 * Instantiate (via a subclass) at the top of a component `<script>` so its
 * `$effect`s register in that component's lifecycle.
 */
export abstract class ComboBoxDataCore<TConfig extends ComboBoxDataConfig> {
	allGroups = $state<ComboBoxGroup[]>([]);
	filteredGroups = $state<ComboBoxGroup[]>([]);
	preloading = $state(false);
	searching = $state(false);

	protected config: TConfig;
	#timeout: ReturnType<typeof setTimeout> | undefined;
	#fetchInitialized = false;
	#lastOptionsRef: ComboBoxItem[] | undefined;
	#lastGroupedRef: ComboBoxGroup[] | undefined;

	constructor(config: TConfig) {
		this.config = config;

		$effect(() => {
			const cfg = this.config;

			// fetchFunction is one-shot on mount; ignore later prop changes.
			const fetchFunction = cfg.getFetchFunction();
			if (fetchFunction) {
				if (this.#fetchInitialized) return;
				this.#fetchInitialized = true;
				this.preloading = true;
				fetchFunction().then((response: NotifyModel<ComboBoxItem[]>) => {
					this.convertOptions(response.object ?? []);
					this.preloadValues();
					this.preloading = false;
				});
				return;
			}

			// Reference guard: skip rebuilds when the parent re-rendered the same arrays.
			const options = cfg.getOptions();
			const grouped = cfg.getGroupedOptions();
			if (options === this.#lastOptionsRef && grouped === this.#lastGroupedRef) return;
			this.#lastOptionsRef = options;
			this.#lastGroupedRef = grouped;

			if (grouped.length) {
				this.convertGroupOptions(grouped);
			} else if (options.length) {
				this.convertOptions(options);
			} else {
				this.allGroups = [];
				this.filteredGroups = [];
			}

			this.preloadValues();
			cfg.onOptionsChanged?.();
		});

		$effect(() => () => clearTimeout(this.#timeout));
	}

	/** Whether an option should render as selected for the current value(s). */
	protected abstract isSelected(item: ComboBoxItem): boolean;

	/** Resolve rawValue(s) for the current value(s). Returns true if it changed the value(s). */
	abstract preloadValues(): boolean;

	convertOptions(options: ComboBoxItem[]) {
		const items = options.map((option) => ({ ...option, selected: this.isSelected(option) }));
		this.allGroups = [{ label: '', items: [...items] }];
		this.filteredGroups = [{ label: '', items: [...items] }];
	}

	convertGroupOptions(groups: ComboBoxGroup[]) {
		this.allGroups = groups.map((group) => ({
			...group,
			items: group.items.map((option) => ({
				...option,
				selected: this.isSelected(option),
				groupName: group.label
			}))
		}));
		this.filteredGroups = [...this.allGroups];
	}

	/** Debounced remote search via searchFunction. */
	search(filterValue: string, onComplete?: () => void) {
		clearTimeout(this.#timeout);
		this.searching = true;
		this.#timeout = setTimeout(() => {
			this.config.getSearchFunction()!(filterValue).then(
				(response: NotifyModel<ComboBoxItem[]>) => {
					this.convertOptions(response.object ?? []);
					this.searching = false;
					onComplete?.();
				}
			);
		}, 300);
	}

	/** Case-insensitive local filter over already-loaded options. */
	filterLocal(filterValue: string) {
		if (filterValue.length === 0) {
			this.filteredGroups = this.allGroups;
			return;
		}
		const needle = filterValue.toLowerCase();
		this.filteredGroups = this.allGroups
			.map((group) => ({
				...group,
				items: group.items.filter((item) => item.label.toLowerCase().includes(needle))
			}))
			.filter((group) => group.items.length > 0);
	}
}

/** Single-value data core (Select, Autocomplete). */
export class ComboBoxCore extends ComboBoxDataCore<ComboBoxCoreConfig> {
	protected isSelected(item: ComboBoxItem): boolean {
		return item.value === this.config.getValue();
	}

	preloadValues(): boolean {
		const cfg = this.config;
		const value = cfg.getValue();

		if (!value) {
			cfg.setRawValue(undefined);
			return false;
		}

		const found = findItemByValue(this.allGroups, value);
		if (found !== undefined) {
			cfg.setRawValue(found);
			return false;
		}

		const retrieveLabelFunction = cfg.getRetrieveLabelFunction();
		if (cfg.getSearchFunction() && retrieveLabelFunction) {
			// Show the loader while resolving; discard if the value changes first.
			cfg.setRawValue(undefined);
			this.preloading = true;
			const valueAtCall = value;
			retrieveLabelFunction(value).then((response) => {
				if (valueAtCall !== cfg.getValue()) return;
				const raw: ComboBoxItem = {
					label: response.object ?? String(valueAtCall),
					value: valueAtCall
				};
				cfg.setRawValue(raw);
				this.preloading = false;
				cfg.onRawValueResolved?.(raw);
			});
			return false;
		}

		if (cfg.getFetchFunction()) {
			// Async source may still resolve this value — keep it with a fallback label.
			cfg.setRawValue({ label: String(value), value });
			return false;
		}

		if (cfg.clearUnknownStatic) {
			cfg.setValue(undefined);
			cfg.setRawValue(undefined);
			cfg.onValueCleared?.();
			return true;
		}

		// Freeform (Autocomplete): leave the typed value in place.
		return false;
	}
}

/** Multi-value data core (SelectMulti, AutocompleteMulti). */
export class ComboBoxMultiCore extends ComboBoxDataCore<ComboBoxMultiCoreConfig> {
	protected isSelected(item: ComboBoxItem): boolean {
		return this.config.getValues().includes(item.value);
	}

	preloadValues(): boolean {
		const cfg = this.config;
		const values = cfg.getValues() ?? [];
		const items = flattenItems(this.allGroups);

		for (const option of items) option.selected = false;

		if (values.length === 0) {
			cfg.setRawValues([]);
			return false;
		}

		const newRawValues: ComboBoxItem[] = [];
		const validValues: string[] = [];
		const promises: Promise<unknown>[] = [];
		let droppedAny = false;

		const searchFunction = cfg.getSearchFunction();
		const retrieveLabelFunction = cfg.getRetrieveLabelFunction();
		const fetchFunction = cfg.getFetchFunction();

		for (const value of values) {
			const found = items.find((x) => x.value === value);
			if (found !== undefined) {
				found.selected = true;
				newRawValues.push({ ...found });
				validValues.push(value);
				continue;
			}

			const provided = cfg.initialRawValues?.find((x) => x.value === value);
			if (provided !== undefined) {
				// Caller vouched for this item up front — keep its label, skip async resolution
				newRawValues.push({ ...provided, selected: true });
				validValues.push(value);
				continue;
			}

			if (searchFunction && retrieveLabelFunction) {
				// Capture value to discard stale responses if the selection changes mid-request
				const valueAtCall = value;
				const placeholder: ComboBoxItem = { label: String(value), value, selected: true };
				promises.push(
					retrieveLabelFunction(value).then((response) => {
						if (!cfg.getValues().includes(valueAtCall)) return;
						placeholder.label = response.object ?? String(valueAtCall);
					})
				);
				newRawValues.push(placeholder);
				validValues.push(value);
				continue;
			}

			if (fetchFunction) {
				// Async data source may still resolve this value — preserve with fallback label
				newRawValues.push({ label: String(value), value, selected: true });
				validValues.push(value);
				continue;
			}

			if (cfg.clearUnknownStatic) {
				// Static options + unknown value: drop so form submits don't carry stale keys
				droppedAny = true;
			} else {
				// Freeform (AutocompleteMulti): keep the value as its own chip
				newRawValues.push({ label: String(value), value, selected: true });
				validValues.push(value);
			}
		}

		cfg.setRawValues(newRawValues);

		if (promises.length > 0) {
			this.preloading = true;
			Promise.all(promises).then(() => {
				cfg.setRawValues([...newRawValues]);
				this.preloading = false;
				cfg.onRawValuesResolved?.(newRawValues);
			});
		}

		if (droppedAny) {
			cfg.setValues(validValues);
			cfg.onValuesCleared?.();
			return true;
		}

		return false;
	}
}
