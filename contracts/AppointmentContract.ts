export interface AppointmentsContract {
  day: string,
  intervals: Array<{ start: string, end: string }>
}