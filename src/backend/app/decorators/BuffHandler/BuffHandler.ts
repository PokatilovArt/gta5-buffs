import { Injectable, Newable } from '@altv-mango/core';
import { type BuffHandler } from '@backend/domain';
import { BuffType, BuffEntityType, BuffEntityHandlerRegistryKey } from '@common/types';
import { BuffUtils } from '@common/utils';
import { type interfaces } from 'inversify';

export const BuffHandlerRegistry = new Map<
  BuffEntityHandlerRegistryKey,
  {
    serviceIdentifier: interfaces.ServiceIdentifier<BuffHandler>;
  }
>();

export function BuffHandle(buffType: BuffType, buffEntityType: BuffEntityType) {
  return (target: Newable): void => {
    Injectable()(target);

    const key = BuffUtils.getBuffEntityHandlerRegistryKey(buffType, buffEntityType);
    BuffHandlerRegistry.set(key, {
      serviceIdentifier: target,
    });
  };
}
