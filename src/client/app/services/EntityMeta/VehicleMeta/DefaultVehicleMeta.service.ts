import { Inject, Injectable } from '@altv-mango/core';
import { VehicleMetaService, VehicleService } from '@client/domain';
import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';

@Injectable()
export class DefaultVehicleMetaService implements VehicleMetaService {
  constructor(@Inject(VehicleService) private readonly vehicleService: VehicleService) {}

  public applyMeta(
    vehicle: alt.Vehicle,
    metaKey: StreamSyncedMetaType,
    value: unknown,
    prevValue = 1,
  ): void {
    // console.log(`Apply to vehicle metaKey: ${metaKey}, value: ${value}`);
    switch (metaKey) {
      case StreamSyncedMetaType.ElectroMagneticPulse:
        this.vehicleService.setEngineState(vehicle, !value, !!value);
        this.vehicleService.setLightState(vehicle, !value);
        this.vehicleService.setRadioState(vehicle, !value);
        break;

      case StreamSyncedMetaType.Nitro:
        const newValue = typeof value === 'number' ? value : 1;
        this.vehicleService.setAccelerationMultiplier(vehicle, newValue, prevValue);
        break;

      case StreamSyncedMetaType.Burning:
        // todo: можно запустить анимацию на тачке
        break;
    }
  }
}
