import { Injectable } from '@altv-mango/client';
// import alt from 'alt-client';

@Injectable()
export class PlayerService {
  public onReady(): void {
    console.log('[PlayerService] Client ready');
    // alt.log('[PlayerService] Client ready');
  }
}
