# Zenty Documentation

Zenty is a powerful Zustand-based library that simplifies CRUD operations with elegant state management. It provides two main store creators for different use cases.

For more examples and advanced usage, visit our <a href="https://github.com/zentylib/zenty" target="_blank" rel="noopener noreferrer">GitHub repository</a> or try our <a href="https://zentylib.com" target="_blank" rel="noopener noreferrer">interactive demo</a>.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [createEntitiesStore](#createentitiesstore)
  - [createEntityStore](#createentitystore)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [TypeScript Support](#typescript-support)

## Installation

```bash
npm install zenty zustand
```

```bash
yarn add zenty zustand
```

```bash
pnpm add zenty zustand
```

## Quick Start

### Managing Collections with createEntitiesStore

```typescript
import { createEntitiesStore } from 'zenty';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Create a store for managing products
const useProductStore = createEntitiesStore<Product>();

// Use in your React component
function ProductList() {
  const { 
    entities, 
    loading, 
    error, 
    add, 
    update, 
    delete: deleteProduct 
  } = useProductStore();

  const handleAddProduct = () => {
    add({
      id: crypto.randomUUID(),
      name: 'New Product',
      price: 29.99,
      category: 'Electronics'
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      <button onClick={handleAddProduct}>Add Product</button>
      
      {entities.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: \${product.price}</p>
          <button onClick={() => deleteProduct(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Managing Single Entities with createEntityStore

```typescript
import { createEntityStore } from 'zenty';

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// Create a store for managing a single user
const useUserStore = createEntityStore<User>({
  deepMerge: true // Enable deep merging for nested objects
});

function UserProfile() {
  const { entity: user, loading, set, update } = useUserStore();

  const updateTheme = (theme: 'light' | 'dark') => {
    update({
      preferences: {
        theme
      }
    });
  };

  return (
    <div>
      {user && (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={() => updateTheme('dark')}>
            Switch to Dark Mode
          </button>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### createEntitiesStore

Creates a Zustand store for managing collections of entities with built-in CRUD operations.

#### Signature

```typescript
// For entities with 'id' field
function createEntitiesStore<T extends { id: string | number }>(
  options?: EntitiesStoreOptions<T, 'id'>
): UseBoundStore<StoreApi<EntitiesState<T, 'id'> & EntitiesActions<T, 'id'>>>;

// For entities with custom ID field
function createEntitiesStore<T, K extends keyof T>(
  options: EntitiesStoreOptions<T, K>
): UseBoundStore<StoreApi<EntitiesState<T, K> & EntitiesActions<T, K>>>;
```

#### Options

```typescript
interface EntitiesStoreOptions<T, K extends keyof T> {
  idKey: K;                    // Which field is the unique identifier
  initialState?: T[];          // Initial list of entities (defaults to [])
  
  // Optional custom implementations for each action
  add?: (item: T, state: EntitiesState<T, K>) => T[];
  addMany?: (items: T[], state: EntitiesState<T, K>) => T[];
  update?: (uid: T[K], patch: Partial<T>, state: EntitiesState<T, K>) => T[];
  updateMany?: (patches: (Pick<T, K> & Partial<T>)[], state: EntitiesState<T, K>) => T[];
  delete?: (uid: T[K], state: EntitiesState<T, K>) => T[];
  deleteMany?: (uids: T[K][], state: EntitiesState<T, K>) => T[];
}
```

#### State

```typescript
interface EntitiesState<T, K extends keyof T> {
  entities: T[];           // Array of entities
  loaded: boolean;         // Whether data has been loaded
  loading: boolean;        // Whether an operation is in progress
  error: string | null;    // Error message if any
}
```

#### Actions

```typescript
interface EntitiesActions<T, K extends keyof T> {
  add: (item: T) => void;                                    // Add single entity
  addMany: (items: T[]) => void;                            // Add multiple entities
  update: (uid: T[K], patch: Partial<T>) => void;          // Update single entity
  updateMany: (patches: (Pick<T, K> & Partial<T>)[]) => void; // Update multiple entities
  delete: (uid: T[K]) => void;                              // Delete single entity
  deleteMany: (uids: T[K][]) => void;                       // Delete multiple entities
  clear: () => void;                                        // Clear all entities
  find: (uid: T[K]) => T | undefined;                       // Find entity by ID
  has: (uid: T[K]) => boolean;                              // Check if entity exists
  replaceAll: (items: T[]) => void;                         // Replace all entities
  setError: (error: string | null) => void;                 // Set error state
  setLoading: (loading: boolean) => void;                   // Set loading state
}
```

### createEntityStore

Creates a Zustand store for managing a single entity.

#### Signature

```typescript
function createEntityStore<T>(
  options?: EntityStoreOptions<T>
): UseBoundStore<StoreApi<EntityState<T> & EntityActions<T>>>;
```

#### Options

```typescript
interface EntityStoreOptions<T> {
  initialState?: T | null;  // Initial entity state (defaults to null)
  deepMerge?: boolean;      // Whether updates should deep merge (defaults to false)
}
```

#### State & Actions

```typescript
interface EntityState<T> {
  entity: T | null;         // The entity or null
  loaded: boolean;          // Whether entity has been loaded
  loading: boolean;         // Whether an operation is in progress
  error: string | null;     // Error message if any
}

interface EntityActions<T> {
  set: (entity: T) => void;                    // Set the entire entity
  update: (updated: Partial<T>) => void;       // Update parts of the entity
  clear: () => void;                           // Clear the entity
  setError: (error: string | null) => void;    // Set error state
  setLoading: (loading: boolean) => void;      // Set loading state
}
```

## Examples

### Custom ID Field

```typescript
interface User {
  userId: string;
  name: string;
  email: string;
}

const useUserStore = createEntitiesStore<User, 'userId'>({
  idKey: 'userId',
  initialState: [
    { userId: '1', name: 'John', email: 'john@example.com' }
  ]
});
```

### Custom CRUD Operations

```typescript
const useProductStore = createEntitiesStore<Product>({
  // Custom add logic with validation
  add: (item, state) => {
    if (state.entities.some(p => p.name === item.name)) {
      throw new Error('Product name must be unique');
    }
    return [...state.entities, { ...item, createdAt: new Date() }];
  },
  
  // Custom delete with soft delete
  delete: (id, state) => {
    return state.entities.map(p => 
      p.id === id ? { ...p, deleted: true } : p
    );
  }
});
```

### Deep Merging

```typescript
interface Settings {
  ui: {
    theme: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
}

const useSettingsStore = createEntityStore<Settings>({
  deepMerge: true,
  initialState: {
    ui: { theme: 'light', language: 'en' },
    notifications: { email: true, push: false }
  }
});

// This will only update the theme, keeping language intact
const { update } = useSettingsStore();
update({ ui: { theme: 'dark' } });
```

### Async Operations

```typescript
const useProductStore = createEntitiesStore<Product>();

async function fetchProducts() {
  const { setLoading, setError, replaceAll } = useProductStore.getState();
  
  try {
    setLoading(true);
    const response = await fetch('/api/products');
    const products = await response.json();
    replaceAll(products);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

async function createProduct(product: Omit<Product, 'id'>) {
  const { setLoading, setError, add } = useProductStore.getState();
  
  try {
    setLoading(true);
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    const newProduct = await response.json();
    add(newProduct);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
```

## Best Practices

### 1. Use TypeScript

Always define your entity interfaces for better type safety:

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const useProductStore = createEntitiesStore<Product>();
```

### 2. Handle Loading States

Always handle loading and error states in your components:

```typescript
function ProductList() {
  const { entities, loading, error } = useProductStore();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ProductGrid products={entities} />;
}
```

### 3. Use Custom Operations for Complex Logic

Implement custom CRUD operations for validation and business logic:

```typescript
const useProductStore = createEntitiesStore<Product>({
  add: (item, state) => {
    // Validation
    if (!item.name.trim()) {
      throw new Error('Product name is required');
    }
    
    // Business logic
    const productWithDefaults = {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return [...state.entities, productWithDefaults];
  }
});
```


## TypeScript Support

Zenty is built with TypeScript and provides full type safety:

- **Generic Types**: Both store creators are fully generic
- **Type Inference**: TypeScript will infer types from your entity interfaces
- **Custom ID Fields**: Support for any field as the unique identifier
- **Overloads**: Function overloads for different use cases
- **Strict Typing**: All actions and state are strictly typed

