import alt from 'alt-server';
import { MultiplayerRepository } from '../Multiplayer.repository';

export interface PedRepository extends MultiplayerRepository<alt.Ped> {
  create(model: string, position: alt.Vector3, rotation: alt.Vector3): alt.Ped;
}

export const PedRepository: unique symbol = Symbol('PedRepository');
