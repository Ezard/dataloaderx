import { ArrayDataLoader } from './array-data-loader';

interface Entity {
  id: number;
  userId: number;
}

describe('ArrayDataLoader', () => {
  let arrayDataLoader: ArrayDataLoader<Entity, number>;
  const entities: Entity[] = [
    {
      id: 0,
      userId: 1,
    },
    {
      id: 1,
      userId: 2,
    },
    {
      id: 2,
      userId: 1,
    },
    {
      id: 3,
      userId: 2,
    },
    {
      id: 4,
      userId: 1,
    },
  ];

  beforeEach(() => {
    arrayDataLoader = new ArrayDataLoader<Entity, number>(
      async () => entities,
      result => result.userId,
    );
  });

  it('should return the relevant entities if they were loaded', async () => {
    const userId = 1;

    const entities = await arrayDataLoader.getDataLoader({}).load(userId);
    const ids = entities.map(entity => entity.userId);

    for (let id of ids) {
      expect(id).toEqual(userId);
    }
  });

  it('should return an empty array if no relevant entities were loaded', async () => {
    const userId = 3;

    const entities = await arrayDataLoader.getDataLoader({}).load(userId);

    expect(entities.length).toEqual(0);
  });
});
