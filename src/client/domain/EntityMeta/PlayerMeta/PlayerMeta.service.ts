import * as alt from 'alt-client';
import { IEntityMetaService } from '../IEntityMeta.service';

export interface PlayerMetaService extends IEntityMetaService<alt.Player> {}

export const PlayerMetaService: unique symbol = Symbol('PlayerMetaService');
