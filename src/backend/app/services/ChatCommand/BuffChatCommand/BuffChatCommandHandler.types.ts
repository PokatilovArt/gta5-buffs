import { BuffChatCommandStateType } from './BuffChatCommandStateType.enum';

export interface BuffChatCommandHandlerArgs {
  state: BuffChatCommandStateType;
  entityId: number;
}
