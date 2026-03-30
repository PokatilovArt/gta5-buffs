import { BuffChatCommandType } from './BuffChatCommandType.enum';
import { BuffEntityType } from './BuffEntityType';

export type BuffChatCommandHandlerRegistryKey = `${BuffChatCommandType}_${BuffEntityType}`;
