import { SelectQueryBuilder } from 'typeorm';

export function applyFilters<T>(
  qb: SelectQueryBuilder<T>,
  query: any,
  tbl: string,
) {
  Object.keys(query).forEach((key) => {
    if (!key.startsWith('filter_')) return;

    // contoh: filter_id_type, filter_id_val
    const parts = key.split('_'); // [ 'filter', 'id', 'type' ]
    const col = parts[1]; // "id"

    const typeKey = `filter_${col}_type`;
    const valKey = `filter_${col}_val`;
    const opKey = `filter_${col}_op`; // untuk advanced filter AND/OR

    const filterType = query[typeKey];
    const filterVal = query[valKey];

    if (!filterType) return;

    switch (filterType) {
      case 'contains':
        qb.andWhere(`${tbl}.${col} LIKE :${col}`, {
          [col]: `%${filterVal}%`,
        });
        break;

      case 'notContains':
        qb.andWhere(`${tbl}.${col} NOT LIKE :${col}`, {
          [col]: `%${filterVal}%`,
        });
        break;

      case 'equals':
        qb.andWhere(`${tbl}.${col} = :${col}`, { [col]: filterVal });
        break;

      case 'notEqual':
        qb.andWhere(`${tbl}.${col} != :${col}`, { [col]: filterVal });
        break;

      case 'startsWith':
        qb.andWhere(`${tbl}.${col} LIKE :${col}`, {
          [col]: `${filterVal}%`,
        });
        break;

      case 'endsWith':
        qb.andWhere(`${tbl}.${col} LIKE :${col}`, {
          [col]: `%${filterVal}`,
        });
        break;

      case 'blank':
        qb.andWhere(`${tbl}.${col} IS NULL OR ${tbl}.${col} = ''`);
        break;

      case 'notBlank':
        qb.andWhere(`${tbl}.${col} IS NOT NULL AND ${tbl}.${col} != ''`);
        break;
    }
  });
}
