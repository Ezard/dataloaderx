import { BaseDataLoader, DataLoaderOptions } from './base-data-loader';

export class ArrayDataLoader<ID, Entity, HookResult = unknown> extends BaseDataLoader<
  ID,
  Entity[],
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
