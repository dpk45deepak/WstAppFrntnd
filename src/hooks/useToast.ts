// Re-export the context-based toast hooks and types so the entire app shares one toast store
export { useToast, useToaster } from '../context/ToastContext';
export type { Toast as ToastItem, ToastType, ToastPosition } from '../context/ToastContext';