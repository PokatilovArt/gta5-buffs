import { Module } from '@altv-mango/client';
import { PlayerController } from './controllers/Player.controller';
import { PlayerService } from './services/Player.service';

@Module({
    controllers: [PlayerController],
    providers: [PlayerService],
})
export class AppModule {}
