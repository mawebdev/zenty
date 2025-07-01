export type EntityStoreOptions<T> = {
  initialState: T | null;
  deepMerge?: boolean;
};

export type EntitiesStoreOptions<T extends { id: string | number }> = {
  initialState?: T[];
  create?: (item: T, state: { entities: T[] }) => T[];
  createMany?: (items: T[], state: { entities: T[] }) => T[];
  update?: (uid: string | number, item: Partial<T>, state: { entities: T[] }) => T[];
  updateMany?: (items: Partial<T>[], state: { entities: T[] }) => T[];
  delete?: (uid: string | number, state: { entities: T[] }) => T[];
  deleteMany?: (uids: (string | number)[], state: { entities: T[] }) => T[];
  clear?: (state: { entities: T[] }) => T[];
};
