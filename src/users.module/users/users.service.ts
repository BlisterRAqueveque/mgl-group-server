import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioDto } from 'src/users.module/users/user.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UsuarioEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly userRepo: Repository<UsuarioDto>,
    private readonly authService: AuthService,
  ) {}

  /** @description Crea un nuevo usuario */
  async register(user: UsuarioDto): Promise<UsuarioDto> {
    try {
      const availability = await this.checkAvailability(user.username);
      if (!availability) throw new ConflictException('username already taken');
      if (user.contrasenia) {
        const hashPassword = await this.authService.hashPassword(
          user.contrasenia,
        );
        user.contrasenia = hashPassword;
      }
      user.username = user.username.toLowerCase();
      user.email = user.email ? user.email.toLowerCase() : '';
      const result = await this.userRepo.save(user);
      return { ...result, pericia: [], contrasenia: '****' };
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }
  /** @description Comprueba la disponibilidad del usuario por el username. */
  private async checkAvailability(username: string) {
    try {
      const availability = await this.userRepo.findOne({
        where: { username: username },
      });
      if (availability) return false;
      else return true;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Login del usuario, genera el token */
  async login(username: string, password: string) {
    try {
      const user = await this.getUser(username);
      if (!user.contrasenia)
        throw new HttpException(await this.authService.generateJwt(user), 300);
      const checkPass = await this.authService.comparePassword(
        password,
        user.contrasenia,
      );
      if (!checkPass) throw new UnauthorizedException('wrong credentials');
      if (!user.activo) throw new BadRequestException('user inactive');
      const result = {
        token: await this.authService.generateJwt(user),
        user,
      };
      return result;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        e.message ? e.message : 'Server error',
        e.status ? e.status : 500,
      );
    }
  }

  /** @description Devuelve la información del usuario */
  async getUser(username: string): Promise<UsuarioDto> {
    try {
      const user = await this.userRepo.findOne({
        where: { username: username },
      });
      if (!user) throw new NotFoundException('entity not found');
      return user;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Retorna todos los usuarios. Funciona como paginator en caso de que se envíe undefined
   * pages y perPage */
  async getAllFilter(
    activo: boolean,
    page: number,
    perPage: number,
    filterBy: string,
    sortBy: string,
    relations?: boolean,
  ) {
    const conditions: FindOptionsWhere<UsuarioDto>[] = [];

    if (activo) conditions.push({ activo: activo });

    if (filterBy) {
      conditions.push(
        { nombre: Like(`%${filterBy}%`) },
        { apellido: Like(`%${filterBy}%`) },
        { username: Like(`%${filterBy}%`) },
        { email: Like(`%${filterBy}%`) },
      );
    }

    const [entities, count] = await this.userRepo.findAndCount({
      where: conditions,
      skip: page !== undefined ? (page - 1) * perPage : 0,
      take: perPage,
      order: {
        id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
      },
      relations: {
        usuario_carga: relations !== undefined ? relations : true,
        pericia: relations !== undefined ? relations : true,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        username: true,
        tel: true,
        email: true,
        fecha_creado: true,
        activo: true,
        rol: true,
        usuario_carga: {
          id: true,
          nombre: true,
          apellido: true,
        },
      },
    });
    return { entities, count };
  }

  async getOne(id: number) {
    try {
      const result = await this.userRepo.findOne({
        where: { id: id },
        relations: {
          pericia: true,
        },
        select: {
          id: true,
          nombre: true,
          apellido: true,
          username: true,
          email: true,
          tel: true,
          pericia: true,
        },
      });
      if (!result) throw new NotFoundException('entity not found');
      return result;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  async update(id: number, user: Partial<UsuarioDto>) {
    try {
      if (user.contrasenia)
        user.contrasenia = await this.authService.hashPassword(
          user.contrasenia,
        );
      const oldUser = await this.userRepo.findOne({ where: { id: id } });
      if (!oldUser) throw new NotFoundException('user not found');
      const mergeUser = await this.userRepo.merge(oldUser, user);
      const result = await this.userRepo.save(mergeUser);
      return result;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  async getCountUsuarios(): Promise<{ activos: number; inactivos: number }> {
    try {
      const activos = await this.userRepo.count({
        where: { activo: true },
      });
      const inactivos = await this.userRepo.count({
        where: { activo: false },
      });
      return { activos, inactivos };
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
