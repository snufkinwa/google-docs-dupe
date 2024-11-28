import { writable } from 'svelte/store';

// Shared store for document content
export const docContent = writable<string>('');
