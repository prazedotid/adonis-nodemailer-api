'use strict'

const Database = use('Database')
const Sender = use('App/Models/Sender')
// const Encryption = use('Encryption')

class SenderController {
  // async decPassword({ response, params }){
  //   var data = await Sender.find(params.id)
  //   return response.ok({ data: await Encryption.decrypt(data.password)})
  // }

  async getAccounts({ response }){
    const startTime = Date.now()

    try {
      let data = await Sender.all()
      if(!data){
        return response.notFound({
          code: 404,
          status: false,
          time: Date.now() - startTime + 'ms',
          message: 'There are no senders'
        })
      }

      return response.ok({
        code: 200,
        status: true,
        time: Date.now() - startTime + 'ms',
        message: 'Senders fetch successful',
        data: data
      })
    } catch(e) {
      return response.status(500).send({
        code: 500,
        status: false,
        time: Date.now() - startTime + 'ms',
        message: e
      })
    }
  }

  async createAccount({ request, response }){
    const startTime = Date.now()
    const body = request.post()
    const sender = new Sender()

    sender.service = body.service
    sender.email = body.email
    sender.password = body.password

    await sender.save()

    return response.ok({
      code: 200,
      status: true,
      time: Date.now() - startTime + 'ms',
      message: 'New sender create successful',
      data: sender
    })
  }

  async editAccount({ request, response, params }){
    const startTime = Date.now()
    const { service, email, password } = request.post()
    const { id } = params

    const sender = await Sender.find(id)

    if(!sender){
      return response.notFound({
        code: 404,
        status: true,
        time: Date.now() - startTime + 'ms',
        message: 'The sender you are trying to update doesn\'t exist'
      })
    }

    let newService = service || sender.service
    let newEmail = email || sender.email
    let newPassword = password || sender.password

    sender.merge({ service: newService, email: newEmail, password: newPassword })
    await sender.save()

    return response.ok({
      code: 200,
      status: true,
      time: Date.now() - startTime + 'ms',
      message: 'Sender update successful',
      data: sender
    })
  }

  async deleteAccount({ response, params }){
    const startTime = Date.now()
    const { id } = params

    const sender = await Sender.find(id)

    if(!sender){
      return response.notFound({
        code: 404,
        status: true,
        time: Date.now() - startTime + 'ms',
        message: 'The sender you are trying to delete doesn\'t exist'
      })
    }

    await sender.delete()

    return response.ok({
      code: 200,
      status: true,
      time: Date.now() - startTime + 'ms',
      message: 'Sender deletion successful',
      data: sender
    })
  }
}

module.exports = SenderController
