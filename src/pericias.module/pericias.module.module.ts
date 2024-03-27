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
import { UsersModule } from 'src/users.module/users.module';
import { InformesController } from './informes/informes.controller';
import { InformesService } from './informes/informes.service';
import { AdjuntosService } from './adjuntos/adjuntos.service';
import { AdjuntosController } from './adjuntos/adjuntos.controller';
import { InformeEntity } from './informes/informes.entity';
import { AdjuntoEntity } from './adjuntos/adjuntos.entity';
import { MulterModule } from '@nestjs/platform-express';
import { saveImagesToStorage } from 'src/helpers/image-storage';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AseguradoraEntity,
      PericiaEntity,
      TipoSiniestroEntity,
      InformeEntity,
      AdjuntoEntity,
    ]),
    UsersModule,
    MulterModule.register({
      dest: './uploads',
      fileFilter: saveImagesToStorage('adjuntos').fileFilter,
      storage: saveImagesToStorage('adjuntos').storage,
    }),
  ],
  controllers: [
    PericiasController,
    AseguradorasController,
    TipoSiniestrosController,
    InformesController,
    AdjuntosController,
  ],
  providers: [
    PericiasService,
    AseguradorasService,
    TipoSiniestrosService,
    InformesService,
    AdjuntosService,
  ],
  exports: [PericiasService, AseguradorasService, TipoSiniestrosService],
})
export class PericiasModuleModule {}
