import DataLoader from 'dataloader';
import { DataLoaderContext } from './data-loader-context';

export interface DataLoaderHookOptions<T> {
  beforeLoad: () => T | Promise<T>;
  afterLoad?: (value: T) => void | Promise<void>;
}

export interface DataLoaderOptions {
  hooks?: DataLoaderHookOptions<unknown>;
}

export abstract class BaseDataLoader<Entity, ID, Result> {
  private static ID_COUNT = 0;
  private readonly id = BaseDataLoader.ID_COUNT++;

  protected constructor(private readonly options: DataLoaderOptions = {}) {}

  protected abstract loadByIds: (ids: ID[]) => Promise<Result>;

  protected abstract load(ids: ReadonlyArray<ID>): Promise<(Entity | Error)[]>;

  private createDataLoader(): DataLoader<ID, Entity> {
    return new DataLoader<ID, Entity>(async (ids: ReadonlyArray<ID>) => {
      const beforeHookResult = await this.options.hooks?.beforeLoad?.();
      const results = await this.load(ids);
      await this.options.hooks?.afterLoad?.(beforeHookResult);
      return results;
    });
  }

  getDataLoader(context: DataLoaderContext): DataLoader<ID, Entity> {
    context.dataLoaders = context.dataLoaders ?? {};
    context.dataLoaders[this.id] = context.dataLoaders[this.id] ?? this.createDataLoader();
    return context.dataLoaders[this.id];
  }
}
