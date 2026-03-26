import { Vehicle } from "@altv/server";
import { MultiplayerRepository } from "../Multiplayer.repository";

export interface VehicleRepository extends MultiplayerRepository<Vehicle> {}

export const VehicleRepository: unique symbol = Symbol('VehicleRepository');
