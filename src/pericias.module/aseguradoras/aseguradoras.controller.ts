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
} from '@nestjs/common';
import { AseguradorasService } from './aseguradoras.service';
import { Response } from 'express';
import { AseguradoraDto } from './aseguradoras.dto';

@Controller('aseguradoras')
export class AseguradorasController {
  constructor(private readonly aseguradoraService: AseguradorasService) {}

  @Get()
  async getAllFilter(
    @Query('id') id: number,
    @Query('nombre') nombre: string,
    @Query('CUIT') CUIT: string,
    @Query('activo') activo: boolean,
    @Query('fecha_creado') fecha_creado: Date,
    @Query('usuario_carga') usuario_carga: string,
    @Query('sortBy') sortBy: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('relations') relations: boolean,
    @Res() res: Response,
  ) {
    const result = await this.aseguradoraService.getAllFilter(
      id,
      nombre,
      CUIT,
      activo,
      fecha_creado,
      usuario_carga,
      sortBy,
      page,
      perPage,
      relations,
    );
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.aseguradoraService.getOne(id);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Post()
  async insert(@Body() aseguradora: AseguradoraDto, @Res() res: Response) {
    const result = await this.aseguradoraService.insert(aseguradora);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() aseguradora: Partial<AseguradoraDto>,
    @Res() res: Response,
  ) {
    const result = await this.aseguradoraService.update(id, aseguradora);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number, @Res() res: Response) {
    const result = await this.aseguradoraService.softDelete(id)
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved'
    })
  }
}
