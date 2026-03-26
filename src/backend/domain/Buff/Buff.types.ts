import { Player } from "@altv/server";
import { BuffHandler } from "./BuffHandler";
import { BuffEntityType, BuffType } from "@common/types";

export interface BuffObject {
    handler: BuffHandler;
    activeUntil?: Date;
    activedBy?: Player;
}

export type BuffTypeObjectMap = Map<BuffType, BuffObject>;
