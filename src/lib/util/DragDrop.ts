/**
 * Low-level drag/drop primitives for the UI library.
 *
 * Two Svelte actions — `draggable` and `droppable` — communicate via a shared
 * in-memory drag context. The HTML5 DnD API's dataTransfer is intentionally NOT
 * used to carry rich payloads (it stringifies and is unreadable during dragover),
 * so the context lives in module scope and any droppable can inspect it.
 */

export interface DragContext<T = unknown> {
	/** Identifier of the source widget — e.g. the Sortable instance id */
	source: string;
	/** Application payload (item, index, ids, etc.) */
	payload: T;
	/** Logical type used by droppables to filter what they accept */
	type: string;
}

let activeDrag: DragContext | null = null;

export function getActiveDrag(): DragContext | null {
	return activeDrag;
}

export interface DraggableOptions<T = unknown> {
	/** Application payload to carry */
	payload: T;
	/** Logical type — droppables filter by this */
	type?: string;
	/** Source widget identifier */
	source?: string;
	/** When true, drag is suppressed */
	disabled?: boolean;
	/** Optional CSS selector — drag only initiates if pointerdown hit this element inside the node */
	handle?: string;
	onDragStart?: (ctx: DragContext<T>, event: DragEvent) => void;
	onDragEnd?: (event: DragEvent) => void;
}

/**
 * The element the browser chose as the drag source: the nearest draggable ancestor
 * of the event target. Drag events bubble, so a draggable's listeners also receive
 * events from drags that started on a nested draggable — those are not ours to
 * claim (that would overwrite the shared drag context) or cancel via preventDefault.
 * Native draggables without the attribute (img, a[href]) resolve to their host node,
 * so dragging those still starts the host item's drag.
 */
function dragSourceOf(e: DragEvent): Element | null {
	const target = e.target as Element | null;
	return target?.closest?.('[draggable="true"]') ?? null;
}

export function draggable<T>(node: HTMLElement, opts: DraggableOptions<T>) {
	let options = opts;
	let handleActive = !options.handle;

	function onPointerDown(e: PointerEvent) {
		if (!options.handle) {
			handleActive = true;
			return;
		}
		const target = e.target as HTMLElement | null;
		handleActive = !!target?.closest(options.handle);
	}

	function onDragStart(e: DragEvent) {
		if (dragSourceOf(e) !== node) return;
		if (options.disabled || !handleActive) {
			e.preventDefault();
			return;
		}
		const ctx: DragContext<T> = {
			source: options.source ?? '',
			payload: options.payload,
			type: options.type ?? 'default'
		};
		activeDrag = ctx as DragContext;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			// Firefox requires data to be set to initiate drag
			try {
				e.dataTransfer.setData('text/plain', '');
			} catch {
				/* ignore */
			}
		}
		node.classList.add('pui-dragging');
		options.onDragStart?.(ctx, e);
	}

	function onDragEnd(e: DragEvent) {
		if (dragSourceOf(e) !== node) return;
		node.classList.remove('pui-dragging');
		options.onDragEnd?.(e);
		activeDrag = null;
	}

	node.setAttribute('draggable', 'true');
	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('dragstart', onDragStart);
	node.addEventListener('dragend', onDragEnd);

	return {
		update(next: DraggableOptions<T>) {
			options = next;
			if (!options.handle) handleActive = true;
		},
		destroy() {
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('dragstart', onDragStart);
			node.removeEventListener('dragend', onDragEnd);
		}
	};
}

export interface DroppableOptions<T = unknown> {
	/** Accept only these logical types. Omit to accept any active drag. */
	accepts?: string | string[];
	/** Custom predicate — return false to ignore the active drag */
	canDrop?: (ctx: DragContext<T>) => boolean;
	disabled?: boolean;
	onDragEnter?: (ctx: DragContext<T>, event: DragEvent) => void;
	onDragOver?: (ctx: DragContext<T>, event: DragEvent) => void;
	onDragLeave?: (ctx: DragContext<T>, event: DragEvent) => void;
	onDrop?: (ctx: DragContext<T>, event: DragEvent) => void;
}

export function droppable<T>(node: HTMLElement, opts: DroppableOptions<T>) {
	let options = opts;
	let depth = 0;

	function shouldAccept(): boolean {
		if (!activeDrag || options.disabled) return false;
		if (options.accepts) {
			const list = Array.isArray(options.accepts) ? options.accepts : [options.accepts];
			if (!list.includes(activeDrag.type)) return false;
		}
		if (options.canDrop && !options.canDrop(activeDrag as DragContext<T>)) return false;
		return true;
	}

	function onDragEnter(e: DragEvent) {
		if (!shouldAccept()) return;
		depth++;
		e.preventDefault();
		if (depth === 1) {
			node.classList.add('pui-drop-over');
			options.onDragEnter?.(activeDrag as DragContext<T>, e);
		}
	}

	function onDragOver(e: DragEvent) {
		if (!shouldAccept()) return;
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		options.onDragOver?.(activeDrag as DragContext<T>, e);
	}

	function onDragLeave(e: DragEvent) {
		if (!shouldAccept()) return;
		depth--;
		if (depth <= 0) {
			depth = 0;
			node.classList.remove('pui-drop-over');
			options.onDragLeave?.(activeDrag as DragContext<T>, e);
		}
	}

	function onDrop(e: DragEvent) {
		if (!shouldAccept()) return;
		e.preventDefault();
		e.stopPropagation();
		depth = 0;
		node.classList.remove('pui-drop-over');
		const ctx = activeDrag as DragContext<T>;
		options.onDrop?.(ctx, e);
	}

	node.addEventListener('dragenter', onDragEnter);
	node.addEventListener('dragover', onDragOver);
	node.addEventListener('dragleave', onDragLeave);
	node.addEventListener('drop', onDrop);

	return {
		update(next: DroppableOptions<T>) {
			options = next;
		},
		destroy() {
			node.removeEventListener('dragenter', onDragEnter);
			node.removeEventListener('dragover', onDragOver);
			node.removeEventListener('dragleave', onDragLeave);
			node.removeEventListener('drop', onDrop);
		}
	};
}
