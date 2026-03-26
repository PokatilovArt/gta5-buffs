import { Injectable } from '@altv-mango/server';
import { Ped as altPed } from '@altv/server';
import { PedRepository } from '@backend/domain';

@Injectable()
export class AltVPedRepository implements PedRepository {
    public findById(id: number): altPed | null {
        return altPed.getByID(id);
    }
}
