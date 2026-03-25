import { Controller, Inject, On } from '@altv-mango/server';
import { PlayerService } from '../services/Player.service';

@Controller()
export class PlayerController {
    constructor(@Inject(PlayerService) private readonly playerService: PlayerService) {}

    @On('playerConnect')
    public onPlayerConnect(): void {
        this.playerService.onConnect();
    }

    @On('playerDisconnect')
    public onPlayerDisconnect(): void {
        this.playerService.onDisconnect();
    }
}
