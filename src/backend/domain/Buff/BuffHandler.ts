import { BuffEntity } from './BuffEntity';

export interface BuffHandler {
  onApply(entity: BuffEntity, stackCount: number): void;
  onRemove(entity: BuffEntity): void;
  onTick(): void;
  onStackUpdate(entity: BuffEntity, stackCount: number): void;
}
