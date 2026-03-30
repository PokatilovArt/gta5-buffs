import { Module } from '@altv-mango/client';
import { PlayerService } from './services/Player.service';
import { DefaultEntityMetaService, DefaultPedMetaService } from './services';
import { EntityMetaController, PlayerController } from './controllers';
import { EntityMetaService, PedMetaService } from '@client/domain';

@Module({
  controllers: [PlayerController, EntityMetaController],
  providers: [
    PlayerService,
    {
      provide: EntityMetaService,
      useClass: DefaultEntityMetaService,
    },
    {
      provide: PedMetaService,
      useClass: DefaultPedMetaService,
    },
  ],
})
export class AppModule {}
