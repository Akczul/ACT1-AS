import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Obtiene el usuario validado por JwtAuthGuard.
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);