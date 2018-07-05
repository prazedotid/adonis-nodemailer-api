'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route
  .group(() => {

    Route.get('/', () => {
      const start = Date.now()
      return { code: 200, status: true, time: Date.now() - start + 'ms', message: 'Welcome to Adonis-Nodemailer API!' }
    })

    Route.get('/email', 'EmailController.getEmails')

    Route.post('/email', 'EmailController.createEmail')

  })
  .prefix('/api')
