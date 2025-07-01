import { create as zustandCreate, StoreApi, UseBoundStore } from 'zustand';
import { EntitiesStoreOptions } from './types/store.types';

export function createEntitiesStore<T extends { id: string | number }>(
  options: Partial<EntitiesStoreOptions<T>> = {}
): UseBoundStore<
  StoreApi<{
    entities: T[];
    loaded: boolean;
    create: (item: T) => void;
    update: (uid: string | number, item: Partial<T>) => void;
    delete: (uid: string | number) => void;
    clear: () => void;
  }>
> {
  return zustandCreate((set) => ({
    entities: options.initialState || [],
    loaded: false,

    create: (item: T) =>
      set((state) => {
        if (options.create) {
          return {
            entities: options.create(item, state),
            loaded: true,
          };
        }

        const exists = state.entities.some((entity) => entity.id === item.id);
        if (exists) {
          return state;
        }

        return {
          entities: [...state.entities, item],
          loaded: true,
        };
      }),

    update: (uid: string | number, item: Partial<T>) =>
      set((state) => {
        if (options.update) {
          return {
            entities: options.update(uid, item, state),
            loaded: true,
          };
        }

        const updatedEntities = state.entities.map((entity) =>
          entity.id === uid ? { ...entity, ...item } : entity
        );

        return {
          entities: updatedEntities,
          loaded: true,
        };
      }),

    delete: (uid: string | number) =>
      set((state) => {
        if (options.delete) {
          return {
            entities: options.delete(uid, state),
            loaded: true,
          };
        }

        const filtered = state.entities.filter((entity) => entity.id !== uid);
        return {
          entities: filtered,
          loaded: filtered.length > 0,
        };
      }),

    clear: () =>
      set((state) => ({
        entities: options.clear ? options.clear(state) : [],
        loaded: false,
      })),
  }));
}
