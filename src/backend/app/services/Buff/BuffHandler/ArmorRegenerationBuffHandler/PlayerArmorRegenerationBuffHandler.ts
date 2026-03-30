import {
  BUFF_ARMOR_REGENERATION_AMOUNT,
  BUFF_ARMOR_REGENERATION_PERIOD,
  BuffEntity,
  BuffHandler as IBuffHandler,
  PlayerRepository,
} from '@backend/domain';
import { BaseObjectType, BuffType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';

type playerId = number;
interface RegenerationObject {
  nextApplyAt: Date;
  regenerateValue: number;
}

@BuffHandler(BuffType.ArmorRegeneration, BaseObjectType.PLAYER)
export class PlayerArmorRegenerationBuffHandler implements IBuffHandler {
  private readonly regenerateInterval = BUFF_ARMOR_REGENERATION_PERIOD;
  private readonly regenerateValuePerInterval = BUFF_ARMOR_REGENERATION_AMOUNT;
  private readonly regenerationObjectMap = new Map<playerId, RegenerationObject>();

  constructor(
    @Inject(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== BaseObjectType.PLAYER) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PlayerArmorRegenerationBuffHandler.name}`,
      );
    }

    const regenerateValue = stackCount * this.regenerateValuePerInterval;
    const nextApplyAt = new Date(Date.now() + this.regenerateInterval);

    const existingRegenerationObject = this.regenerationObjectMap.get(entity.id);
    if (existingRegenerationObject) {
      existingRegenerationObject.regenerateValue += regenerateValue;
      existingRegenerationObject.nextApplyAt = nextApplyAt;
    } else {
      this.regenerationObjectMap.set(entity.id, {
        nextApplyAt: nextApplyAt,
        regenerateValue: regenerateValue,
      });
    }
  }

  public onRemove(entity: BuffEntity): void {
    this.regenerationObjectMap.delete(entity.id);
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {
    const existingRegenerationObject = this.regenerationObjectMap.get(entity.id);
    if (!existingRegenerationObject) {
      throw new Error(`Regeneration object not found for playerId=${entity.id}`);
    }

    existingRegenerationObject.regenerateValue = stackCount * this.regenerateValuePerInterval;
    existingRegenerationObject.nextApplyAt = new Date(Date.now() + this.regenerateInterval);
  }

  public onTick(): void {
    for (const [entityId, regenerationObject] of this.regenerationObjectMap.entries()) {
      if (!regenerationObject) {
        this.regenerationObjectMap.delete(entityId);
        continue;
      }

      const now = new Date();
      if (now >= regenerationObject.nextApplyAt) {
        const player = this.playerRepository.findById(entityId);
        if (!player || !player.valid) {
          this.regenerationObjectMap.delete(entityId);
          return;
        }

        regenerationObject.nextApplyAt = new Date(now.getTime() + this.regenerateInterval);

        const maxArmorValue = player.maxArmour;
        const nextArmorValue = player.armour + regenerationObject.regenerateValue;
        if (nextArmorValue > maxArmorValue) {
          player.armour = maxArmorValue;
          return;
        }

        player.armour += regenerationObject.regenerateValue;
      }
    }
  }
}
