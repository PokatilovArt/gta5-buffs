import * as alt from 'alt-client';

export interface PlayerService {
  setVisibility(player: alt.Player, enabled: boolean): void;
  onReady(): void;
}

export const PlayerService: unique symbol = Symbol('PlayerService');
