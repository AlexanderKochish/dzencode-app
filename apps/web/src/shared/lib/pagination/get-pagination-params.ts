export const getPaginationParams = (
  page?: string | number,
  itemsLimit: number = 10
) => {
  const currentPage = Math.max(Number(page) || 1, 1)
  const limit = itemsLimit
  const offset = (currentPage - 1) * limit

  return {
    limit,
    offset,
    currentPage,
  }
}
