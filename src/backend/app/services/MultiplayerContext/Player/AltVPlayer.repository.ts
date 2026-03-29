import { Injectable } from '@altv-mango/server';
import alt from 'alt-server';
import { PlayerRepository } from '@backend/domain';

@Injectable()
export class AltVPlayerRepository implements PlayerRepository {
    public findById(id: number): alt.Player | null {
        return alt.Player.getByID(id);
    }
}
