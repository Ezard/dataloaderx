# DataLoaderX

[![npm](https://img.shields.io/npm/v/dataloaderx?logo=npm)](https://www.npmjs.com/package/dataloaderx)

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ezard/dataloaderx/publish.yaml?logo=github)](https://github.com/Ezard/dataloaderx)
[![Codecov](https://img.shields.io/codecov/c/github/ezard/dataloaderx?logo=codecov)](https://codecov.io/gh/Ezard/dataloaderx)
[![Stryker](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2FEzard%2Fdataloaderx%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/Ezard/dataloaderx/master)

DataLoaderX is an expansion upon [DataLoader](https://github.com/graphql/dataloader), designed to abstract some details away, and add common functionality.

This library provides 2 classes to work with: `ObjectDataLoader` and `ArrayDataLoader`.

- `ObjectDataLoader` is for use cases where you wish to load a single entity for each provided ID (e.g. load user by ID)
- `ArrayDataLoader` is for use cases where you wish to load multiple entities for each provided ID (e.g. load all books by author ID)

Both classes require a `context` to be passed to them, which is any object which will persist for the duration of the request that is currently being processed.
This allows dataloader instances to be cached for the duration of the request, [as recommended](https://github.com/graphql/dataloader#caching-per-request) by the base dataloader library.

The ID can be a scalar (e.g. a `string` or `number`), or can be an object or array;
the ID will always be stringified before being used a cache key so, for example, 2 objects that contain the same data will cause a cached entity to be returned (if one exists).

### ObjectDataLoader

```typescript
const idLoader = new ObjectDataLoader(
  async (ids: number[]) => getUsersByIds(ids),
  result => result.id
);

await idLoader.getDataLoader(context).load(1); // returns the user with an ID of 1, or null if not found
```

### ArrayDataLoader

```typescript
const authorIdLoader = new ArrayDataLoader(
  async (ids: number[]) => getBooksByAuthorIds(ids),
  result => result.authorId
);

await authorIdLoader.getDataLoader(context).load(2); // returns an array of all books with an authorId of 2
```

### Hooks

There are 2 hooks available; one runs before the loading occurs, and one runs after the loading has finished.
This allows for implementing functionality such as timing how long the loading takes, implementing tracing, etc.

Additionally, a value can optionally be passed from the before-load hook to the after-load hook.

```typescript
const idLoader = new ObjectDataLoader(
  async (ids: number[]) => getUsersByIds(ids),
  result => result.id,
  {
    hooks: {
      beforeLoad: () => {
        const start = Date.now();
        return start;
      },
      afterLoad: (start: number) => {
        const end = Date.now();
        const time = end - start;
        console.log(`Loading users took ${time}ms`);
      }
    }
  }
);
```
