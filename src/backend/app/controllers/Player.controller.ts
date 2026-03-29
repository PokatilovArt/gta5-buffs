import { Controller, Inject, On } from '@altv-mango/server';
import * as vchat from 'vchat';
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
    vchat.addSuggestion(player, {
      name: 'spawn',
      description: 'Teleport a player to the spawnpoint or to the specified coordinates.',
      parameters: [{ name: 'x' }, { name: 'y' }, { name: 'z' }],
    });
  }

  @On('playerDisconnect')
  public onPlayerDisconnect(): void {
    // this.playerService.onDisconnect();
  }
}
