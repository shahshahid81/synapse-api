import { DateTime } from 'luxon';
import { TokenList } from 'src/tokenlist/token-list.entity';
import { getDateTransformer } from 'src/utils/date-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

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

  @OneToMany(() => TokenList, (token) => token.user)
  tokens: TokenList[];
}
