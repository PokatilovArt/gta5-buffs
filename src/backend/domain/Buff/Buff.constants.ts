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

export const BUFF_COMMAND_ERROR_ARGUMENTS_WRONG_COUNT = `У данной команды должно быть 2 аргумента`;
export const BUFF_COMMAND_ERROR_FIRST_ARGUMENT_IS_NOT_STATE = `1 аргумент должен быть "on" или "off"`;
export const BUFF_COMMAND_ERROR_SECOND_ARGUMENT_IS_NOT_NUMBER = `2 аргумент должен быть id сущности`;
export const BUFF_COMMAND_ERROR_ENTITY_NOT_EXIST = `Сущность с заданным id не существует`;
