import { UsuarioDto } from 'src/users.module/users/user.dto';
import { PericiaDto } from '../pericias/pericias.dto';

export class AseguradoraDto {
  id: number;
  nombre: string;
  CUIT: string;
  activo: boolean;

  fecha_creado: Date;
  fecha_eliminado: Date;

  usuario_carga: UsuarioDto;
  pericia: PericiaDto[];
}
