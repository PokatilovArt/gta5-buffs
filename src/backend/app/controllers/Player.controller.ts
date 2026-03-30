import { Controller, Inject, On } from '@altv-mango/server';
import alt from 'alt-server';

@Controller()
export class PlayerController {
  // constructor(@Inject(PlayerService) private readonly playerService: PlayerService) {}

  @On('serverStarted')
  public onServerStarted(): void {
    alt.log('Server started');
  }
  @On('playerConnect')
  public onPlayerConnect(player: alt.Player): void {
    alt.log('Player connected');
    // this.playerService.onConnect();
  }

  @On('playerDisconnect')
  public onPlayerDisconnect(): void {
    // this.playerService.onDisconnect();
  }
}
