import { Controller, Inject, Interval, On } from '@altv-mango/server';
import { BUFF_CHECK_INTERVAL, BuffService } from '@backend/domain';

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

    @Interval(BUFF_CHECK_INTERVAL)
    public checkBuffs(): void {
        this.buffService.checkBuffs();
    }
}
