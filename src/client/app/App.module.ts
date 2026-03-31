import { Module } from '@altv-mango/client';
import {
  DefaultEntityMetaService,
  DefaultPedMetaService,
  DefaultPedService,
  DefaultPlayerMetaService,
  DefaultPlayerService,
  DefaultVehicleMetaService,
  DefaultVehicleService,
} from './services';
import { EntityMetaController, PlayerController } from './controllers';
import {
  EntityMetaService,
  PedMetaService,
  PedService,
  PlayerMetaService,
  PlayerService,
  VehicleMetaService,
  VehicleService,
} from '@client/domain';

@Module({
  controllers: [PlayerController, EntityMetaController],
  providers: [
    {
      provide: EntityMetaService,
      useClass: DefaultEntityMetaService,
    },
    {
      provide: PedMetaService,
      useClass: DefaultPedMetaService,
    },
    {
      provide: VehicleMetaService,
      useClass: DefaultVehicleMetaService,
    },
    {
      provide: PlayerMetaService,
      useClass: DefaultPlayerMetaService,
    },
    {
      provide: VehicleService,
      useClass: DefaultVehicleService,
    },
    {
      provide: PedService,
      useClass: DefaultPedService,
    },
    {
      provide: PlayerService,
      useClass: DefaultPlayerService,
    },
  ],
})
export class AppModule {}
