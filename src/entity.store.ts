import { create as zustandCreate, StoreApi, UseBoundStore } from 'zustand';
import { deepMerge } from './helpers/deep-merge.helper';

/**
 * A simple store for a single entity of type T.
 * @param initialState - The initial entity state (defaults to null).
 * @param deepMerge - Whether updates should deep merge into the existing entity (defaults to false).
 */
export interface EntityStoreOptions<T> {
    initialState?: T | null;
    deepMerge?: boolean;
}

export function createEntityStore<T>(
    options: EntityStoreOptions<T> = {}
): UseBoundStore<
    StoreApi<{
        entity: T | null;
        loaded: boolean;
        loading: boolean;
        error: string | null;
        set: (entity: T) => void;
        update: (updated: Partial<T>) => void;
        clear: () => void;
        setError: (error: string | null) => void;
        setLoading: (loading: boolean) => void;
    }>
> {
    const { initialState = null, deepMerge: shouldDeepMerge = false } = options;

    return zustandCreate((set) => ({
        entity: initialState,
        loaded: initialState !== null,
        loading: false,
        error: null,

        setError: (error: string | null) => set({ error }),
        setLoading: (loading: boolean) => set({ loading }),

        set: (entity: T) => set({ entity, loaded: true }),

        update: (updated: Partial<T>) =>
            set((state: any) => {
                if (!state.entity) return state;
                const newEntity = shouldDeepMerge
                    ? deepMerge(state.entity, updated)
                    : { ...state.entity, ...updated };
                return { entity: newEntity, loaded: true };
            }),

        clear: () => set({ entity: null, loaded: false }),
    }));
}
