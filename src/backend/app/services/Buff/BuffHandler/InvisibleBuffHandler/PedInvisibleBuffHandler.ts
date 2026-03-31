import { BuffEntity, BuffHandler as IBuffHandler, PedRepository } from '@backend/domain';
import { BaseObjectType, BuffType, StreamSyncedMetaType } from '@common/types';
import { BuffHandler } from '../../../../decorators';
import { Inject } from '@altv-mango/core';
import * as alt from 'alt-server';

type pedId = number;

@BuffHandler(BuffType.Invisible, BaseObjectType.PED)
export class PedInvisibleBuffHandler implements IBuffHandler {
  private readonly invisibleMap = new Set<pedId>();

  constructor(
    @Inject(PedRepository)
    private readonly pedRepository: PedRepository,
  ) {}

  public onApply(entity: BuffEntity, stackCount: number): void {
    if (entity.type !== alt.BaseObjectType.Ped) {
      throw new Error(
        `Entity type ${entity.type} is not supported for ${PedInvisibleBuffHandler.name}`,
      );
    }

    this.invisibleMap.add(entity.id);

    const ped = this.pedRepository.findById(entity.id);
    if (ped) {
      ped.visible = false;
      ped.setStreamSyncedMeta(StreamSyncedMetaType.Invisible, true);
    }
  }

  public onRemove(entity: BuffEntity): void {
    this.invisibleMap.delete(entity.id);

    const ped = this.pedRepository.findById(entity.id);
    if (ped) {
      ped.visible = true;
      ped.deleteStreamSyncedMeta(StreamSyncedMetaType.Invisible);
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
