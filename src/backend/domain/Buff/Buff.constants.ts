import { BuffReapplyType, BuffType } from '@common/types';

export const BUFF_REAPPLY_TYPES: Map<BuffType, BuffReapplyType> = new Map([
  [BuffType.ArmorRegeneration, BuffReapplyType.Stack],
  [BuffType.NitroBoost, BuffReapplyType.Stack],
  [BuffType.ElectroMagneticPulse, BuffReapplyType.RestartDuration],
]);

export const BUFF_DURATION: Map<BuffType, number> = new Map([
  [BuffType.ElectroMagneticPulse, 30 * 1000],
]);

export const BUFF_ARMOR_REGENERATION_PERIOD = 5 * 1000;
export const BUFF_ARMOR_REGENERATION_AMOUNT = 5;

export const BUFF_NITRO_BOOST_MULTIPLIER = 3;

export const BUFF_BURNING_PERIOD = 3 * 1000;
export const BUFF_BURNING_AMOUNT = 5;
