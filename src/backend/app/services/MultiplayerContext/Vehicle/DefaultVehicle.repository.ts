import { Injectable } from '@altv-mango/server';
import { Vehicle as altVehicle } from '@altv/server';
import { VehicleRepository } from '@backend/domain';

@Injectable()
export class DefaultVehicleRepository implements VehicleRepository {
    public findById(id: number): altVehicle | null {
        return altVehicle.getByID(id);
    }
}
