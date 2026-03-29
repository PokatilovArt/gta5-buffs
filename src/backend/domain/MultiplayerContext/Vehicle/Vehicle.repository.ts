import alt from 'alt-server';
import { MultiplayerRepository } from '../Multiplayer.repository';

export interface VehicleRepository extends MultiplayerRepository<alt.Vehicle> {}

export const VehicleRepository: unique symbol = Symbol('VehicleRepository');
