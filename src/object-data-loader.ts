import { BaseDataLoader, DataLoaderOptions } from './base-data-loader';

export class ObjectDataLoader<ID, Entity, HookResult = unknown> extends BaseDataLoader<
  ID,
  Entity | null,
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

  protected async load(ids: ID[]): Promise<(Entity | null)[]> {
    const results = await this.loadByIds(ids);
    return ids.map(id => results.find(result => this.getId(result) === id) ?? null);
  }
}
