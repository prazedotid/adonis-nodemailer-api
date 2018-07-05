'use strict'

const Database = use('Database')
const Email = use('App/Models/Email')
const nodemailer = require('nodemailer')
const he = require('he')

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

  async createEmail({ request, response }){
    const start = Date.now()
    const mailUser = process.env.MAIL_USER
    const mailPassword = process.env.MAIL_PASSWORD
    const body = request.post()

    let transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: mailUser,
        pass: mailPassword
      }
    })

    let mailOptions = {
      from: mailUser,
      to: body.recipients,
      subject: body.subject,
      html: body.html
    }

    try {
      await transporter.sendMail(mailOptions)

      const email = new Email()
      email.from = mailUser
      email.to = body.recipients
      email.subject = body.subject
      email.html = body.html
      email.status = true
      email.status_message = 'success'
      
      await email.save()

      var responseData = await Database.table('emails').select('*').where({ id: email.id }).first()

      return response.ok({
        code: 200,
        status: true,
        time: Date.now() - start + 'ms',
        message: email.status_message,
        data: responseData
      })

    } catch(err) {

      const email = new Email()
      email.from = mailUser
      email.to = body.recipients
      email.subject = body.subject
      email.html = body.html
      email.status = false
      email.status_message = err
      
      await email.save()

      return response.badRequest({
        code: 400,
        status: false,
        time: Date.now() - start + 'ms',
        message: email.status_message,
        data: responseData
      })
    }
    

  //   transporter.sendMail(mailOptions, async (err, info) => {
  //     const email = new Email()

  //     email.from = mailUser
  //     email.to = body.recipients
  //     email.subject = body.subject
  //     email.html = body.html

  //     if (err) {
  //       email.status = false
  //       email.status_message = 'failed'

  //       console.log(err)
  //     } else {
  //       email.status = true
  //       email.status_message = 'success'
  //     }

  //     try {
  //       await email.save()

  //       var responseData = await Database.table('emails').select('*').where({ id: email.id }).first()

  //       return response.status(200).send({
  //         code: 200,
  //         status,
  //         time: Date.now() - start + 'ms',
  //         message: email.status_message,
  //         data: responseData
  //       })
  //     } catch(exception) {
  //       return response.send({
  //         code: 500,
  //         status: false,
  //         time: Date.now() - start + 'ms',
  //         message: exception
  //       })
  //     }
      
  //  })
  }
}

module.exports = EmailController
