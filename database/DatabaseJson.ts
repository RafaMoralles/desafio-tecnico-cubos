import Rule from 'App/Models/Rule'
import fs from 'fs'
import { RuleContract } from 'Contracts/RuleContract'

export default class DatabaseJson{

  public static save (rules: Array<Rule> = new Array<Rule>()): { create: boolean, error: { message: string, name: string, status: number }}{
    const pathRules = process.env.DATABASE_PATH === undefined ? '' : process.env.DATABASE_PATH?.toString()
    
    const jsonContent = JSON.stringify(rules)
    try {
      fs.writeFileSync(pathRules, jsonContent, 'utf8')
      return { create: true, error: { message: '', name: '', status: 200 }}
    } catch (error) {
      return { create: false, error: { message: 'Erro interno ao salvar.', name: 'error_server', status: 500}}
    }
  }

  public static read(): Array<Rule>{
    const path = process.env.DATABASE_PATH === undefined ? '' : process.env.DATABASE_PATH?.toString()

    let database = fs.readFileSync(path, "utf8")
    if (database.length > 0) {
      const databaseRuleContract: Array<RuleContract> = JSON.parse(database) as Array<RuleContract>
      const rules: Array<Rule> = []
      for (const item of databaseRuleContract) {
        let day = item.day.split('T')
        day = day[0].split('-')
        rules.push(new Rule(`${day[2]}-${day[1]}-${day[0]}`, item.intervals, item.daysOfWeek, item.id))
      }
      return rules
    } else {
      return Array<Rule>()
    }
  }

  public static delete (id: string = ''): boolean {
    let rules = this.read()
    rules = rules.filter(item => item.Id != id)
    const result = this.save(rules)
    return result.create
  }
}