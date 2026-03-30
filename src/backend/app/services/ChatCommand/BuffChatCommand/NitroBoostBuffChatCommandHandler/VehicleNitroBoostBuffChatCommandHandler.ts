import {
  BUFF_COMMAND_ERROR_ENTITY_NOT_EXIST,
  BuffService,
  VehicleRepository,
} from '@backend/domain';
import { BuffChatCommandType, BuffType } from '@common/types';
import { BuffChatCommandHandler } from '../../../../decorators';
import { BuffChatCommandHandler as IBuffChatCommandHandler } from '../BuffChatCommandHandler';
import { Inject } from '@altv-mango/core';
import * as alt from 'alt-server';
import { BuffChatCommandStateType } from '../BuffChatCommandStateType.enum';

@BuffChatCommandHandler(BuffChatCommandType.VehicleNitroBoost)
export class VehicleNitroBoostBuffChatCommandHandler extends IBuffChatCommandHandler {
  constructor(
    @Inject(BuffService)
    private readonly buffService: BuffService,
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {
    super();
  }

  public execute(player: alt.Player, args: string[]): void {
    const parsedArgs = this.parseArgs(args);

    const entity = this.vehicleRepository.findById(parsedArgs.entityId);
    if (!entity) {
      throw new Error(BUFF_COMMAND_ERROR_ENTITY_NOT_EXIST);
    }

    switch (parsedArgs.state) {
      case BuffChatCommandStateType.On:
        this.buffService.applyBuff({
          entity,
          buffType: BuffType.NitroBoost,
          source: player,
        });
        break;

      case BuffChatCommandStateType.Off:
        this.buffService.removeBuff(entity, BuffType.NitroBoost);
        break;
    }
  }
}
