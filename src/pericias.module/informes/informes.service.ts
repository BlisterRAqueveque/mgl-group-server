import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InformeEntity } from './informes.entity';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InformeDto } from './informes.dto';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { AdjuntosService } from '../adjuntos/adjuntos.service';
import { AdjuntoDto } from '../adjuntos/adjuntos.dto';
import { UsersService } from 'src/users.module/users/users.service';

@Injectable()
export class InformesService {
  constructor(
    @InjectRepository(InformeEntity)
    private readonly repository: Repository<InformeDto>,
    private readonly adjuntoService: AdjuntosService,
    private readonly userService: UsersService,
  ) {}

  async insert(informe: InformeDto): Promise<InformeDto> {
    try {
      const result = await this.repository.save(informe);
      return result;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  async delete(id: number) {
    try {
      const entity = await this.repository.findOne({
        where: { id: id },
        relations: { adjuntos: true },
      });
      const result = await this.repository.remove(entity);
      return result;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async update(id: number, body: Partial<InformeDto>) {
    try {
      const entity = await this.repository.findOne({
        where: { id },
        relations: { adjuntos: true },
      });
      if (!entity) throw new NotFoundException('Entity not found');
      const oldImages = [...entity.adjuntos];
      entity.adjuntos = [];
      const merge = await this.repository.merge(entity, body);
      const result = await this.repository.save(merge);
      if (result) {
        const deleteImages = this.compareList(oldImages, body.adjuntos);
        this.deleteAdjuntos(deleteImages);
        return result;
      }
      return null;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  private compareList(oldList: AdjuntoDto[], newList: AdjuntoDto[]) {
    return oldList.filter(
      (oldAd) => !newList.find((newAd) => oldAd.id === newAd.id),
    );
  }
  private async deleteAdjuntos(deleteList: AdjuntoDto[]) {
    for (const a of deleteList) {
      try {
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          'uploads',
          'adjuntos',
          a.adjunto,
        );
        await unlink(filePath);
      } catch (error) {
        console.error(
          'Error al intentar eliminar la imagen: ',
          a.adjunto,
          error,
        );
      }
      await this.adjuntoService.delete(a.id);
    }
  }

  async contarTotales(desde: string, hasta: string, usuario: number) {
    try {
      const conditions: FindOptionsWhere<InformeDto> = {};
      if (desde && hasta)
        conditions.fecha_terminado = Between(new Date(desde), new Date(hasta));
      if (usuario) conditions.usuario_carga = { id: usuario };

      const findOptions: FindManyOptions<InformeDto> = {
        where: conditions,
      };

      const [result, count] = await this.repository.findAndCount(findOptions);

      const data = await this.userService.getInformesUsuarios(
        desde,
        hasta,
        usuario,
      );
      return { count, data };
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
