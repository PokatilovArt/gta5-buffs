import { Injectable } from '@altv-mango/core';
import { PlayerMetaService } from '@client/domain';
import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';
import natives from '@altv/natives';

@Injectable()
export class DefaultPlayerMetaService implements PlayerMetaService {
  constructor() {}

  public applyMeta(player: alt.Player, metaKey: StreamSyncedMetaType, value: unknown): void {
    console.log(`Apply to player metaKey: ${metaKey}, value: ${value}`);
    switch (metaKey) {
      case StreamSyncedMetaType.Invisible:
        natives.setEntityAlpha(player.scriptID, value ? 255 : 0, false);
        break;
    }
  }
}
