import { Controller, EveryTick, Inject, Interval, On } from '@altv-mango/server';
import { BuffService } from '@backend/domain';

@Controller()
export class BuffController {
  constructor(@Inject(BuffService) private readonly buffService: BuffService) {}

  @On('playerConnect')
  public onPlayerConnect(): void {
    // this.playerService.onConnect();
  }

  @On('playerDisconnect')
  public onPlayerDisconnect(): void {
    // this.playerService.onDisconnect();
  }

  @EveryTick()
  public tickBuffs(): void {
    this.buffService.tickBuffs();
  }
}
