import { AseguradoraEntity } from 'src/pericias.module/aseguradoras/aseguradoras.entity';
import { PericiaEntity } from 'src/pericias.module/pericias/pericias.entity';
import { TipoSiniestroEntity } from 'src/pericias.module/tipo-siniestros/tipo-siniestros.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Roles {
  admin = 'admin',
  user = 'user',
  visit = 'visit',
}

@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar', { length: 250, nullable: true })
  nombre: string;
  @Column('varchar', { length: 250, nullable: true })
  apellido: string;
  @Column('varchar', { length: 250 })
  contrasenia: string;
  @Column('varchar', { length: 250 })
  username: string;
  @Column('varchar', { length: 250 })
  email: string;
  @Column('varchar', { length: 250 })
  tel: string;
  @Column('bool', { default: false })
  superuser: boolean;
  @Column('enum', { enum: Roles, default: Roles.user })
  rol: Roles;

  @OneToMany(
    () => PericiaEntity,
    (carga_pericia) => carga_pericia.usuario_carga,
  )
  carga_pericia: PericiaEntity[];
  @OneToMany(() => PericiaEntity, (pericia) => pericia.verificador)
  pericia: PericiaEntity[];
  @OneToMany(
    () => TipoSiniestroEntity,
    (tipo_siniestro) => tipo_siniestro.usuario_carga,
  )
  tipo_siniestro: TipoSiniestroEntity[];
  @OneToMany(
    () => AseguradoraEntity,
    (aseguradora) => aseguradora.usuario_carga,
  )
  aseguradora: AseguradoraEntity[];
}
