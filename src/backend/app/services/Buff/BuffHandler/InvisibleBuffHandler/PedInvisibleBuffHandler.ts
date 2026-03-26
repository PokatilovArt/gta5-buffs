import { BuffEntity, BuffHandler, PedRepository } from '@backend/domain';
import { BuffType } from '@common/types';
import { BuffHandle } from '../../../../decorators';
import { Enums as altEnums } from '@altv/shared';
import { Inject } from '@altv-mango/core';

type pedId = number;

@BuffHandle(BuffType.Invisible, altEnums.BaseObjectType.PED)
export class PedInvisibleBuffHandler implements BuffHandler {
  private readonly invisibleMap = new Set<pedId>();

  constructor(
    @Inject(PedRepository)
    private readonly pedRepository: PedRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== altEnums.BaseObjectType.PED) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PedInvisibleBuffHandler.name}`,
      );
    }

    this.invisibleMap.add(entity.id);

    const ped = this.pedRepository.findById(entity.id);
    if (ped) {
      ped.visible = false;
    }
  }

  public onRemove(entity: BuffEntity): void {
    this.invisibleMap.delete(entity.id);

    const ped = this.pedRepository.findById(entity.id);
    if (ped) {
      ped.visible = true;
    }
  }

  public onStackUpdate(entity: BuffEntity, stackCount: number): void {}

  public onTick(): void {
    for (const entityId of this.invisibleMap) {
      const ped = this.pedRepository.findById(entityId);
      if (!ped || !ped.valid) {
        this.invisibleMap.delete(entityId);
        return;
      }
    }
  }
}
