import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) {
      this.logger.warn(`Registro rechazado: el usuario ${email} ya existe`);
      throw new ConflictException('Usuario ya existe');
    }
    const user = await this.usersService.create(email, password, name);
    const { password: _, ...result } = user;
    this.logger.log(`Usuario registrado: ${email}`);
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Login fallido: usuario no encontrado (${email})`);
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      this.logger.warn(`Login fallido: contraseña inválida (${email})`);
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    this.logger.log(`Login exitoso: ${email}`);
    this.logger.debug(`JWT generado: ${token.slice(0, 12)}...`);
    return { access_token: token };
  }
}
