import * as pluralize from 'pluralize';
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(targetName: string, userSpecifiedName?: string): string {
    if (userSpecifiedName) {
      return userSpecifiedName;
    }

    return 'tbl_' + snakeCase(pluralize(targetName).toLowerCase());
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    const name = customName || propertyName;

    if (embeddedPrefixes.length)
      return snakeCase(embeddedPrefixes.join('_')) + snakeCase(name);

    return snakeCase(name);
  }
}
