# zenty

**Zenty** is a lightweight abstraction layer for [Zustand](https://github.com/pmndrs/zustand), providing reusable and scalable stores for managing single entities and/or entity collections. It supports both shallow and optional deep merging.

---

## 📦 Installation

```bash
npm install zustand zenty
```

---

## ⚙️ Features

- 🧠 Type-safe Zustand stores for entities and collections
- 🔄 Built-in CRUD methods
- 🧼 Optional `deepMerge` for updating nested objects
- ⚡️ Minimal and dependency-free (other than Zustand)

---

## 🚀 Usage

### 🔹 Entity Store (single object)

```ts
import { createEntityStore } from 'zenty';

type User = { id: number; name: string; settings: { theme: string } };

const useUserStore = createEntityStore<User>({
  initialState: null,
  deepMerge: true, // optional: to deeply merge nested objects
});

// Set entire entity
useUserStore.getState().set({ id: 1, name: 'Milaim', settings: { theme: 'dark' } });

// Partial update (deep merge enabled)
useUserStore.getState().update({ settings: { theme: 'light' } });
```

---

### 🔹 Entities Store (collection of objects)

```ts
import { createEntitiesStore } from 'zenty';

type Product = { id: number; name: string };

const useProductsStore = createEntitiesStore<Product>({
  initialState: [],
});

// Add item
useProductsStore.getState().add({ id: 1, name: 'Laptop' });

// Update by ID
useProductsStore.getState().update(1, { name: 'Tablet' });

// Delete by ID
useProductsStore.getState().delete(1);

// Clear all
useProductsStore.getState().clear();
```

---

## Running Tests

```bash
npm install
npm run test
```

---

## License

MIT © [Milaim Ajdari](https://github.com/mawebdev)


## Features

- Simple Zustand store creation for single entities
- Management of entity collections with CRUD operations
- Configurable callbacks for custom behavior
- `deepMerge` helper for merging nested objects
- Strict TypeScript typing and Jest tests
- Support for ESM and CJS outputs
