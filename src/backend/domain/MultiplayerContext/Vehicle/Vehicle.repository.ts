import alt from 'alt-server';
import { MultiplayerRepository } from '../Multiplayer.repository';

export interface VehicleRepository extends MultiplayerRepository<alt.Vehicle> {
  create(model: string, position: alt.Vector3, rotation: alt.Vector3): alt.Vehicle;
}

export const VehicleRepository: unique symbol = Symbol('VehicleRepository');
