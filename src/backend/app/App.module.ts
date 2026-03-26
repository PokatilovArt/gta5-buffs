import { Module } from '@altv-mango/server';
import { PlayerController } from './controllers/Player.controller';
import { BuffController } from './controllers';

@Module({
    controllers: [
        BuffController,
        PlayerController
    ],
    providers: [
        // PlayerService
    ],
})
export class AppModule {}
