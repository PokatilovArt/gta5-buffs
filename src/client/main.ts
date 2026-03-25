import 'reflect-metadata';
import { createAppBuilder } from '@altv-mango/client';
import { AppModule } from './app/App.module';

const appBuilder = await createAppBuilder();
appBuilder.enableShutdownHooks();
const app = await appBuilder.build();
await app.start(AppModule);
