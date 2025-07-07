import { create as zustandCreate, StoreApi, UseBoundStore } from 'zustand';

/**
 * All the customizable callbacks and initial data for the store.
 */
export interface EntitiesStoreOptions<
    T,
    K extends keyof T
> {
    /** Which field on T is the unique identifier? */
    idKey: K;

    /** initial list of entities (defaults to []) */
    initialState?: T[];

    /** optional overrides for each action: receive the args + current state */
    add?: (item: T, state: EntitiesState<T, K>) => T[];
    addMany?: (items: T[], state: EntitiesState<T, K>) => T[];
    update?: (uid: T[K], patch: Partial<T>, state: EntitiesState<T, K>) => T[];
    updateMany?: (patches: (Pick<T, K> & Partial<T>)[], state: EntitiesState<T, K>) => T[];
    delete?: (uid: T[K], state: EntitiesState<T, K>) => T[];
    deleteMany?: (uids: T[K][], state: EntitiesState<T, K>) => T[];
}

/** Internal shape of your store’s state */
type EntitiesState<T, K extends keyof T> = {
    entities: T[];
    loaded: boolean;
    loading: boolean;
    error: string | null;
};

/** Actions your store exposes */
type EntitiesActions<T, K extends keyof T> = {
    add: (item: T) => void;
    addMany: (items: T[]) => void;
    update: (uid: T[K], patch: Partial<T>) => void;
    updateMany: (patches: (Pick<T, K> & Partial<T>)[]) => void;
    delete: (uid: T[K]) => void;
    deleteMany: (uids: T[K][]) => void;
    clear: () => void;
    find: (uid: T[K]) => T | undefined;
    has: (uid: T[K]) => boolean;
    replaceAll: (items: T[]) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
};

/** Overload #1: if T has `id: string|number`, you may omit `idKey` (defaults to "id") */
export function createEntitiesStore<
    T extends { id: string | number }
>(
    options?: Omit<EntitiesStoreOptions<T, 'id'>, 'idKey'> & { idKey?: 'id' }
): UseBoundStore<StoreApi<EntitiesState<T, 'id'> & EntitiesActions<T, 'id'>>>;

/** Overload #2: general case—must pass `idKey`. */
export function createEntitiesStore<
    T extends Record<K, string | number>,
    K extends keyof T
>(
    options: EntitiesStoreOptions<T, K>
): UseBoundStore<StoreApi<EntitiesState<T, K> & EntitiesActions<T, K>>>;

/** Implementation */
export function createEntitiesStore(options: any = {}) {
    // default idKey to "id" if you omitted it
    const {
        idKey = 'id',
        initialState = [],
        add,
        addMany,
        update,
        updateMany,
        delete: del,
        deleteMany,
    } = options as EntitiesStoreOptions<any, any>;

    return zustandCreate<EntitiesState<any, any> & EntitiesActions<any, any>>(
        (set, get) => ({
            // initial state
            entities: initialState,
            loaded: false,
            loading: false,
            error: null,

            setError: (error) => set({ error }),
            setLoading: (loading) => set({ loading }),

            add: (item) =>
                set((state) => ({
                    entities: add
                        ? add(item, state)
                        : state.entities.some((e) => e[idKey] === item[idKey])
                            ? state.entities
                            : [...state.entities, item],
                    loaded: true,
                    error: add
                        ? null
                        : state.entities.some((e) => e[idKey] === item[idKey])
                            ? `Item with ${String(idKey)}=${item[idKey]} already exists.`
                            : null,
                })),

            addMany: (items: any[]) =>
                set((state) => ({
                    entities: addMany
                        ? addMany(items, state)
                        : [...state.entities, ...items],
                    loaded: true,
                    error: null,
                })),

            update: (uid, patch) =>
                set((state) => ({
                    entities: update
                        ? update(uid, patch, state)
                        : state.entities.map((e) =>
                            e[idKey] === uid ? { ...e, ...patch } : e
                        ),
                    error: null,
                })),

            updateMany: (patches: any[]) =>
                set((state) => ({
                    entities: updateMany
                        ? updateMany(patches, state)
                        : state.entities.map((e) => {
                            const p = patches.find((x) => x[idKey] === e[idKey]);
                            return p ? { ...e, ...p } : e;
                        }),
                    error: null,
                })),

            delete: (uid) =>
                set((state) => ({
                    entities: del
                        ? del(uid, state)
                        : state.entities.filter((e) => e[idKey] !== uid),
                    error: null,
                })),

            deleteMany: (uids) =>
                set((state) => ({
                    entities: deleteMany
                        ? deleteMany(uids, state)
                        : state.entities.filter((e) => !uids.includes(e[idKey])),
                    error: null,
                })),

            clear: () =>
                set({
                    entities: [],
                    loaded: false,
                    error: null,
                }),

            find: (uid) => get().entities.find((e) => e[idKey] === uid),

            has: (uid) => get().entities.some((e) => e[idKey] === uid),

            replaceAll: (items: any[]) =>
                set({
                    entities: items,
                    loaded: true,
                    error: null,
                }),
        })
    );
}
