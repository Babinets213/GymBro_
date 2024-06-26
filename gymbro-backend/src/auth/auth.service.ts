import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RoleService } from '../api/role/role.service';
import { AuthDto, RegisterDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import * as argon from 'argon2';

/**
 * Сервіс для автентифікації користувачів.
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private roleService: RoleService,
  ) {}

  /**
   * Реєстрація нового користувача.
   * @param dto Об'єкт даних для реєстрації
   * @returns Об'єкт з токеном доступу
   * @throws ForbiddenException Якщо облікові дані вже використовуються
   */
  async signup(dto: RegisterDto) {
    const DEFAULT_ROLE = 'USER';
    const { email, password, firstName, lastName } = dto;
    const hash = await argon.hash(password);
    const role = await this.roleService.getRoleByName(DEFAULT_ROLE);
    try {
      const user = await this.prisma.user.create({
        data: {
          id: uuidv4(),
          email: email,
          password: hash,
          firstName: firstName,
          lastName: lastName,
          roleId: role?.id,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          roleId: true,
        },
      });
      return this.signToken(user.id, user.email, user.roleId);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      throw err;
    }
  }

  /**
   * Авторизація користувача.
   * @param dto Об'єкт даних для авторизації
   * @returns Об'єкт з токеном доступу
   * @throws ForbiddenException Якщо неправильна електронна адреса або пароль
   */
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Non-existent e-mail');

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Incorrect password');

    return this.signToken(user.id, user.email, user.roleId);
  }

  /**
   * Підписує токен доступу для користувача.
   * @param userId Ідентифікатор користувача
   * @param email Електронна адреса користувача
   * @param roleId Ідентифікатор ролі користувача
   * @returns Об'єкт з токеном доступу
   */
  async signToken(
    userId: string,
    email: string,
    roleId: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      roleId,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
