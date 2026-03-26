import { BuffType } from "@common/types";
import { BuffEntity } from "./BuffEntity";
import { Player } from "@altv/server";

export interface BuffService {
    // todo: уточнить про stacks - скорее всего не нужен этот параметр, будет внутри хэндлера
    applyBuff(entity: BuffEntity, buffType: BuffType, source?: Player): void;
    removeBuff(entity: BuffEntity, buffType: BuffType): void;
    hasBuff(entity: BuffEntity, buffType: BuffType): boolean;
    // todo: нужно ли возвращать сущности? Может, достаточно типов?
    getBuffs(entity: BuffEntity): BuffType[];

    checkBuffs(): void;
}

export const BuffService: unique symbol = Symbol('BuffService');