import { Inject, Injectable, MODULE_CONTAINER } from '@altv-mango/server';
import { Player } from '@altv/server';
import { BUFF_DURATION, BUFF_REAPPLY_TYPES, BuffEntity, BuffService, BuffTypeObjectMap, PedRepository, PlayerRepository, VehicleRepository } from '@backend/domain';
import { BuffEntityType, BuffReapplyType, BuffType } from '@common/types';
import { Enums as altEnums } from "@altv/shared";
import { Container } from 'inversify';
import { BuffUtils } from '@common/utils';
import { BuffHandlerRegistry } from '@backend/app/decorators';

@Injectable()
export class DefaultBuffService implements BuffService {
    private buffEntityHandlers: Record<BuffEntityType, Map<number, BuffTypeObjectMap>> = {
        [altEnums.BaseObjectType.PLAYER]: new Map(),
        [altEnums.BaseObjectType.VEHICLE]: new Map(),
        [altEnums.BaseObjectType.PED]: new Map(),
    };

    constructor(
        @Inject(MODULE_CONTAINER)
        private readonly container: Container,
        @Inject(PlayerRepository) private readonly playerRepository: PlayerRepository,
        @Inject(VehicleRepository) private readonly vehicleRepository: VehicleRepository,
        @Inject(PedRepository) private readonly pedRepository: PedRepository,
    ) {}

    public applyBuff(entity: BuffEntity, buffType: BuffType, source?: Player): void {
        const buffTypeObjectMap = this.findBuffTypeObjectMap(entity);
        if (buffTypeObjectMap) {
            const now = new Date();
            const buffDuration = BUFF_DURATION.get(buffType);
            const buffObject = buffTypeObjectMap.get(buffType);
            if (buffObject) {
                switch (BUFF_REAPPLY_TYPES.get(buffType)) {
                    case BuffReapplyType.RestartDuration:
                        if (!buffDuration) {
                            return;
                        }
                        buffObject.activeUntil = new Date(now.getTime() + buffDuration);
                        break;
                    
                    case BuffReapplyType.Stack:
                        buffObject.handler.increaseIntensity(entity);
                        break;
                }
                buffObject.handler.apply(entity);

                if (source) {
                    buffObject.activedBy = source;
                }
            } else {
                const buffEntityType = BuffUtils.isBuffEntityType(entity.type);
                if (!buffEntityType) {
                    throw new Error(`Entity with ${entity.type} is not supported for buffs`);
                }

                const buffHandlerRegistryKey = BuffUtils.getBuffEntityHandlerRegistryKey(buffType, entity.type);
                const serviceIdentifier = BuffHandlerRegistry.get(buffHandlerRegistryKey)?.serviceIdentifier;

                if (!serviceIdentifier) {
                    throw new Error(`Buff for entity=${entity.type} and buff=${buffType} not supported`);
                }

                const buffHandler = this.container.get(serviceIdentifier);
                buffHandler.apply(entity);

                buffTypeObjectMap.set(buffType, {
                    handler: buffHandler,
                    activeUntil: buffDuration ? new Date(now.getTime() + buffDuration) : undefined,
                    activedBy: source,
                });
            }
        }
    }

    public removeBuff(entity: BuffEntity, buffType: BuffType): void {
        const buffTypeObjectMap = this.findBuffTypeObjectMap(entity);
        if (buffTypeObjectMap) {
            const buffObject = buffTypeObjectMap.get(buffType);
            if (!buffObject) {
                return;
            }
            buffObject.handler.remove(entity);
            buffTypeObjectMap.delete(buffType);
        }
    }

    public hasBuff(entity: BuffEntity, buffType: BuffType): boolean {
        return !!this.findBuffTypeObjectMap(entity)?.get(buffType);
    }

    private findBuffTypeObjectMap(entity: BuffEntity): BuffTypeObjectMap | null {
        return this.buffEntityHandlers[entity.type]?.get(entity.id) || null;
    }

    public getBuffs(entity: BuffEntity): BuffType[] {
        const entityBuffs = this.buffEntityHandlers[entity.type]?.get(entity.id);
        if (entityBuffs) {
            return Array.from(entityBuffs.keys());
        }
        return [];
    }

    public checkBuffs(): void {
        const now = new Date();

        for (const [entityType, entityBuffMap] of Object.entries(this.buffEntityHandlers)) {
            for (const [entityId, buffTypeMap] of entityBuffMap) {
                if (!buffTypeMap) {
                    entityBuffMap.delete(entityId);
                    continue;
                }

                const buffEntity = this.getBuffEntity(entityType as unknown as BuffEntityType, entityId);
                if (!buffEntity || !buffEntity.valid) {
                    entityBuffMap.delete(entityId);
                    continue;
                }

                for (const [buffType, buffObject] of buffTypeMap) {
                    if (buffObject.activeUntil && buffObject.activeUntil < now) {
                        buffObject.handler.remove(buffEntity);
                        buffTypeMap.delete(buffType);
                    }
                }
            }
        }
    }

    private getBuffEntity(entityType: BuffEntityType, id: number): BuffEntity | null {
        switch (entityType) {
            case altEnums.BaseObjectType.PLAYER:
                return this.playerRepository.findById(id);

            case altEnums.BaseObjectType.VEHICLE:
                return this.vehicleRepository.findById(id);

            case altEnums.BaseObjectType.PED:
                return this.pedRepository.findById(id);
        }
    }
}
