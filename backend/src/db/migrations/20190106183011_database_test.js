exports.up = function(knex) {
  return knex.schema.createTable("test", table => {
    table.string("test_field");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("test");
};
