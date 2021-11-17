import Route from '@ioc:Adonis/Core/Route'

Route.get('appointments/:dateStart/:dateEnd', 'AppointmentsController.index')

Route.resource('rules', 'RulesController')
  .only(['store', 'index', 'destroy'])
  .apiOnly()
