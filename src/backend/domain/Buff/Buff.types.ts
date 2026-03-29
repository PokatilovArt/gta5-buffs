import type { Player } from '@altv/server';
import { BuffHandler } from './BuffHandler';
import { BuffType } from '@common/types';
import { BuffEntity } from './BuffEntity';

export interface ApplyBuffPayload {
  entity: BuffEntity;
  buffType: BuffType;
  source?: Player;
  stackCount?: number;
}

export interface BuffObject {
  handler: BuffHandler;
  activeUntil?: Date;
  activedBy?: Player;
}

export type BuffTypeObjectMap = Map<BuffType, BuffObject>;
