import {
  BUFF_BURNING_AMOUNT,
  BUFF_BURNING_PERIOD,
  BuffEntity,
  BuffHandler as IBuffHandler,
  PlayerRepository,
} from '@backend/domain';
import { BaseObjectType, BuffType, StreamSyncedMetaType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import * as alt from 'alt-server';

type playerId = number;

@BuffHandler(BuffType.Burning, BaseObjectType.PLAYER)
export class PlayerBurningBuffHandler implements IBuffHandler {
  private readonly burningInterval = BUFF_BURNING_PERIOD;
  private readonly hurtValuePerInterval = BUFF_BURNING_AMOUNT;
  private readonly burningEntitiesMap = new Map<playerId, Date>();

  constructor(
    @Inject(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== alt.BaseObjectType.Player) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PlayerBurningBuffHandler.name}`,
      );
    }

    const existingBurningApplyDate = this.burningEntitiesMap.get(entity.id);
    if (!existingBurningApplyDate) {
      this.burningEntitiesMap.set(entity.id, new Date(Date.now() + this.burningInterval));
    }

    this.applyBuffToPlayer(entity as alt.Player);
  }

  public onRemove(entity: BuffEntity): void {
    if (this.burningEntitiesMap.has(entity.id)) {
      this.burningEntitiesMap.delete(entity.id);
      this.removeBuffFromPlayer(entity as alt.Player);
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

  private applyBuffToPlayer(player: alt.Player): void {
    // todo: запустить анимацию огня
    player.setStreamSyncedMeta(StreamSyncedMetaType.Burning, true);
  }

  private removeBuffFromPlayer(player: alt.Player): void {
    // todo: остановить анимацию огня
    player.deleteStreamSyncedMeta(StreamSyncedMetaType.Burning);
  }
}
