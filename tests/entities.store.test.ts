import { createEntitiesStore } from "../src";

type Product = { id: number; name: string };

describe('createEntitiesStore', () => {
  it('should initialize with empty list', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    expect(store.getState().entities).toEqual([]);
    expect(store.getState().loaded).toBe(false);
    expect(store.getState().loading).toBe(false);
    expect(store.getState().error).toBeNull();
  });

  it('should add a new product', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    store.getState().add({ id: 1, name: 'Laptop' });
    expect(store.getState().entities).toHaveLength(1);
    expect(store.getState().loaded).toBe(true);
  });

  it('should add multiple products', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    store.getState().addMany([{ id: 1, name: 'Laptop' }, { id: 2, name: 'Phone' }]);
    expect(store.getState().entities).toHaveLength(2);
    expect(store.getState().loaded).toBe(true);
  });

  it('should not add a duplicate product', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    const product = { id: 1, name: 'Laptop' };
    store.getState().add(product);
    store.getState().add(product);
    expect(store.getState().entities).toHaveLength(1);
    expect(store.getState().error).toMatch(/already exists/);
  });

  it('should update a product', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    store.getState().update(1, { name: 'Tablet' });
    expect(store.getState().entities[0].name).toBe('Tablet');
  });

  it('should update multiple products', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }, { id: 2, name: 'Phone' }] });
    store.getState().updateMany([{ id: 1, name: 'Tablet' }, { id: 2, name: 'Smartphone' }]);
    expect(store.getState().entities[0].name).toBe('Tablet');
    expect(store.getState().entities[1].name).toBe('Smartphone');
  });

  it('should delete a product', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    store.getState().delete(1);
    expect(store.getState().entities).toHaveLength(0);
    expect(store.getState().loaded).toBe(false);
  });

  it('should delete multiple products', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }, { id: 2, name: 'Phone' }] });
    store.getState().deleteMany([1, 2]);
    expect(store.getState().entities).toHaveLength(0);
    expect(store.getState().loaded).toBe(false);
  });

  it('should clear all products', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    store.getState().clear();
    expect(store.getState().entities).toEqual([]);
    expect(store.getState().loaded).toBe(false);
  });

  it('should find a product by id', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    const found = store.getState().find(1);
    expect(found).toBeDefined();
    expect(found?.name).toBe('Laptop');
  });

  it('should return undefined if product not found', () => {
    const store = createEntitiesStore<Product>({ initialState: [] });
    const found = store.getState().find(99);
    expect(found).toBeUndefined();
  });

  it('should check if product exists by id', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    expect(store.getState().has(1)).toBe(true);
    expect(store.getState().has(2)).toBe(false);
  });

  it('should replace all entities', () => {
    const store = createEntitiesStore<Product>({ initialState: [{ id: 1, name: 'Laptop' }] });
    store.getState().replaceAll([{ id: 2, name: 'Phone' }]);
    expect(store.getState().entities).toEqual([{ id: 2, name: 'Phone' }]);
  });

  it('should set and clear error manually', () => {
    const store = createEntitiesStore<Product>();
    store.getState().setError('Something went wrong');
    expect(store.getState().error).toBe('Something went wrong');
    store.getState().setError(null);
    expect(store.getState().error).toBeNull();
  });

  it('should set loading state manually', () => {
    const store = createEntitiesStore<Product>();
    store.getState().setLoading(true);
    expect(store.getState().loading).toBe(true);
    store.getState().setLoading(false);
    expect(store.getState().loading).toBe(false);
  });
});
