import { DateTime } from 'luxon';
import { ValueTransformer } from 'typeorm';

export function getDateTransformer(): ValueTransformer {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from(value): any {
      return value ? DateTime.fromMillis(value.valueOf()) : value;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    to(value): any {
      if (value instanceof Date) {
        return DateTime.fromMillis(value.valueOf());
      }
      return value;
    },
  };
}
