import { Controller, Inject, On } from '@altv-mango/client';
import { PlayerService } from '@client/domain';
import alt from 'alt-client';

@Controller()
export class PlayerController {
  constructor(@Inject(PlayerService) private readonly playerService: PlayerService) {}

  @On('connectionComplete')
  public onConnectionComplete(): void {
    this.playerService.onReady();
  }

  @On('playerConnect')
  public onPlayerConnect(player: alt.Player): void {
    alt.log('Player connected');
    // console.log('Player connected');
  }
}
