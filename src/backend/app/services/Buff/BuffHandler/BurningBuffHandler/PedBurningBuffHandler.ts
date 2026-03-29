import {
  BUFF_BURNING_AMOUNT,
  BUFF_BURNING_PERIOD,
  BuffEntity,
  BuffHandler,
  PedRepository,
} from '@backend/domain';
import { BaseObjectType, BuffType } from '@common/types';
import { BuffHandle } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import type { Ped } from '@altv/server';

type pedId = number;

@BuffHandle(BuffType.Burning, BaseObjectType.PED)
export class PedBurningBuffHandler implements BuffHandler {
  private readonly burningInterval = BUFF_BURNING_PERIOD;
  private readonly hurtValuePerInterval = BUFF_BURNING_AMOUNT;
  private readonly burningEntitiesMap = new Map<pedId, Date>();

  constructor(
    @Inject(PedRepository)
    private readonly pedRepository: PedRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== BaseObjectType.PED) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PedBurningBuffHandler.name}`,
      );
    }

    const existingBurningApplyDate = this.burningEntitiesMap.get(entity.id);
    if (!existingBurningApplyDate) {
      this.burningEntitiesMap.set(entity.id, new Date(Date.now() + this.burningInterval));
    }

    this.applyBuffToPed(entity as Ped);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.burningEntitiesMap.has(entity.id)) {
      this.burningEntitiesMap.delete(entity.id);
      this.removeBuffFromPed(entity as Ped);
    }
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {}

  public onTick(): void {
    for (const [entityId, nextApplyAt] of this.burningEntitiesMap.entries()) {
      if (!nextApplyAt) {
        this.burningEntitiesMap.delete(entityId);
        continue;
      }

      const now = new Date();
      if (now >= nextApplyAt) {
        const ped = this.pedRepository.findById(entityId);
        if (!ped || !ped.valid) {
          this.burningEntitiesMap.delete(entityId);
          return;
        }

        ped.health -= this.hurtValuePerInterval;
        this.burningEntitiesMap.set(entityId, new Date(now.getTime() + this.burningInterval));
      }
    }
  }

  private applyBuffToPed(ped: Ped): void {
    // todo: запустить анимацию огня
  }

  private removeBuffFromPed(ped: Ped): void {
    // todo: остановить анимацию огня
  }
}
