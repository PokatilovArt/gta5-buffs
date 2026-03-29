import {
  BUFF_BURNING_AMOUNT,
  BUFF_BURNING_PERIOD,
  BuffEntity,
  BuffHandler,
  PlayerRepository,
} from '@backend/domain';
import { BaseObjectType, BuffType } from '@common/types';
import { BuffHandle } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import type { Player } from '@altv/server';

type playerId = number;

@BuffHandle(BuffType.Burning, BaseObjectType.PLAYER)
export class PlayerBurningBuffHandler implements BuffHandler {
  private readonly burningInterval = BUFF_BURNING_PERIOD;
  private readonly hurtValuePerInterval = BUFF_BURNING_AMOUNT;
  private readonly burningEntitiesMap = new Map<playerId, Date>();

  constructor(
    @Inject(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== BaseObjectType.PLAYER) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PlayerBurningBuffHandler.name}`,
      );
    }

    const existingBurningApplyDate = this.burningEntitiesMap.get(entity.id);
    if (!existingBurningApplyDate) {
      this.burningEntitiesMap.set(entity.id, new Date(Date.now() + this.burningInterval));
    }

    this.applyBuffToPlayer(entity as Player);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.burningEntitiesMap.has(entity.id)) {
      this.burningEntitiesMap.delete(entity.id);
      this.removeBuffFromPlayer(entity as Player);
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
        const player = this.playerRepository.findById(entityId);
        if (!player || !player.valid) {
          this.burningEntitiesMap.delete(entityId);
          return;
        }

        player.health -= this.hurtValuePerInterval;
        this.burningEntitiesMap.set(entityId, new Date(now.getTime() + this.burningInterval));
      }
    }
  }

  private applyBuffToPlayer(player: Player): void {
    // todo: запустить анимацию огня
  }

  private removeBuffFromPlayer(player: Player): void {
    // todo: остановить анимацию огня
  }
}
