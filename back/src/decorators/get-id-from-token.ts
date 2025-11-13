import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';

export const CurrentUserId = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx).getContext();
  const refreshToken = gqlCtx.req.cookies['accessToken'];

  if (!refreshToken) {
    throw new UnauthorizedException('Нет access token');
  }

  const jwtService = gqlCtx.jwtService as JwtService;
  const payload: JwtPayload = await jwtService.verifyAsync(refreshToken);
  return payload.id;
});
