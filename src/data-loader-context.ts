import DataLoader from 'dataloader';

export interface DataLoaderContext {
  dataLoaders?: { [s: string]: DataLoader<never, never> };
}
