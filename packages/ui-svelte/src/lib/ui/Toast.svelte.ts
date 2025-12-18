import { toast as sonnerToast } from 'svelte-sonner';

/**
 * Toast wrapper functions that encapsulate svelte-sonner functionality
 * This allows consuming applications to use toast notifications without
 * directly depending on svelte-sonner
 */

/**
 * Display a default toast notification
 * @param message - The message to display
 * @param options - Additional options for the toast
 */
function toastDefault(message: string, options?: any) {
  return sonnerToast.message(message, options);
}

/**
 * Display a success toast notification
 * @param message - The message to display
 * @param options - Additional options for the toast
 */
toastDefault.success = (message: string, options?: any) => {
  return sonnerToast.success(message, options);
};

/**
 * Display an info toast notification
 * @param message - The message to display
 * @param options - Additional options for the toast
 */
toastDefault.info = (message: string, options?: any) => {
  return sonnerToast.info(message, options);
};

/**
 * Display a warning toast notification
 * @param message - The message to display
 * @param options - Additional options for the toast
 */
toastDefault.warning = (message: string, options?: any) => {
  return sonnerToast.warning(message, options);
};

/**
 * Display an error toast notification
 * @param message - The message to display
 * @param options - Additional options for the toast
 */
toastDefault.error = (message: string, options?: any) => {
  return sonnerToast.error(message, options);
};

/**
 * Display a loading toast notification
 * @param message - The message to display
 * @param options - Additional options for the toast
 */
toastDefault.loading = (message: string, options?: any) => {
  return sonnerToast.loading(message, options);
};

/**
 * Display a custom toast notification
 * @param message - The message to display
 * @param options - Additional options for the toast
 */
toastDefault.custom = (message: any, options?: any) => {
  return sonnerToast.custom(message, options);
};

/**
 * Promise-based toast that shows loading, success, or error states
 * @param promise - The promise to track
 * @param options - Options for each state (loading, success, error)
 */
toastDefault.promise = (promise: Promise<any>, options: { loading?: string; success?: string | ((data: any) => string); error?: string | ((error: any) => string) }) => {
  return sonnerToast.promise(promise, options);
};

/**
 * Dismiss a specific toast by ID
 * @param id - The ID of the toast to dismiss
 */
toastDefault.dismiss = (id?: string | number) => {
  return sonnerToast.dismiss(id);
};

export const toast = toastDefault;
