import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';
import { IEntityMetaService } from './IEntityMeta.service';

export interface EntityMetaService extends IEntityMetaService<alt.Entity> {
  applyMetas(entity: alt.Entity, keyChanged?: StreamSyncedMetaType): void;
}

export const EntityMetaService: unique symbol = Symbol('EntityMetaService');
