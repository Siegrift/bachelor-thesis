exports.up = function(knex) {
  return knex.schema.createTable("problem", table => {
    table
      .uuid("id")
      .notNullable()
      .primary();
    table
      .string("name")
      .notNullable()
      .unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("problem");
};
