import { Injectable, Newable } from '@altv-mango/core';
import { type ChatCommandHandler } from '@backend/domain';
import { BuffChatCommandType } from '@common/types';
import { type interfaces } from 'inversify';

export const BuffChatCommandHandlerRegistry = new Map<
  BuffChatCommandType,
  {
    serviceIdentifier: interfaces.ServiceIdentifier<ChatCommandHandler>;
  }
>();

export function BuffChatCommandHandler(buffChatCommandType: BuffChatCommandType) {
  return (target: Newable): void => {
    Injectable()(target);

    BuffChatCommandHandlerRegistry.set(buffChatCommandType, {
      serviceIdentifier: target,
    });
  };
}
