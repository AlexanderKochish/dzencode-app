import {
  formatDate,
  formatDateForOrder,
  formatDateShort,
} from '@/shared/lib/date/format-date'

describe('formatDate', () => {
  it('форматирует корректную дату строкой', () => {
    const result = formatDate('2024-01-15')
    expect(result).not.toBe('Invalid Date')
    expect(result).toMatch(/2024/)
  })

  it('форматирует объект Date', () => {
    const result = formatDate(new Date('2024-06-01'))
    expect(result).not.toBe('Invalid Date')
    expect(result).toMatch(/2024/)
  })

  it('возвращает "Invalid Date" для невалидной строки', () => {
    expect(formatDate('not-a-date')).toBe('Invalid Date')
  })

  it('возвращает "Invalid Date" для пустой строки', () => {
    expect(formatDate('')).toBe('Invalid Date')
  })
})

describe('formatDateForOrder', () => {
  it('возвращает формат "DD / Mon / YYYY"', () => {
    const result = formatDateForOrder('2024-03-05')
    expect(result).toMatch(/05/)
    expect(result).toMatch(/2024/)
    expect(result).toContain(' / ')
  })

  it('возвращает пустую строку для невалидной даты', () => {
    expect(formatDateForOrder('invalid')).toBe('')
  })

  it('день форматируется с ведущим нулём (01-09)', () => {
    const result = formatDateForOrder('2024-01-05')
    expect(result.startsWith('05')).toBe(true)
  })

  it('месяц начинается с заглавной буквы', () => {
    const result = formatDateForOrder('2024-03-15')
    const parts = result.split(' / ')
    expect(parts[1]).toMatch(/^[А-ЯA-Z]/)
  })
})

describe('formatDateShort', () => {
  it('возвращает формат "DD / MM"', () => {
    const result = formatDateShort('2024-03-05')
    expect(result).toBe('05 / 03')
  })

  it('возвращает формат с ведущими нулями', () => {
    const result = formatDateShort('2024-01-01')
    expect(result).toBe('01 / 01')
  })

  it('возвращает пустую строку для невалидной даты', () => {
    expect(formatDateShort('invalid')).toBe('')
  })

  it('декабрь форматируется как 12', () => {
    const result = formatDateShort('2024-12-25')
    expect(result).toBe('25 / 12')
  })
})
