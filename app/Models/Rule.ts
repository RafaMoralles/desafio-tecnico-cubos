import Constants from 'App/Constants'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class Rule {
  private id: string
  private dateStart: DateTime
  private dateEnd: DateTime
  private daysOfWeek: Array<number>
  private intervals: Array<{ start: string, end: string}>

  constructor (dateStart = '', dateEnd = '', intervals: Array<{ start: string, end: string}> =[], daysOfWeek: Array<number> = [], id: string = '') {
    this.id = id === '' ? uuid() : id
    this.dateStart = DateTime.fromFormat(dateStart, Constants.DATE_FORMAT)
    this.dateEnd = DateTime.fromFormat(dateEnd, Constants.DATE_FORMAT)
    this.intervals = intervals
    this.daysOfWeek = daysOfWeek
  } 
  
  get Id(): string {
    return this.id
  }
  set Id(value: string) {
    this.id = value
  }

  get DateStart(): DateTime {
    return this.dateStart
  }
  set DateStart(value: DateTime) {
    this.dateStart = value
  }
  
  get DateEnd(): DateTime {
    return this.dateEnd
  }
  set DateEnd(value: DateTime) {
    this.dateEnd = value
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
