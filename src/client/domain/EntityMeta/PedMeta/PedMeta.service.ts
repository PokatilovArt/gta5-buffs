import * as alt from 'alt-client';
import { IEntityMetaService } from '../IEntityMeta.service';

export interface PedMetaService extends IEntityMetaService<alt.Ped> {}

export const PedMetaService: unique symbol = Symbol('PedMetaService');
