import {createEntityStore} from "../src";

type User = { id: number; name: string; age?: number };

describe('createEntityStore', () => {
  it('should initialize with null', () => {
    const store = createEntityStore<User>({ initialState: null });
    expect(store.getState().entity).toBeNull();
    expect(store.getState().loaded).toBe(false);
  });

  it('should set and get an entity', () => {
    const store = createEntityStore<User>({ initialState: null });
    const user = { id: 1, name: 'Alice' };
    store.getState().set(user);
    expect(store.getState().entity).toEqual(user);
    expect(store.getState().loaded).toBe(true);
  });

  it('should update an existing entity', () => {
    const store = createEntityStore<User>({ initialState: { id: 1, name: 'Alice' } });
    store.getState().update({ name: 'Bob' });
    expect(store.getState().entity?.name).toBe('Bob');
  });

  it('should clear the entity', () => {
    const store = createEntityStore<User>({ initialState: { id: 1, name: 'Alice' } });
    store.getState().clear();
    expect(store.getState().entity).toBeNull();
    expect(store.getState().loaded).toBe(false);
  });
});
