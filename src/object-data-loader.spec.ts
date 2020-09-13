import { ObjectDataLoader } from './object-data-loader';

interface Entity {
  id: number;
}

describe('ObjectDataLoader', () => {
  let objectDataLoader: ObjectDataLoader<Entity, number>;
  const entities: Entity[] = [
    {
      id: 0,
    },
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];

  beforeEach(() => {
    objectDataLoader = new ObjectDataLoader<Entity, number>(
      async () => entities,
      result => result.id,
    );
  });

  it('should return the relevant entity if it was loaded', async () => {
    const id = 1;

    const entity = await objectDataLoader.getDataLoader({}).load(id);

    expect(entity?.id === id);
  });

  it('should return null if the relevant entity was not loaded', async () => {
    const id = 4;

    const entity = await objectDataLoader.getDataLoader({}).load(id);

    expect(entity?.id === null);
  });

  it('should handle entities being returned in a different order to that in which the IDs were supplied', async () => {
    const objectDataLoader = new ObjectDataLoader(
      async () => [{ id: 3 }, { id: 2 }, { id: 1 }],
      result => result.id,
    );
    const dataLoader = objectDataLoader.getDataLoader({});
    const [a, b, c] = await Promise.all([dataLoader.load(1), dataLoader.load(2), dataLoader.load(3)]);

    expect(a?.id).toEqual(1);
    expect(b?.id).toEqual(2);
    expect(c?.id).toEqual(3);
  });
});
