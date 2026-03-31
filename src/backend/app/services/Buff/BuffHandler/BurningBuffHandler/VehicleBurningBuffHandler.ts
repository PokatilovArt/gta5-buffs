import { BuffEntity, BuffHandler as IBuffHandler, VehicleRepository } from '@backend/domain';
import { BaseObjectType, BuffType, StreamSyncedMetaType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import * as alt from 'alt-server';

type vehicleId = number;

@BuffHandler(BuffType.Burning, BaseObjectType.VEHICLE)
export class VehicleBurningBuffHandler implements IBuffHandler {
  private readonly burningVehiclesSet = new Set<vehicleId>();

  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== alt.BaseObjectType.Vehicle) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${VehicleBurningBuffHandler.name}`,
      );
    }

    this.burningVehiclesSet.add(entity.id);

    this.applyBuffToVehicle(entity as alt.Vehicle);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.burningVehiclesSet.has(entity.id)) {
      this.burningVehiclesSet.delete(entity.id);
      this.removeBuffFromVehicle(entity as alt.Vehicle);
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

  private applyBuffToVehicle(vehicle: alt.Vehicle): void {
    // todo: запустить анимацию огня
    vehicle.setStreamSyncedMeta(StreamSyncedMetaType.Burning, true);
  }

  private removeBuffFromVehicle(vehicle: alt.Vehicle): void {
    // todo: остановить анимацию огня
    vehicle.deleteStreamSyncedMeta(StreamSyncedMetaType.Burning);
  }
}
