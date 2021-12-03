export interface RuleContract {
  id: string
  day: string
  daysOfWeek: Array<number>
  intervals: Array<{ start: string, end: string}>
}