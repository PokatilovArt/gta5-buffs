import * as alt from 'alt-server';

export interface ChatCommandHandler {
  execute(player: alt.Player, args: string[]): void;
}
