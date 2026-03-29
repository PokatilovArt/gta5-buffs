import alt from 'alt-server';
import { MultiplayerRepository } from '../Multiplayer.repository';

export interface PlayerRepository extends MultiplayerRepository<alt.Player> {}

export const PlayerRepository: unique symbol = Symbol('PlayerRepository');
