import { BuffType } from '@common/types';
import { BuffEntity } from './BuffEntity';
import { ApplyBuffPayload } from './Buff.types';

export interface BuffService {
  applyBuff(payload: ApplyBuffPayload): void;
  removeBuff(entity: BuffEntity, buffType: BuffType): void;
  hasBuff(entity: BuffEntity, buffType: BuffType): boolean;
  // todo: нужно ли возвращать сущности? Может, достаточно типов?
  getBuffs(entity: BuffEntity): BuffType[];

  tickBuffs(): void;
}

export const BuffService: unique symbol = Symbol('BuffService');
