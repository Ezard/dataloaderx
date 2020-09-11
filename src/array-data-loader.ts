import { BaseDataLoader, DataLoaderOptions } from './base-data-loader';

export class ArrayDataLoader<Entity, ID> extends BaseDataLoader<Entity[], ID, Entity[]> {
  constructor(
    protected loadByIds: (ids: ID[]) => Promise<Entity[]>,
    protected getId: (result: Entity) => ID,
    options?: DataLoaderOptions,
  ) {
    super(options);
  }

  protected async load(ids: ID[]): Promise<Entity[][]> {
    const results = await this.loadByIds(ids);
    return ids.map(id => results.filter(result => this.getId(result) === id));
  }
}
