import { Injectable } from '@altv-mango/server';
import { Player as altPlayer } from '@altv/server';
import { PlayerRepository } from '@backend/domain';

@Injectable()
export class AltVPlayerRepository implements PlayerRepository {
    public findById(id: number): altPlayer | null {
        return altPlayer.getByID(id);
    }
}