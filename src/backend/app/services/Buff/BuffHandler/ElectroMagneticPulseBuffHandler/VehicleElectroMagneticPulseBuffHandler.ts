import { BuffEntity, BuffHandler as IBuffHandler, VehicleRepository } from '@backend/domain';
import { BaseObjectType, BuffType, StreamSyncedMetaType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import * as alt from 'alt-server';

type vehicleId = number;

@BuffHandler(BuffType.ElectroMagneticPulse, BaseObjectType.VEHICLE)
export class VehicleElectroMagneticPulseBuffHandler implements IBuffHandler {
  private readonly electroMagneticPulseEntitiesMap = new Set<vehicleId>();

  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== alt.BaseObjectType.Vehicle) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${VehicleElectroMagneticPulseBuffHandler.name}`,
      );
    }

    this.electroMagneticPulseEntitiesMap.add(entity.id);
    this.applyBuffToVehicle(entity as alt.Vehicle);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.electroMagneticPulseEntitiesMap.has(entity.id)) {
      this.electroMagneticPulseEntitiesMap.delete(entity.id);
      this.removeBuffFromVehicle(entity as alt.Vehicle);
    }
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {}

  public onTick(): void {
    for (const entityId of this.electroMagneticPulseEntitiesMap) {
      const vehicle = this.vehicleRepository.findById(entityId);
      if (!vehicle || !vehicle.valid) {
        this.electroMagneticPulseEntitiesMap.delete(entityId);
        return;
      }
    }
  }

  private applyBuffToVehicle(vehicle: alt.Vehicle): void {
    vehicle.engineOn = false;
    vehicle.lightState = 0;
    vehicle.activeRadioStation = alt.RadioStation.RadioOff;

    vehicle.setStreamSyncedMeta(StreamSyncedMetaType.ElectroMagneticPulse, true);
  }

  private removeBuffFromVehicle(vehicle: alt.Vehicle): void {
    vehicle.engineOn = true;
    vehicle.lightState = 1;
    vehicle.activeRadioStation = alt.RadioStation.SoulwaxFm;

    vehicle.deleteStreamSyncedMeta(StreamSyncedMetaType.ElectroMagneticPulse);
  }
}
