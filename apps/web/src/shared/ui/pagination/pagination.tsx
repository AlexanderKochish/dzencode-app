'use client'

import { Pagination as BSPagination } from 'react-bootstrap'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Props {
  totalCount: number
  pageSize: number
}

export const Pagination = ({ totalCount, pageSize }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(totalCount / pageSize)
  const currentPage = Number(searchParams.get('page')) || 1

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())

    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (totalPages <= 1) return null

  const items = []
  for (let number = 1; number <= totalPages; number++) {
    if (
      number === 1 ||
      number === totalPages ||
      (number >= currentPage - 1 && number <= currentPage + 1)
    ) {
      items.push(
        <BSPagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </BSPagination.Item>
      )
    } else if (number === currentPage - 2 || number === currentPage + 2) {
      items.push(<BSPagination.Ellipsis key={number} />)
    }
  }

  return (
    <BSPagination className="justify-content-center mt-4">
      <BSPagination.First
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
      <BSPagination.Prev
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />

      {items}

      <BSPagination.Next
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
      <BSPagination.Last
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      />
    </BSPagination>
  )
}
