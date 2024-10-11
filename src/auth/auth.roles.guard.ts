import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; 
        try {
            if (!user || !user.role) {
                throw new UnauthorizedException('User is not authenticated or role is missing');
            }

            if (user.role !== 'admin') {
                throw new UnauthorizedException('User does not have required role');
            }

            return true; 
        } catch (error) {
            console.error('RolesGuard error:', error); 
            throw new UnauthorizedException(error.message);
        }
    }
}
