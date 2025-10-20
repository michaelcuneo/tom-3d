import { writable } from 'svelte/store';

export const selectedProject = writable<Project | null>(null);
