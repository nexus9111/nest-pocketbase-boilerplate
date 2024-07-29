import { Reflector } from '@nestjs/core';
import { UserRole } from '../shared/users.role';

export const Roles = Reflector.createDecorator<UserRole[]>();
