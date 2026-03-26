import { Player } from "@altv/server";
import { MultiplayerRepository } from "../Multiplayer.repository";

export interface PlayerRepository extends MultiplayerRepository<Player> {}

export const PlayerRepository: unique symbol = Symbol('PlayerRepository');
