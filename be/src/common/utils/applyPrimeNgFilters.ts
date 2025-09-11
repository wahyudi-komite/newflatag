import { SelectQueryBuilder } from 'typeorm';
import { cleanFilters } from './clean-filters';

export function applyPrimeNgFilters<T>(
  myQuery: SelectQueryBuilder<T>,
  filters: string,
  alias: string,
) {
  if (!filters) return myQuery;

  let parsedFilters: Record<string, any[]> = {};
  try {
    parsedFilters = JSON.parse(filters);
    parsedFilters = cleanFilters(parsedFilters);
  } catch (e) {
    console.error('Invalid filter JSON', e);
    return myQuery;
  }

  Object.keys(parsedFilters).forEach((field) => {
    const conditions = parsedFilters[field];
    if (!Array.isArray(conditions)) return;

    conditions.forEach((cond, index) => {
      const { value, matchMode, operator } = cond;

      if (value === null || value === '') return;

      let whereClause = '';
      const paramKey = `${field}_${index}`;
      let paramValue: any = value;

      switch (matchMode) {
        case 'equals':
          whereClause = `${alias}.${field} = :${paramKey}`;
          break;

        case 'notEquals':
          whereClause = `${alias}.${field} <> :${paramKey}`;
          break;

        case 'startsWith':
          whereClause = `${alias}.${field} LIKE :${paramKey}`;
          paramValue = `${value}%`;
          break;

        case 'contains':
          whereClause = `${alias}.${field} LIKE :${paramKey}`;
          paramValue = `%${value}%`;
          break;

        case 'endsWith':
          whereClause = `${alias}.${field} LIKE :${paramKey}`;
          paramValue = `%${value}`;
          break;

        case 'lt': // less than
          whereClause = `${alias}.${field} < :${paramKey}`;
          break;

        case 'lte':
          whereClause = `${alias}.${field} <= :${paramKey}`;
          break;

        case 'gt':
          whereClause = `${alias}.${field} > :${paramKey}`;
          break;

        case 'gte':
          whereClause = `${alias}.${field} >= :${paramKey}`;
          break;

        case 'in':
          let inValues: any[] = [];
          if (Array.isArray(value)) {
            inValues = value.map((v: any) =>
              typeof v === 'object' ? v.value : v,
            );
          } else {
            inValues = [value];
          }

          if (!inValues.length) return;
          whereClause = `${alias}.${field} IN (:...${paramKey})`;
          paramValue = inValues;
          break;

        default:
          whereClause = `${alias}.${field} = :${paramKey}`;
      }

      // operator (and/or) → untuk contoh kita pake "andWhere"
      if (operator?.toLowerCase() === 'or') {
        myQuery.orWhere(whereClause, { [paramKey]: paramValue });
      } else {
        myQuery.andWhere(whereClause, { [paramKey]: paramValue });
      }
    });
  });

  return myQuery;
}
