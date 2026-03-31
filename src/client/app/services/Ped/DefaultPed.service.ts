import { Injectable } from '@altv-mango/core';
import { PedService } from '@client/domain';
import * as alt from 'alt-client';
import natives from '@altv/natives';

@Injectable()
export class DefaultPedService implements PedService {
  constructor() {}

  // todo: перенести простые методы в обёртку Ped, если будет хватать времени

  public setVisibility(ped: alt.Ped, enabled: boolean): void {
    natives.setEntityAlpha(ped.scriptID, enabled ? 255 : 0, false);
  }
}
