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
});
