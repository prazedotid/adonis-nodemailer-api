'use strict'

const Schema = use('Schema')

class SenderSchema extends Schema {
  up () {
    this.create('senders', (table) => {
      table.increments()
      table.string('service').notNullable().defaultTo('gmail')
      table.string('email', 191).notNullable().unique()
      table.string('password').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('senders')
  }
}

module.exports = SenderSchema
