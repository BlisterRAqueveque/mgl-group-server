import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InformesService } from './informes.service';
import { InformeDto } from './informes.dto';
import { Response } from 'express';

@Controller('informes')
export class InformesController {
  constructor(private readonly informeService: InformesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async insert(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Res() res: Response,
  ) {
    const informe = JSON.parse(body.form) as InformeDto;
    let i = 0;
    informe.adjuntos.forEach((a) => {
      a.adjunto = files[i].filename;
      i++;
    });
    if (informe.terceros) {
      informe.terceros.forEach((t, i) => {
        t.adjuntos.forEach((a) => {
          a.adjunto = files[i].filename;
          i++;
        });
      });
    }
    const result = await this.informeService.insert(informe);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const result = await this.informeService.delete(id);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const form = JSON.parse(body.form) as InformeDto;
      let i = 0;
      form.adjuntos.forEach((a) => {
        if (!a.id) {
          a.adjunto = files[i].filename;
          i++;
        }
      });
      if (form.terceros) {
        form.terceros.forEach((t) => {
          t.adjuntos.forEach((a) => {
            if (!a.id) {
              a.adjunto = files[i].filename;
              i++;
            }
          });
        });
      }
      const result = await this.informeService.update(id, form);
      res.status(HttpStatus.OK).json({
        ok: true,
        result,
        msg: 'Approved',
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.BAD_REQUEST).json({
        ok: true,
        msg: 'Rejected',
      });
    }
  }

  @Get('usuarios/informes')
  async contarTotales(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Query('usuario') usuario: number,
    @Res() res: Response,
  ) {
    const result = await this.informeService.contarTotales(
      desde,
      hasta,
      usuario,
    );
    res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }
}
