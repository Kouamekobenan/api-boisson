import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/domain/enums/role.enum';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorators';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Vérifier si la route est publique
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Laisser passer sans authentification
    }

    // Récupérer les rôles requis pour l'accès à la route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si aucun rôle requis, accès autorisé
    }

    // Récupérer l'utilisateur depuis request.user (ajouté par JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('🔍 Rôles requis:', requiredRoles);
    console.log('👤 Rôle utilisateur:', user?.role);

    // Vérifier si l'utilisateur a l'un des rôles requis
    return user && user.role && requiredRoles.includes(user.role);
  }
}
