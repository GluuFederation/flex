import {
  REGEX_CSV_FORMULA_INJECTION,
  REGEX_CSV_SPECIAL_CHARS,
  REGEX_DOUBLE_QUOTE,
} from '@/utils/regex'

const CSV_MIME_TYPE = 'text/csv;charset=utf-8;'

type CsvCellValue = string | number | boolean | null | undefined

const sanitizeCsvCell = (value: CsvCellValue): string => {
  let cell = value == null ? '' : String(value)
  if (REGEX_CSV_FORMULA_INJECTION.test(cell)) {
    cell = `'${cell}`
  }
  if (REGEX_CSV_SPECIAL_CHARS.test(cell)) {
    cell = `"${cell.replace(REGEX_DOUBLE_QUOTE, '""')}"`
  }
  return cell
}

const toCsv = (
  headers: readonly CsvCellValue[],
  rows: readonly (readonly CsvCellValue[])[],
): string => [headers, ...rows].map((row) => row.map(sanitizeCsvCell).join(',')).join('\n')

export { CSV_MIME_TYPE, toCsv }
