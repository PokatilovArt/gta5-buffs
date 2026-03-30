import {
  BuffEntityHandlerRegistryKey,
  BuffEntityType,
  BuffType,
  buffEntityTypes,
  BaseObjectType,
  BuffChatCommandType,
  BuffChatCommandHandlerRegistryKey,
} from '@common/types';

export class BuffUtils {
  public static getBuffEntityHandlerRegistryKey(
    buffType: BuffType,
    buffEntityType: BuffEntityType,
  ): BuffEntityHandlerRegistryKey {
    return `${buffType}_${buffEntityType}`;
  }

  public static getBuffChatCommandHandlerRegistryKey(
    buffChatCommandType: BuffChatCommandType,
    buffEntityType: BuffEntityType,
  ): BuffChatCommandHandlerRegistryKey {
    return `${buffChatCommandType}_${buffEntityType}`;
  }

  public static isBuffEntityType(type: BaseObjectType): type is BuffEntityType {
    return buffEntityTypes.has(type as BuffEntityType);
  }
}
