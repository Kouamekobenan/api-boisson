import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/auth/types/user-payload.interface';

export const CurrentUser = createParamDecorator(
  (
    data: keyof UserPayload | undefined,
    ctx: ExecutionContext,
  ): UserPayload | any => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    // console.log('ℹ CurrentUser - request.user:', request.user); // Debug
    if (!user) {
      console.warn(
        '⚠ CurrentUser decorator - Aucun utilisateur trouvé dans la requête',
      );
    }

    return data ? user?.[data] : user;
  },
);
