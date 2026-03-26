import { BuffEntity, BuffHandler, VehicleRepository } from '@backend/domain';
import { BuffType } from '@common/types';
import { BuffHandle } from '../../../../decorators';
import { Enums as altEnums } from '@altv/shared';
import { Inject } from '@altv-mango/core';
import { Vehicle } from '@altv/server';

type vehicleId = number;

@BuffHandle(BuffType.Burning, altEnums.BaseObjectType.VEHICLE)
export class VehicleBurningBuffHandler implements BuffHandler {
  private readonly burningVehiclesSet = new Set<vehicleId>();

  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== altEnums.BaseObjectType.VEHICLE) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${VehicleBurningBuffHandler.name}`,
      );
    }

    this.burningVehiclesSet.add(entity.id);

    this.applyBuffToVehicle(entity as Vehicle);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.burningVehiclesSet.has(entity.id)) {
      this.burningVehiclesSet.delete(entity.id);
      this.removeBuffFromVehicle(entity as Vehicle);
    }
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {}

  public onTick(): void {
    for (const entityId of this.burningVehiclesSet) {
      const vehicle = this.vehicleRepository.findById(entityId);
      if (!vehicle || !vehicle.valid) {
        this.burningVehiclesSet.delete(entityId);
        return;
      }
    }
  }

  private applyBuffToVehicle(vehicle: Vehicle): void {
    // todo: запустить анимацию огня
  }

  private removeBuffFromVehicle(vehicle: Vehicle): void {
    // todo: остановить анимацию огня
  }
}
