import { InformeDto } from '../informes/informes.dto';
import { PericiaDto } from '../pericias/pericias.dto';

export class TerceroDto {
  id: number;
  nombre: string;
  dni: string;
  aseguradora: string;

  pericia: PericiaDto;
  informe: InformeDto;
}
