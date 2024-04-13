import { AdjuntoDto } from '../adjuntos/adjuntos.dto';
import { InformeDto } from '../informes/informes.dto';
import { PericiaDto } from '../pericias/pericias.dto';

export class TerceroDto {
  id: number;
  nombre: string;
  domicilio: string;
  tel: string;
  veh: string;
  patente: string;
  amp_denuncia: string;
  aseguradora: string;

  pericia: PericiaDto;
  informe: InformeDto;
  adjuntos: AdjuntoDto[];
}
