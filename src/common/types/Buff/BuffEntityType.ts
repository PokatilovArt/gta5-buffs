import { Enums as altEnums } from "@altv/shared";

export type BuffEntityType = altEnums.BaseObjectType.PLAYER | altEnums.BaseObjectType.VEHICLE | altEnums.BaseObjectType.PED;


export const buffEntityTypes = new Set<altEnums.BaseObjectType>([
  altEnums.BaseObjectType.PLAYER,
  altEnums.BaseObjectType.VEHICLE,
  altEnums.BaseObjectType.PED,
]);

