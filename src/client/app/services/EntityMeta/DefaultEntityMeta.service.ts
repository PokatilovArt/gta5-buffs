import { Inject, Injectable } from '@altv-mango/core';
import {
  EntityMetaService,
  PedMetaService,
  PlayerMetaService,
  VehicleMetaService,
} from '@client/domain';
import { BaseObjectType, StreamSyncedMetaType } from '@common/types';
import { EnumUtils } from '@common/utils';
import * as alt from 'alt-client';

@Injectable()
export class DefaultEntityMetaService implements EntityMetaService {
  constructor(
    @Inject(PedMetaService) private readonly pedMetaService: PedMetaService,
    @Inject(PlayerMetaService) private readonly playerMetaService: PlayerMetaService,
    @Inject(VehicleMetaService) private readonly vehicleMetaService: VehicleMetaService,
  ) {}

  public applyMetas(entity: alt.Entity, keyChanged?: StreamSyncedMetaType): void {
    const metaKeys = keyChanged ? [keyChanged] : EnumUtils.getEnumValues(StreamSyncedMetaType);

    for (const metaKey of metaKeys) {
      const metaValue = entity.getStreamSyncedMeta(metaKey);
      this.applyMeta(entity, metaKey as StreamSyncedMetaType, metaValue);
    }
  }

  public applyMeta(entity: alt.Entity, metaKey: StreamSyncedMetaType, value: unknown): void {
    switch (entity.type) {
      case BaseObjectType.PED:
        this.pedMetaService.applyMeta(entity as alt.Ped, metaKey, value);
        break;
      case BaseObjectType.PLAYER:
        this.playerMetaService.applyMeta(entity as alt.Player, metaKey, value);
        break;
      case BaseObjectType.PED:
        this.vehicleMetaService.applyMeta(entity as alt.Vehicle, metaKey, value);
        break;
    }
  }
}
