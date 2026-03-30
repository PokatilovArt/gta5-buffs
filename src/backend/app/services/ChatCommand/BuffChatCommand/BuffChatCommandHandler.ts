import {
  BUFF_COMMAND_ERROR_ARGUMENTS_WRONG_COUNT,
  BUFF_COMMAND_ERROR_FIRST_ARGUMENT_IS_NOT_STATE,
  BUFF_COMMAND_ERROR_SECOND_ARGUMENT_IS_NOT_NUMBER,
  ChatCommandHandler,
} from '@backend/domain';
import * as alt from 'alt-server';
import { BuffChatCommandHandlerArgs } from './BuffChatCommandHandler.types';
import { EnumUtils } from '@common/utils';
import { BuffChatCommandStateType } from './BuffChatCommandStateType.enum';

export class BuffChatCommandHandler implements ChatCommandHandler {
  public execute(player: alt.Player, args: string[]): void {
    throw new Error(`Not implemented execute method in ${BuffChatCommandHandler.name} class`);
  }

  public parseArgs(args: string[]): BuffChatCommandHandlerArgs {
    if (args.length !== 2) {
      throw new Error(BUFF_COMMAND_ERROR_ARGUMENTS_WRONG_COUNT);
    }

    const commandState = EnumUtils.getEnumByValue(BuffChatCommandStateType, args[0]);
    if (!commandState) {
      throw new Error(BUFF_COMMAND_ERROR_FIRST_ARGUMENT_IS_NOT_STATE);
    }

    const entityId = parseInt(args[1]);
    if (isNaN(entityId)) {
      throw new Error(BUFF_COMMAND_ERROR_SECOND_ARGUMENT_IS_NOT_NUMBER);
    }

    return { state: commandState, entityId: entityId };
  }
}
