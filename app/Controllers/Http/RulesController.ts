import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime, Interval } from 'luxon'
import Rule from 'App/Models/Rule'
import RuleDayValidator from 'App/Validators/RuleDayValidator'
import RuleWeekValidator from 'App/Validators/RuleWeekValidator'
import Database from 'Database/DatabaseJson'
import Constants from 'App/Constants'

export default class RulesController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['dateOrDaysOfWeek'])
    const rule = await this.validateData(data, request)
    const valid = this.validateRule(rule)

    if (valid.isValid) {
      const rules = Database.read()
      rules.push(rule)
      const result = Database.save(rules)
      if(result.create) {
        return rule
      } else {
        if (result.error.message === '') {
          return response.status(422).send({
            error: {
              message: 'Erro ao inserir a regra',
              name: 'erro_rule_create',
              status: 422
            }
          })
        } else {
          return response.status(result.error.status).send({
            error: {
              message: result.error.message,
              name: result.error.name,
              status: result.error.status
            }
          })
        }
      } 
    } else {
      return response.status(valid.error.status).send({
        error: {
          message: valid.error.message,
          name: valid.error.name,
          status: valid.error.status
        }
      })
    }
  }

  private async validateData (data, request) : Promise<Rule> {
    if (typeof data.dateOrDaysOfWeek === 'string') {
      const dataValid = await request.validate(RuleDayValidator)
      const day: DateTime = dataValid.dateOrDaysOfWeek
      return new Rule(day.toFormat(Constants.DATE_FORMAT), dataValid.intervals)
    } else {
      const dataValid = await request.validate(RuleWeekValidator)
      return new Rule('', dataValid.intervals, dataValid.dateOrDaysOfWeek)
    }
  }

  private validateRule (newRule: Rule) : { isValid: boolean, error: { message: string, name: string, status: number}} {
    const rules = Database.read()
    //Array
    let result = { isValid: true, error: { message: '', name: '', status: 200 }}
    const matchRules: Array<Rule> = []
    for (const rule of rules) {
      if (newRule.Day.equals(DateTime.fromISO(Constants.DATE_TIME_INITIAL))) { 
        for (const newDayWeek of newRule.DaysOfWeek) {
          const matchDayOfWeek = rule.DaysOfWeek.some(dayWeek => dayWeek === newDayWeek)
          if (matchDayOfWeek) {
            matchRules.push(rule)
          } else {
            const dayWeekRule = rule.Day.toFormat(Constants.DAY_WEEK_FORMAT) as unknown as Number
            if (dayWeekRule === newDayWeek) {
              matchRules.push(rule)
            }
          }
        }
      } else {
        const newDayWeek = newRule.Day.toFormat(Constants.DAY_WEEK_FORMAT) as unknown as Number
        const matchRule = rule.DaysOfWeek.some(weekDay => weekDay == newDayWeek)
        if (matchRule) {
          matchRules.push(rule)
        } else {
          if (rule.Day.equals(newRule.Day)) {
            matchRules.push(rule)
          }
        }
      }
    }
    for (const matchedRule of matchRules) {
      const verifyIntervals = this.verifyIntervals(matchedRule.Intervals, newRule.Intervals)
      if (verifyIntervals.isValid === false) {
        result = verifyIntervals
      }
    }
    return result
    
    
    
    
    // if (newRule.Day.equals(DateTime.fromISO(Constants.DATE_TIME_INITIAL))) {
    //   const matchRulesDayOfWeek: Array<Rule> = []
    //   for (const rule of rules) {
    //     for (const newDayWeek of newRule.DaysOfWeek) {
    //       const matchDayOfWeek = rule.DaysOfWeek.some(dayWeek => dayWeek === newDayWeek)
    //       console.log(matchDayOfWeek)
    //       if (matchDayOfWeek) {
    //         const verifyIntervals = this.verifyIntervals(rule.Intervals, newRule.Intervals)
    //         if (verifyIntervals.isValid === false) {
    //           result = verifyIntervals
    //         }
    //       }
    //     }
    //   }
    // } else { //Dia
    //   const newDayWeek = newRule.Day.toFormat(Constants.DAY_WEEK_FORMAT) as unknown as Number
    //   console.log(newDayWeek)
    //   const matchRulesDayOfWeek: Array<Rule> = []
    //   for (const rule of rules) {
    //     const matchRule = rule.DaysOfWeek.some(weekDay => weekDay == newDayWeek)
    //     console.log(matchRule)
    //     if (matchRule) {
    //       matchRulesDayOfWeek.push(rule)
    //     } else {
    //       if (rule.Day.equals(newRule.Day)) {
    //         matchRulesDayOfWeek.push(rule)
    //       }
    //     }
    //   }
    //   console.log(matchRulesDayOfWeek)
    //   for (const matchedRule of matchRulesDayOfWeek) {
    //     const verifyIntervals = this.verifyIntervals(matchedRule.Intervals, newRule.Intervals)
    //     if (verifyIntervals.isValid === false) {
    //       result = verifyIntervals
    //     }
    //   }
    // }
    // return result
  }

  private verifyIntervals (intervals, newIntervals) : { isValid: boolean, error: { message: string, name: string, status: number}} {
    for (const newInterval of newIntervals) {
      const newIntervalStart = DateTime.fromFormat(newInterval.start, Constants.HOUR_FORMAT)
      const newIntervalEnd = DateTime.fromFormat(newInterval.end, Constants.HOUR_FORMAT)
      for (const interval of intervals) {
        const intervalStart = DateTime.fromFormat(interval.start, Constants.HOUR_FORMAT)
        const intervalEnd = DateTime.fromFormat(interval.end, Constants.HOUR_FORMAT)
        const intervalRule = Interval.fromDateTimes(intervalStart, intervalEnd)
        const intervalNewRule = Interval.fromDateTimes(newIntervalStart, newIntervalEnd)
        if (intervalNewRule.equals(intervalRule)) {
          return { isValid: false, error: { message: 'The rule to be registered conflicts with another rule. Equals', name: 'rule_conflict', status: 422 }}
        } else if (intervalNewRule.engulfs(intervalRule)) {
          return { isValid: false, error: { message: 'The rule to be registered conflicts with another rule. Engulfs', name: 'rule_conflict', status: 422 }}
        } else if (intervalNewRule.overlaps(intervalRule)) {
          return { isValid: false, error: { message: 'The rule to be registered conflicts with another rule. Overlaps', name: 'rule_conflict', status: 422 }}
        }
      }
    }
    return { isValid: false, error: { message: 'Error internal', name: 'error_internal', status: 500 }}
  }

  public async index () {
    const rules = Database.read()
    return rules
  }

  public async destroy ({ params, response }: HttpContextContract) {
    if(Database.delete(params.id)) {
      return true
    } else {
      return response.status(500).send({
        error: {
          message: 'Erro ao deletar a regra',
          name: 'erro_rule_destroy',
          status: 500
        }
      })
    }
  }
}
