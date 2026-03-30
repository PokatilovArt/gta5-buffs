import { Injectable } from '@altv-mango/core';
import { VehicleMetaService } from '@client/domain';
import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';
import natives from '@altv/natives';

@Injectable()
export class DefaultVehicleMetaService implements VehicleMetaService {
  constructor() {}

  public applyMeta(vehicle: alt.Vehicle, metaKey: StreamSyncedMetaType, value: unknown): void {
    console.log(`Apply to vehicle metaKey: ${metaKey}, value: ${value}`);
    switch (metaKey) {
      case StreamSyncedMetaType.ElectroMagneticPulse:
        natives.setVehicleEngineOn(vehicle.scriptID, !value, true, !!value);
        break;
    }
  }
}
