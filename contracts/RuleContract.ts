export interface RuleContract {
  id: string
  dateStart: string
  dateEnd: string
  daysOfWeek: Array<number>
  intervals: Array<{ start: string, end: string}>
}