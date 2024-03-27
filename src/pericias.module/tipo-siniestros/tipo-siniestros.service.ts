import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { TipoSiniestroDto } from './tipo-siniestro.dto';
import { TipoSiniestroEntity } from './tipo-siniestros.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  Like,
  FindOptionsOrder,
  FindManyOptions,
} from 'typeorm';

@Injectable()
export class TipoSiniestrosService {
  constructor(
    @InjectRepository(TipoSiniestroEntity)
    private readonly tipoSiniestroRepo: Repository<TipoSiniestroDto>,
  ) {}

  /** @description Obtenemos un paginator para traer la información, junto con un filtro */
  async getAllFilter(
    id: number,
    nombre: string,
    activo: boolean,
    fecha_creado: Date,
    usuario_carga: string,
    sortBy: string,
    page: number,
    perPage: number,
    relations?: boolean,
  ) {
    try {
      const skip = page !== undefined ? (page - 1) * perPage : 0;

      //! Set the conditions:
      const conditions: FindOptionsWhere<TipoSiniestroDto> = {};
      if (id) conditions.id = id;
      if (fecha_creado) {
        const date = new Date(fecha_creado);
        date.setDate(date.getDate() + 1);
        conditions.fecha_creado = Between(new Date(fecha_creado), date);
      }
      if (activo) conditions.activo = activo;
      if (nombre) conditions.nombre = Like(`%${nombre}%`);
      if (usuario_carga)
        conditions.usuario_carga = [
          { nombre: Like(`%${usuario_carga}%`) },
          { apellido: Like(`%${usuario_carga}%`) },
        ];

      const order: FindOptionsOrder<TipoSiniestroDto> = sortBy
        ? {
            id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
          }
        : { nombre: 'ASC' };

      //! Creates the finding options
      const findOptions: FindManyOptions<TipoSiniestroDto> = {
        where: conditions,
        skip: skip,
        take: perPage,
        order: order,
        relations: {
          usuario_carga: relations !== undefined ? relations : true,
          pericia: relations !== undefined ? relations : true,
        },
        select: {
          usuario_carga: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      };
      const [entities, count] =
        await this.tipoSiniestroRepo.findAndCount(findOptions);
      return { entities, count };
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.activo);
    }
  }

  /** @description Obtenemos un registro con sus relaciones */
  async getOne(id: number): Promise<TipoSiniestroDto> {
    try {
      const entity = await this.tipoSiniestroRepo.findOne({
        where: { id: id },
        relations: { usuario_carga: true, pericia: true },
        select: {
          usuario_carga: {
            id: true,
            nombre: true,
            apellido: true,
            tel: true,
            email: true,
          },
        },
      });
      if (!entity) throw new NotFoundException('entity not found');
      return entity;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Inserta una nueva entidad */
  async insert(tipo: TipoSiniestroDto): Promise<TipoSiniestroDto> {
    try {
      const entity = await this.tipoSiniestroRepo.findOne({
        where: { nombre: tipo.nombre },
      });
      if (entity) throw new ConflictException('same entity');
      const result = await this.tipoSiniestroRepo.save(tipo);
      return result;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Realiza un Soft Delete de la entidad. No elimina la misma, sino que le agrega una "fecha de eliminado" */
  async softDelete(id: number) {
    try {
      const entity = await this.tipoSiniestroRepo.findOne({
        where: { id: id },
      });
      if (!entity) throw new NotFoundException('entity not found');
      const result = await this.tipoSiniestroRepo.softRemove(entity);
      return result;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Hace un update de la información del tipo de siniestro. */
  async update(
    id: number,
    siniestro: Partial<TipoSiniestroDto>,
  ): Promise<TipoSiniestroDto> {
    try {
      const entity = await this.tipoSiniestroRepo.findOne({
        where: { id: id }
      })
      const mergeEntity = await this.tipoSiniestroRepo.merge(entity, siniestro)
      const result = await this.tipoSiniestroRepo.save(mergeEntity)
      return result
    } catch (e) {
      throw new HttpException(e.message, e.status)
    }
  }

  async getCountTipoSiniestros(): Promise<{ activos: number; inactivos: number }> {
    try {
      const activos = await this.tipoSiniestroRepo.count({
        where: { activo: true },
      });
      const inactivos = await this.tipoSiniestroRepo.count({
        where: { activo: false },
      });
      return { activos, inactivos };
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
