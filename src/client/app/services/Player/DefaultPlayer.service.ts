import { Injectable } from '@altv-mango/core';
import { PlayerService } from '@client/domain';
import * as alt from 'alt-client';
import natives from '@altv/natives';

@Injectable()
export class DefaultPlayerService implements PlayerService {
  constructor() {}

  // todo: перенести простые методы в обёртку Player, если будет хватать времени

  public setVisibility(player: alt.Player, enabled: boolean): void {
    natives.setEntityAlpha(player.scriptID, enabled ? 255 : 0, false);
  }

  public onReady(): void {
    // console.log('[PlayerService] Client ready');
    alt.log('[PlayerService] Client ready');
  }
}
