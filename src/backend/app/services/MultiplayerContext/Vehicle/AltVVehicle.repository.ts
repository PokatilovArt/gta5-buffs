import { Injectable } from '@altv-mango/server';
import alt from 'alt-server';
import { VehicleRepository } from '@backend/domain';

@Injectable()
export class AltVVehicleRepository implements VehicleRepository {
    public findById(id: number): alt.Vehicle | null {
        return alt.Vehicle.getByID(id);
    }
}
