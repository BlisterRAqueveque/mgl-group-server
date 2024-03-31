import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Put,
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
    informe.adjuntos.forEach((a, i) => {
      a.adjunto = files[i].filename;
    });
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
}
