// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'test',
      user: 'root',
      password: 'example',
      host: 'db'
    }
  },

  test: {
    client: 'mysql',
    connection: {
      database: 'db',
      user: 'root',
      password: 'example'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
