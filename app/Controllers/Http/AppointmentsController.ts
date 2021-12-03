import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Constants from 'App/Constants'
import { AppointmentsContract } from 'Contracts/AppointmentContract'
import Database from 'Database/DatabaseJson'
import { DateTime } from 'luxon'


export default class AppointmentsController {
  public async index ({ params } : HttpContextContract) {
    let dateStart = DateTime.fromFormat(params.dateStart, Constants.DATE_FORMAT)
    const dateEnd = DateTime.fromFormat(params.dateEnd, Constants.DATE_FORMAT)
    
    const appointments: AppointmentsContract[] = new Array ()
    const rules = Database.read()

    
    while (dateStart <= dateEnd) {
      const dayWeek = Number(dateStart.toFormat(Constants.DAY_WEEK_FORMAT))
      let matchedRules: Array<{start: string, end: string}> = []
      for (const rule of rules) {
        if (rule.DaysOfWeek.length > 0) {
          const matchRule = rule.DaysOfWeek.some(weekDay => weekDay === dayWeek)
          if (matchRule) {
            for (const intrevals of rule.Intervals) {
              matchedRules.push(intrevals)
            }
          }
        }
      }
      const filteredRules = rules.filter(rule => rule.Day.equals(dateStart))
      for (const rule of filteredRules) {
        for (const intrevals of rule.Intervals) {
          matchedRules.push(intrevals)
        }
      }
      if (matchedRules.length > 0) {
        appointments.push({ day: dateStart.toFormat(Constants.DATE_FORMAT), intervals: matchedRules})
      }
      dateStart = dateStart.plus({ days: 1 })
    }
    return appointments
  }
}
