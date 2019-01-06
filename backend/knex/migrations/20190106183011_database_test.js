exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("test", table => {
      table.string("token").primary();
      table.string("userId");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("test")]);
};
