export interface FilterMetadata {
  value: any;
  matchMode: string;
  operator?: string;
}

export function cleanFilters(
  filterData: Record<string, FilterMetadata | FilterMetadata[]>,
) {
  return Object.fromEntries(
    Object.entries(filterData)
      .map(([key, conditions]) => {
        if (Array.isArray(conditions)) {
          // array of FilterMetadata
          const valid = conditions.filter((c) => {
            if (c.value === null) return false;
            if (typeof c.value === 'string' && c.value.trim() === '')
              return false;
            if (Array.isArray(c.value) && c.value.length === 0) return false;
            return true;
          });
          return [key, valid];
        } else {
          // single FilterMetadata
          const c = conditions;
          const isValid =
            c.value !== null &&
            !(typeof c.value === 'string' && c.value.trim() === '') &&
            !(Array.isArray(c.value) && c.value.length === 0);

          return isValid ? [key, [c]] : [key, []];
        }
      })
      // hapus key yang kosong
      .filter(([_, conditions]) => (conditions as FilterMetadata[]).length > 0),
  );
}
