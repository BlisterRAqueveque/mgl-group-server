import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getDashboard(
    @Query('verificador') verificador: number,
    @Res() res: Response,
  ) {
    const result = await this.appService.getDashboard(verificador);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }
}
