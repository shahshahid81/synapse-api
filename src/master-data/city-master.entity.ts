import { DateTime } from 'luxon';
import { getDateTransformer } from 'src/utils/date-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_city_masters')
export class CityMaster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column()
  value: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: getDateTransformer(),
  })
  createdAt: DateTime;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: getDateTransformer(),
  })
  updatedAt: DateTime;
}
