import { Inject, Injectable } from '@altv-mango/core';
import { PedMetaService, PedService } from '@client/domain';
import { StreamSyncedMetaType } from '@common/types';
import * as alt from 'alt-client';

@Injectable()
export class DefaultPedMetaService implements PedMetaService {
  constructor(@Inject(PedService) private readonly pedService: PedService) {}

  public applyMeta(ped: alt.Ped, metaKey: StreamSyncedMetaType, value: unknown): void {
    // console.log(`Apply to ped metaKey: ${metaKey}, value: ${value}`);
    switch (metaKey) {
      case StreamSyncedMetaType.Invisible:
        this.pedService.setVisibility(ped, !value);
        break;
      case StreamSyncedMetaType.Burning:
        // todo: можно запустить анимацию на педе
        break;
    }
  }
}
