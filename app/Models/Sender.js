'use strict'

const Model = use('Model')
const Encryption = use('Encryption')

class Sender extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async (senderInstance) => {
      senderInstance.password = await Encryption.encrypt( senderInstance.password )
    })
  }

  static get hidden() {
    return ['password']
  }
}

module.exports = Sender
