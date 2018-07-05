'use strict'

const Database = use('Database')
const Encryption = use('Encryption')
const Email = use('App/Models/Email')
const Sender = use('App/Models/Sender')
const nodemailer = require('nodemailer')

class EmailController {
  async getEmails({ response }){
    const start = Date.now()
    let emails = await Database.table('emails').select('*')

    if(!emails.length){
      return response.notFound({
        code: 404,
        status: false,
        time: Date.now() - start + 'ms',
        message: 'There are no emails yet'
      })
    }

    return response.ok({
      code: 200,
      status: true,
      time: Date.now() - start + 'ms',
      message: 'Emails fetch successful',
      data: emails
    })
  }

  async createEmail({ request, response, params }){
    const start = Date.now()
    const body = request.post()

    const sender = await Sender.find(params.id)

    if(!sender){
      return response.notFound({
        code: 404,
        status: false,
        time: Date.now() - start + 'ms',
        message: 'The sender you are trying to use doesn\'t exist'
      })
    }

    let transporter = nodemailer.createTransport({
      service: sender.service,
      auth: {
        user: sender.email,
        pass: await Encryption.decrypt(sender.password)
      }
    })

    let mailOptions = {
      from: sender.email,
      to: body.recipients,
      subject: body.subject,
      html: body.html
    }

    try {
      await transporter.sendMail(mailOptions)

      const email = new Email()
      email.from = sender.email
      email.to = body.recipients
      email.subject = body.subject
      email.html = body.html
      email.status = true
      email.status_message = 'success'
      
      await email.save()

      return response.ok({
        code: 200,
        status: true,
        time: Date.now() - start + 'ms',
        message: email.status_message,
        data: email
      })

    } catch(err) {
      let statusMessage

      if(err.code == 'EAUTH'){
        statusMessage = 'Less secure application permission is not enabled. Please visit https://myaccount.google.com/lesssecureapps?pageId=none.'
      } else {
        console.log(err)
        statusMessage = 'unexpected error'
      }

      const email = new Email()
      email.from = sender.email
      email.to = body.recipients
      email.subject = body.subject
      email.html = body.html
      email.status = false
      email.status_message = statusMessage
      
      await email.save()

      return response.badRequest({
        code: 400,
        status: false,
        time: Date.now() - start + 'ms',
        message: email.status_message,
        data: email
      })
    }
  }
}

module.exports = EmailController
