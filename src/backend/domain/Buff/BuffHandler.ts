import { BuffEntity } from "./BuffEntity";

export interface BuffHandler {
    apply(entity: BuffEntity): void;
    remove(entity: BuffEntity): void;
    increaseIntensity(entity: BuffEntity): void;
}