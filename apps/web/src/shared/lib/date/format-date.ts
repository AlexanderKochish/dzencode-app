const getValidDate = (dateInput: string | Date): Date | null => {
  const date = new Date(dateInput)
  return isNaN(date.getTime()) ? null : date
}

export const formatDate = (dateInput: string | Date): string => {
  const date = getValidDate(dateInput)
  if (!date) return 'Invalid Date'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const formatDateForOrder = (dateInput: string | Date): string => {
  const date = getValidDate(dateInput)
  if (!date) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  let month = date.toLocaleString('ru-RU', { month: 'short' }).replace('.', '')
  month = month.charAt(0).toUpperCase() + month.slice(1)

  return `${day} / ${month} / ${year}`
}

export const formatDateShort = (dateInput: string | Date): string => {
  const date = getValidDate(dateInput)
  if (!date) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${day} / ${month}`
}

export const formatTopDate = (
  dateInput: string | Date,
  locale: string = 'ru'
): string => {
  const date = getValidDate(dateInput)
  if (!date) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  let month = date.toLocaleString(locale, { month: 'short' }).replace('.', '')
  month = month.charAt(0).toUpperCase() + month.slice(1)

  return `${day} ${month}, ${year}`
}

export const getDayLabel = (
  dateInput: string | Date,
  locale = 'Today'
): string => {
  const date = getValidDate(dateInput)
  if (!date) return ''

  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  if (isToday) return locale

  const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ]
  return days[date.getDay()]
}

export const formatTime = (dateInput: string | Date): string => {
  const date = getValidDate(dateInput)
  if (!date) return ''

  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
