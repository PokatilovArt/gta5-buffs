import alt from 'alt-server';
import { MultiplayerRepository } from '../Multiplayer.repository';

export interface PedRepository extends MultiplayerRepository<alt.Ped> {}

export const PedRepository: unique symbol = Symbol('PedRepository');
