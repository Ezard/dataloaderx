import { BaseDataLoader, DataLoaderOptions } from './base-data-loader';

export class ArrayDataLoader<Entity, ID, HookResult = unknown> extends BaseDataLoader<
  Entity[],
  ID,
  Entity[],
  HookResult
> {
  constructor(
    protected loadByIds: (ids: ID[]) => Promise<Entity[]>,
    protected getId: (result: Entity) => ID,
    options?: DataLoaderOptions<HookResult>,
  ) {
    super(options);
  }

  protected async load(ids: ID[]): Promise<Entity[][]> {
    const results = await this.loadByIds(ids);
    return ids.map(id => results.filter(result => this.getId(result) === id));
  }
}
