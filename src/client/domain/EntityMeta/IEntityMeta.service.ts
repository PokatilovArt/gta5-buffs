import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';

export interface IEntityMetaService<T extends alt.Entity> {
  applyMeta(entity: T, metaKey: StreamSyncedMetaType, value: unknown): void;
}
