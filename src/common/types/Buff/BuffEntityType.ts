import { BaseObjectType } from './BaseObjectType.enum';

export type BuffEntityType =
  | BaseObjectType.PLAYER
  | BaseObjectType.VEHICLE
  | BaseObjectType.PED;

export const buffEntityTypes = new Set<BaseObjectType>([
  BaseObjectType.PLAYER,
  BaseObjectType.VEHICLE,
  BaseObjectType.PED,
]);
