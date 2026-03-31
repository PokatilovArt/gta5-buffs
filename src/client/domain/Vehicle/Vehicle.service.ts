import * as alt from 'alt-client';

export interface VehicleService {
  setEngineState(vehicle: alt.Vehicle, enabled: boolean, denyFurtherChange?: boolean): void;
  setLightState(vehicle: alt.Vehicle, enabled: boolean): void;
  setRadioState(vehicle: alt.Vehicle, enabled: boolean): void;
  setAccelerationMultiplier(
    vehicle: alt.Vehicle,
    newMultiplier: number,
    prevMultiplier?: number,
  ): void;
}

export const VehicleService: unique symbol = Symbol('VehicleService');
