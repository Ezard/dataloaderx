import { DataLoaderContext } from './data-loader-context';
import { ObjectDataLoader } from './object-data-loader';

interface Entity {
  id: number;
}

describe('BaseDataLoader', () => {
  it('should assign each instance a unique ID on creation', () => {
    const objectDataLoader1 = new ObjectDataLoader(
      async () => [],
      () => undefined,
    );
    const objectDataLoader2 = new ObjectDataLoader(
      async () => [],
      () => undefined,
    );
    const objectDataLoader3 = new ObjectDataLoader(
      async () => [],
      () => undefined,
    );
    const context: DataLoaderContext = {};

    const dataLoader1 = objectDataLoader1.getDataLoader(context);
    const dataLoader2 = objectDataLoader2.getDataLoader(context);
    const dataLoader3 = objectDataLoader3.getDataLoader(context);

    expect(context.dataLoaders?.['0']).toBe(dataLoader1);
    expect(context.dataLoaders?.['1']).toBe(dataLoader2);
    expect(context.dataLoaders?.['2']).toBe(dataLoader3);
  });
  it('should cache data loaders using the provided context', () => {
    const context: DataLoaderContext = {};
    const objectDataLoader = new ObjectDataLoader<number, Entity>(
      async () => [],
      result => result.id,
    );

    const dataLoader1 = objectDataLoader.getDataLoader(context);
    const dataLoader2 = objectDataLoader.getDataLoader(context);

    expect(dataLoader1).toBe(dataLoader2);
  });

  it('should run the pre-load hook', async () => {
    const beforeLoad = jest.fn();
    const objectDataLoader = new ObjectDataLoader<number, Entity>(
      async () => [],
      result => result.id,
      {
        hooks: {
          beforeLoad,
        },
      },
    );

    await objectDataLoader.getDataLoader({}).load(0);

    expect(beforeLoad).toHaveBeenCalled();
  });

  it('should run the post-load hook', async () => {
    const afterLoad = jest.fn();
    const objectDataLoader = new ObjectDataLoader<number, Entity>(
      async () => [],
      result => result.id,
      {
        hooks: {
          beforeLoad: () => {
            // unused
          },
          afterLoad,
        },
      },
    );

    await objectDataLoader.getDataLoader({}).load(0);

    expect(afterLoad).toHaveBeenCalled();
  });

  it('should pass the result of the pre-load hook to the post-load hook', async () => {
    const beforeLoadResult = {
      foo: 'bar',
    };
    const afterLoad = jest.fn();
    const objectDataLoader = new ObjectDataLoader<number, Entity>(
      async () => [],
      result => result.id,
      {
        hooks: {
          beforeLoad: () => beforeLoadResult,
          afterLoad,
        },
      },
    );

    await objectDataLoader.getDataLoader({}).load(0);

    expect(afterLoad).toHaveBeenCalledWith(beforeLoadResult);
  });

  it('should return a cached entities when using complex IDs', async () => {
    const load = jest.fn().mockReturnValue([]);
    const objectDataLoader = new ObjectDataLoader<{ foo: number }, Entity>(load, result => ({ foo: result.id }));
    const dataLoader = objectDataLoader.getDataLoader({});

    await dataLoader.load({ foo: 123 });
    await dataLoader.load({ foo: 123 });

    expect(load).toHaveBeenCalledTimes(1);
  });
});
