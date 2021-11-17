import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rule from 'App/Models/Rule'
import Database from 'Database/DatabaseJson'

export default class RulesController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['dateStart','dateEnd','intervals','daysOfWeek'])

    const rule = new Rule(data.dateStart, data.dateEnd, data.intervals, data.daysOfWeek)
    const result = Database.create(rule)
    if(result.create) {
      return rule
    } else {
      if (result.error.message === '') {
        return response.status(500).send({
          error: {
            message: 'Erro ao inserir a regra',
            name: 'erro_rule_create',
            status: 500
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
  }

  public async index () {
    const rules = Database.read()
    return rules
  }

  public async destroy ({ params, response }: HttpContextContract) {
    Database.read()
    if( Database.delete(params.id) ) {
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
