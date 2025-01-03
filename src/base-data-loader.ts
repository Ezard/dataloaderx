import DataLoader from 'dataloader';
import { DataLoaderContext } from './data-loader-context';

export interface DataLoaderHookOptions<T> {
  beforeLoad: () => T | Promise<T>;
  afterLoad?: (value: T) => void | Promise<void>;
}

export interface DataLoaderOptions<T> {
  hooks?: DataLoaderHookOptions<T>;
}

export abstract class BaseDataLoader<ID, Entity, Result, HookResult = unknown> {
  private static ID_COUNT = 0;
  private readonly id: number;

  protected constructor(private readonly options: DataLoaderOptions<HookResult> = {}) {
    this.id = BaseDataLoader.ID_COUNT;
    BaseDataLoader.ID_COUNT++;
  }

  protected abstract loadByIds: (ids: ID[]) => Promise<Result>;

  protected abstract load(ids: ReadonlyArray<ID>): Promise<(Entity | Error)[]>;

  private createDataLoader(): DataLoader<ID, Entity> {
    return new DataLoader<ID, Entity, string>(
      async (ids: ReadonlyArray<ID>) => {
        let results: (Entity | Error)[];
        if (this.options.hooks) {
          const beforeHookResult = await this.options.hooks.beforeLoad();
          results = await this.load(ids);
          await this.options.hooks.afterLoad?.(beforeHookResult);
        } else {
          results = await this.load(ids);
        }
        return results;
      },
      {
        cacheKeyFn: key => JSON.stringify(key),
      },
    );
  }

  getDataLoader(context: DataLoaderContext): DataLoader<ID, Entity> {
    context.dataLoaders = context.dataLoaders ?? {};
    context.dataLoaders[this.id] = context.dataLoaders[this.id] ?? this.createDataLoader();
    return context.dataLoaders[this.id];
  }
}
