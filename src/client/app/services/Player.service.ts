import { Injectable } from '@altv-mango/client';

@Injectable()
export class PlayerService {
    public onReady(): void {
        console.log('[PlayerService] Client ready');
    }
}
