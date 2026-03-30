import * as alt from 'alt-client';
import { IEntityMetaService } from '../IEntityMeta.service';

export interface VehicleMetaService extends IEntityMetaService<alt.Vehicle> {}

export const VehicleMetaService: unique symbol = Symbol('VehicleMetaService');
