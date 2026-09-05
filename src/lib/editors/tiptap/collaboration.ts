import type { XmlFragment } from 'yjs';

/** User identity shown on remote collaboration cursors. */
export interface CollaborationUser {
	/** Display name shown on the cursor label */
	name: string;
	/** 6-digit hex color for the cursor and selection highlight (e.g. `'#f59e0b'`). Must be hex format — HSL, RGB, and named colors are not supported. */
	color: `#${string}`;
}

/**
 * Configuration for real-time collaborative editing.
 *
 * **Required peer dependencies** (install in your app):
 * - `yjs` — CRDT document model
 * - A Yjs network provider such as `y-websocket`, `y-webrtc`, or `@hocuspocus/provider`
 *
 * **Usage:**
 * ```ts
 * import * as Y from 'yjs';
 * import { WebsocketProvider } from 'y-websocket';
 *
 * const ydoc = new Y.Doc();
 * const provider = new WebsocketProvider('wss://your-server.com', 'room-id', ydoc);
 *
 * const collaboration = {
 *   fragment: ydoc.getXmlFragment('content'),
 *   provider,
 *   user: { name: 'Alice', color: '#f59e0b' }
 * };
 * ```
 *
 * **Notes:**
 * - When collaboration is enabled, the `value` prop is ignored — Yjs is the source of truth.
 * - The built-in undo/redo is replaced by Yjs collaborative history.
 * - Your app is responsible for managing the provider lifecycle (connect/disconnect).
 */
export interface CollaborationConfig {
	/**
	 * A Yjs XML fragment to sync editor content.
	 *
	 * Create with `ydoc.getXmlFragment('content')`. All clients sharing
	 * the same Y.Doc and fragment name will see each other's edits.
	 */
	fragment: XmlFragment;
	/**
	 * A Yjs provider instance that handles network transport.
	 *
	 * Common choices:
	 * - `WebsocketProvider` from `y-websocket` (requires a WebSocket server)
	 * - `WebrtcProvider` from `y-webrtc` (peer-to-peer, no server)
	 * - `HocuspocusProvider` from `@hocuspocus/provider` (TipTap's managed solution)
	 */
	provider: any;
	/** Current user info displayed on remote cursors */
	user: CollaborationUser;
}
