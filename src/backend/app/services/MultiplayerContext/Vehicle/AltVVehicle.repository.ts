import { Injectable } from '@altv-mango/server';
import alt from 'alt-server';
import { VehicleRepository } from '@backend/domain';

@Injectable()
export class AltVVehicleRepository implements VehicleRepository {
  public findById(id: number): alt.Vehicle | null {
    return alt.Vehicle.getByID(id);
  }

  public create(model: string, position: alt.Vector3, rotation: alt.Vector3): alt.Vehicle {
    return new alt.Vehicle(model, position, rotation);
  }
}
