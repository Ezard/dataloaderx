import DataLoader from 'dataloader';

export interface DataLoaderContext {
  dataLoaders?: { [s: string]: DataLoader<any, any> };
}
