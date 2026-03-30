import {
  BUFF_COMMAND_ERROR_ENTITY_NOT_EXIST,
  BuffService,
  PlayerRepository,
} from '@backend/domain';
import { BuffChatCommandType, BuffType } from '@common/types';
import { BuffChatCommandHandler } from '../../../../decorators';
import { BuffChatCommandHandler as IBuffChatCommandHandler } from '../BuffChatCommandHandler';
import { Inject } from '@altv-mango/core';
import * as alt from 'alt-server';
import { BuffChatCommandStateType } from '../BuffChatCommandStateType.enum';

@BuffChatCommandHandler(BuffChatCommandType.PlayerBurning)
export class PlayerBurningBuffChatCommandHandler extends IBuffChatCommandHandler {
  constructor(
    @Inject(BuffService)
    private readonly buffService: BuffService,
    @Inject(PlayerRepository)
    private readonly playerRepository: PlayerRepository,
  ) {
    super();
  }

  public execute(player: alt.Player, args: string[]): void {
    const parsedArgs = this.parseArgs(args);

    const entity = this.playerRepository.findById(parsedArgs.entityId);
    if (!entity) {
      throw new Error(BUFF_COMMAND_ERROR_ENTITY_NOT_EXIST);
    }

    switch (parsedArgs.state) {
      case BuffChatCommandStateType.On:
        this.buffService.applyBuff({
          entity,
          buffType: BuffType.Burning,
          source: player,
        });
        break;

      case BuffChatCommandStateType.Off:
        this.buffService.removeBuff(entity, BuffType.Burning);
        break;
    }
  }
}
