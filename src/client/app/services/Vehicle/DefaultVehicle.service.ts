import { Injectable } from '@altv-mango/core';
import { VehicleService } from '@client/domain';
import * as alt from 'alt-client';
import natives from '@altv/natives';

@Injectable()
export class DefaultVehicleService implements VehicleService {
  constructor() {}

  // todo: перенести простые методы в обёртку Vehicle, если будет хватать времени

  public setEngineState(vehicle: alt.Vehicle, enabled: boolean, denyFurtherChange?: boolean): void {
    natives.setVehicleEngineOn(vehicle.scriptID, enabled, true, !!denyFurtherChange);
  }

  public setLightState(vehicle: alt.Vehicle, enabled: boolean): void {
    vehicle.indicatorLights = enabled
      ? alt.VehicleIndicatorLights.StaticBoth
      : alt.VehicleIndicatorLights.None;
  }

  public setRadioState(vehicle: alt.Vehicle, enabled: boolean): void {
    // todo: проверить, достаточно ли серверного отключения
  }

  public setAccelerationMultiplier(
    vehicle: alt.Vehicle,
    newMultiplier: number,
    prevMultiplier = 1,
  ): void {
    const defaultAcceleration = vehicle.handling.acceleration / prevMultiplier;
    vehicle.handling.acceleration = newMultiplier * defaultAcceleration;
  }
}
