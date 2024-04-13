import { InformeDto } from '../informes/informes.dto';
import { TerceroDto } from '../terceros/terceros.dto';

export class AdjuntoDto {
  id: number;
  adjunto: string;
  descripcion: string;
  type: string;
  index: number;
  dot: string;

  informe: InformeDto;
  tercero: TerceroDto;
}
