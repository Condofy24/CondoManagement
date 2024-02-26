/**
 * Decorator that can be used to assign roles to a route handler or a controller.
 *
 * @param {number} roles - The roles to assign.
 * @returns {MethodDecorator & ClassDecorator} - The decorator function.
 */
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<number>();
