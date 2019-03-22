exports.up = function(knex) {
  return knex.schema.createTable("test", table => {
    table.string("testField");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("test");
};
