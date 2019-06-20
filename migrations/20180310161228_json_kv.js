exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tbl_listing', function(t) {
      t.increments('id').primary()
      t.jsonb('kv')
      t.unique('kv');
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('tbl_listing')])
}
