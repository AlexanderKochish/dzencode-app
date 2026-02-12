export const formatDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput)

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const formatDateForOrder = (dateInput: string | Date): string => {
  const date = new Date(dateInput)

  if (isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()

  let month = date.toLocaleString('ru-RU', { month: 'short' }).replace('.', '')
  month = month.charAt(0).toUpperCase() + month.slice(1)

  return `${day} / ${month} / ${year}`
}

export const formatDateShort = (dateInput: string | Date): string => {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${day} / ${month}`
}
