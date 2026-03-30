import { PlayerArmorRegenerationBuffChatCommandHandler } from './ArmorRegenerationBuffChatCommandHandler';
import {
  PedBurningBuffChatCommandHandler,
  PlayerBurningBuffChatCommandHandler,
  VehicleBurningBuffChatCommandHandler,
} from './BurningBuffChatCommandHandler';
import { VehicleElectroMagneticPulseBuffChatCommandHandler } from './ElectroMagneticPulseBuffChatCommandHandler';
import {
  PedInvisibleBuffChatCommandHandler,
  PlayerInvisibleBuffChatCommandHandler,
} from './InvisibleBuffChatCommandHandler';
import { VehicleNitroBoostBuffChatCommandHandler } from './NitroBoostBuffChatCommandHandler';

export * from './BuffChatCommandStateType.enum';
export * from './BuffChatCommandHandler.types';
export * from './BuffChatCommandHandler';

export const BuffChatCommandHandlers = [
  PlayerArmorRegenerationBuffChatCommandHandler,
  PedBurningBuffChatCommandHandler,
  PlayerBurningBuffChatCommandHandler,
  VehicleBurningBuffChatCommandHandler,
  VehicleNitroBoostBuffChatCommandHandler,
  VehicleElectroMagneticPulseBuffChatCommandHandler,
  PlayerInvisibleBuffChatCommandHandler,
  PedInvisibleBuffChatCommandHandler,
];
