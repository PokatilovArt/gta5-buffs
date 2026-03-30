import { Injectable } from '@altv-mango/core';
import { PedMetaService } from '@client/domain';
import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';
import natives from '@altv/natives';

@Injectable()
export class DefaultPedMetaService implements PedMetaService {
  constructor() {}

  public applyMeta(ped: alt.Ped, metaKey: StreamSyncedMetaType, value: unknown): void {
    console.log(`Apply to ped metaKey: ${metaKey}, value: ${value}`);
    switch (metaKey) {
      case StreamSyncedMetaType.Invisible:
        natives.setEntityAlpha(ped.scriptID, value ? 255 : 0, false);
        break;
    }
  }
}
