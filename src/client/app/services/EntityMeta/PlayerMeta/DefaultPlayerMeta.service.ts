import { Inject, Injectable } from '@altv-mango/core';
import { PlayerMetaService, PlayerService } from '@client/domain';
import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';

@Injectable()
export class DefaultPlayerMetaService implements PlayerMetaService {
  constructor(@Inject(PlayerService) private readonly playerService: PlayerService) {}

  public applyMeta(player: alt.Player, metaKey: StreamSyncedMetaType, value: unknown): void {
    // console.log(`Apply to player metaKey: ${metaKey}, value: ${value}`);
    switch (metaKey) {
      case StreamSyncedMetaType.Invisible:
        this.playerService.setVisibility(player, !value);
        break;
      case StreamSyncedMetaType.ArmorRegeneration:
        // todo: можно запустить анимацию на игроке или в худе
        break;
      case StreamSyncedMetaType.Burning:
        // todo: можно запустить анимацию на игроке
        break;
    }
  }
}
