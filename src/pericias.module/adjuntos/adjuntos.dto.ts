import { InformeDto } from '../informes/informes.dto';

export class AdjuntoDto {
  id: number;
  adjunto: string;
  descripcion: string;
  index: number;

  informe: InformeDto;
}
