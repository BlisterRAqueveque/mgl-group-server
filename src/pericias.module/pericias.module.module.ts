import { Module } from '@nestjs/common';
import { PericiasController } from './pericias/pericias.controller';
import { PericiasService } from './pericias/pericias.service';
import { AseguradorasService } from './aseguradoras/aseguradoras.service';
import { AseguradorasController } from './aseguradoras/aseguradoras.controller';
import { TipoSiniestrosController } from './tipo-siniestros/tipo-siniestros.controller';
import { TipoSiniestrosService } from './tipo-siniestros/tipo-siniestros.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AseguradoraEntity } from './aseguradoras/aseguradoras.entity';
import { PericiaEntity } from './pericias/pericias.entity';
import { TipoSiniestroEntity } from './tipo-siniestros/tipo-siniestros.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AseguradoraEntity,
      PericiaEntity,
      TipoSiniestroEntity,
    ]),
  ],
  controllers: [
    PericiasController,
    AseguradorasController,
    TipoSiniestrosController,
  ],
  providers: [PericiasService, AseguradorasService, TipoSiniestrosService],
})
export class PericiasModuleModule {}
