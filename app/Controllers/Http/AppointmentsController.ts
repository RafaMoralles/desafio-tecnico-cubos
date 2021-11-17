import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Constants from 'App/Constants'
import Appointment from 'App/Models/Appointment'
import { AppointmentsContract } from 'Contracts/AppointmentContract'
import Database from 'Database/DatabaseJson'
import { DateTime } from 'luxon'


export default class AppointmentsController {
  public async index ({ params } : HttpContextContract) {
    const dateStart = DateTime.fromFormat(params.dateStart, Constants.DATE_FORMAT)
    const dateEnd = DateTime.fromFormat(params.dateEnd, Constants.DATE_FORMAT)
    
    const appointments: Appointment[] = new Array ()
    const rules = Database.read()
    for (const rule of rules) {
      let start = rule.DateStart
      const end = rule.DateEnd

      if (rule.DateStart <= dateStart && rule.DateEnd >= dateEnd) {
        while (start <= end) {
          const dayHaveAppointment = rule.DaysOfWeek.some(day => day === Number(start.toFormat('c')))
          if (dayHaveAppointment) {
            appointments.push(new Appointment(start, rule.Intervals))
          }
          start = start.plus({ days: 1 })
        }
      }
    }
    const appointmentsParsed: AppointmentsContract[] = []
    for (const appointment of appointments) {
      appointmentsParsed.push({
        day: appointment.day.toFormat(Constants.DATE_FORMAT),
        intervals: appointment.intervals
      })
    }
    return appointmentsParsed
  }
}
