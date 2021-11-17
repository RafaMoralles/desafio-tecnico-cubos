import Rule from 'App/Models/Rule'
import Constants from 'App/Constants'
import fs from 'fs'
import { RuleContract } from 'Contracts/RuleContract'
import { DateTime } from 'luxon'

export default class DatabaseJson{

  public static create (data: Rule = new Rule()): { create: boolean, error: { message: string, name: string, status: number }}{
    const rules = this.read()
    if (rules.length > 0) {
      let insert = true
      // PERCORRE OS DADOS SALVOS
      for (const rule of rules) {
        // VERIFICA SE A DATA INFORMADA NA REQUEST EXISTE NO BANCO DE DADOS
        if (rule.DateStart <= data.DateStart && rule.DateEnd >= data.DateEnd) {
          // PERCORRE OS DIAS DA SEMANA INFORMADO NA REQUEST
          for (const day of data.DaysOfWeek) {
            // SE DATA EXISTE VERIFICA SE É NO MESMO DIA DA SEMANA  
            if (rule.DaysOfWeek.some(item => item === day)) {
              // SE É O MESMO DIA DA SEMANA PERCORRE OS INTERVALOS CADASTRADOS E INFORMADOS PARA COMPARATIVO
              for (const interval of data.Intervals) {
                for (const intervalSaved of rule.Intervals) {
                  const dataHourStart = DateTime.fromFormat(interval.start, Constants.HOUR_FORMAT)
                  const dataHourEnd = DateTime.fromFormat(interval.end, Constants.HOUR_FORMAT)
                  const ruleIntervalHourStart = DateTime.fromFormat(intervalSaved.start, Constants.HOUR_FORMAT)
                  const ruleIntervalHourEnd = DateTime.fromFormat(intervalSaved.end, Constants.HOUR_FORMAT)
                  // SE É O MESMO INTERVALO NÃO SALVA
                  if (ruleIntervalHourStart <= dataHourStart && ruleIntervalHourEnd >= dataHourEnd) {
                    insert = false
                  }
                }
              }
            }
          }
        }
      }
      if (insert) {
        rules.push(data)
        return { create: this.save(rules), error: { message: '', name: '', status: 200 }}
      } else {
        return { create: false, error: { message: 'Já existe uma regra com estas informacões.', name: 'rule_registred', status: 404}}
      }
    } else {
      const arrayData: Array<Rule> = 
      [
        new Rule(
          data.DateStart.toFormat(Constants.DATE_FORMAT),
          data.DateEnd.toFormat(Constants.DATE_FORMAT),
          data.Intervals,
          data.DaysOfWeek)
      ]
      return { create: this.save(arrayData), error: { message: '', name: '', status: 200 }}
    }
  }

  private static save (data = {}): boolean{
    const path = process.env.DATABASE_PATH === undefined ? '' : process.env.DATABASE_PATH?.toString()
    
    const jsonContent = JSON.stringify(data)
    try {
      fs.writeFileSync(path, jsonContent, 'utf8')
      return true
    } catch (error) {
      return false
    }
  }

  public static read(): Array<Rule>{
    const path = process.env.DATABASE_PATH === undefined ? '' : process.env.DATABASE_PATH?.toString()

    let database = fs.readFileSync(path, "utf8")
    if (database.length > 0) {
      const databaseRuleContract = JSON.parse(database) as RuleContract[]
      const rules: Array<Rule> = []
      for (const item of databaseRuleContract) {
        const dateStartParsed = this.formatDate(item.dateStart)
        const dateEndParsed = this.formatDate(item.dateEnd)
        rules.push(new Rule(dateStartParsed, dateEndParsed, item.intervals, item.daysOfWeek, item.id))
      }
      return rules
    } else {
      return Array<Rule>()
    }
  }

  public static delete (id: string = ''): boolean {
    let rules = this.read()
    rules = rules.filter(item => item.Id != id)
    return this.save(rules)
  }

  public static formatDate (date): string {
    let dateParsed = date.split('T')
    dateParsed = dateParsed[0].split('-')
    return `${dateParsed[2]}-${dateParsed[1]}-${dateParsed[0]}`
  }
}