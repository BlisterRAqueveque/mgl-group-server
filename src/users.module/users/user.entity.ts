import { AseguradoraEntity } from 'src/pericias.module/aseguradoras/aseguradoras.entity';
import { PericiaEntity } from 'src/pericias.module/pericias/pericias.entity';
import { TipoSiniestroEntity } from 'src/pericias.module/tipo-siniestros/tipo-siniestros.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @Column('varchar', { length: 250, nullable: true })
  contrasenia: string;
  @Column('varchar', { length: 250 })
  username: string;
  @Column('varchar', { length: 250, nullable: true })
  email: string;
  @Column('varchar', { length: 250, nullable: true })
  tel: string;
  @Column('bool', { default: true })
  activo: boolean;
  @Column('bool', { default: false })
  superuser: boolean;
  @Column('enum', { enum: Roles, default: Roles.user })
  rol: Roles;

  @CreateDateColumn()
  fecha_creado: Date;
  @DeleteDateColumn()
  fecha_eliminado: Date;

  @ManyToOne(
    () => UsuarioEntity,
    (usuario_carga) => usuario_carga.usuarios_creados,
  )
  usuario_carga: UsuarioEntity;
  @OneToMany(
    () => UsuarioEntity,
    (usuarios_creados) => usuarios_creados.usuario_carga,
  )
  usuarios_creados: UsuarioEntity;

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
