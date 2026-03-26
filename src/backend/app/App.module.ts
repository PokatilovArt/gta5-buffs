import { Module } from '@altv-mango/server';
import { PlayerController } from './controllers/Player.controller';
import { BuffController } from './controllers';
import { BuffHandlers, DefaultBuffService } from './services';
import { BuffService } from '@backend/domain';

@Module({
    controllers: [
        BuffController,
        PlayerController
    ],
    providers: [
        ...BuffHandlers,
        // PlayerService
        {
            provide: BuffService,
            useClass: DefaultBuffService,
        },
    ],
})
export class AppModule {}
