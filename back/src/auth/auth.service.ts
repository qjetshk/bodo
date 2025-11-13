import { Body, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'; 
import { JwtPayload, StringValue } from './interfaces/jwt.interface';
import { LoginRequest } from './dto/login.dto';
import { Request, Response } from 'express';
import { isDev } from 'src/utils/is-dev.util';
import { convertExpireTime } from 'src/utils/convert-expire-time.util';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TTL: StringValue;
  private readonly JWT_REFRESH_TTL: StringValue;
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TTL = configService.getOrThrow('JWT_ACCESS_TTL') as StringValue;
    this.JWT_REFRESH_TTL = configService.getOrThrow('JWT_REFRESH_TTL') as StringValue;
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(dto: RegisterRequest) {
    const { nickName, email, password } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.prismaService.user.create({
      data: {
        nickName,
        email,
        password: await hash(password),
      },
    });

    await this.prismaService.user.update({
      where: {
        id: user.id
      },
      data: {
        avatarUrl: `https://api.dicebear.com/9.x/glass/svg?seed=${user.id}`
      }
    })

    return {message: 'Вы успешно зарегистировались!'}
  }

  async login(res: Response, dto: LoginRequest) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Неправильный email или пароль');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new NotFoundException('Неправильный email или пароль');
    }

    return { accessToken: this.auth(res, user.id), user: user };
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Недействительный refresh token');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Такой пользователь не найден');
      }

      return {accessToken: this.auth(res, user.id)};
    }
  }

  async logout(res: Response) {
    this.setCookie(res, 'refreshToken', new Date(0));
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    this.setCookie(res, refreshToken, new Date(Date.now() + convertExpireTime(this.JWT_REFRESH_TTL)));

    return accessToken;
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Такой пользователь не найден');
    }

    return user;
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = { id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TTL,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TTL,
    });

    return { accessToken, refreshToken };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
