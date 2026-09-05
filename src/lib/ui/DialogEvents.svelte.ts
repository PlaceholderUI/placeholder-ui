import { getContext } from 'svelte';

export interface DialogContext {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onFirstOpen: () => void;
}

export function useDialog() {
	const context = getContext<DialogContext>('dialog');
	return context;
}

export function useDialogEvents(callbacks: {
	onOpen?: () => void;
	onClose?: () => void;
	onFirstOpen?: () => void;
}) {
	const context = useDialog();
	
	// If not in a dialog context, callbacks won't be registered
	if (!context) {
		return null;
	}
	
	if (callbacks.onOpen) {
		context.onOpen = callbacks.onOpen;
	}
	
	if (callbacks.onClose) {
		context.onClose = callbacks.onClose;
	}
	
	if (callbacks.onFirstOpen) {
		context.onFirstOpen = callbacks.onFirstOpen;
	}
	
	return context;
}