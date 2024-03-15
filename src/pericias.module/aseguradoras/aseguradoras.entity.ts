import { UsuarioEntity } from 'src/users.module/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PericiaEntity } from '../pericias/pericias.entity';

@Entity('aseguradoras')
export class AseguradoraEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar', { length: 250 })
  nombre: string;
  @Column('varchar', { length: 250, nullable: true })
  CUIT: string;
  @Column('bool', { default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creado: Date;
  @DeleteDateColumn()
  fecha_eliminado: Date;

  @ManyToOne(() => UsuarioEntity, (usuario_carga) => usuario_carga.aseguradora)
  usuario_carga: UsuarioEntity;
  @OneToMany(() => PericiaEntity, (pericia) => pericia.aseguradora)
  pericia: PericiaEntity[];
}
