import { BuffEntity, BuffHandler, PlayerRepository } from '@backend/domain';
import { BuffType } from '@common/types';
import { BuffHandle } from '../../../../decorators';
import { Enums as altEnums } from '@altv/shared';
import { Inject } from '@altv-mango/core';

type playerId = number;

@BuffHandle(BuffType.Invisible, altEnums.BaseObjectType.PLAYER)
export class PlayerInvisibleBuffHandler implements BuffHandler {
  private readonly invisibleMap = new Set<playerId>();

  constructor(
    @Inject(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== altEnums.BaseObjectType.PLAYER) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PlayerInvisibleBuffHandler.name}`,
      );
    }

    this.invisibleMap.add(entity.id);

    const player = this.playerRepository.findById(entity.id);
    if (player) {
      player.visible = false;
    }
  }

  public onRemove(entity: BuffEntity): void {
    this.invisibleMap.delete(entity.id);

    const player = this.playerRepository.findById(entity.id);
    if (player) {
      player.visible = true;
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
