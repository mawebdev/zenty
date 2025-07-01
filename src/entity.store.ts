import { create as zustandCreate, StoreApi, UseBoundStore } from 'zustand';
import { deepMerge } from './helpers/deep-merge.helper';
import { EntityStoreOptions } from './types/store.types';

export function createEntityStore<T extends { id: string | number }>(
  options: EntityStoreOptions<T>
): UseBoundStore<
  StoreApi<{
    entity: T | null;
    loaded: boolean;
    set: (entity: T) => void;
    update: (updated: Partial<T>) => void;
    clear: () => void;
  }>
> {
  return zustandCreate((set) => ({
    entity: options.initialState,
    loaded: options.initialState !== null,

    set: (entity: T) => set({ entity, loaded: true }),

    update: (updated: Partial<T>) =>
      set((state) => {
        if (!state.entity) {
          console.error("No entity is currently loaded.");
          return state;
        }

        const newEntity = options.deepMerge
          ? deepMerge(state.entity, updated)
          : { ...state.entity, ...updated };

        return {
          entity: newEntity,
          loaded: true,
        };
      }),

    clear: () => set({ entity: null, loaded: false }),
  }));
}
