import { ArrayDataLoader } from './array-data-loader';

interface Entity {
  id: number;
  userId: number;
}

describe('ArrayDataLoader', () => {
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

  it('should return the relevant entities if they were loaded', async () => {
    const arrayDataLoader = new ArrayDataLoader<number, Entity>(
      async () => entities,
      result => result.userId,
    );
    const userId = 1;

    const results = await arrayDataLoader.getDataLoader({}).load(userId);
    const ids = results.map(result => result.userId);

    for (const id of ids) {
      expect(id).toEqual(userId);
    }
  });

  it('should return an empty array if no relevant entities were loaded', async () => {
    const arrayDataLoader = new ArrayDataLoader<number, Entity>(
      async () => entities,
      result => result.userId,
    );
    const userId = 3;

    const results = await arrayDataLoader.getDataLoader({}).load(userId);

    expect(results.length).toEqual(0);
  });

  it('should handle entities being returned in a different order to that in which the IDs were supplied', async () => {
    const arrayDataLoader = new ArrayDataLoader(
      async () => [
        { id: 3, userId: 2 },
        { id: 2, userId: 1 },
        { id: 1, userId: 2 },
      ],
      result => result.userId,
    );
    const dataLoader = arrayDataLoader.getDataLoader({});
    const [a, b] = await Promise.all([dataLoader.load(1), dataLoader.load(2)]);

    const aUserIds = a.map(item => item.userId);
    const bUserIds = b.map(item => item.userId);
    expect(aUserIds).toEqual([1]);
    expect(bUserIds).toEqual([2, 2]);
  });
});
