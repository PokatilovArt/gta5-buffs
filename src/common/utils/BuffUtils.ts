import { BuffEntityHandlerRegistryKey, BuffEntityType, BuffType, buffEntityTypes } from "@common/types";
import { Enums as altEnums } from "@altv/shared";

export class BuffUtils {
  public static getBuffEntityHandlerRegistryKey(buffType: BuffType, buffEntityType: BuffEntityType): BuffEntityHandlerRegistryKey {
    return `${buffType}_${buffEntityType}`;
  }

  public static isBuffEntityType(
    type: altEnums.BaseObjectType
  ): type is BuffEntityType {
    return buffEntityTypes.has(type as BuffEntityType);
  }
}