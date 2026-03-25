import { Controller, Inject, On } from '@altv-mango/client';
import { PlayerService } from '../services/Player.service';

@Controller()
export class PlayerController {
    constructor(@Inject(PlayerService) private readonly playerService: PlayerService) {}

    @On('connectionComplete')
    public onConnectionComplete(): void {
        this.playerService.onReady();
    }
}
