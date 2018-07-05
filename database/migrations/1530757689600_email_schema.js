'use strict'

const Schema = use('Schema')

class EmailSchema extends Schema {
  up () {
    this.create('emails', (table) => {
      table.increments()
      table.string('from', 50).notNullable()
      table.string('to', 50).notNullable()
      table.string('subject').notNullable()
      table.string('html').notNullable()
      table.boolean('status').notNullable()
      table.string('status_message').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('emails')
  }
}

module.exports = EmailSchema
