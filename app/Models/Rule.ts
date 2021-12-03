import Constants from 'App/Constants'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class Rule {
  private id: string
  private day: DateTime
  private daysOfWeek: Array<number>
  private intervals: Array<{ start: string, end: string}>

  constructor (day: string = '', intervals: Array<{ start: string, end: string}> =[], daysOfWeek: Array<number> = [], id: string = '') {
    this.id = id === '' ? uuid() : id
    this.day = day === '' ? DateTime.fromISO(Constants.DATE_TIME_INITIAL) : DateTime.fromFormat(day, Constants.DATE_FORMAT)
    this.intervals = intervals
    this.daysOfWeek = daysOfWeek
  } 

  get Id(): string {
    return this.id
  }
  set Id(value: string) {
    this.id = value
  }

  get Day(): DateTime {
    return this.day
  }
  set Day(value: DateTime) {
    this.day = value
  }
  
  get Intervals(): Array<{ start: string, end: string}> {
    return this.intervals
  }
  set Intervals(value: Array<{ start: string, end: string}>) {
    this.intervals = value
  }

  get DaysOfWeek(): Array<number> {
    return this.daysOfWeek
  }
  set DaysOfWeek(value: Array<number>) {
    this.daysOfWeek = value
  }
}
