import {
  BUFF_NITRO_BOOST_MULTIPLIER,
  BuffEntity,
  BuffHandler as IBuffHandler,
  VehicleRepository,
} from '@backend/domain';
import { BaseObjectType, BuffType, StreamSyncedMetaType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import * as alt from 'alt-server';

type vehicleId = number;
interface NitroBoostObject {
  nitroBoost: number;
  initialAccelerationLevel: number;
}

@BuffHandler(BuffType.NitroBoost, BaseObjectType.VEHICLE)
export class VehicleNitroBoostBuffHandler implements IBuffHandler {
  private readonly nitroEngineMultiplier = BUFF_NITRO_BOOST_MULTIPLIER;
  private readonly nitroObjectMap = new Map<vehicleId, NitroBoostObject>();

  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== alt.BaseObjectType.Vehicle) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${VehicleNitroBoostBuffHandler.name}`,
      );
    }

    const vehicleEntity = entity as alt.Vehicle;

    const existingNitroBoostObject = this.nitroObjectMap.get(entity.id);
    const boostMultiplier = Math.pow(this.nitroEngineMultiplier, stackCount);
    if (existingNitroBoostObject) {
      existingNitroBoostObject.nitroBoost = existingNitroBoostObject.nitroBoost * boostMultiplier;
    } else {
      this.nitroObjectMap.set(entity.id, {
        nitroBoost: Math.pow(this.nitroEngineMultiplier, stackCount),
        initialAccelerationLevel: vehicleEntity.accelerationLevel,
      });
    }

    this.applyNitroBoostToVehicle(vehicleEntity, this.nitroObjectMap.get(entity.id)!);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.nitroObjectMap.has(entity.id)) {
      this.nitroObjectMap.delete(entity.id);
      this.removeNitroBoostFromVehicle(entity as alt.Vehicle);
    }
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {
    const existingNitroBoostObject = this.nitroObjectMap.get(entity.id);
    if (!existingNitroBoostObject) {
      throw new Error(`Nitro object not found for vehicleId=${entity.id}`);
    }

    existingNitroBoostObject.nitroBoost =
      existingNitroBoostObject.nitroBoost * Math.pow(this.nitroEngineMultiplier, stackCount);

    this.applyNitroBoostToVehicle(entity as alt.Vehicle, existingNitroBoostObject);
  }

  public onTick(): void {
    for (const [entityId, nitroBoost] of this.nitroObjectMap.entries()) {
      const vehicle = this.vehicleRepository.findById(entityId);
      if (!vehicle || !vehicle.valid) {
        this.nitroObjectMap.delete(entityId);
        return;
      }
    }
  }

  private applyNitroBoostToVehicle(vehicle: alt.Vehicle, nitroBoostObject: NitroBoostObject): void {
    vehicle.setStreamSyncedMeta(StreamSyncedMetaType.Nitro, nitroBoostObject.nitroBoost);
  }

  private removeNitroBoostFromVehicle(vehicle: alt.Vehicle): void {
    vehicle.deleteStreamSyncedMeta(StreamSyncedMetaType.Nitro);
  }
}
