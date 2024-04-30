import { MigrationInterface } from 'typeorm';
import BaseMigration from './base-migration';
import { User } from 'src/users/user.entity';

export class CreateUser1714500437917
  extends BaseMigration
  implements MigrationInterface
{
  public async up(): Promise<void> {
    // public async up(queryRunner: QueryRunner): Promise<void> {
    console.log(User.name);
    console.log(this.getTableName(User.name));
    // await queryRunner.createTable(
    //   new Table({
    //     name: this.getTableName(User.name),
    //   }),
    // );
  }

  //   public async down(queryRunner: QueryRunner): Promise<void> {}
  public async down(): Promise<void> {}
}
