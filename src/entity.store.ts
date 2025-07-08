import { create as zustandCreate, StoreApi, UseBoundStore } from 'zustand';
import { deepMerge } from './helpers/deep-merge.helper';

/** Base options (you normally always have to pass `idKey`) */
export interface EntityStoreOptions<
    T,
    K extends keyof T
> {
    /** The field on T which holds its unique identifier */
    idKey: K;
    initialState: T | null;
    deepMerge?: boolean;
}

/**
 * Overload #1: when T has an `id` property, you can omit `idKey`.
 * `idKey` is effectively defaulted to `"id"`.
 */
export function createEntityStore<
    T extends { id: string | number }
>(
    options: Omit<EntityStoreOptions<T, 'id'>, 'idKey'> & { idKey?: 'id' }
): UseBoundStore<
    StoreApi<{
        entity: T | null;
        loaded: boolean;
        set: (entity: T) => void;
        update: (updated: Partial<T>) => void;
        clear: () => void;
    }>
>;

/**
 * Overload #2: the general case—must explicitly pass `idKey`.
 */
export function createEntityStore<
    T extends Record<K, string | number>,
    K extends keyof T
>(
    options: EntityStoreOptions<T, K>
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
>;

/** Implementation */
export function createEntityStore(options: any) {
    const {
        initialState,
        deepMerge: shouldDeepMerge = false
    } = options;

    return zustandCreate((set) => ({
        entity: initialState,
        loaded: initialState !== null,
        loading: false,
        error: null,

        setError: (error: string | null) => set({ error }),
        setLoading: (loading: boolean) => set({ loading }),

        set: (entity: any) => set({ entity, loaded: true }),

        update: (updated: Partial<any>) =>
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
