import { BuffHandler } from './BuffHandler';
import { BuffType } from '@common/types';
import { BuffEntity } from './BuffEntity';
import * as alt from 'alt-server';

export interface ApplyBuffPayload {
  entity: BuffEntity;
  buffType: BuffType;
  source?: alt.Player;
  stackCount?: number;
}

export interface BuffObject {
  handler: BuffHandler;
  activeUntil?: Date;
  activedBy?: alt.Player;
}

export type BuffTypeObjectMap = Map<BuffType, BuffObject>;
