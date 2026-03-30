import { Controller, Inject, On } from '@altv-mango/client';
import alt from 'alt-client';
import { EntityMetaService } from '@client/domain';
import { StreamSyncedMetaType } from '@common/types';

@Controller()
export class EntityMetaController {
  constructor(@Inject(EntityMetaService) private readonly entityMetaService: EntityMetaService) {}

  @On('streamSyncedMetaChange')
  public onStreamSyncedMetaChanged(
    entity: alt.Entity,
    key: string,
    newValue: unknown,
    oldValue?: unknown,
  ): void {
    this.entityMetaService.applyMeta(entity as alt.Entity, key as StreamSyncedMetaType, newValue);
  }

  @On('gameEntityCreate')
  public onGameEntityCreated(entity: alt.Entity): void {
    this.entityMetaService.applyMetas(entity as alt.Entity);
  }
}
