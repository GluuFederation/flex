import type { Dayjs } from 'dayjs'
import type { GetStatParams } from 'JansConfigApi'
import { isAfterDate } from '@/utils/dayjsUtils'
import { formatDateForApi } from './dataAugmentation'

export const orderMonthRange = (startDate: Dayjs, endDate: Dayjs): [Dayjs, Dayjs] =>
  isAfterDate(startDate, endDate, 'month') ? [endDate, startDate] : [startDate, endDate]

export const buildStatParams = (startDate: Dayjs, endDate: Dayjs): GetStatParams => {
  const startMonth = formatDateForApi(startDate)
  const endMonth = formatDateForApi(endDate)

  return startMonth === endMonth
    ? { month: startMonth }
    : { start_month: startMonth, end_month: endMonth }
}
