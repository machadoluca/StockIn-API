export function pagination(page: number, limit: number) {
  const pageNumber = page > 0 ? page : 1;
  const pageSize = limit > 0 ? limit : 20;

  return (pageNumber - 1) * pageSize;
}
