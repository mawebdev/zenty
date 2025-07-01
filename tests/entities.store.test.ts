import {createEntitiesStore} from "../src";

type Product = { id: number; name: string };

describe('createEntitiesStore', () => {
  it('should initialize with empty list', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    expect(store.getState().entities).toEqual([]);
    expect(store.getState().loaded).toBe(false);
  });

  it('should add a new product', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    store.getState().create({ id: 1, name: 'Laptop' });
    expect(store.getState().entities).toHaveLength(1);
    expect(store.getState().loaded).toBe(true);
  });

  it('should not add a duplicate product', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    const product = { id: 1, name: 'Laptop' };
    store.getState().create(product);
    store.getState().create(product);
    expect(store.getState().entities).toHaveLength(1);
  });

  it('should update a product', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    store.getState().update(1, { name: 'Tablet' });
    expect(store.getState().entities[0].name).toBe('Tablet');
  });

  it('should delete a product', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    store.getState().delete(1);
    expect(store.getState().entities).toHaveLength(0);
    expect(store.getState().loaded).toBe(false);
  });

  it('should clear all products', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    store.getState().clear();
    expect(store.getState().entities).toEqual([]);
    expect(store.getState().loaded).toBe(false);
  });
});
