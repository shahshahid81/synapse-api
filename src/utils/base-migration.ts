import { SnakeNamingStrategy } from 'src/typeorm/naming-strategy';

export default class BaseMigration {
  getTableName(className: string): string {
    return new SnakeNamingStrategy().tableName(className);
  }
}
