import { DateTime } from 'luxon'

export default class Appointment {
  private _day: DateTime
  private _intervals: Array<{ start: string, end: string}>

  constructor (day = new DateTime(), intervals = new Array()) {
    this._day = day
    this._intervals = intervals
  }

  public get intervals(): { start: string, end: string}[] {
    return this._intervals
  }
  public set intervals(value: { start: string, end: string}[]) {
    this._intervals = value
  }

  public get day(): DateTime {
    return this._day
  }
  public set day(value: DateTime) {
    this._day = value
  }
}
