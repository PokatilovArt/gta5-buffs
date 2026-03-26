import { PlayerArmorRegenerationBuffHandler } from './ArmorRegenerationBuffHandler';
import {
  PedBurningBuffHandler,
  PlayerBurningBuffHandler,
  VehicleBurningBuffHandler,
} from './BurningBuffHandler';
import { VehicleElectroMagneticPulseBuffHandler } from './ElectroMagneticPulseBuffHandler';
import { PedInvisibleBuffHandler, PlayerInvisibleBuffHandler } from './InvisibleBuffHandler';
import { VehicleNitroBoostBuffHandler } from './NitroBoostBuffHandler';

export const BuffHandlers = [
  PlayerArmorRegenerationBuffHandler,
  VehicleNitroBoostBuffHandler,
  PlayerInvisibleBuffHandler,
  PedInvisibleBuffHandler,
  VehicleElectroMagneticPulseBuffHandler,
  PlayerBurningBuffHandler,
  PedBurningBuffHandler,
  VehicleBurningBuffHandler,
];
