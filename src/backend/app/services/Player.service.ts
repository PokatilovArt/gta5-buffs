import { Injectable } from '@altv-mango/server';

@Injectable()
export class PlayerService {
    public onConnect(): void {
        console.log('[PlayerService] Player connected');
    }

    public onDisconnect(): void {
        console.log('[PlayerService] Player disconnected');
    }
}
