import * as alt from 'alt-client';

export interface PedService {
  setVisibility(ped: alt.Ped, enabled: boolean): void;
}

export const PedService: unique symbol = Symbol('PedService');
