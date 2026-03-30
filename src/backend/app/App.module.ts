import { Module } from '@altv-mango/server';
import { PlayerController } from './controllers/Player.controller';
import { BuffController, ChatCommandController } from './controllers';
import {
  AltVPedRepository,
  AltVPlayerRepository,
  AltVVehicleRepository,
  BuffChatCommandHandlers,
  BuffHandlers,
  DefaultBuffService,
  DefaultChatCommandService,
} from './services';
import {
  BuffService,
  ChatCommandService,
  PedRepository,
  PlayerRepository,
  VehicleRepository,
} from '@backend/domain';

@Module({
  controllers: [BuffController, PlayerController, ChatCommandController],
  providers: [
    ...BuffHandlers,
    ...BuffChatCommandHandlers,
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
    {
      provide: ChatCommandService,
      useClass: DefaultChatCommandService,
    },
  ],
})
export class AppModule {}
