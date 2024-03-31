import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InformeEntity } from './informes.entity';
import { Repository } from 'typeorm';
import { InformeDto } from './informes.dto';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { AdjuntosService } from '../adjuntos/adjuntos.service';

@Injectable()
export class InformesService {
  constructor(
    @InjectRepository(InformeEntity)
    private readonly repository: Repository<InformeDto>,
    private readonly adjuntoService: AdjuntosService,
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
      for (const a of entity.adjuntos) {
        try {
          const filePath = path.join(
            __dirname,
            '..',
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
      const result = await this.repository.remove(entity);
      return result;
    } catch (e: any) {
      console.log(e)
      throw new HttpException(e.message, e.status);
    }
  }
}
