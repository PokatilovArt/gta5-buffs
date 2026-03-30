import { Inject, Injectable, MODULE_CONTAINER } from '@altv-mango/server';
import {
  ChatCommandService,
  PedRepository,
  SPAWN_PED_MODELS,
  SPAWN_ENTITY_POSITION_MAX_SHIFT,
  SpawnChatCommandEntityType,
  VehicleRepository,
  SPAWN_VEHICLE_MODELS,
} from '@backend/domain';
import { BuffChatCommandType } from '@common/types';
import { Container } from 'inversify';
import { EnumUtils, RandomUtils } from '@common/utils';
import { BuffChatCommandHandlerRegistry } from '../../decorators';
import * as vchat from 'vchat';
import alt, { Vector3 } from 'alt-server';

@Injectable()
export class DefaultChatCommandService implements ChatCommandService {
  constructor(
    @Inject(MODULE_CONTAINER)
    private readonly container: Container,
    @Inject(PedRepository) private readonly pedRepository: PedRepository,
    @Inject(VehicleRepository) private readonly vehicleRepository: VehicleRepository,
  ) {}

  public registerCommands(): void {
    this.registerBuffCommands();
    this.registerSpawnCommand();
  }

  private registerBuffCommands(): void {
    for (const buffChatCommandType of EnumUtils.getEnumValues(BuffChatCommandType)) {
      const serviceIdentifier = BuffChatCommandHandlerRegistry.get(
        buffChatCommandType as BuffChatCommandType,
      )?.serviceIdentifier;

      if (!serviceIdentifier) {
        throw new Error(
          `Buff Chat Command Handler for buffChatCommandType=${buffChatCommandType} not implemented`,
        );
      }

      const buffChatCommandHandler = this.container.get(serviceIdentifier);
      vchat.registerCmd(buffChatCommandType, (player: alt.Player, args: string[]) => {
        try {
          buffChatCommandHandler.execute(player, args);
        } catch (error) {
          vchat.send(player, error.message);
        }
      });
    }
  }

  private registerSpawnCommand(): void {
    vchat.registerCmd('spawn', (player: alt.Player, args: string[]) => {
      const rawEntityType = args[0];
      const entityType = EnumUtils.getEnumByValue(SpawnChatCommandEntityType, rawEntityType);

      if (!entityType) {
        vchat.send(player, 'Invalid entity type for spawn command');
      }

      const spawnPosition = this.getSpawnEntityPosition(player.pos);

      switch (entityType) {
        case SpawnChatCommandEntityType.Vehicle:
          const vehicleModel = this.getSpawnEntityModel(SPAWN_VEHICLE_MODELS);
          this.vehicleRepository.create(vehicleModel, spawnPosition, new Vector3(0, 0, 0));
          break;

        case SpawnChatCommandEntityType.Ped:
          const pedModel = this.getSpawnEntityModel(SPAWN_PED_MODELS);
          this.pedRepository.create(pedModel, spawnPosition, new Vector3(0, 0, 0));
          break;
      }
    });
  }

  private getSpawnEntityModel(models: string[]): string {
    return models[RandomUtils.randomInt(0, models.length - 1)];
  }

  private getSpawnEntityPosition(playerPosition: alt.Vector3): alt.Vector3 {
    return new alt.Vector3({
      x:
        playerPosition.x +
        RandomUtils.randomInt(-SPAWN_ENTITY_POSITION_MAX_SHIFT, SPAWN_ENTITY_POSITION_MAX_SHIFT),
      y:
        playerPosition.y +
        RandomUtils.randomInt(-SPAWN_ENTITY_POSITION_MAX_SHIFT, SPAWN_ENTITY_POSITION_MAX_SHIFT),
      z: playerPosition.z,
    });
  }
}
