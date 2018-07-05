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

Route.get('/api', () => {
  const start = Date.now()
  return { code: 200, status: true, time: Date.now() - start + 'ms', message: 'Welcome to Adonis-Nodemailer API!' }
})

Route
  .group(() => {

    // Route.get('/', 'EmailController.getEmails')
    
    Route.post('/send/:id', 'EmailController.createEmail')

    Route.get('/accounts', 'SenderController.getAccounts')

    Route.post('/accounts', 'SenderController.createAccount')

    Route.put('/accounts/:id', 'SenderController.editAccount')

    Route.delete('/accounts/:id', 'SenderController.deleteAccount')

  })
  .prefix('/api/email')
