import { BuffEntity, BuffHandler as IBuffHandler, VehicleRepository } from '@backend/domain';
import { BaseObjectType, BuffType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import type { Vehicle } from '@altv/server';

type vehicleId = number;

@BuffHandler(BuffType.ElectroMagneticPulse, BaseObjectType.VEHICLE)
export class VehicleElectroMagneticPulseBuffHandler implements IBuffHandler {
  private readonly electroMagneticPulseEntitiesMap = new Set<vehicleId>();

  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== BaseObjectType.VEHICLE) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${VehicleElectroMagneticPulseBuffHandler.name}`,
      );
    }

    this.electroMagneticPulseEntitiesMap.add(entity.id);
    this.applyBuffToVehicle(entity as unknown as Vehicle);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.electroMagneticPulseEntitiesMap.has(entity.id)) {
      this.electroMagneticPulseEntitiesMap.delete(entity.id);
      this.removeBuffFromVehicle(entity as unknown as Vehicle);
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

  private applyBuffToVehicle(vehicle: Vehicle): void {
    vehicle.engineOn = false;
    vehicle.lightState = 0;
    // todo: разобраться с радио:
    //  vehicle.radioStationIndex = 0; или mp.game.audio.setRadioToStationName("OFF"); на клиенте (каждый раз при посадке)
  }

  private removeBuffFromVehicle(vehicle: Vehicle): void {
    vehicle.engineOn = true;
    vehicle.lightState = 1;
    // todo: разобраться с радио
  }
}
