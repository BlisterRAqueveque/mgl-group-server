import { UsuarioEntity } from 'src/users.module/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AseguradoraEntity } from '../aseguradoras/aseguradoras.entity';
import { TipoSiniestroEntity } from '../tipo-siniestros/tipo-siniestros.entity';
import { InformeEntity } from '../informes/informes.entity';
import { TerceroEntity } from '../terceros/terceros.entity';

@Entity('pericias')
export class PericiaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('datetime', { nullable: true })
  fecha_asignado: Date;
  @Column('bigint', { default: 0, nullable: true })
  n_siniestro: number;
  @Column('bigint', { default: 0, nullable: true })
  n_denuncia: number;
  @Column('varchar', { length: 250, nullable: true })
  nombre_asegurado: string;
  @Column('varchar', { length: 250, nullable: true })
  dir_asegurado: string;
  @Column('varchar', { length: 250, nullable: true })
  tel_asegurado: string;
  @Column('varchar', { length: 250, nullable: true })
  mail_asegurado: string;
  @Column('varchar', { length: 250, nullable: true })
  veh_asegurado: string;
  @Column('varchar', { length: 250, nullable: true })
  patente_asegurado: string;
  @Column('varchar', { length: 250, nullable: true })
  conductor: string;
  @Column('varchar', { length: 250, nullable: true })
  dni_conductor: string;
  @Column('bigint', { nullable: true })
  anio: number;
  @Column('text', { nullable: true })
  poliza: string;
  @Column('text', { nullable: true })
  cobertura: string;
  @Column('bool', { default: true })
  abierta: boolean;
  @Column('bool', { default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creado: Date;
  @DeleteDateColumn()
  fecha_eliminado: Date;

  @ManyToOne(
    () => UsuarioEntity,
    (usuario_carga) => usuario_carga.carga_pericia,
  )
  usuario_carga: UsuarioEntity;
  @ManyToOne(() => AseguradoraEntity, (aseguradora) => aseguradora.pericia)
  aseguradora: AseguradoraEntity;
  @ManyToOne(
    () => TipoSiniestroEntity,
    (tipo_siniestro) => tipo_siniestro.pericia,
  )
  tipo_siniestro: TipoSiniestroEntity;
  @ManyToOne(() => UsuarioEntity, (verificador) => verificador.pericia)
  verificador: UsuarioEntity;

  @OneToOne(() => InformeEntity, (informe) => informe.pericia)
  informe: InformeEntity;

  @OneToMany(() => TerceroEntity, (terceros) => terceros.pericia, {
    cascade: true,
  })
  terceros: TerceroEntity[];
}
