import { create as zustandCreate, StoreApi, UseBoundStore } from 'zustand';
import { EntitiesStoreOptions } from './types/store.types';

export function createEntitiesStore<T extends { id: string | number }>(
  options: Partial<EntitiesStoreOptions<T>> = {}
): UseBoundStore<
  StoreApi<{
    entities: T[];
    loaded: boolean;
    loading: boolean;
    error: string | null;
    create: (item: T) => void;
    createMany: (items: T[]) => void;
    update: (uid: string | number, item: Partial<T>) => void;
    updateMany: (items: Partial<T>[]) => void;
    delete: (uid: string | number) => void;
    deleteMany: (uids: (string | number)[]) => void;
    clear: () => void;
    find: (uid: string | number) => T | undefined;
    has: (uid: string | number) => boolean;
    replaceAll: (items: T[]) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
  }>
> {
  return zustandCreate((set, get) => ({
    entities: options.initialState ?? [],
    loaded: false,
    loading: false,
    error: null,

    setError: (error) => set({ error }),
    setLoading: (loading) => set({ loading }),

    create: (item) =>
      set((state) => {
        if (options.create) {
          return { entities: options.create(item, state), loaded: true, error: null };
        }
        const exists = state.entities.some((e) => e.id === item.id);
        if (exists) {
          return { ...state, error: `Item with id ${item.id} already exists.` };
        }
        return { entities: [...state.entities, item], loaded: true, error: null };
      }),

    createMany: (items) =>
      set((state) => {
        if (options.createMany) {
          return { entities: options.createMany(items, state), loaded: true, error: null };
        }
        return {
          entities: [...state.entities, ...items],
          loaded: true,
          error: null,
        };
      }),

    update: (uid, patch) =>
      set((state) => {
        if (options.update) {
          return { entities: options.update(uid, patch, state), error: null };
        }
        const newEntities = state.entities.map((e) =>
          e.id === uid ? { ...e, ...patch } : e
        );
        return { entities: newEntities, error: null };
      }),

    updateMany: (items) =>
      set((state) => {
        if (options.updateMany) {
          return { entities: options.updateMany(items, state), error: null };
        }
        const newEntities = state.entities.map((e) => {
          const p = items.find((i) => i.id === e.id);
          return p ? { ...e, ...p } : e;
        });
        return { entities: newEntities, error: null };
      }),

    delete: (uid) =>
      set((state) => {
        if (options.delete) {
          return { entities: options.delete(uid, state), error: null };
        }
        return { entities: state.entities.filter((e) => e.id !== uid), error: null };
      }),

    deleteMany: (uids) =>
      set((state) => {
        if (options.deleteMany) {
          return { entities: options.deleteMany(uids, state), error: null };
        }
        return { entities: state.entities.filter((e) => !uids.includes(e.id)), error: null };
      }),

    clear: () =>
      set(() => ({
        entities: [],
        loaded: false,
        error: null,
      })),

    find: (uid) => get().entities.find((e) => e.id === uid),

    has: (uid) => get().entities.some((e) => e.id === uid),

    replaceAll: (items) =>
      set(() => ({
        entities: items,
        loaded: true,
        error: null,
      })),
  }));
}