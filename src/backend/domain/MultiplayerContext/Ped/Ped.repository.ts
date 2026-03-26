import { Ped } from "@altv/server";
import { MultiplayerRepository } from "../Multiplayer.repository";

export interface PedRepository extends MultiplayerRepository<Ped> {}

export const PedRepository: unique symbol = Symbol('PedRepository');
