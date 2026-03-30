import { BuffEntity, BuffHandler as IBuffHandler, PlayerRepository } from '@backend/domain';
import { BaseObjectType, BuffType, StreamSyncedMetaType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';

type playerId = number;

@BuffHandler(BuffType.Invisible, BaseObjectType.PLAYER)
export class PlayerInvisibleBuffHandler implements IBuffHandler {
  private readonly invisibleMap = new Set<playerId>();

  constructor(
    @Inject(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== BaseObjectType.PLAYER) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PlayerInvisibleBuffHandler.name}`,
      );
    }

    this.invisibleMap.add(entity.id);

    const player = this.playerRepository.findById(entity.id);
    if (player) {
      player.visible = false;
      player.setStreamSyncedMeta(StreamSyncedMetaType.Invisible, true);
    }
  }

  public onRemove(entity: BuffEntity): void {
    this.invisibleMap.delete(entity.id);

    const player = this.playerRepository.findById(entity.id);
    if (player) {
      player.visible = true;
      player.deleteStreamSyncedMeta(StreamSyncedMetaType.Invisible);
    }
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {}

  public onTick(): void {
    for (const entityId of this.invisibleMap) {
      const player = this.playerRepository.findById(entityId);
      if (!player || !player.valid) {
        this.invisibleMap.delete(entityId);
        return;
      }
    }
  }
}
