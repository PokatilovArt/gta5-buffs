import { Module } from '@altv-mango/server';
import { PlayerController } from './controllers/Player.controller';
import { BuffController } from './controllers';
import { AltVPedRepository, AltVPlayerRepository, AltVVehicleRepository, BuffHandlers, DefaultBuffService } from './services';
import { BuffService, PedRepository, PlayerRepository, VehicleRepository } from '@backend/domain';

@Module({
    controllers: [
        BuffController,
        PlayerController
    ],
    providers: [
        ...BuffHandlers,
        // PlayerService
        {
            provide: PlayerRepository,
            useClass: AltVPlayerRepository,
        },
        {
            provide: PedRepository,
            useClass: AltVPedRepository,
        },
        {
            provide: VehicleRepository,
            useClass: AltVVehicleRepository,
        },
        {
            provide: BuffService,
            useClass: DefaultBuffService,
        },
    ],
})
export class AppModule {}
