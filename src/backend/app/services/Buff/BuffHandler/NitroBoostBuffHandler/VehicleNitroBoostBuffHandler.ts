import {
  BUFF_NITRO_BOOST_MULTIPLIER,
  BuffEntity,
  BuffHandler,
  VehicleRepository,
} from '@backend/domain';
import { BaseObjectType, BuffType } from '@common/types';
import { BuffHandle } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import type { Vehicle } from '@altv/server';

type vehicleId = number;
interface NitroBoostObject {
  nitroBoost: number;
  initialAccelerationLevel: number;
}

@BuffHandle(BuffType.NitroBoost, BaseObjectType.VEHICLE)
export class VehicleNitroBoostBuffHandler implements BuffHandler {
  private readonly nitroEngineMultiplier = BUFF_NITRO_BOOST_MULTIPLIER;
  private readonly nitroObjectMap = new Map<vehicleId, NitroBoostObject>();

  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== BaseObjectType.VEHICLE) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${VehicleNitroBoostBuffHandler.name}`,
      );
    }

    const vehicleEntity = entity as Vehicle;

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
      this.removeNitroBoostFromVehicle(entity as Vehicle);
    }
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {
    const existingNitroBoostObject = this.nitroObjectMap.get(entity.id);
    if (!existingNitroBoostObject) {
      throw new Error(`Nitro object not found for vehicleId=${entity.id}`);
    }

    existingNitroBoostObject.nitroBoost =
      existingNitroBoostObject.nitroBoost * Math.pow(this.nitroEngineMultiplier, stackCount);

    this.applyNitroBoostToVehicle(entity as Vehicle, existingNitroBoostObject);
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

  private applyNitroBoostToVehicle(vehicle: Vehicle, nitroBoostObject: NitroBoostObject): void {
    // todo: send event to client
    // todo: use params as meta
  }

  private removeNitroBoostFromVehicle(vehicle: Vehicle): void {
    // todo: send event to client
    // todo: use params as meta
  }
}
