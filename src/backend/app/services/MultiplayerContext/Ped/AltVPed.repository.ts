import { Injectable } from '@altv-mango/server';
import alt from 'alt-server';
import { PedRepository } from '@backend/domain';

@Injectable()
export class AltVPedRepository implements PedRepository {
    public findById(id: number): alt.Ped | null {
        return alt.Ped.getByID(id);
    }
}
