
exports.up = function(knex, Promise) {
	Promise.all([knex.schema.createTable('Listing', function(t) {
		  t.increments('id').primary()
		  t.jsonb('kv')
		  t.unique('kv')
		})
	])
  
};

exports.down = function(knex, Promise) {
	Promise.all([
			knex.schema.dropTable('Listing')
		])
};
