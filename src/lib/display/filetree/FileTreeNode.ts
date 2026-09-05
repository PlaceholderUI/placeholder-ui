export type FileTreeNodeType = 'file' | 'folder';

export interface FileTreeNode {
	/** Unique identifier within the tree */
	id: string;
	/** Display label */
	name: string;
	type: FileTreeNodeType;
	/** Present on folders. Absent (or empty) on files. */
	children?: FileTreeNode[];
	/** Persisted open/closed state for folders */
	expanded?: boolean;
	/** Optional custom icon (raw SVG string). Overrides the default file/folder icon. */
	icon?: string;
	/** Arbitrary application data ignored by the component */
	data?: unknown;
}

export interface FileTreeDropTarget {
	/** Parent id — null for tree root */
	parentId: string | null;
	/** Insertion index within parent.children. -1 means append at end (used when dropping INTO an empty folder). */
	index: number;
}

interface Found {
	node: FileTreeNode;
	parent: FileTreeNode[];
	index: number;
}

export function findNode(nodes: FileTreeNode[], id: string): Found | null {
	for (let i = 0; i < nodes.length; i++) {
		const n = nodes[i];
		if (n.id === id) return { node: n, parent: nodes, index: i };
		if (n.children) {
			const found = findNode(n.children, id);
			if (found) return found;
		}
	}
	return null;
}

export function findParent(nodes: FileTreeNode[], id: string): FileTreeNode | null {
	for (const n of nodes) {
		if (n.children?.some((c) => c.id === id)) return n;
		if (n.children) {
			const found = findParent(n.children, id);
			if (found) return found;
		}
	}
	return null;
}

/** Returns the chain of nodes from the root down to (and including) `id`, or null if not found. */
export function findPath(nodes: FileTreeNode[], id: string): FileTreeNode[] | null {
	for (const n of nodes) {
		if (n.id === id) return [n];
		if (n.children) {
			const sub = findPath(n.children, id);
			if (sub) return [n, ...sub];
		}
	}
	return null;
}

/**
 * Expands every ancestor folder of `id` so the node is visible. Mutates the tree in place.
 * Returns true if any folder's expanded state changed.
 */
export function expandTo(nodes: FileTreeNode[], id: string): boolean {
	const path = findPath(nodes, id);
	if (!path) return false;
	let changed = false;
	for (const n of path.slice(0, -1)) {
		if (n.type === 'folder' && !n.expanded) {
			n.expanded = true;
			changed = true;
		}
	}
	return changed;
}

/** True if `ancestorId` is `id` or an ancestor of `id` in the tree. */
export function isAncestor(nodes: FileTreeNode[], ancestorId: string, id: string): boolean {
	const found = findNode(nodes, ancestorId);
	if (!found) return false;
	const stack: FileTreeNode[] = [found.node];
	while (stack.length) {
		const n = stack.pop()!;
		if (n.id === id) return true;
		if (n.children) stack.push(...n.children);
	}
	return false;
}

/**
 * Moves the node identified by `sourceId` to `target`.
 * Returns a new tree array; the input is not mutated.
 * Returns the original tree unchanged if the move is illegal
 * (source missing, target inside source's subtree, etc.).
 */
export function moveNode(
	tree: FileTreeNode[],
	sourceId: string,
	target: FileTreeDropTarget
): FileTreeNode[] {
	if (target.parentId && isAncestor(tree, sourceId, target.parentId)) {
		return tree;
	}

	const clone = cloneTree(tree);
	const found = findNode(clone, sourceId);
	if (!found) return tree;

	const [removed] = found.parent.splice(found.index, 1);

	let destChildren: FileTreeNode[];
	if (target.parentId === null) {
		destChildren = clone;
	} else {
		const destParent = findNode(clone, target.parentId);
		if (!destParent || destParent.node.type !== 'folder') {
			// roll back
			found.parent.splice(found.index, 0, removed);
			return tree;
		}
		if (!destParent.node.children) destParent.node.children = [];
		destChildren = destParent.node.children;
	}

	// Adjust index if removing from same parent shifted positions
	let insertAt = target.index;
	if (target.index === -1) insertAt = destChildren.length;
	else if (found.parent === destChildren && found.index < target.index) insertAt--;

	destChildren.splice(insertAt, 0, removed);
	return clone;
}

function cloneTree(nodes: FileTreeNode[]): FileTreeNode[] {
	return nodes.map((n) => ({
		...n,
		children: n.children ? cloneTree(n.children) : n.children
	}));
}
