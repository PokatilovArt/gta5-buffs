import { Injectable } from '@altv-mango/server';
import alt from 'alt-server';
import { PedRepository } from '@backend/domain';

@Injectable()
export class AltVPedRepository implements PedRepository {
  public findById(id: number): alt.Ped | null {
    return alt.Ped.getByID(id);
  }

  public create(model: string, position: alt.Vector3, rotation: alt.Vector3): alt.Ped {
    return new alt.Ped(model, position, rotation);
  }
}
