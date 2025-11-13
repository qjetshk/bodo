import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const req = gqlCtx.req;

    // Берём токен из cookie
    const token = req.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('Нет access token');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      // Кладём payload в контекст для декораторов
      gqlCtx.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Некорректный токен');
    }
  }
}
